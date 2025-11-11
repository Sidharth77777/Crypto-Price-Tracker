import dotenv from "dotenv";

dotenv.config({quiet: true});

export const ENV = {
    NODE_ENV: process.env['NODE_ENV'],
    PORT: process.env['PORT'],
    FRONTEND_ORIGIN: process.env['FRONTEND_ORIGIN'],
    
    MONGODB_URI: process.env['MONGODB_URI'],
    SALT_ROUNDS: process.env['SALT_ROUNDS'],
    JWT_SECRET: process.env['JWT_SECRET'],

    SMTP_PASSWORD: process.env['SMTP_PASSWORD'],
    SMTP_HOST: process.env['SMTP_HOST'],
    SMTP_PORT: process.env['SMTP_PORT'],
    SMTP_USER: process.env['SMTP_USER'],

    COINGECKO_SECRET_KEY: process.env['COINGECKO_SECRET_KEY'],

    CRON_SECRET: process.env['CRON_SECRET'],
    ENABLE_SELF_CRON: process.env['ENABLE_SELF_CRON'],
}