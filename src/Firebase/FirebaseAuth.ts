import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import firebaseConfig from './FirebaseApp';
import { initializeApp } from 'firebase/app';

initializeApp(firebaseConfig);

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    // const uid = user.uid;
    // ...
  } else {
    // User is signed out
    // ...
  }
});

const showSuccessToast = (message: string) => {
  toast.success(message, {
    position: toast.POSITION.BOTTOM_CENTER,
  });
};

const showErrorToast = (message: string) => {
  toast.error(message, {
    position: toast.POSITION.BOTTOM_CENTER,
  });
};

export const firebaseRegisterUser = (
  email: string,
  password: string,
  closeRegisterPage: () => void
) => {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log('SUCCESS creating: ', user);
      showSuccessToast('Successfully created user!');
      closeRegisterPage();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('Error creating user:', errorCode, errorMessage);
      if (errorCode === 'auth/email-already-in-use')
        showErrorToast('Email already in use! Please try login in.');
    });
};
