import { Strapi } from '@strapi/strapi';
import { Context } from 'koa';
import { RegistrationRelationsPayload, RegistrationUPNAgencyPayload, RegistrationUPNPayload, RegistrationPayload, AgencyRelationPayload, UPNRelationPayload, RegistrationRelationPayload, RegistrationUPNRelationPayload } from '../../routes/types/inputs';
import _ from 'lodash';
import { errors } from '@strapi/utils'

export class UpdateRegistrationUsecase {
  static readonly strapi: Strapi = strapi;

  static async updateUPNs(upns: RegistrationUPNPayload[]): Promise<any> {
    let agencyList = _.uniq(upns.reduce<RegistrationUPNAgencyPayload[]>(
      (acc, curr) => {
        return curr?.agencies !== undefined && curr.agencies.length > 0 ? acc.concat(curr.agencies) : acc
      }, []))

    const agencyMap = new Map<string, any>();

    await Promise.all(agencyList.map(async (agency) => {
      let setAgencyRelations: AgencyRelationPayload = {};

      const agencyRelationPayload = agency;

      for (let relationKey in setAgencyRelations) {
        if (!Array.isArray(setAgencyRelations[relationKey])) {
          setAgencyRelations[relationKey] = { set: [agencyRelationPayload[relationKey]] }
        }

        if (Array.isArray(setAgencyRelations[relationKey])) {
          setAgencyRelations[relationKey] = { set: agencyRelationPayload[relationKey] }
        }
      }

      if (!agency.id) {
        const createdAgency = await this.strapi.entityService.create('api::agency.agency', {
          data: {
            ...agency,
            ...setAgencyRelations,
            publishedAt: new Date(),
          }
        } as any)

        agencyMap.set(JSON.stringify(agency), createdAgency);
        return;
      }

      await this.strapi.entityService.update('api::agency.agency', agency.id, {
        data: {
          ...agency,
          ...setAgencyRelations,
          publishedAt: new Date(),
        }
      } as any);

      const resolvedAgency = await this.strapi.entityService.findOne('api::agency.agency', agency.id)

      agencyMap.set(JSON.stringify(agency), resolvedAgency)
    }))

    return await Promise.all(upns.map(async (upn) => {
      upn.agencies = upn.agencies ? upn.agencies.map(agency => { return agencyMap.get(JSON.stringify(agency)) }) : [];
      const upnRelationPayload: RegistrationUPNRelationPayload = { ...upn };

      let setUPNRelations: UPNRelationPayload = {};

      for (let relationKey in setUPNRelations) {
        if (!Array.isArray(upnRelationPayload[relationKey])) {
          setUPNRelations[relationKey] = { set: [upnRelationPayload[relationKey]] }
        }

        if (Array.isArray(setUPNRelations[relationKey])) {
          setUPNRelations[relationKey] = { set: upnRelationPayload[relationKey] }
        }
      }

      if (!upn.id) {
        return await this.strapi.entityService.create('api::upn.upn', {
          data: <any>{
            ...upn,
            ...setUPNRelations,
            publishedAt: new Date(),
          }
        })
      }

      return await this.strapi.entityService.update('api::upn.upn', upn.id, {
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
      const id = ctx.params.id;
      if (!id) {
        throw new errors.HttpError(`missing id`)
      }

      const isExisted = await this.strapi.entityService.findOne('api::registration.registration', id as any);
      if (!isExisted) { throw new Error(`This Registration ID is not existed`) }

      const payload: RegistrationPayload = ctx.request.body as any;
      const regRelationPayload: RegistrationRelationsPayload = payload;

      const isExistedRegistrationNo = await this.strapi.entityService.findMany('api::registration.registration', {
        filters: { $and: [{ $not: { id } }, { registration_no: payload.registration_no }] }
      })
      if (isExistedRegistrationNo.length > 0) {
        throw new errors.ForbiddenError(`Registration_no: ${payload.registration_no} is already existed`)
      }

      const upns = payload.upns ? await this.updateUPNs(payload.upns) : [];

      let setRelationObj: RegistrationRelationPayload = {};

      for (let relationKey in setRelationObj) {
        if (!Array.isArray(regRelationPayload[relationKey])) {
          setRelationObj[relationKey] = { set: [regRelationPayload[relationKey]] }
        }

        if (Array.isArray(setRelationObj[relationKey])) {
          setRelationObj[relationKey] = { set: regRelationPayload[relationKey] }
        }
      }

      await this.strapi.entityService.update('api::registration.registration', isExisted.id, {
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
          is_draft,
          publishedAt: new Date(),
        },
      })

      const resolvedRegistration = await this.strapi.entityService.findOne('api::registration.registration', isExisted.id, {
        populate: ['application', 'upns.agencies']
      })

      return resolvedRegistration;
    })
      .then(result => { return result })
      .catch(error => { console.log(error); throw error });
  }
}   
