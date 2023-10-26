export default {
    routes: [
        {
            method: 'GET',
            path: '/books/count',
            handler: 'book.countTotalBooks',
            config: {
                auth: false
            }
        },
        {
            method: 'GET',
            path: '/books/export/csv',
            handler: 'book.exportBooks',
            config: {
                auth: false
            }
        },
        {
            method: 'GET',
            path: '/books/is-in-stock/:id',
            handler: 'book.isInStockById',
            config: {
                auth: false
            }
        }
    ]
}