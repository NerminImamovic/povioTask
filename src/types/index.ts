export type UserPublic = {
  id: string,
  username: string;
  likes: number;
};

export type UserAuth = {
  id: string,
  username: string,
  token: string
};
