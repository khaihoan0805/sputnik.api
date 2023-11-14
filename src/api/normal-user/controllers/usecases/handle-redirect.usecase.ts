import { Strapi } from '@strapi/strapi';
import { Context } from 'koa';
import { azureADService } from '../../../../services/sso';
import { CreateUserUsecase } from './create-user.usecase';

export class HandleRedirectAzureEntraUsecase {
    static readonly strapi: Strapi = strapi;

    static async execute(ctx: Context): Promise<void> {
        const { state } = await azureADService.handleRedirect(ctx);

        console.log(`session before re-mapping: `, ctx.session)

        let session = {
            oauth: {
                idToken: ctx.session.idToken,
                accessToken: ctx.session.accessToken,
                account: ctx.session.account,
            },
            user: null,
        };

        const account = session.oauth.account;

        let { results } = await this.strapi.service('api::normal-user.normal-user').find({
            filters: {
                username: { $eq: account.username }
            },
            populate: { role: { populate: 'permissions' } }
        })

        if (results.length > 0) {
            session.user = results[0]

            ctx.session = session;
            ctx.response.redirect(state.successRedirect);

            return
        }

        const createUser = await CreateUserUsecase.execute(account)

        session.user = createUser;

        ctx.session = session;
        ctx.response.redirect(state.successRedirect);

        return;
    }
}   