export type ApplicationError = {
  name: string;
  message: string;
  details?: string[];
};

export type GetTweetsParams = {
  page: number;
  userId: number;
};

export type FollowUserParams = {
  following_user_id: number;
  followed_user_id: number;
};
