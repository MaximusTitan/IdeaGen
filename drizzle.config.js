
/** @type { import("drizzle-kit").Config } */

export default {
    schema: "./utils/Schema.tsx", 
    dialect: 'postgresql',
    dbCredentials: {
    url: 'postgresql://neondb_owner:3NJSi8whRrgX@ep-billowing-waterfall-a5xryhjl.us-east-2.aws.neon.tech/neondb?sslmode=require',
    }
}