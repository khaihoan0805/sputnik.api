import { Strapi } from '@strapi/strapi';
import { Context } from 'koa';
import { errors } from '@strapi/utils';
import fs from 'fs';
import { parse } from 'csv';
import { RegistrationUPNPayload, RequiredUPNFields } from '../../routes/types/inputs';
import _ from 'lodash';

const ImportUPNFieldHeaders = {
    'CODE': 'code',
    'PAR Request Date': 'par_request_date',
    'Status': 'status',
    'Device Description': 'device_description',
    'Name As Per Label': 'name_as_per_label',
    'Local Device Description': 'local_device_description',
    'UDI': 'udi',
    'Shelf Life': 'shelf_life',
    'CFS/CFG no': 'cfs_cfg_no',
    'CFS/CFG Expiry Date': 'cfs_cfg_expiry_date',
    'Potential Sales': 'potential_sales',
    'Local IFU Windchills': 'local_ifu_windchills',
    'Global IFU Windchills': 'global_ifu_windchills',
    'Legal Manufacturers': 'legal_manufacturers',
    'Manufacturer Sites': 'manufacturer_sites',
    'Sterilization Sites': 'sterilization_sites',
}

const multipleValuesColumns = [
    'local_ifu_windchills',
    'global_ifu_windchills',
    'legal_manufacturers',
    'manufacturer_sites',
    'sterilization_sites'
]

const dateValueColumns = ['par_request_date', 'cfs_cfg_expiry_date']

export class ParseUPNsWithCSVUsecase {
    static readonly strapi: Strapi = strapi;

    static async validate(records: any[]): Promise<RegistrationUPNPayload[]> {
        const [localIFUWindchills, globalIFUWindchills, manufacturerSites, legalManufacturers, sterilisationSites] = await Promise.all([
            this.strapi.entityService.findMany('api::local-ifu-windchill.local-ifu-windchill'),
            this.strapi.entityService.findMany('api::global-ifu-windchill.global-ifu-windchill'),
            this.strapi.entityService.findMany('api::manufacturing-site.manufacturing-site'),
            this.strapi.entityService.findMany('api::legal-manufacturer.legal-manufacturer'),
            this.strapi.entityService.findMany('api::sterilisation-site.sterilisation-site'),
        ])

        return records.map((record, index) => {
            RequiredUPNFields.forEach(key => {
                if (!record[key]) throw new errors.ForbiddenError(`Missing Key ${key} in line ${index}`)
            })

            const isDuplicatedAt = _.indexOf(records.map(element => element.code), record.code, index + 1)
            if (isDuplicatedAt > -1) throw new errors.ForbiddenError(`duplicated UPN: ${record.code} at line ${isDuplicatedAt}`, { message: `duplicated UPN: ${record.code} at line ${isDuplicatedAt}` })

            if (record.local_ifu_windchills && record.local_ifu_windchills.length > 0) {
                record.local_ifu_windchills = record.local_ifu_windchills.map(datum => {
                    const isExisted = localIFUWindchills.find(windchill => windchill.title === datum);
                    if (!isExisted) throw new errors.ForbiddenError(`windchill ${datum} in line ${index} is not existed`);

                    return isExisted
                })
            }

            if (record.global_ifu_windchills && record.global_ifu_windchills.length > 0) {
                record.global_ifu_windchills = record.global_ifu_windchills.map(datum => {
                    const isExisted = globalIFUWindchills.find(windchill => windchill.title === datum);
                    if (!isExisted) throw new errors.ForbiddenError(`windchill ${datum} in line ${index} is not existed`);

                    return isExisted
                })
            }

            if (record.legal_manufacturers && record.legal_manufacturers.length > 0) {
                record.legal_manufacturers = record.legal_manufacturers.map(datum => {
                    const isExisted = legalManufacturers.find(legalManufacturer => legalManufacturer.title === datum);
                    if (!isExisted) throw new errors.ForbiddenError(`legal Manufacturer ${datum} in line ${index} is not existed`);

                    return isExisted
                })
            }

            if (record.manufacturer_sites && record.manufacturer_sites.length > 0) {
                record.manufacturer_sites = record.manufacturer_sites.map(datum => {
                    const isExisted = manufacturerSites.find(manufacturerSite => manufacturerSite.title === datum);
                    if (!isExisted) throw new errors.ForbiddenError(`manufacturers Sites ${datum} in line ${index} is not existed`);

                    return isExisted
                })
            }

            if (record.sterilization_sites && record.sterilization_sites.length > 0) {
                record.sterilization_sites = record.sterilization_sites.map(datum => {
                    const isExisted = sterilisationSites.find(sterilizationSite => sterilizationSite.title === datum);
                    if (!isExisted) throw new errors.ForbiddenError(`sterilization Sites ${datum} in line ${index} is not existed`);

                    return isExisted
                })
            }

            return record as RegistrationUPNPayload;
        })
    }

    static async execute(ctx: any): Promise<any> {
        try {
            const file = ctx.request.files.file;
            const content = fs.readFileSync(file.path, 'utf-8');
            let records = []

            const parser = parse(
                content.trim(),
                {
                    delimiter: ',',
                    columns: (headers) => {
                        return headers.map(column => {
                            return ImportUPNFieldHeaders[column]
                                ? ImportUPNFieldHeaders[column]
                                : column
                        })
                    },
                    cast: function (value, context) {
                        if (multipleValuesColumns.some(datum => context.column === datum)) {
                            return value.split('|')
                        }

                        if (dateValueColumns.some(datum => context.column === datum)) {
                            return new Date(value);
                        }

                        return value
                    },
                    cast_date: true,
                }
            )

            for await (const record of parser) {
                records.push(record);
            }

            records = await this.validate(records)
            fs.unlinkSync(file.path)

            return { data: records }
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}   
