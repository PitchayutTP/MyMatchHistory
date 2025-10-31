import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    const headers = { "Access-Control-Allow-Origin": "*" };
    try {
        const userId = event.requestContext.authorizer.claims.sub;
        const command = new QueryCommand({
            TableName: "Videos",
            IndexName: "user_id-index",
            KeyConditionExpression: "user_id = :uid",
            ExpressionAttributeValues: {
                ":uid": userId
            }
        });

        const response = await docClient.send(command);

        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify(response.Items),
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