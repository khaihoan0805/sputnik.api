import { Strapi } from '@strapi/strapi';
import { Context } from 'koa';
import { azureADService } from '../../../../services/sso';

export class UserLogoutAzureEntraUsecase {
    static readonly strapi: Strapi = strapi;

    static async execute(ctx: Context): Promise<void> {
        const logoutURL = await azureADService.logout({
            postLogoutRedirectUri: 'http://localhost:1337/',
        });

        ctx.session = null;

        return ctx.redirect(logoutURL)
    }
}