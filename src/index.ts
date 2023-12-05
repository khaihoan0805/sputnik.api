import { Strapi } from '@strapi/strapi'
import { registrationStatuses } from '../data/registration-statuses'
import { licenseMarkets } from '../data/license-markets';
import { divisions } from '../data/divisions';
import { classifications } from '../data/classifications';
import { groupings } from '../data/groupings';
import { applications } from '../data/applications';
import { globalIfuWindchills } from '../data/global-ifu-windchills';
import { saTypes } from '../data/sa-types';
import { localIfuWindchills } from '../data/local-ifu-windchills'
import { legalManufacturers } from '../data/legal_manufacturers';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap(/*{ strapi }*/) {
    const admin = await strapi.db.query('admin::user').findOne({ where: { isActive: true, blocked: false } })
    if (!admin) {
      return
    }

    console.log('Seeding data: Registration Statuses')
    for (const title of registrationStatuses) {
      const entity = await strapi.db.query('api::registration-status.registration-status').findOne({ where: { title } })
      if (!entity) {
        await strapi.db.query('api::registration-status.registration-status').create({
          data: {
            title,
            publishedAt: new Date(),
            createdBy: admin.id,
            updatedBy: admin.id,
          }
        })
      }
    }

    console.log('Seeding data: License Markets')
    for (const title of licenseMarkets) {
      const entity = await strapi.db.query('api::license-market.license-market').findOne({ where: { title } })
      if (!entity) {
        await strapi.db.query('api::license-market.license-market').create({
          data: {
            title,
            publishedAt: new Date(),
            createdBy: admin.id,
            updatedBy: admin.id,
          }
        })
      }
    }

    console.log('Seeding data: Divisions')
    for (const title of divisions) {
      const entity = await strapi.db.query('api::division.division').findOne({ where: { title } })
      if (!entity) {
        await strapi.db.query('api::division.division').create({
          data: {
            title,
            publishedAt: new Date(),
            createdBy: admin.id,
            updatedBy: admin.id,
          }
        })
      }
    }

    console.log('Seeding data: Classifications')
    for (const title of classifications) {
      const entity = await strapi.db.query('api::classification.classification').findOne({ where: { title } })
      if (!entity) {
        await strapi.db.query('api::classification.classification').create({
          data: {
            title,
            publishedAt: new Date(),
            createdBy: admin.id,
            updatedBy: admin.id,
          }
        })
      }
    }

    console.log('Seeding data: Groupings')
    for (const title of groupings) {
      const entity = await strapi.db.query('api::grouping.grouping').findOne({ where: { title } })
      if (!entity) {
        await strapi.db.query('api::grouping.grouping').create({
          data: {
            title,
            publishedAt: new Date(),
            createdBy: admin.id,
            updatedBy: admin.id,
          }
        })
      }
    }

    console.log('Seeding data: Applications')
    for (const title of applications) {
      const entity = await strapi.db.query('api::application.application').findOne({ where: { title } })
      if (!entity) {
        await strapi.db.query('api::application.application').create({
          data: {
            title,
            publishedAt: new Date(),
            createdBy: admin.id,
            updatedBy: admin.id,
          }
        })
      }
    }

    console.log('Seeding data: Local IFU Windchills')
    for (const title of localIfuWindchills) {
      const entity = await strapi.db.query('api::local-ifu-windchill.local-ifu-windchill').findOne({ where: { title } })
      if (!entity) {
        await strapi.db.query('api::local-ifu-windchill.local-ifu-windchill').create({
          data: {
            title,
            publishedAt: new Date(),
            createdBy: admin.id,
            updatedBy: admin.id,
          }
        })
      }
    }

    console.log('Seeding data: Global IFU Windchills')
    for (const title of globalIfuWindchills) {
      const entity = await strapi.db.query('api::local-ifu-windchill.local-ifu-windchill').findOne({ where: { title } })
      if (!entity) {
        await strapi.db.query('api::local-ifu-windchill.local-ifu-windchill').create({
          data: {
            title,
            publishedAt: new Date(),
            createdBy: admin.id,
            updatedBy: admin.id,
          }
        })
      }
    }

    console.log('Seeding data: SA Types')
    for (const title of saTypes) {
      const entity = await strapi.db.query('api::sa-type.sa-type').findOne({ where: { title } })
      if (!entity) {
        await strapi.db.query('api::sa-type.sa-type').create({
          data: {
            title,
            publishedAt: new Date(),
            createdBy: admin.id,
            updatedBy: admin.id,
          }
        })
      }
    }

    console.log('Seeding data: Legal Manufacturers')
    for (const title of legalManufacturers) {
      const entity = await strapi.db.query('api::legal-manufacturer.legal-manufacturer').findOne({ where: { title } })
      if (!entity) {
        await strapi.db.query('api::legal-manufacturer.legal-manufacturer').create({
          data: {
            title,
            publishedAt: new Date(),
            createdBy: admin.id,
            updatedBy: admin.id,
          }
        })
      }
    }

    console.log('Seeding data: Manufacturer Sites')
    for (const title of saTypes) {
      const entity = await strapi.db.query('api::manufacturing-site.manufacturing-site').findOne({ where: { title } })
      if (!entity) {
        await strapi.db.query('api::manufacturing-site.manufacturing-site').create({
          data: {
            title,
            publishedAt: new Date(),
            createdBy: admin.id,
            updatedBy: admin.id,
          }
        })
      }
    }

    console.log('Seeding data: Sterilization Sites')
    for (const title of saTypes) {
      const entity = await strapi.db.query('api::sterilisation-site.sterilisation-site').findOne({ where: { title } })
      if (!entity) {
        await strapi.db.query('api::sterilisation-site.sterilisation-site').create({
          data: {
            title,
            publishedAt: new Date(),
            createdBy: admin.id,
            updatedBy: admin.id,
          }
        })
      }
    }

  },
};
