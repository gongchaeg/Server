type ApnsPriority = {
  "apns-priority": string;
};

type PushMessage = {
  token: string;
  notification: {
    title: string;
    body: string;
  };
  apns: {
    headers: ApnsPriority;
  };
};

export const createPushMessage = (
  token: string,
  title: string,
  body: string
): PushMessage => {
  const pushMessage = {
    token: token,
    notification: {
      title: title,
      body: body,
    },
    apns: {
      headers: {
        "apns-priority": "5",
      },
    },
  };

  return pushMessage;
};
