import { BookEntityMapper } from './books';
import { CategoryEntityMapper } from './categories';

export class EntityFactory {
    static create<T = any>(uid: string, data: any): T {
        switch (uid) {
            case 'api::book.book': return BookEntityMapper.toEntity(data);

            case 'api::category.category': return CategoryEntityMapper.toEntity(data);

            default: throw new Error(`${uid} is not suppported.`);
        }
    }
}