import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithRedirect,
  setPersistence,
  browserSessionPersistence,
  User,
} from 'firebase/auth';
import FirebaseApp from './FirebaseApp';

const auth = getAuth(FirebaseApp);
auth.useDeviceLanguage();

const provider = new GoogleAuthProvider();

export const firebaseCheckAuthState = (
  onAuthChange: (_: User | null) => void
) => {
  return onAuthStateChanged(auth, onAuthChange);
};

export const firebaseRegisterUser = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const firebaseSignInUser = async (email: string, password: string) => {
  await setPersistence(auth, browserSessionPersistence);
  return signInWithEmailAndPassword(auth, email, password);
};

export const firebaseSignOutUser = () => {
  return signOut(auth);
};

export const firebaseGoogleSignIn = () => {
  return signInWithRedirect(auth, provider);
};

export const firebaseGetCurrentUser = () => {
  const user = auth.currentUser;
  console.log('CURRENT USER:', user);
};
