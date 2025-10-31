// ⭐️ โค้ดใหม่สำหรับ getPresignedUrl โดยใช้ AWS SDK v3 (มีใน Node.js 20.x)

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({});
const BUCKET_NAME = process.env.BUCKET_NAME;

export const handler = async (event) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
    };

    if (!BUCKET_NAME) {
        return { statusCode: 500, headers: headers, body: JSON.stringify({ detail: "BUCKET_NAME environment variable is not set." }) };
    }

    try {
        const { fileName, fileType } = JSON.parse(event.body);
        const key = `videos/${Date.now()}_${fileName}`;

        // 1. สร้างคำสั่ง PutObject
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            ContentType: fileType
        });

        // 2. สร้าง Pre-signed URL (ไวยากรณ์ใหม่ของ v3)
        const uploadURL = await getSignedUrl(client, command, { expiresIn: 300 }); // 5 mins
        const videoUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;

        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({ uploadURL, videoUrl }),
        };
    } catch (error) {
        console.error(error);
        return { statusCode: 500, headers: headers, body: JSON.stringify({ detail: error.message }) };
    }
};