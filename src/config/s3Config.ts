import { S3Client } from "@aws-sdk/client-s3";
import config from ".";

const s3: S3Client = new S3Client({
    region: "ap-northeast-2",
    credentials: {
        accessKeyId: config.s3AccessKey, //여기있는 key 에 ㅇ접근함
        secretAccessKey: config.s3SecretKey,
    },
});

export default s3;