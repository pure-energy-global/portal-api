// Supabase Function Configuration
const FUNCTION_NAME = "onboarding";
const ENDPOINT_VERSION = "v1";

export const BASE_PATH = `/${FUNCTION_NAME}/${ENDPOINT_VERSION}`;

// Tally
export const TALLY_EVENT_TYPE = "FORM_RESPONSE";
export const TALLY_SIGNATURE_HEADER = "tally-signature"; // Must be in lowercase since Hono returns the header map in lowercase
