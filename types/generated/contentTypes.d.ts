import type { Schema, Attribute } from '@strapi/strapi';

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    username: Attribute.String;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    registrationToken: Attribute.String & Attribute.Private;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    preferedLanguage: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    name: 'Transfer Token';
    singularName: 'transfer-token';
    pluralName: 'transfer-tokens';
    displayName: 'Transfer Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    name: 'Transfer Token Permission';
    description: '';
    singularName: 'transfer-token-permission';
    pluralName: 'transfer-token-permissions';
    displayName: 'Transfer Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    alternativeText: Attribute.String;
    caption: Attribute.String;
    width: Attribute.Integer;
    height: Attribute.Integer;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    ext: Attribute.String;
    mime: Attribute.String & Attribute.Required;
    size: Attribute.Decimal & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: 'i18n_locale';
  info: {
    singularName: 'locale';
    pluralName: 'locales';
    collectionName: 'locales';
    displayName: 'Locale';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.SetMinMax<{
        min: 1;
        max: 50;
      }>;
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAgencyAgency extends Schema.CollectionType {
  collectionName: 'agencies';
  info: {
    singularName: 'agency';
    pluralName: 'agencies';
    displayName: 'Agency';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    upns: Attribute.Relation<
      'api::agency.agency',
      'manyToMany',
      'api::upn.upn'
    >;
    agency_application_status: Attribute.Relation<
      'api::agency.agency',
      'manyToOne',
      'api::agency-application-status.agency-application-status'
    >;
    agency_license_detail: Attribute.Relation<
      'api::agency.agency',
      'manyToOne',
      'api::agency-license-detail.agency-license-detail'
    >;
    agency_license_expiry_date: Attribute.Date;
    agency_license_summision_date: Attribute.Date;
    agency_license_approval_date: Attribute.Date;
    agency_license_approval_nr: Attribute.String;
    agency_registration_nr: Attribute.String;
    frequency: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::agency.agency',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::agency.agency',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAgencyApplicationStatusAgencyApplicationStatus
  extends Schema.CollectionType {
  collectionName: 'agency_application_statuses';
  info: {
    singularName: 'agency-application-status';
    pluralName: 'agency-application-statuses';
    displayName: 'Agency Application Status';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    agencies: Attribute.Relation<
      'api::agency-application-status.agency-application-status',
      'oneToMany',
      'api::agency.agency'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::agency-application-status.agency-application-status',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::agency-application-status.agency-application-status',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAgencyLicenseDetailAgencyLicenseDetail
  extends Schema.CollectionType {
  collectionName: 'agency_license_details';
  info: {
    singularName: 'agency-license-detail';
    pluralName: 'agency-license-details';
    displayName: 'Agency License Detail';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    agencies: Attribute.Relation<
      'api::agency-license-detail.agency-license-detail',
      'oneToMany',
      'api::agency.agency'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::agency-license-detail.agency-license-detail',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::agency-license-detail.agency-license-detail',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiApplicationApplication extends Schema.CollectionType {
  collectionName: 'applications';
  info: {
    singularName: 'application';
    pluralName: 'applications';
    displayName: 'Application';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String & Attribute.Required & Attribute.Unique;
    registrations: Attribute.Relation<
      'api::application.application',
      'oneToMany',
      'api::registration.registration'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::application.application',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::application.application',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiClassificationClassification extends Schema.CollectionType {
  collectionName: 'classifications';
  info: {
    singularName: 'classification';
    pluralName: 'classifications';
    displayName: 'Classification';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String & Attribute.Required & Attribute.Unique;
    registrations: Attribute.Relation<
      'api::classification.classification',
      'oneToMany',
      'api::registration.registration'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::classification.classification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::classification.classification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDeviceCategoryDeviceCategory extends Schema.CollectionType {
  collectionName: 'device_categories';
  info: {
    singularName: 'device-category';
    pluralName: 'device-categories';
    displayName: 'Device Category';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String & Attribute.Required & Attribute.Unique;
    registrations: Attribute.Relation<
      'api::device-category.device-category',
      'oneToMany',
      'api::registration.registration'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::device-category.device-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::device-category.device-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDivisionDivision extends Schema.CollectionType {
  collectionName: 'divisions';
  info: {
    singularName: 'division';
    pluralName: 'divisions';
    displayName: 'Division';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String & Attribute.Required & Attribute.Unique;
    registrations: Attribute.Relation<
      'api::division.division',
      'oneToMany',
      'api::registration.registration'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::division.division',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::division.division',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiGlobalIfuWindchillGlobalIfuWindchill
  extends Schema.CollectionType {
  collectionName: 'global_ifu_windchills';
  info: {
    singularName: 'global-ifu-windchill';
    pluralName: 'global-ifu-windchills';
    displayName: 'Global IFU Windchill';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String & Attribute.Required & Attribute.Unique;
    upns: Attribute.Relation<
      'api::global-ifu-windchill.global-ifu-windchill',
      'manyToMany',
      'api::upn.upn'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::global-ifu-windchill.global-ifu-windchill',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::global-ifu-windchill.global-ifu-windchill',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiGroupingGrouping extends Schema.CollectionType {
  collectionName: 'groupings';
  info: {
    singularName: 'grouping';
    pluralName: 'groupings';
    displayName: 'Grouping';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String & Attribute.Required & Attribute.Unique;
    registrations: Attribute.Relation<
      'api::grouping.grouping',
      'oneToMany',
      'api::registration.registration'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::grouping.grouping',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::grouping.grouping',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLegalManufacturerLegalManufacturer
  extends Schema.CollectionType {
  collectionName: 'legal_manufacturers';
  info: {
    singularName: 'legal-manufacturer';
    pluralName: 'legal-manufacturers';
    displayName: 'Legal Manufacturer';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String & Attribute.Required & Attribute.Unique;
    upns: Attribute.Relation<
      'api::legal-manufacturer.legal-manufacturer',
      'manyToMany',
      'api::upn.upn'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::legal-manufacturer.legal-manufacturer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::legal-manufacturer.legal-manufacturer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLicenseMarketLicenseMarket extends Schema.CollectionType {
  collectionName: 'license_markets';
  info: {
    singularName: 'license-market';
    pluralName: 'license-markets';
    displayName: 'License Market';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String & Attribute.Required & Attribute.Unique;
    registrations: Attribute.Relation<
      'api::license-market.license-market',
      'oneToMany',
      'api::registration.registration'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::license-market.license-market',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::license-market.license-market',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLocalIfuWindchillLocalIfuWindchill
  extends Schema.CollectionType {
  collectionName: 'local_ifu_windchills';
  info: {
    singularName: 'local-ifu-windchill';
    pluralName: 'local-ifu-windchills';
    displayName: 'Local IFU Windchill';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String & Attribute.Required & Attribute.Unique;
    upns: Attribute.Relation<
      'api::local-ifu-windchill.local-ifu-windchill',
      'manyToMany',
      'api::upn.upn'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::local-ifu-windchill.local-ifu-windchill',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::local-ifu-windchill.local-ifu-windchill',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiManufacturingSiteManufacturingSite
  extends Schema.CollectionType {
  collectionName: 'manufacturing_sites';
  info: {
    singularName: 'manufacturing-site';
    pluralName: 'manufacturing-sites';
    displayName: 'Manufacturing Site';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String & Attribute.Required & Attribute.Unique;
    upns: Attribute.Relation<
      'api::manufacturing-site.manufacturing-site',
      'manyToMany',
      'api::upn.upn'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::manufacturing-site.manufacturing-site',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::manufacturing-site.manufacturing-site',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiNormalUserNormalUser extends Schema.CollectionType {
  collectionName: 'normal_users';
  info: {
    singularName: 'normal-user';
    pluralName: 'normal-users';
    displayName: 'Normal User';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    username: Attribute.Email;
    countries: Attribute.Enumeration<['Malaysia', 'Singapore']>;
    name: Attribute.String;
    status: Attribute.Enumeration<['ACTIVE', 'INACTIVE', 'DELETED']>;
    role: Attribute.Relation<
      'api::normal-user.normal-user',
      'manyToOne',
      'api::user-role.user-role'
    >;
    ra_reresentative_registrations: Attribute.Relation<
      'api::normal-user.normal-user',
      'oneToMany',
      'api::registration.registration'
    >;
    ra_representative_registrations: Attribute.Relation<
      'api::normal-user.normal-user',
      'oneToMany',
      'api::registration.registration'
    >;
    registrations: Attribute.Relation<
      'api::normal-user.normal-user',
      'oneToMany',
      'api::registration.registration'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::normal-user.normal-user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::normal-user.normal-user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiReferenceCountryReferenceCountry
  extends Schema.CollectionType {
  collectionName: 'reference_countries';
  info: {
    singularName: 'reference-country';
    pluralName: 'reference-countries';
    displayName: 'Reference Country';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    abbreviation: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::reference-country.reference-country',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::reference-country.reference-country',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiRegistrationRegistration extends Schema.CollectionType {
  collectionName: 'registrations';
  info: {
    singularName: 'registration';
    pluralName: 'registrations';
    displayName: 'Registration';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    registration_no: Attribute.String;
    registration_expiry_date: Attribute.Date;
    registration_submission_id: Attribute.String;
    online_single_submission_id: Attribute.String;
    registration_status: Attribute.Relation<
      'api::registration.registration',
      'oneToOne',
      'api::registration-status.registration-status'
    >;
    application: Attribute.Relation<
      'api::registration.registration',
      'manyToOne',
      'api::application.application'
    >;
    division: Attribute.Relation<
      'api::registration.registration',
      'manyToOne',
      'api::division.division'
    >;
    registered_product_set: Attribute.String;
    approved_indication: Attribute.Text;
    classification: Attribute.Relation<
      'api::registration.registration',
      'manyToOne',
      'api::classification.classification'
    >;
    grouping: Attribute.Relation<
      'api::registration.registration',
      'manyToOne',
      'api::grouping.grouping'
    >;
    device_category: Attribute.Relation<
      'api::registration.registration',
      'manyToOne',
      'api::device-category.device-category'
    >;
    rule: Attribute.Integer &
      Attribute.SetMinMax<{
        min: 1;
        max: 16;
      }>;
    gmdn: Attribute.BigInteger;
    halal_registration: Attribute.String;
    queries_from_authority_info: Attribute.String;
    total_fee: Attribute.String;
    ra_reresentative: Attribute.Relation<
      'api::registration.registration',
      'manyToOne',
      'api::normal-user.normal-user'
    >;
    registration_est_submission_date: Attribute.Date;
    registration_authority_submitted_date: Attribute.Date;
    registration_queries_from_authority_receive_date: Attribute.Date;
    registration_queries_from_authority_response_date: Attribute.Date;
    registration_remark: Attribute.Text;
    par_request_date: Attribute.Date;
    country_of_origin: Attribute.Integer;
    potential_sales: Attribute.JSON;
    registration_total_fee: Attribute.BigInteger;
    non_md_letter_submission_date: Attribute.Date;
    non_md_letter_approval_date: Attribute.Date;
    non_md_letter_expiry_date: Attribute.Date;
    non_md_letter_approval_no: Attribute.BigInteger;
    non_md_access_fee: Attribute.JSON;
    sa_type: Attribute.Relation<
      'api::registration.registration',
      'manyToOne',
      'api::sa-type.sa-type'
    >;
    sa_submission_date: Attribute.Date;
    sa_approval_date: Attribute.Date;
    sa_expiry_date: Attribute.Date;
    sa_fee: Attribute.JSON;
    registration_approval_date: Attribute.Date;
    registration_cab_submission_date: Attribute.Date;
    registration_cab_approval_date: Attribute.Date;
    license_owner: Attribute.String;
    ra_representative: Attribute.Relation<
      'api::registration.registration',
      'manyToOne',
      'api::normal-user.normal-user'
    >;
    license_market: Attribute.Relation<
      'api::registration.registration',
      'manyToOne',
      'api::license-market.license-market'
    >;
    upns: Attribute.Relation<
      'api::registration.registration',
      'oneToMany',
      'api::upn.upn'
    >;
    created_by_user: Attribute.Relation<
      'api::registration.registration',
      'manyToOne',
      'api::normal-user.normal-user'
    >;
    is_draft: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    reference_country: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::registration.registration',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::registration.registration',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiRegistrationStatusRegistrationStatus
  extends Schema.CollectionType {
  collectionName: 'registration_statuses';
  info: {
    singularName: 'registration-status';
    pluralName: 'registration-statuses';
    displayName: 'Registration Status';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String & Attribute.Required & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::registration-status.registration-status',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::registration-status.registration-status',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiRolePermissionRolePermission extends Schema.CollectionType {
  collectionName: 'role_permissions';
  info: {
    singularName: 'role-permission';
    pluralName: 'role-permissions';
    displayName: 'Permission';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    action: Attribute.String;
    method: Attribute.String & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    roles: Attribute.Relation<
      'api::role-permission.role-permission',
      'manyToMany',
      'api::user-role.user-role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::role-permission.role-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::role-permission.role-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSaTypeSaType extends Schema.CollectionType {
  collectionName: 'sa_types';
  info: {
    singularName: 'sa-type';
    pluralName: 'sa-types';
    displayName: 'SA Type';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String & Attribute.Required & Attribute.Unique;
    registrations: Attribute.Relation<
      'api::sa-type.sa-type',
      'oneToMany',
      'api::registration.registration'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::sa-type.sa-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::sa-type.sa-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSterilisationSiteSterilisationSite
  extends Schema.CollectionType {
  collectionName: 'sterilisation_sites';
  info: {
    singularName: 'sterilisation-site';
    pluralName: 'sterilisation-sites';
    displayName: 'Sterilisation Site';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String & Attribute.Required & Attribute.Unique;
    upns: Attribute.Relation<
      'api::sterilisation-site.sterilisation-site',
      'manyToMany',
      'api::upn.upn'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::sterilisation-site.sterilisation-site',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::sterilisation-site.sterilisation-site',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiUpnUpn extends Schema.CollectionType {
  collectionName: 'upns';
  info: {
    singularName: 'upn';
    pluralName: 'upns';
    displayName: 'UPN';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    code: Attribute.String & Attribute.Required;
    agencies: Attribute.Relation<
      'api::upn.upn',
      'manyToMany',
      'api::agency.agency'
    >;
    status: Attribute.Enumeration<['ACTIVE', 'INACTIVE']>;
    par_request_date: Attribute.Date;
    device_description: Attribute.String;
    legal_manufacturers: Attribute.Relation<
      'api::upn.upn',
      'manyToMany',
      'api::legal-manufacturer.legal-manufacturer'
    >;
    manufacturing_sites: Attribute.Relation<
      'api::upn.upn',
      'manyToMany',
      'api::manufacturing-site.manufacturing-site'
    >;
    sterilisation_sites: Attribute.Relation<
      'api::upn.upn',
      'manyToMany',
      'api::sterilisation-site.sterilisation-site'
    >;
    name_as_per_label: Attribute.String;
    udi: Attribute.String;
    shelf_life: Attribute.String;
    local_ifu_windchills: Attribute.Relation<
      'api::upn.upn',
      'manyToMany',
      'api::local-ifu-windchill.local-ifu-windchill'
    >;
    global_ifu_windchills: Attribute.Relation<
      'api::upn.upn',
      'manyToMany',
      'api::global-ifu-windchill.global-ifu-windchill'
    >;
    cfs_cfg_no: Attribute.String;
    cfs_cfg_expriry_date: Attribute.String;
    potential_sales: Attribute.JSON;
    registration: Attribute.Relation<
      'api::upn.upn',
      'manyToOne',
      'api::registration.registration'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::upn.upn', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::upn.upn', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiUserRoleUserRole extends Schema.CollectionType {
  collectionName: 'user_roles';
  info: {
    singularName: 'user-role';
    pluralName: 'user-roles';
    displayName: 'Role';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    status: Attribute.Enumeration<['ACTIVE', 'INACTIVE', 'DELETED']>;
    permissions: Attribute.Relation<
      'api::user-role.user-role',
      'manyToMany',
      'api::role-permission.role-permission'
    >;
    normal_users: Attribute.Relation<
      'api::user-role.user-role',
      'oneToMany',
      'api::normal-user.normal-user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::user-role.user-role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::user-role.user-role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::i18n.locale': PluginI18NLocale;
      'api::agency.agency': ApiAgencyAgency;
      'api::agency-application-status.agency-application-status': ApiAgencyApplicationStatusAgencyApplicationStatus;
      'api::agency-license-detail.agency-license-detail': ApiAgencyLicenseDetailAgencyLicenseDetail;
      'api::application.application': ApiApplicationApplication;
      'api::classification.classification': ApiClassificationClassification;
      'api::device-category.device-category': ApiDeviceCategoryDeviceCategory;
      'api::division.division': ApiDivisionDivision;
      'api::global-ifu-windchill.global-ifu-windchill': ApiGlobalIfuWindchillGlobalIfuWindchill;
      'api::grouping.grouping': ApiGroupingGrouping;
      'api::legal-manufacturer.legal-manufacturer': ApiLegalManufacturerLegalManufacturer;
      'api::license-market.license-market': ApiLicenseMarketLicenseMarket;
      'api::local-ifu-windchill.local-ifu-windchill': ApiLocalIfuWindchillLocalIfuWindchill;
      'api::manufacturing-site.manufacturing-site': ApiManufacturingSiteManufacturingSite;
      'api::normal-user.normal-user': ApiNormalUserNormalUser;
      'api::reference-country.reference-country': ApiReferenceCountryReferenceCountry;
      'api::registration.registration': ApiRegistrationRegistration;
      'api::registration-status.registration-status': ApiRegistrationStatusRegistrationStatus;
      'api::role-permission.role-permission': ApiRolePermissionRolePermission;
      'api::sa-type.sa-type': ApiSaTypeSaType;
      'api::sterilisation-site.sterilisation-site': ApiSterilisationSiteSterilisationSite;
      'api::upn.upn': ApiUpnUpn;
      'api::user-role.user-role': ApiUserRoleUserRole;
    }
  }
}
