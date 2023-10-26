import { stringify, Stringifier } from 'csv-stringify'
import { Readable, Stream } from 'stream';

export abstract class CSVExporter<T = any> {
    abstract readonly defaults: Record<string, string>;

    private buildColumnExporting(customKeys?: string[], customTitles?: { [key: string]: string }) {
        const keys = customKeys ? customKeys : Object.keys(this.defaults)
        console.log(`keys: `, keys)

        let headers: { key: string, header: string }[] = [];

        for (let key of keys) {
            if (customTitles && (key in customTitles)) {
                console.log(`customTitles && (key in customTitles) pass here`)

                headers.push({
                    key,
                    header: customTitles[key],
                });

            }
            else {
                if (key in this.defaults) {
                    console.log(`{ key, header: this.defaults }`, { key, header: this.defaults })
                    headers.push({
                        key,
                        header: this.defaults[key]
                    })
                }
            }
        }
        console.log(headers)

        return headers;
    }

    public create(data: T[], options?: { customKeys?: string[], customTitles?: { [key: string]: string } }) {
        // const decimalColumns: string[] = ['name'];

        // const textColumns: string[] = ['id', 'stock'];

        const stringifier: Stringifier = stringify(data, {
            delimiter: ',',
            header: true,
            columns: this.buildColumnExporting(options?.customKeys, options?.customTitles)
        })

        return Readable.from(stringifier);
    }
}