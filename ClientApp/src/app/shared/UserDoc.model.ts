export interface UserDoc {
  uid: string;
  data: {
    email: string;
    roles: {
      admin: boolean;
      employee: boolean;
    };
  };
}
