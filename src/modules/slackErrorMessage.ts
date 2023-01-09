export const slackErrorMessage = (method: string, endpoint: string, error: any, userId: string, statusCode: string) => {
    return `[ERROR] [${method}] ${endpoint} ${userId ? `userId: ${userId}` : 'user 없음'
        } ${JSON.stringify(error)}`;
}