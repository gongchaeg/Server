export const slackErrorMessage = (method: string, endpoint: string, error: any, statusCode?: number) => {
    console.log(`에러코드!!!!!!!!!!!!!!!!!!!! ${error}, ${typeof (error)}`);
    return `[ERROR] [${method}] ${endpoint} ${error}`;
}