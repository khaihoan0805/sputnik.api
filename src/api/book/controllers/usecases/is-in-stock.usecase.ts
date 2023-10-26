import { Strapi } from '@strapi/strapi';
import { Context } from 'koa'

export class IsInStockBookUsecase {
    static strapi: Strapi = strapi;

    static async handle(ctx: Context): Promise<{ data: boolean }> {
        const test = await strapi.entityService.findMany('api::book.book', {
            filters: {
                id: { $eq: ctx.params.id }
            }
        })

        const book = await this.strapi.service('api::book.book').findOne(ctx.params.id)

        if (book.stock < 1) { return { data: false } }

        return { data: true }
    }
}