import _ from 'lodash'

export class BookEntityMapper {
    static toEntity(data: any): any {
        const fields = [
            'id',
            'name',
            'stock',
            'category'
        ];

        return _.pick(data, fields);
    }
}