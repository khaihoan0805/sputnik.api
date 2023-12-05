/**
 * registration controller
 */

import { factories } from '@strapi/strapi'
import { SaveRegistrationUsecase, UpdateRegistrationUsecase } from './usecases';

export default factories.createCoreController('api::registration.registration', {

    saveDraftRegistration: async (ctx) => { return await SaveRegistrationUsecase.execute(ctx, true) },

    updateDraftRegistration: async (ctx) => { return await UpdateRegistrationUsecase.execute(ctx, true) },

    submitNewRegistration: async (ctx) => { return await SaveRegistrationUsecase.execute(ctx, false) },

    submitRegistrationFromDraft: async (ctx) => { return await UpdateRegistrationUsecase.execute(ctx, false) },

});
