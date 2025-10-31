import { CognitoIdentityProviderClient, ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
const client = new CognitoIdentityProviderClient({});

export const handler = async (event) => {
    const { email, code } = JSON.parse(event.body);
    const { COGNITO_CLIENT_ID } = process.env;

    // 1. สร้างคำสั่งยืนยันตัวตน (แบบผู้ใช้)
    const command = new ConfirmSignUpCommand({
        ClientId: COGNITO_CLIENT_ID,
        Username: email, // เราใช้ Email เป็น Username
        ConfirmationCode: code // รหัส 6 หลักที่ผู้ใช้กรอก
    });

    try {
        // 2. ส่งคำสั่ง
        await client.send(command);
        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "Account confirmed successfully! You can now log in." }),
        };
    } catch (error) {
        // 3. ถ้า Error (เช่น รหัสผิด, User ไม่มีอยู่จริง)
        return {
            statusCode: 400,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ detail: error.message }), // เช่น "CodeMismatchException"
        };
    }
};