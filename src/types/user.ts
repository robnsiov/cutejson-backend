export interface UserSignupBody {
  email: string;
  password: string;
}

export interface UserSigninBody {
  email: string;
  password: string;
}
export interface UserForgotPassBody {
  email: string;
}
