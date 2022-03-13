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

export interface UserDocRaw {
  displayName: string;
  email: string;
  newUser: boolean;
  phoneNumber: string;
  roles: { [role: string]: boolean };
  uid: string;
}
