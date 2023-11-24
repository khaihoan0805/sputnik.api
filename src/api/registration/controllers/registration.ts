/**
 * registration controller
 */

import { factories } from '@strapi/strapi'
import { SaveRegistrationAsDraftUsecase } from './usecases';

export default factories.createCoreController('api::registration.registration', {

    saveAsDraft: async (ctx) => { return await SaveRegistrationAsDraftUsecase.execute(ctx) },

});
