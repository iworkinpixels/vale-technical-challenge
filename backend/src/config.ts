export type RuntimeEnv = "development" | "production";

export interface AppConfig {
  env: RuntimeEnv;
  version: string;
  port: number;
}

function getEnv(value: string | undefined): RuntimeEnv {
  return value === "production" ? "production" : "development";
}

export const config: AppConfig = {
  env: getEnv(process.env.NODE_ENV),
  version: process.env.VERSION ?? "0.0.0",
  port: 8000
};
