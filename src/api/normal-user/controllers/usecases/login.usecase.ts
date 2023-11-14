import { Strapi } from '@strapi/strapi';
import { Context } from 'koa';
import { azureADService } from '../../../../services/sso';

export class UserLoginAzureEntraUsecase {
    static readonly strapi: Strapi = strapi;

    static async execute(ctx: Context): Promise<void> {
        const { data } = await azureADService.login({
            scopes: [],
            redirectUri: process.env.REDIRECT_URI,
            successRedirect: '/'
        });

        const { session, redirectUrl } = data;
        ctx.session = session;

        return ctx.response.redirect(redirectUrl);
    }
}