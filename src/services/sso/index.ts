import { AzureADSSOService, MSALConfig } from './ad-sso.service';

const msalConfig: MSALConfig = {
    auth: {
        clientId: process.env.CLIENT_ID, // 'Application (client) ID' of app registration in Azure portal - this value is a GUID
        authority: process.env.CLOUD_INSTANCE + process.env.TENANT_ID, // Full directory URL, in the form of https://login.microsoftonline.com/<tenant>
        clientSecret: process.env.CLIENT_SECRET // Client secret generated from the app registration in Azure portal
    },
    system: {
        loggerOptions: (message: string) => console.log(message),
        piiLoggingEnabled: false,
        logLevel: 3,
    }
}

const azureADService = new AzureADSSOService(msalConfig);

export { azureADService }

