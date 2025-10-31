import { CognitoIdentityProviderClient, ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
const client = new CognitoIdentityProviderClient({});

export const handler = async (event) => {
    const { email, code } = JSON.parse(event.body);
    const { COGNITO_CLIENT_ID } = process.env;

    const command = new ConfirmSignUpCommand({
        ClientId: COGNITO_CLIENT_ID,
        Username: email,
        ConfirmationCode: code
    });

    try {
        await client.send(command);
        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "Account confirmed successfully! You can now log in." }),
        };
    } catch (error) {
        return {
            statusCode: 400,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ detail: error.message }),
        };
    }
};