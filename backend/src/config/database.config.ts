import { registerAs } from "@nestjs/config";

export default registerAs("database", () => ({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  database: process.env.DB_NAME || "",
  username: process.env.DB_USER || "",
  password: process.env.DB_PASS || "",
  entities: ["dist/**/*.model{.ts,.js}"],
  synchronize: process.env.DB_SYNCHRONIZE === "true",
}));
