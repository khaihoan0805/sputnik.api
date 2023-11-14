import { Strapi } from '@strapi/strapi';
import { Context } from 'koa';

export class CountTotalBooksUsecase {
    static readonly strapi: Strapi = strapi;

    static async execute(ctx: Context): Promise<{ data: number }> {
        const { results } = await this.strapi.service('api::book.book').find(ctx);

        let total: number = 0;
        for (let index = 0; index < results.length; index++) {
            total += results[index].stock
        }
        return { data: total }
    }
}