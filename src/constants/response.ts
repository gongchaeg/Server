export const success = (status: number, message: string, data?: any) => {
  return {
    status,
    success: true,
    message,
    data,
  };
};

export const fail = (status: number, message: string) => {
  return {
    status,
    success: false,
    message,
  };
};