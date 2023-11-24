import { Strapi } from '@strapi/strapi';
import { Context } from 'koa';

export class GetUserProfileUsecase {
    static readonly strapi: Strapi = strapi;

    static async execute(ctx: Context): Promise<any> {
        let { user } = ctx.session;

        const profile = await this.strapi.entityService.findOne('api::normal-user.normal-user', user.id, {
            populate: { role: { populate: 'permissions' } }
        })
        if (!profile) throw ctx.notFound(`This user is not existed`)

        return profile;
    }
}   