import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    const headers = { "Access-Control-Allow-Origin": "*" };
    try {
        const videoScan = new ScanCommand({ TableName: "Videos" });
        const videoResponse = await docClient.send(videoScan);
        const videos = videoResponse.Items;
        const profileScan = new ScanCommand({ TableName: "Profiles" });
        const profileResponse = await docClient.send(profileScan);
        const userEmailMap = new Map();
        profileResponse.Items.forEach(profile => {
            userEmailMap.set(profile.id, profile.email);
        });
        const enrichedVideos = videos.map(video => {
            return {
                ...video,
                uploaderEmail: userEmailMap.get(video.user_id) || "Unknown User"
            };
        });

        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify(enrichedVideos),
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