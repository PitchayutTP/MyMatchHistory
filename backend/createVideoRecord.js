import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto"; // สำหรับสร้าง ID ใหม่

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    const headers = { "Access-Control-Allow-Origin": "*" };

    try {
        // 1. ดึงข้อมูล videoData ทั้งหมดที่ Upload.vue ส่งมา
        const data = JSON.parse(event.body);
        const id = randomUUID(); // สร้าง ID ใหม่

        // 2. ⭐️ สร้าง Item ที่จะบันทึกลง DB ⭐️
        // ใช้ ...data เพื่อกระจายทุกอย่างที่ส่งมา (รวมถึง title, thumbnail, sport_id, ฯลฯ)
        const item = {
            ...data,
            id: id // เพิ่ม ID ที่เราเพิ่งสร้าง
        };

        // 3. บันทึก Item ทั้งหมดลง DynamoDB
        const command = new PutCommand({
            TableName: "Videos", // ชื่อตาราง
            Item: item
        });

        await docClient.send(command);

        return {
            statusCode: 201, // 201 Created
            headers: headers,
            body: JSON.stringify(item), // ส่งข้อมูลที่สร้างเสร็จกลับไป
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