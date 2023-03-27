import dotenv from "dotenv";

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();

if (envFound.error) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
    port: parseInt(process.env.PORT as string, 10) as number,

    //? 데이터베이스
    database: process.env.DATABASE_URL as string,

    //? AWS
    s3AccessKey: process.env.S3_ACCESS_KEY as string,
    s3SecretKey: process.env.S3_SECRET_KEY as string,
    bucketName: process.env.S3_BUCKET as string,

    //? Email
    email: process.env.MANAGER_EMAIL as string,
    password: process.env.MANAGER_PASSWORD as string,
};