import { CognitoIdentityProviderClient, ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";
const client = new CognitoIdentityProviderClient({});

export const handler = async (event) => {
    const { COGNITO_USER_POOL_ID } = process.env;
    const command = new ListUsersCommand({
        UserPoolId: COGNITO_USER_POOL_ID,
    });
    try {
        const response = await client.send(command);

        const users = response.Users.map(user => {
            const emailAttr = user.Attributes.find(a => a.Name === 'email');
            const subAttr = user.Attributes.find(a => a.Name === 'sub');

            return {
                id: subAttr ? subAttr.Value : user.Username,
                name: emailAttr ? emailAttr.Value : user.Username,
                imageUrl: 'https://via.placeholder.com/150'
            };
        });

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify(users),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ detail: error.message }),
        };
    }
};