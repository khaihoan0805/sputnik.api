import _ from 'lodash';

export class CategoryEntityMapper {
    static toEntity(data: any): any {
        const fields = [
            'id',
            'name'
        ];

        return _.pick(data, fields);
    }
}