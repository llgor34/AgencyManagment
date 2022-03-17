import * as functions from 'firebase-functions';
import { projectFirestore, projectAuth } from './firebase';

export const createUser = functions.https.onCall(async (data, context) => {
  const orderingUserDoc = await projectFirestore
    .collection('users')
    .doc(context.auth!.uid)
    .get();

  if (orderingUserDoc.data()!.roles['admin'] == false) {
    return { status: 'error', data: 'Not enough permissions!' };
  }

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
});
