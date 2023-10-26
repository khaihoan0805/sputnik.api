import { Category } from '../categories/category.entity';

export type Book = {
    id: number;
    name: string;
    stock: string;
    categories?: Category[];
}