import { Strapi } from '@strapi/strapi';
import { ApiNormalUserNormalUser } from '../../../../../types/generated/contentTypes';

export class CreateUserUsecase {
    static readonly strapi: Strapi = strapi;

    static async execute(account: any): Promise<ApiNormalUserNormalUser> {
        const { results } = await this.strapi.service('api::normal-user.normal-user').find({
            filters: {
                username: { $eq: account.username }
            },
        })
        if (results.length > 0) { console.log(`user is existed`); return }

        const roles = await this.strapi.entityService.findMany('api::user-role.user-role', {
            filters: {
                name: 'Country Admin'
            }
        })
        if (!roles) { throw this.strapi.requestContext.get().notFound(`default Role is not existed when add role for user`) }

        const user = await this.strapi.entityService.create('api::normal-user.normal-user', {
            data: {
                username: account.username,
                name: account.name,
                countries: 'Malaysia',
                status: 'ACTIVE',
                publishedAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
                role: roles[0].id
            }
        })

        const resolveUser = await this.strapi.service('api::normal-user.normal-user').findOne(user.id, {
            populate: { role: { populate: 'permissions' } }
        })

        return resolveUser;
    }
}   