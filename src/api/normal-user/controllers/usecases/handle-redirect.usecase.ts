import { Strapi } from '@strapi/strapi';
import { Context } from 'koa';
import { azureADService } from '../../../../services/sso';
import { CreateUserUsecase } from './create-user.usecase';

export class HandleRedirectAzureEntraUsecase {
    static readonly strapi: Strapi = strapi;

    static async execute(ctx: Context): Promise<void> {
        const { state } = await azureADService.handleRedirect(ctx);

        let session = {
            oauth: {
                idToken: ctx.session.idToken,
                accessToken: ctx.session.accessToken,
                account: ctx.session.account,
            },
            isAuthenticated: true,
            user: { id: null, username: null }
        };

        const account = session.oauth.account;

        let user: { id: number, username: string } = { id: null, username: null };

        let { results } = await this.strapi.service('api::normal-user.normal-user').find({
            filters: {
                username: { $eq: account.username }
            }
        })
        user = results[0];

        if (!user) { user = await CreateUserUsecase.execute(account); }

        session.user = { id: user.id, username: user.username }

        ctx.session = session;
        ctx.response.redirect(state.successRedirect);

        return;
    }
}   