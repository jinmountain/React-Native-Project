import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import Firebase from '../firebase/config'

const signupFire = (email, password, confirmPassword) => {
  return new Promise ((res, rej) => {
    if (password !== confirmPassword) {
      res("passwordDoNotMatch");
    } else {
      console.log(email);
      // To apply the default browser preference instead of explicitly setting it.
      // firebase.auth().useDeviceLanguage();
      Firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        // USE WHEN HAVE REAL EMAILS
        // const uid = response.user.uid;
        // response.user
        // .sendEmailVerification()
        // .then(() => {
        //   console.log("Verification email is sent to ", response.user.email);
        //   res({ "email": response.user.email, "emailVerified": false });
        // })
        // .catch((error) => {
        //   console.log("signupFire: error occured during sending a verification email: ", error);
        //   res(false);
        // });
        res({ "email": response.user.email, "emailVerified": false });
      })
      .catch((error) => {
        rej(error);
      });
    }
  });
};

const signinFire = (email, password) => {
  return new Promise ((res, rej) => {
    Firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((response) => {
      const uid = response.user.uid;
      const usersRef = Firebase.firestore().collection('users');
      // if (response.user.emailVerified === true) {
        usersRef
        .doc(uid)
        .get()
        .then(firestoreDocument => {
          if (!firestoreDocument.exists) {
            // first signin after signup
            // 
            const data = {
              id: uid,
              email: email,
              emailVerified: response.user.emailVerified,
              sign_up_at: Date.now(),
              last_login_at: Date.now()
            };
            const usersRef = Firebase.firestore().collection('users');

            usersRef
            .doc(uid)
            .set(data)
            .then(() => {
              console.log("Made a user doc in firestore users");
              res(data);
            })
            .catch((error) => {
              rej(error);
              console.log(error);
            });
            return;
          } else {
            const userData = firestoreDocument.data();
            if (userData && userData.g) {
              delete userData['g']
            }
            if (userData && userData.coordinates) {
              delete userData['coordinates']
            }
            usersRef.doc(uid).update({ 
              last_login_at: Date.now(),
              appState: 'active'
            });
            res(userData);
          };
        })
        .catch(error => {
          rej(error);
        });
      // } else {
      //   console.log("Email is not verified.");
      //   res({ "email": response.user.email, "emailVerified": false });
      // }
    })
    .catch(error => {
      rej(error);
    })
  })
};

const localSigninFire = () => {
  return new Promise ((res, rej) => {
    const usersRef = Firebase.firestore().collection('users');
    Firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("found a signed in user: ", user.email, " email Verified: ", user.emailVerified);
        // if (user.emailVerified === true) {
          usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data();
            if (userData && userData.g) {
              delete userData['g']
            }
            if (userData && userData.coordinates) {
              delete userData['coordinates']
            }
            console.log("fetched the current user's data: ", userData.email);
            // update last login to the current time and the user data before updated is pulled and use it
            usersRef.doc(userData.id).update({ 
              last_login_at: Date.now(),
              appState: 'active'
            });
            res(userData);
          })
          .catch((error) => {
            rej(error);
          });
        // } else {
        //   res({ "id": user.uid, "email": user.email, "emailVerified": false });
        // }
      } else {
        console.log('localSigninFire: current user does not exist');
        res(false);
      }
    });
  });
};

const signoutFire = () => {
  return new Promise ((res, rej) => {
    Firebase.auth().signOut()
    .then(() => {
      console.log('User signed out from Firebase.');
      res(true);
    })
    .catch((error) => {
      rej(error);
      console.log(error);
    });
  });
};

const authCheck = () => {
  return new Promise ((res, rej) => {
    const currentUser = Firebase.auth().currentUser;
    if (currentUser != null) {
      res(currentUser);
    } else {
      rej("authCheck: current user does not exist");
    }
  })
};

const sendVerificationEmail = () => {
  return new Promise ((res, rej) => {
    const user = Firebase.auth().currentUser;
    user
    .sendEmailVerification()
    .then(() => {
      res(true);
    })
    .catch((error) => {
      rej("Error occured during sending a verification email: ", error);
    });
  })
};

const passwordResetFire = (emailAddress) => {
  return new Promise ((res, rej) => {
    const auth = Firebase.auth();
    console.log(emailAddress);
    auth.sendPasswordResetEmail(emailAddress)
    .then(() => {
      res(true);
    })
    .catch((error) => {
      rej(error);
    });
  })
}

export { 
  signupFire, 
  signinFire, 
  signoutFire, 
  localSigninFire, 
  authCheck, 
  sendVerificationEmail, 
  passwordResetFire 
};