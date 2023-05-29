export type ApplicationError = {
  name: string;
  message: string;
  details?: string[];
};

export type getTweetsParams = {
  page: number;
  userId: number;
};
