import { projectFirestore, projectAuth } from './firebase';
import { isAdmin } from './isAdmin';
import { throwError } from './throwError';

// Deletes targeted user, if user that request it, have admin role
export const deleteUser = async (
  userToDeleteUid: string,
  requestingUserUid: string
) => {
  try {
    if (!isAdmin(requestingUserUid)) {
      return throwError('Not enough permission for this operation!');
    }

    await projectAuth.deleteUser(userToDeleteUid);
    await projectFirestore.collection('users').doc(userToDeleteUid).delete();

    const projectsDocs = await projectFirestore
      .collection('projects')
      .where('assignedUsers', 'array-contains', userToDeleteUid)
      .get();

    const batch = projectFirestore.batch();

    projectsDocs.docs.forEach(projectDoc => {
      return batch.update(projectDoc.ref, {
        ...projectDoc.data(),
        assignedUsers: projectDoc
          .data()
          .assignedUsers.filter(
            (assignedUser: string) => assignedUser !== userToDeleteUid
          ),
      });
    });

    await batch.commit();
    return { status: 'success', data: 'User successfully deleted!' };
  } catch (error) {
    return { status: 'error', data: error };
  }
};
