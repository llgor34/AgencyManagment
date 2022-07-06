import { projectFirestore } from './firebase';

export const isAdmin = async (userUid: string) => {
  const orderingUserDoc = await projectFirestore
    .collection('users')
    .doc(userUid)
    .get();

  return orderingUserDoc.data()!.roles['admin'] == false;
};
