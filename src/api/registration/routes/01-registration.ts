export default {
    routes: [
        {
            method: 'POST',
            path: '/registrations/save-as-draft',
            handler: 'registration.saveAsDraft',
            config: {
                auth: false,
                policies: ['global::is-having-session']
            }
        }
    ]
}