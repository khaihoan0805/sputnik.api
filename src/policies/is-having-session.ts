import { Strapi } from '@strapi/strapi';
import { Context } from 'koa';
import { errors } from '@strapi/utils'

// async function isHavingSession(policyContext: any, config: any, { strapi }: { strapi: Strapi }): Promise<boolean> {
//     const ctx: Context = strapi.requestContext.get();
//     if (!ctx.session) {
//         throw new errors.UnauthorizedError(`Missing session`);
//     }

//     if (!ctx.session.isAuthenticated && !ctx.session.user) {
//         throw new errors.UnauthorizedError(`Fobbidden session`);
//     }

//     const user = await strapi.entityService.findOne('api::normal-user.normal-user', ctx.session.user.id, {
//         populate: { role: { populate: 'permissions' } }
//     })
//     if (!user) {
//         throw new errors.UnauthorizedError(`Fobbidden session User`);;
//     }

//     ctx.user = user;

//     return true;
// }

export default async (policyContext, config, { strapi }) => {
    const ctx: Context = strapi.requestContext.get();
    console.log(`ctx.session: `, ctx.session)
    if (!ctx.session) {
        console.log(`pass here missing session: `)
        throw new errors.UnauthorizedError(`Missing session`);
    }

    if (!ctx.session.isAuthenticated && !ctx.session.user) {
        console.log(`pass here Fobbidden session: `)
        throw new errors.UnauthorizedError(`Fobbidden session`);
    }

    const user = await strapi.entityService.findOne('api::normal-user.normal-user', ctx.session.user.id, {
        populate: { role: { populate: 'permissions' } }
    })
    if (!user) {
        console.log(`pass here Fobbidden session User: `)
        throw new errors.UnauthorizedError(`Fobbidden session User`);;
    }

    ctx.user = user;

    return true;
};