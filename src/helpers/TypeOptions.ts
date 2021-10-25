export type UserAuthOptions = {
  username: string,
  password: string,
};

export type UpdatePasswordOptions = {
  userId: string,
  password: string,
};

export type UpdateLikesOptions = {
  likerId: string,
  userId: string,
  like: boolean,
};
