import { CognitoIdentityProviderClient, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
const client = new CognitoIdentityProviderClient({});

export const handler = async (event) => {
    // 1. ⭐️ รับแค่ email และ password ⭐️
    const { email, password } = JSON.parse(event.body);
    const { COGNITO_CLIENT_ID } = process.env;

    try {
        const command = new SignUpCommand({
            ClientId: COGNITO_CLIENT_ID,
            Username: email, // ใช้ Email เป็น ID หลัก
            Password: password,
            UserAttributes: [
                { Name: "email", Value: email },
                // 2. ⭐️ ลบ preferred_username ออก ⭐️
            ],
        });
        await client.send(command);

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "User registered successfully, please check email for code" }),
        };
    } catch (error) {
        return {
            statusCode: 400,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ detail: error.message }),
        };
    }
};