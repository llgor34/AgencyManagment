import { projectFirestore, projectAuth } from './firebase';
import { UserCredentials } from './models/user-credentials.model';
import { isAdmin } from './isAdmin';
import { throwError } from './throwError';

export const createUser = async (data: UserCredentials, userUid: string) => {
  const { email, password } = data;

  if (!isAdmin(userUid)) {
    return throwError('Not enough permission for this operation!');
  }

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
