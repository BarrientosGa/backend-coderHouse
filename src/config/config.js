import dotenv from 'dotenv'

dotenv.config()

export default {
    port : process.env.PORT,
    db_connection : process.env.DB_CONNECTION,
    client_id : process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    callback_url: process.env.CALLBACK_URL,
    secret_or_key: process.env.SECRET_OR_KEY,
    environment : process.env.ENVIRONMENT
}