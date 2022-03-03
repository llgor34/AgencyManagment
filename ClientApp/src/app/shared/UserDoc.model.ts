export interface UserDoc {
  uid: string;
  email: string;
  roles: {
    admin: boolean;
    employee: boolean;
  };
}
