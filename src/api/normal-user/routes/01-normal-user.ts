export default {
    routes: [
        {
            method: 'GET',
            path: '/auth/login',
            handler: 'normal-user.login',
            config: {
                auth: false
            }
        },
        {
            method: 'GET',
            path: '/auth/logout',
            handler: 'normal-user.logout',
            config: {
                auth: false,
                policies: ['global::is-having-session']
            },
        },
        {
            method: 'POST',
            path: '/auth/redirect',
            handler: 'normal-user.redirect',
            config: {
                auth: false
            }
        },
        {
            method: 'GET',
            path: '/users/user-profile',
            handler: 'normal-user.profile',
            config: {
                auth: false,
                policies: ['global::is-having-session']
            },
        }
    ]
}