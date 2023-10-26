import { Book } from '../books/books.entity';

export type Category = {
    id: number;
    name: string;
    books?: Book[];
}