import { CognitoIdentityProviderClient, GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
const client = new CognitoIdentityProviderClient({});
export const handler = async (event) => {
    try {
        // 1. ดึง Token จาก Header
        const accessToken = event.headers.authorization.split(' ')[1];
        // 2. ดึงข้อมูล User
        const command = new GetUserCommand({ AccessToken: accessToken });
        const response = await client.send(command);
        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ username: response.Username }), // ส่งชื่อผู้ใช้กลับไป
        };
    } catch (error) {
        return { statusCode: 401, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify(error) };
    }
};