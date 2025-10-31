import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
export const handler = async (event) => {
    const { id } = event.pathParameters;
    const command = new DeleteCommand({ TableName: "Videos", Key: { id } });
    try {
        await docClient.send(command);
        return {
            statusCode: 204,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: "",
        };
    } catch (error) { return { statusCode: 500, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify(error) }; }
};