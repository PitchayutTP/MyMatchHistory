import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    const headers = { "Access-Control-Allow-Origin": "*" };
    try {
        // 1. Get all videos
        const videoScan = new ScanCommand({ TableName: "Videos" });
        const videoResponse = await docClient.send(videoScan);
        const videos = videoResponse.Items;

        // 2. Get all profiles (เพื่อเอา Email)
        const profileScan = new ScanCommand({ TableName: "Profiles" });
        const profileResponse = await docClient.send(profileScan);

        // 3. สร้าง "พจนานุกรม" เพื่อจับคู่ ID (Sub) กับ Email
        // (เช่น 'e4d8f478-...' -> 'user@example.com')
        const userEmailMap = new Map();
        profileResponse.Items.forEach(profile => {
            userEmailMap.set(profile.id, profile.email);
        });

        // 4. "เติม" Email ลงในข้อมูลวิดีโอ
        const enrichedVideos = videos.map(video => {
            return {
                ...video,
                // ค้นหา Email โดยใช้ user_id (SUB) ของวิดีโอ
                uploaderEmail: userEmailMap.get(video.user_id) || "Unknown User"
            };
        });

        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify(enrichedVideos), // ส่งข้อมูลที่ "เติม" แล้วกลับไป
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