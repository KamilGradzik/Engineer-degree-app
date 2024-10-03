import PG from 'pg'
import dotenv from 'dotenv'

dotenv.config({path:'./src/config/.env'});

const client = new PG.Pool ({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
})

export default client;  