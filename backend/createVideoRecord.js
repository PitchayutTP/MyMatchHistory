import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    const headers = { "Access-Control-Allow-Origin": "*" };

    try {
        const data = JSON.parse(event.body);
        const id = randomUUID();
        const item = {
            ...data,
            id: id
        };

        const command = new PutCommand({
            TableName: "Videos",
            Item: item
        });

        await docClient.send(command);

        return {
            statusCode: 201,
            headers: headers,
            body: JSON.stringify(item),
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