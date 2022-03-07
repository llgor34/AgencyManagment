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

  // validate data ...

  // Delete provided user
  try {
    await projectAuth.deleteUser(userUid);
    await projectFirestore.collection("users").doc(userUid).delete();
    return { status: "success", data: "User successfully deleted!" };
  } catch (error) {
    return { status: "error", data: error };
  }
});
