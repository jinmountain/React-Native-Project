const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// get new avg based on the new value
exports.updateUser = functions.firestore
    .document("users/{userId}/technicians/{techId}")
    .onWrite((change, context) => {
      const newValue = change.after.data();

      if (newValue.totalRating > 0 && newValue.countRating > 0) {
        const newAvgRating = newValue.totalRating / newValue.countRating;

        // console.log("new avg rating: ", newAvgRating);

        return change.after.ref.set({
          avgRating: newAvgRating,
        }, {merge: true});
      }
    });