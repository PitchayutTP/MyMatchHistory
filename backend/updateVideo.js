import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
export const handler = async (event) => {
    const { id } = event.pathParameters;
    const data = JSON.parse(event.body);
    // ตรวจสอบว่า id ใน path กับ body ตรงกัน
    if (data.id !== id) {
        return { statusCode: 400, headers: { "Access-Control-Allow-Origin": "*" }, body: "ID mismatch" };
    }
    const command = new PutCommand({ TableName: "Videos", Item: data });
    try {
        await docClient.send(command);
        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify(data),
        };
    } catch (error) { return { statusCode: 500, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify(error) }; }
};