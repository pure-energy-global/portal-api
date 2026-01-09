// CMS vendor
export const FORM_ID_KEY = "FORM_ID";
export const PHONE_NUMBER_FORM_FIELD_KEY = "PHONE_NUMBER_FIELD_KEY";
export const TEXT_ME_A_LINK_FORM_FIELD_KEY = "TEXT_ME_A_LINK_FIELD_KEY";

// Edge runtime configuration
const FUNCTION_NAME = "onboarding";
const ENDPOINT_VERSION = "v1";

export const BASE_PATH = `/${FUNCTION_NAME}/${ENDPOINT_VERSION}`;

// Form vendor
export const FORM_EVENT_TYPE = "FORM_RESPONSE";
export const FORM_SIGNING_SIGNATURE_HEADER = "tally-signature"; // Must be in lowercase since Hono returns the header map in lowercase
