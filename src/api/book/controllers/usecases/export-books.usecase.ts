import { Strapi } from '@strapi/strapi';
import { Context } from 'koa';

export class ExportBooksUsecase {
    static readonly strapi: Strapi = strapi;

    static async handle(ctx: Context) {
        const { results } = await this.strapi.service('api::book.book').find(ctx);
        const stream = await this.strapi.service('api::book.book').export(results);
        ctx.response.attachment(`report.csv`)

        ctx.body = stream

        // stream.pipe(ctx.res);

        return;
    }
}

