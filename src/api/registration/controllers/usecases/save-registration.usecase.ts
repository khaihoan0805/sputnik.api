import { Strapi } from '@strapi/strapi';
import { Context } from 'koa';
import { RegistrationRelationsPayload, RegistrationUPNAgencyPayload, RegistrationUPNPayload, RegistrationPayload, AgencyRelationPayload, UPNRelationPayload, RegistrationRelationPayload, RegistrationUPNRelationPayload } from '../../routes/types/inputs';
import _ from 'lodash';
import { errors } from '@strapi/utils'

export class SaveRegistrationUsecase {
  static readonly strapi: Strapi = strapi;

  static async createUPNs(upns: RegistrationUPNPayload[]): Promise<any> {
    let agencyList = _.uniq(upns.reduce<RegistrationUPNAgencyPayload[]>(
      (acc, curr) => {
        return curr?.agencies !== undefined && curr.agencies.length > 0 ? acc.concat(curr.agencies) : acc
      }, []))

    const uniqAgencies = _.uniqWith(agencyList, _.isEqual)

    // let agencyList = upns.reduce<RegistrationUPNAgencyPayload[]>(
    //   (acc, curr) => {
    //     if (curr?.agencies !== undefined && curr.agencies.length > 0) {
    //       const notExisted = curr.agencies.filter(currDatum => {
    //         return acc.some(accDatum => {
    //           return JSON.stringify(currDatum) !== JSON.stringify(accDatum)
    //         })
    //       })
    //       acc.push(...notExisted)

    //       return acc;
    //     }

    //     return acc;
    //   }, []);

    console.log(`agencies uniq: `, uniqAgencies)

    const newAgenciesMap = new Map<string, any>()

    await Promise.all(uniqAgencies.map(async (agency) => {
      let setAgencyRelations: AgencyRelationPayload = {};

      const agencyRelationPayload = agency;

      for (let relationKey in setAgencyRelations) {
        if (!Array.isArray(agencyRelationPayload[relationKey])) {
          setAgencyRelations[relationKey] = { set: [agencyRelationPayload[relationKey]] }
          continue;
        }

        setAgencyRelations[relationKey] = { set: agencyRelationPayload[relationKey] }

      }

      const createdAgency = await this.strapi.entityService.create('api::agency.agency', {
        data: {
          ...agency,
          ...setAgencyRelations,
          publishedAt: new Date(),
        }
      } as any)

      newAgenciesMap.set(JSON.stringify(agency), createdAgency);
    }))

    return await Promise.all(upns.map(async (upn) => {
      upn.agencies = upn.agencies ? upn.agencies.map(agency => { return newAgenciesMap.get(JSON.stringify(agency)) }) : [];
      const upnRelationPayload: RegistrationUPNRelationPayload = { ...upn };

      let setUPNRelations: UPNRelationPayload = {};

      for (let relationKey in setUPNRelations) {
        if (!Array.isArray(upnRelationPayload[relationKey])) {
          setUPNRelations[relationKey] = { set: [upnRelationPayload[relationKey]] }
          continue;
        }

        setUPNRelations[relationKey] = { set: upnRelationPayload[relationKey] }
      }

      return await this.strapi.entityService.create('api::upn.upn', {
        data: <any>{
          ...upn,
          ...setUPNRelations,
          publishedAt: new Date(),
        }
      })
    }))
  }

  static async execute(ctx: Context, is_draft: boolean = true): Promise<any> {
    return await this.strapi.db.transaction(async () => {
      const payload: RegistrationPayload = ctx.request.body as any;
      const regRelationPayload: RegistrationRelationsPayload = payload;

      const isExistedRegistrationNo = await this.strapi.entityService.findMany('api::registration.registration', {
        filters: { registration_no: payload.registration_no }
      })
      if (isExistedRegistrationNo.length > 0) {
        throw new errors.ForbiddenError(`Registration_no: ${payload.registration_no} is already existed`)
      }


      const upns = payload.upns ? await this.createUPNs(payload.upns) : [];

      let setRelations: RegistrationRelationPayload = {};

      for (let relationKey in setRelations) {
        console.log(`key: `, relationKey)
        if (!Array.isArray(regRelationPayload[relationKey])) {
          setRelations[relationKey] = { set: [regRelationPayload[relationKey]] }
          continue;
        }

        setRelations[relationKey] = { set: regRelationPayload[relationKey] }
      }

      const registration = await this.strapi.entityService.create('api::registration.registration', {
        data: <any>{
          ...payload,
          ...setRelations,
          ...(
            upns.length > 0 ? {
              upns: {
                set: upns.map(upn => { return { id: upn.id } })
              }
            } : {}
          ),
          is_draft,
          publishedAt: new Date(),
        },
      })

      const resolvedRegistration = await this.strapi.entityService.findOne('api::registration.registration', registration.id, {
        populate: ['application', 'upns.agencies']
      })

      return resolvedRegistration;
    })
      .then(result => { return result })
      .catch(error => { console.log(error); throw error });
  }
}   
