import { Strapi } from '@strapi/strapi';
import { Context } from 'koa';

export class GetUserProfileUsecase {
    static readonly strapi: Strapi = strapi;

    static async execute(ctx: Context): Promise<any> {
        let { oauth, user } = ctx.session;

        if (!user) {
            const results = await this.strapi.entityService.findMany('api::normal-user.normal-user', {
                filters: {
                    username: oauth.account.username,
                },
                populate: { role: { populate: 'permissions' } }
            })
            if (results.length < 0) throw ctx.notFound(`This user is not existed`)

            user = results[0];
        }

        return user;
    }
}   