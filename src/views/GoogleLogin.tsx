import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useState, useEffect } from 'react';
import firebaseConfig from '../firebase/FirebaseApp';

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = () => auth.signInWithPopup(provider);

const Login = () => {
  return (
    <div>
      <button className="button" onClick={signInWithGoogle}>
        <i className="fab fa-google"></i>Sign in with google
      </button>
    </div>
  );
};

export default function GoogleLogin() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  console.log(user);

  return <div className="app">{user ? <Home user={user} /> : <Login />}</div>;
}

const Home = ({ user }) => {
  return (
    <div className="home">
      <h1>
        Hello, <span></span>
        {user.displayName}
      </h1>
      <img src={user.photoURL} alt="" />
      <button className="button signout" onClick={() => auth.signOut()}>
        Sign out
      </button>
    </div>
  );
};
