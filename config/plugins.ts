module.exports = ({ env }) => ({
    //...
    'import-export-entries': {
        enabled: true,
        config: {
            /**
             * Public hostname of the server.
             *
             * If you use the local provider to persist medias,
             * `serverPublicHostname` should be set to properly export media urls.
             */
        },
    },
    //...
});