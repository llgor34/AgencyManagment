import { projectFirestore, projectAuth } from './firebase';
import { UserCredentials } from './models/user-credentials.model';

export const createUser = async (data: UserCredentials, userUid: string) => {
  const { email, password } = data;

  const user = await projectAuth.createUser({
    email,
    password,
  });

  await projectFirestore
    .collection('users')
    .doc(user.uid)
    .set({
      displayName: '',
      email,
      newUser: true,
      phoneNumber: '',
      roles: {
        admin: false,
        employee: true,
      },
    });

  return { status: 'success', data: 'User successfully created!' };
};
