import axios from "axios";

const webhookErrorUrl = process.env.WEBHOOK_URL_ERROR as string;
const webhookSignUpUrl = process.env.WEBHOOK_URL_SIGNUP as string;

export const sendWebhookErrorMessage = async (
  message: string
): Promise<void> => {
  try {
    await axios.post(webhookErrorUrl, { text: message });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const sendWebhookSignUpMessage = async (
  message: string
): Promise<void> => {
  try {
    await axios.post(webhookSignUpUrl, { text: message });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
