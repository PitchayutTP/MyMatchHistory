import { CognitoIdentityProviderClient, InitiateAuthCommand, GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
const client = new CognitoIdentityProviderClient({});

export const handler = async (event) => {
    const { username, password } = JSON.parse(event.body);
    console.log(username, password)
    const { COGNITO_CLIENT_ID } = process.env;

    const authCommand = new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: COGNITO_CLIENT_ID,
        AuthParameters: { USERNAME: username, PASSWORD: password },
    });

    try {
        const authResponse = await client.send(authCommand);
        const accessToken = authResponse.AuthenticationResult.AccessToken;
        const token = authResponse.AuthenticationResult.IdToken;

        const getUserCommand = new GetUserCommand({ AccessToken: accessToken });
        const userResponse = await client.send(getUserCommand);
        const userId = userResponse.UserAttributes.find(attr => attr.Name === 'sub').Value;

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({
                token: token,
                user: { id: userId },
            }),
        };
    } catch (error) {
        console.log(error)
        return {
            statusCode: 401,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ detail: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" }),
        };
    }
};