import { EnvironmentVariableDataSource } from "./data/datasource/EnvironmentVariableDataSource.ts";

// Edge runtime configuration
export const DEPLOYMENT_REGION = EnvironmentVariableDataSource("SB_REGION");
