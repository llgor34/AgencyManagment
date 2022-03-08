export interface UserDoc {
  uid: string;
  data: {
    newUser: boolean;
    email: string;
    displayName: string;
    phoneNumber: string;
    roles: {
      [role: string]: boolean;
    };
  };
}
