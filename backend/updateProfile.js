import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
export const handler = async (event) => {
    const { id } = event.pathParameters;
    const data = JSON.parse(event.body);
    const command = new PutCommand({
        TableName: "Profiles",
        Item: { ...data, id: id }, // บันทึกข้อมูลใหม่ทับลงไป
    });
    try {
        await docClient.send(command);
        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify(data),
        };
    } catch (error) { return { statusCode: 500, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify(error) }; }
};