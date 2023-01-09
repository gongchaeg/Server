import axios from 'axios';

const webhook = process.env.WEBHOOK_URL as string;

export const webhookMessage = async (message: string): Promise<void> => {
    try {
        await axios.post(webhook, { text: message });
    } catch (error) {
        console.log(error);
        throw error;
    }
};