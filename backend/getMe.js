import { CognitoIdentityProviderClient, GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
const client = new CognitoIdentityProviderClient({});
export const handler = async (event) => {
    try {
        const accessToken = event.headers.authorization.split(' ')[1];
        const command = new GetUserCommand({ AccessToken: accessToken });
        const response = await client.send(command);
        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ username: response.Username }),
        };
    } catch (error) {
        return { statusCode: 401, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify(error) };
    }
};