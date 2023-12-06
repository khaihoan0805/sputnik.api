
export type SetRelationsPayload<P> = { [K in keyof P]?: { set: { id: number }[] } };

export type RegistrationUPNAgencyPayload = {
    id?: number;
    agency_application_status: { id: number };
    agency_license_details: { id: number };
    agency_license_expiry_date: Date;
    agency_license_summission_date: Date;
    agency_license_approval_date: Date;
    agency_license_approval_no: string;
    agency_registration_no: string;
    frequency: string;
}

export type RegistrationUPNAgencyRelationPayload = Pick<RegistrationUPNAgencyPayload,
    'agency_application_status' | 'agency_license_details'
>;

export type AgencyRelationPayload = SetRelationsPayload<RegistrationUPNAgencyRelationPayload>;

export const RequiredUPNFields = [
    'par_request_date',
    'code',
    'device_description',
    'legal_manufacturers',
    'manufacturer_sites',
    'sterilization_sites',
]

export type RegistrationUPNPayload = {
    id?: number;

    //main information

    par_request_date: Date;
    code: string;
    status: string;

    device_description: string;
    legal_manufacturers: { id: number }[];
    manufacturer_sites: { id: number }[];
    sterilisation_sites: { id: number }[];


    //secondary information

    name_as_per_label: string;
    local_device_description: string;
    udi: string;
    shelf_life: string;
    local_ifu_windchills: { id: number }[];
    global_ifu_windchills: { id: number }[];
    cfs_cfg_no: string;
    cfs_cfg_expiry_date: Date;
    potential_sales: {
        amount: number;
        currency: string;
    }

    //agencies

    agencies: RegistrationUPNAgencyPayload[];
}

export type RegistrationUPNRelationPayload = Pick<RegistrationUPNPayload,
    'legal_manufacturers'
    | 'manufacturer_sites'
    | 'sterilisation_sites'
    | 'local_ifu_windchills'
    | 'global_ifu_windchills'
>;

export type UPNRelationPayload = SetRelationsPayload<RegistrationUPNRelationPayload & { agencies?: RegistrationUPNAgencyPayload[] }>


export const RequiredRegistrationFields = [
    'registration_status',
    'application',
    'division',
    'registration_approval_date',
    // 'registration_submission_id',
    'registered_product_set',
    'approved_indication',
    'classification',
    'grouping',
    'device_category',
    'license_market'
]

export type RegistrationPayload = {
    id?: number;

    // UPNs

    upns: RegistrationUPNPayload[]

    // License information fields
    registration_status: { id: number };
    application: { id: number };
    division: { id: number };
    registration_no: string;
    registration_approval_date: Date;
    registration_expiry_date: Date;
    registration_submission_id: string;
    online_single_submission_id: string;
    registered_product_set: string;
    approved_indication: string;
    classification: { id: number };
    rule: { id: number };
    grouping: { id: number };
    device_category: { id: number };
    gmdn: number;
    reference_country: { id: number };
    license_owner: string;
    halal_registration: string;
    country_of_origin: { id: number };
    registration_cab_submission_date: Date;
    registration_cab_approval_date: Date;
    // cab_certificate: any;
    registration_est_submission_date: Date;

    // calculate field: 
    //registration_est_approval_date: Date;

    registration_authority_submitted_date: Date;

    // calculate field: 
    //registration_actual_approval_timeline: Date;

    registration_queries_from_authority_receive_date: Date;
    registration_queries_from_authority_response_date: Date;
    registration_queries_from_authority_info: string;
    registration_total_fee: number;
    ra_representative: { id: number };
    license_market: { id: number };

    //license Documentation

    remark: string;
    // product_registration_documentation: any;
    // attachment: any

    //dynamic

    non_md_letter_submission_date: Date;
    non_md_letter_approval_date: Date;
    non_md_letter_expiry_date: Date;
    non_md_approval_no: number;
    non_md_access_fee: {
        amount: number;
        currency: string;
    };

    sa_type: { id: number };
    sa_submission_date: Date;
    sa_approval_date: Date;
    sa_expiry_date: Date;
    sa_approval_no: any;
    sa_fee: {
        amount: number;
        currency: string;
    };
}

export type RegistrationRelationsPayload = Pick<
    RegistrationPayload,
    'application'
    | 'division'
    | 'classification'
    | 'rule'
    | 'grouping'
    | 'ra_representative'
    | 'license_market'
    | 'sa_type'
>

export type RegistrationRelationPayload = SetRelationsPayload<RegistrationRelationsPayload & { upns?: RegistrationUPNPayload }>

