import { EnvironmentVariableDataSource } from "../_shared/data/datasource/EnvironmentVariableDataSource.ts";

// CMS vendor
export const CMS_API_VERSION = EnvironmentVariableDataSource("CMS_API_VERSION");
export const CMS_DATASET = EnvironmentVariableDataSource("CMS_DATASET");
export const CMS_PROJECT_ID = EnvironmentVariableDataSource("CMS_PROJECT_ID");
export const CMS_USE_CDN = EnvironmentVariableDataSource("CMS_USE_CDN") === "true";

export const CMS_FORM_ID_KEY = "FORM_ID";
export const CMS_FORM_PHONE_NUMBER_FIELD_KEY = "PHONE_NUMBER_FIELD_KEY";
export const CMS_FORM_TEXT_ME_A_LINK_FIELD_KEY = "TEXT_ME_A_LINK_FIELD_KEY";

// Edge runtime configuration
const FUNCTION_NAME = "onboarding";
const ENDPOINT_VERSION = "v1";

export const EDGE_BASE_PATH = `/${FUNCTION_NAME}/${ENDPOINT_VERSION}`;

// Form vendor
export const FORM_SIGNING_SECRET = EnvironmentVariableDataSource("FORM_SIGNING_SECRET") || "";

export const FORM_EVENT_TYPE = "FORM_RESPONSE";
export const FORM_FIELD_TYPE_CHECKBOX = "CHECKBOXES";
export const FORM_FIELD_TYPE_PHONE_NUMBER = "INPUT_PHONE_NUMBER";
export const FORM_SIGNATURE_ALGORITHM = "sha256";
export const FORM_SIGNATURE_ENCODING = "base64";
export const FORM_SIGNATURE_HEADER = "tally-signature"; // Must be in lowercase since Hono returns the header map in lowercase
export const FORM_PHONE_NUMBER_COUNTRY_CODE = "USA";
