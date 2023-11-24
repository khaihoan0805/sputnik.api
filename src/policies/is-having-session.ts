import { Strapi } from '@strapi/strapi';
import { Context } from 'koa';

async function isHavingSession(policyContext: any, config: any, { strapi }: { strapi: Strapi }): Promise<boolean> {
    const ctx: Context = strapi.requestContext.get();
    if (!ctx.session.isAuthenticated && !ctx.session.user) {
        console.log(`have no session: `)
        return false;
    }

    console.log(`session: `, ctx.session)

    const user = await strapi.entityService.findOne('api::normal-user.normal-user', ctx.session.user.id, {
        populate: { role: { populate: 'permissions' } }
    })
    if (!user) {
        return false;
    }

    ctx.user = user;

    console.log(`ctx.user: `, ctx.user)

    return true;
}

// const isHavingSession: (policyContext: any, config: any, { strapi }: { strapi: Strapi }) => Promise<boolean>  = (policyContext, config, { strapi }) => {
//     const ctx: Context = strapi.requestContext.get();
//     if (!ctx.session.isAuthenticated) {
//         console.log(`have no session: `)
//         return false;
//     }

//     const user = await strapi.entityService.findMany('api::normal-user.normal-user', {
//         filters: {
//             username: ctx.session.oauth
//         }
//     })



//     return true;



// }

export default isHavingSession;