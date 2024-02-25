type PushMessage = {
  token: string;
  notification: {
    title: string;
    body: string;
  };
};

export const createPushMessage = (
  token: string,
  title: string,
  body: string
): PushMessage => {
  return {
    token: token,
    notification: {
      title: title,
      body: body,
    },
  };
};
