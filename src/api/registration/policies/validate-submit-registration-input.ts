import { Strapi } from '@strapi/strapi';
import { Context } from 'koa';
import { RegistrationPayload, RequiredRegistrationFields, RequiredUPNFields } from '../routes/types';

import { errors } from '@strapi/utils';
const { PolicyError } = errors;

async function validateSubmitRegistrationWithNewApplication(payload: RegistrationPayload): Promise<void> {
    console.log(`pass validateSubmitRegistrationWithNewApplication: `)
    const requiredRegistrationFields = [
        'registration_cab_submission_date',
        'registration_cab_approval_date'
    ]

    requiredRegistrationFields.forEach(key => {
        if (!payload[key]) throw new PolicyError(`missing key: ${key} for status submitted`)
    })

}


async function validateSubmitRegistrationWithApprovedStatus(payload: RegistrationPayload): Promise<void> {
    console.log(`pass validateSubmitRegistrationWithApprovedStatus: `)
    const requiredRegistrationFields = [
        'registration_no',
        'registration_expiry_date',
    ]

    requiredRegistrationFields.forEach(key => {
        if (!payload[key]) throw new PolicyError(`missing key: ${key} for status submitted`)
    })

}

async function validateSubmitRegistrationWithSubmittedStatus(payload: RegistrationPayload): Promise<void> {
    console.log(`pass validateSubmitRegistrationWithSubmittedStatus: `)

    const requiredRegistrationFields = [
        'registration_submission_id',
        'reference_country',
        'license_owner'
    ];

    requiredRegistrationFields.forEach(key => {
        if (!payload[key]) { throw new PolicyError(`missing key: ${key} for status submitted`) }
    })

    return;

}

async function validateSubmitRegistration(policyContext: any, config: any, { strapi }: { strapi: Strapi }): Promise<boolean> {
    const ctx: Context = strapi.requestContext.get();
    const body: RegistrationPayload = ctx.request.body as any;

    try {
        RequiredRegistrationFields.forEach(key => {
            if (!body[key]) { throw new PolicyError(`missing key: ${key} when submitting registrion`) }
        })

        if (body.upns || body.upns.length > 0) {
            body.upns.forEach(upn => {
                RequiredUPNFields.forEach(key => {
                    if (!upn[key]) { throw new PolicyError(`missing key: ${key} in UPN ${upn.code} when submitting registrion`) }
                })
            })
        }

        const statuses = await strapi.entityService.findMany('api::registration-status.registration-status');
        const registrationStatus = statuses.find(status => status.id === body.registration_status.id);
        if (!registrationStatus) { throw new PolicyError(`forbbidden registration status`) }

        const applications = await strapi.entityService.findMany('api::application.application');
        const registrationApplication = applications.find(application => application.id === body.application.id);
        if (!registrationApplication) { throw new PolicyError(`fobbiden registration application`) }

        switch (registrationStatus.title) {
            case 'Submitted': validateSubmitRegistrationWithSubmittedStatus(body);

            case 'Approved': validateSubmitRegistrationWithApprovedStatus(body);
        }

        if (registrationApplication.title.includes('New') && registrationApplication.title === 'Renewal') {
            validateSubmitRegistrationWithNewApplication(body)
        }


        return true;
    } catch (error) { console.log(error); throw error }
}

export default validateSubmitRegistration;