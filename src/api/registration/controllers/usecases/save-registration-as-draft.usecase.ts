import { Strapi } from '@strapi/strapi';
import { Context } from 'koa';
import { SaveRegistrationAsDraftRelationsPayload, SaveRegistrationAsDraftUPNAgencyPayload, SaveRegistrationAsDraftUPNAgencyRelationPayload, SaveRegistrationAsDraftUPNPayload, SaveRegistrationAsDraftUPNRelationPayload, SaveRegistrationAsDraftayload } from '../../routes/types/inputs';
import _ from 'lodash';

export class SaveRegistrationAsDraftUsecase {
  static readonly strapi: Strapi = strapi;

  static async createUPNs(upns: SaveRegistrationAsDraftUPNPayload[]): Promise<any> {
    let agencies = upns.reduce((acc, curr) => {
      console.log(acc);
      return curr.agencies !== undefined ? acc.concat(curr.agencies) : acc
    }, [] as SaveRegistrationAsDraftUPNAgencyPayload[]);

    console.log(`agencies: `, agencies);

    console.log(`agencies.length: `, agencies.length);

    const newAgenciesMap = new Map<SaveRegistrationAsDraftUPNAgencyPayload, any>()

    const newAgencies = agencies.length > 0 ? _.uniq(agencies).filter(agency => !agency.id) : [];

    console.log(`create Agencies: `)

    await Promise.all(newAgencies.map(async (agency) => {
      let setAgencyRelations: { [P in keyof SaveRegistrationAsDraftRelationsPayload]?: { set: { id: number }[] } } = {};

      const agencyRelationPayload = agency;

      for (let relationKey in agencyRelationPayload) {
        if (typeof agencyRelationPayload[relationKey] === 'object') {
          setAgencyRelations[relationKey] = { set: [agencyRelationPayload[relationKey]] }
        }

        if (Array.isArray(setAgencyRelations[relationKey])) {
          setAgencyRelations[relationKey] = { set: agencyRelationPayload[relationKey] }
        }
      }

      console.log(`agencies data: `, {
        ...agency,
        ...setAgencyRelations,
      } as any)

      const createdAgency = await this.strapi.entityService.create('api::agency.agency', {
        data: {
          ...agency,
          ...setAgencyRelations,
          publishedAt: new Date(),
        }
      } as any)

      newAgenciesMap.set(agency, createdAgency);
    }))

    return await Promise.all(upns.map(async (upn) => {
      const agencies = upn.agencies ? upn.agencies.map(agency => { return agency.id ? { id: agency.id } : { id: newAgenciesMap.get(agency).id } }) : [];

      const upnRelationPayload = upn;

      let setUPNRelations: { [P in keyof SaveRegistrationAsDraftUPNRelationPayload]?: { set: { id: number }[] } } = {};

      for (let relationKey in upnRelationPayload) {
        if (typeof upnRelationPayload[relationKey] === 'object') {
          setUPNRelations[relationKey] = { set: [upnRelationPayload[relationKey]] }
        }

        if (Array.isArray(setUPNRelations[relationKey])) {
          setUPNRelations[relationKey] = { set: upnRelationPayload[relationKey] }
        }
      }

      return await this.strapi.entityService.create('api::upn.upn', {
        data: <any>{
          ...upn,
          ...setUPNRelations,
          agencies: {
            set: agencies
          },
          publishedAt: new Date(),
        }
      })
    }))
  }

  static async execute(ctx: Context): Promise<any> {
    const payload: SaveRegistrationAsDraftayload = ctx.request.body as any;
    const regRelationPayload: SaveRegistrationAsDraftRelationsPayload = payload;

    let setRelationObj: { [P in keyof SaveRegistrationAsDraftRelationsPayload]?: { set: { id: number }[] } } = {};

    for (let relationKey in regRelationPayload) {
      if (typeof regRelationPayload[relationKey] === 'object') {
        setRelationObj[relationKey] = { set: [regRelationPayload[relationKey]] }
      }

      if (Array.isArray(setRelationObj[relationKey])) {
        setRelationObj[relationKey] = { set: regRelationPayload[relationKey] }
      }
    }

    console.log(setRelationObj)

    const upns = payload.upns ? await this.createUPNs(payload.upns) : [];

    const registration = await this.strapi.entityService.create('api::registration.registration', {
      data: <any>{
        ...payload,
        ...setRelationObj,
        ...(
          upns.length > 0 ? {
            upns: {
              set: upns.map(upn => { return { id: upn.id } })
            }
          } : {}
        ),
        status: 11,
        publishedAt: new Date(),
      }
    })

    const resolvedRegistration = await this.strapi.entityService.findOne('api::registration.registration', registration.id, {
      populate: ['application', 'upns.agencies']
    })

    return resolvedRegistration;
  }
}   
