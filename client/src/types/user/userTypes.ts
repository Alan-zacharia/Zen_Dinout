

export interface RegistercredentialsType {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone ? : string
  }


export interface ProfileNavigationProps {
  userDetails: RegistercredentialsType | null;
}
