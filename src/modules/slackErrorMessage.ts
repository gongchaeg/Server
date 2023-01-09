export const slackErrorMessage = (method: string, endpoint: string, error: any, userId: number, statusCode?: number) => {
    console.log(`에러코드!!!!!!!!!!!!!!!!!!!! ${error}, ${typeof (error)}`);
    return `[ERROR] [${method}] ${endpoint} ${userId ? `userId: ${userId}` : 'user 없음'} ${error}`;
}