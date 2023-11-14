/**
 * book controller
 */

import { factories } from '@strapi/strapi'
import { CountTotalBooksUsecase, ExportBooksUsecase, IsInStockBookUsecase } from './usecases';

export default factories.createCoreController('api::book.book', ({ strapi }) => ({

    countTotalBooks: async (ctx) => { return await CountTotalBooksUsecase.execute(ctx) },

    isInStockById: async (ctx) => { return await IsInStockBookUsecase.execute(ctx) },

    exportBooks: async (ctx) => { return await ExportBooksUsecase.execute(ctx) }
}));

