import * as functions from 'firebase-functions';
import { projectFirestore, projectAuth } from './firebase';

// Deletes targeted user, if user that request it, have admin role
export const deleteUser = functions.https.onCall(async (data, context) => {
  const { userUid } = data;

  const orderingUserDoc = await projectFirestore
    .collection('users')
    .doc(context.auth!.uid)
    .get();

  try {
    if (orderingUserDoc.data()!.roles['admin'] == false) {
      return { status: 'error', data: 'Not enough permissions!' };
    } else {
      await projectAuth.deleteUser(userUid);
      await projectFirestore.collection('users').doc(userUid).delete();

      const projectsDocs = await projectFirestore
        .collection('projects')
        .where('assignedUsers', 'array-contains', userUid)
        .get();

      const batch = projectFirestore.batch();

      projectsDocs.docs.forEach((projectDoc) => {
        return batch.update(projectDoc.ref, {
          ...projectDoc.data(),
          assignedUsers: projectDoc
            .data()
            .assignedUsers.filter(
              (assignedUser: string) => assignedUser !== userUid
            ),
        });
      });

      await batch.commit();
      return { status: 'success', data: 'User successfully deleted!' };
    }
  } catch (error) {
    return { status: 'error', data: error };
  }
});
