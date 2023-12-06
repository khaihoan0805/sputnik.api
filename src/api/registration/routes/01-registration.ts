export default {
    routes: [
        {
            method: 'POST',
            path: '/registrations/save-as-draft',
            handler: 'registration.saveDraftRegistration',
            config: {
                auth: false,
                policies: ['global::is-having-session']
            }
        },
        {
            method: 'PUT',
            path: '/registrations/save-as-draft/:id',
            handler: 'registration.updateDraftRegistration',
            config: {
                auth: false,
                policies: ['global::is-having-session']
            }
        },
        {
            method: 'POST',
            path: '/registrations/submit',
            handler: 'registration.submitNewRegistration',
            config: {
                auth: false,
                policies: ['global::is-having-session', 'api::registration.validate-submit-registration-input']
            }
        },
        {
            method: 'POST',
            path: '/registrations/submit/:id',
            handler: 'registration.submitRegistrationFromDraft',
            config: {
                auth: false,
                policies: ['global::is-having-session', 'api::registration.validate-submit-registration-input']
            }
        },
        {
            method: 'POST',
            path: '/registrations/upns/csv',
            handler: 'registration.parseUPNsWithCSV',
            config: {
                auth: false,
                policies: ['global::is-having-session']
            }
        }
    ]
}