import dotenv from 'dotenv';
dotenv.config();

export default { 
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_COOKIE: process.env.AUTH_COOKIE
};