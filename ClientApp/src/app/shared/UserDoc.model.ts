export interface UserDoc {
  uid: string;
  data: {
    email: string;
    displayName: string;
    phoneNumber: string;
    roles: {
      [role: string]: boolean;
    };
  };
}
