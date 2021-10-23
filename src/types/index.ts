export type UserPublic = {
  id: string,
  username: string;
  likes: number;
}

export type UserVerificationData = {
  username: string,
  password: string,
}

export type UserAuth = {
  id: string,
  username: string,
  token: string
}
