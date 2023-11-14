/**
 * normal-user controller
 */

import { factories } from '@strapi/strapi'
import { GetUserProfileUsecase, HandleRedirectAzureEntraUsecase, UserLoginAzureEntraUsecase, UserLogoutAzureEntraUsecase } from './usecases';

export default factories.createCoreController('api::normal-user.normal-user', ({ strapi }) => ({

    login: async (ctx) => { return await UserLoginAzureEntraUsecase.execute(ctx) },

    redirect: async (ctx) => { return await HandleRedirectAzureEntraUsecase.execute(ctx) },

    profile: async (ctx) => { return await GetUserProfileUsecase.execute(ctx) },

    logout: async (ctx) => { return await UserLogoutAzureEntraUsecase.execute(ctx) },
}));
