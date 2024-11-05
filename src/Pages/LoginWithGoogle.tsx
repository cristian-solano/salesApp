import React from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../Firebase/firebase';
import { useNavigate } from 'react-router-dom';
import {doc, setDoc} from 'firebase/firestore'
import '../Styles/loginwithgoogle.css'

const LoginWithGoogle = () => {
    const navigate = useNavigate()
    const handleGoogleSignIn = async () => {
        try {
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
    
          const credential = GoogleAuthProvider.credentialFromResult(result);
          if (!credential) {
            console.error("Error in user Credential");
            return;
          }  else {
            navigate("/home")
          }
            
    
          const token = credential.accessToken;
          const user = result.user;
          const userRef = doc(db, "Clients", user.uid);
          await setDoc(userRef, {
            uid: user.uid,
            name_client: user.displayName || "Usuario",
            email: user.email,
            nit_client: ""
          }, { merge: true });

          console.log("User:", user, "Token:", token);
          
    
        } catch (error: any) {
          console.log("Error code:", error.code, "Error message:", error.message);
          console.log("Email:", error.customData?.email);
          const credential = GoogleAuthProvider.credentialFromError(error);
          console.error("Credential error:", credential);
        }
      };
    
      return (
        <div className='login-google-container'>
            <div className='login-google-button'>
                <button onClick={handleGoogleSignIn}>
                    Sign Up with Google
                </button>
            </div>
            
            <div className='login-google-message'>
                <h3>Bienvenido a Salesapp</h3>
                <p>Ingresa uniendote con tu cuenta de Google</p>
            </div>
        </div>
      );
}

export default LoginWithGoogle