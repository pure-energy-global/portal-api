export function EnvironmentVariableDataSource(key: string): string | undefined {
    return Deno.env.get(key);
}
