import { Strapi } from '@strapi/strapi';
import { Context } from 'koa';

const isHavingSession: (policyContext: any, config: any, { strapi }: { strapi: Strapi }) => void = (policyContext, config, { strapi }) => {
    const ctx: Context = strapi.requestContext.get();
    console.log(`ctx.session: `, ctx.session)
    if (ctx.session.user) {
        return true;
    }

    console.log(`have no session: `)
    return;
}

export default isHavingSession;