export interface UserDoc {
  uid: string;
  data: {
    email: string;
    roles: {
      [role: string]: boolean;
    };
  };
}
