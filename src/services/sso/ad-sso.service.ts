import { CryptoProvider, ConfidentialClientApplication, Configuration as AzureADInstanceInitialConfig, ResponseMode } from '@azure/msal-node';
import { Next, Context, Request } from 'koa';
import axios from 'axios';

type MSALAuthConfig = {
    clientId: string,
    authority: string,
    clientSecret: string,
    cloudDiscoveryMetadata?: string,
    authorityMetadata?: string
}

export type MSALConfig = {
    auth: MSALAuthConfig,
    system: {
        loggerOptions: (message: string) => void,
        piiLoggingEnabled: boolean,
        logLevel: number,
    },

}

const REDIRECT_URI = process.env.REDIRECT_URI;
const POST_LOGOUT_REDIRECT_URI = process.env.POST_LOGOUT_REDIRECT_URI;
const GRAPH_ME_ENDPOINT = process.env.GRAPH_API_ENDPOINT + "v1.0/me";

type AzureADSSOLoginOptions = {
    successRedirect?: string | '/';
    scopes?: string[] | [];
    redirectUri?: string | '/';
}

export class AzureADSSOService {
    private instance: ConfidentialClientApplication;

    private config: MSALConfig;
    private cryptoProvider: CryptoProvider;

    constructor(config: MSALConfig) {
        this.config = config;
        this.cryptoProvider = new CryptoProvider();
    }

    get singleton(): ConfidentialClientApplication {
        if (this.instance) return this.instance;

        const instance = new ConfidentialClientApplication({ auth: this.config.auth });
        this.instance = instance;

        return this.instance;
    }

    public async login(options: AzureADSSOLoginOptions = {}): Promise<{ data: { session: Record<string, any>, redirectUrl: string } }> {
        const state = this.cryptoProvider.base64Encode(JSON.stringify({
            successRedirect: options.successRedirect || '/',
        }));

        const { scopes, redirectUri } = options;

        const authCodeUrlRequestParams = {
            state,
            scopes,
            redirectUri
        }

        const authCodeRequestParams = {
            state: state,
            scopes: options.scopes || [],
            redirectUri: options.redirectUri,
        };


        if (!this.config.auth.cloudDiscoveryMetadata || !this.config.auth.authorityMetadata) {
            const [cloudDiscoveryMetadata, authorityMetadata] = await Promise.all([
                this.getCloudDiscoveryMetadata(this.config.auth.authority),
                this.getAuthorityMetadata(this.config.auth.authority)
            ]);

            this.config.auth.cloudDiscoveryMetadata = JSON.stringify(cloudDiscoveryMetadata);
            this.config.auth.authorityMetadata = JSON.stringify(authorityMetadata);
        }

        const { session, url } = await this.getRedirectToAuthCodeUrl(authCodeUrlRequestParams, authCodeRequestParams)

        return { data: { session, redirectUrl: url } }

    }

    private async getRedirectToAuthCodeUrl(authCodeUrlRequestParams: Record<string, any>, authCodeRequestParams: Record<string, any>): Promise<{ session: Record<string, any>, url: string }> {
        const { verifier, challenge } = await this.cryptoProvider.generatePkceCodes();

        let session: Record<string, any> = {
            pkceCodes: {
                challengeMethod: 'S256',
                verifier: verifier,
                challenge: challenge,
            }
        }

        session.authCodeUrlRequest = {
            ...authCodeUrlRequestParams,
            responseMode: ResponseMode.FORM_POST,
            codeChallenge: session.pkceCodes.challenge,
            codeChallengeMethod: session.pkceCodes.challengeMethod,
        };

        session.authCodeRequest = {
            ...authCodeRequestParams,
            code: '',
        };

        const authCodeUrlResponse = await this.singleton.getAuthCodeUrl(session.authCodeUrlRequest);

        return { session, url: authCodeUrlResponse };
    }

    public async handleRedirect(ctx): Promise<{ state: { successRedirect: string } }> {
        const authCodeRequest = {
            ...ctx.session.authCodeRequest,
            code: ctx.request.body.code,
            codeVerifier: ctx.session.pkceCodes.verifier,
        };

        console.log(ctx.session)

        if (ctx.session.tokenCache) {
            console.log(`this.singleton.getTokenCache(): `, this.singleton.getTokenCache())
        }

        const tokenResponse = await this.singleton.acquireTokenByCode(authCodeRequest, ctx.request.body);

        ctx.session.tokenCache = this.singleton.getTokenCache().serialize();
        ctx.session.idToken = tokenResponse.idToken;
        ctx.session.account = tokenResponse.account;

        const state = JSON.parse(this.cryptoProvider.base64Decode(ctx.request.body.state));

        return { state }
    }

    logout(options: { postLogoutRedirectUri: string } = { postLogoutRedirectUri: undefined }) {

        let logoutUri = `${this.config.auth.authority}/oauth2/v2.0/`;

        if (options.postLogoutRedirectUri) {
            logoutUri += `logout?post_logout_redirect_uri=${options.postLogoutRedirectUri}`;
        }

        return logoutUri;
    }

    private async getCloudDiscoveryMetadata(authority: string) {
        const endpoint = 'https://login.microsoftonline.com/common/discovery/instance';

        try {
            const response = await axios.get(endpoint, {
                params: {
                    'api-version': '1.1',
                    'authorization_endpoint': `${authority}/oauth2/v2.0/authorize`
                }
            });

            return await response.data;
        } catch (error) {
            throw error;
        }
    }

    async getAuthorityMetadata(authority: string) {
        const endpoint = `${authority}/v2.0/.well-known/openid-configuration`;

        try {
            const response = await axios.get(endpoint);
            return await response.data;
        } catch (error) {
            console.log(error);
        }
    }
}

