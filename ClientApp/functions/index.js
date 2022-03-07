const functions = require("firebase-functions");
const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("./agency-managment-firebase-adminsdk-2svc5-7557c988cb.json");

// initialize firebase
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

// initialize firebase serives
const projectFirestore = firebaseAdmin.firestore();
const projectAuth = firebaseAdmin.auth();

// Deletes targeted user, if user that request it, have admin role
exports.deleteUser = functions.https.onCall(async (data, context) => {
  const { userUid } = data;

  try {
    // validate data ...
    const orderingUser = context.auth.uid;
    const orderingUserDoc = await projectFirestore
      .collection("users")
      .doc(orderingUser)
      .get();

    if (!orderingUserDoc.data().roles.admin) {
      return { status: "error", data: "Not enough permissions!" };
    }
    // Delete provided user
    await projectAuth.deleteUser(userUid);
    await projectFirestore.collection("users").doc(userUid).delete();
    return { status: "success", data: "User successfully deleted!" };
  } catch (error) {
    return { status: "error", data: error };
  }
});
