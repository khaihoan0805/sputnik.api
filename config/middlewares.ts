export default [
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  // {
  //   name: 'strapi::session',
  //   config: {
  //     key: process.env.EXPRESS_SESSION_SECRET,
  //     overwrite
  //   },
  // },
  'strapi::favicon',
  'strapi::public',
];
