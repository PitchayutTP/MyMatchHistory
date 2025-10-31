import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
export const handler = async (event) => {
    const { id } = event.pathParameters;
    // (ควรเพิ่ม: ดึงข้อมูลวิดีโอมาก่อน เพื่อเอา S3 Key แล้วสั่งลบไฟล์ใน S3 ด้วย)
    const command = new DeleteCommand({ TableName: "Videos", Key: { id } });
    try {
        await docClient.send(command);
        return {
            statusCode: 204, // 204 No Content คือการตอบกลับที่ถูกต้องสำหรับการลบ
            headers: { "Access-Control-Allow-Origin": "*" },
            body: "",
        };
    } catch (error) { return { statusCode: 500, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify(error) }; }
};