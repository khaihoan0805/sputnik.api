/**
 * book service
 */

import { factories } from '@strapi/strapi';
import { CSVExporter } from '../../../services';
import { Book } from '../../../../types/entities/book';

class BooksCSVExporter extends CSVExporter<Book> {
    public readonly defaults = {
        id: 'ID',
        name: 'Name',
        stock: 'In Stock Quantity'
    }
}

export default factories.createCoreService('api::book.book', {
    export: (data: Book[], options: { customKeys: string[], customTitles?: { [key: string]: string } }) => {
        return new BooksCSVExporter().create(data, options)
    }
});
