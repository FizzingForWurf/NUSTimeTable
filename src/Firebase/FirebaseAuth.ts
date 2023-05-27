import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const testEmail = "zhtong315@gmail.com";
const testPassword = "12345";

const auth = getAuth();
createUserWithEmailAndPassword(auth, testEmail, testPassword)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });