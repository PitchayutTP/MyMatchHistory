import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    const headers = { "Access-Control-Allow-Origin": "*" };

    try {
        // 1. ⭐️ ดึง User ID (sub) จาก Token ที่ Cognito Authorizer ส่งมา
        const userId = event.requestContext.authorizer.claims.sub;

        // 2. ⭐️ สร้างคำสั่ง Query โดยใช้ Index ที่เราสร้าง
        const command = new QueryCommand({
            TableName: "Videos",
            IndexName: "user_id-index", // ⭐️ ชื่อ Index ที่เราสร้างในขั้นตอนที่ 1
            KeyConditionExpression: "user_id = :uid", // ⭐️ ค้นหาเฉพาะ user_id ที่ตรงกัน
            ExpressionAttributeValues: {
                ":uid": userId
            }
        });

        const response = await docClient.send(command);

        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify(response.Items), // ⭐️ ส่งคืนเฉพาะวิดีโอของ User นั้น
        };

    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({ detail: error.message })
        };
    }
};