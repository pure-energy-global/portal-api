// Supabase Function Configuration
const FUNCTION_NAME = "onboarding";
const ENDPOINT_VERSION = "v1";

export const BASE_PATH = `/${FUNCTION_NAME}/${ENDPOINT_VERSION}`;

// Form Vendor
export const FORM_EVENT_TYPE = "FORM_RESPONSE";
export const FORM_SIGNING_SIGNATURE_HEADER = "tally-signature"; // Must be in lowercase since Hono returns the header map in lowercase
