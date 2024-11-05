import React, { FormEvent, useState } from 'react';
import {signInWithEmailAndPassword } from 'firebase/auth';
import {auth} from '../Firebase/firebase';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/loginwithemail.css'
import visible from '../Images/visible.png'
import novisible from '../Images/novisible.png'

const LoginWithEmail = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [watch, setWatch] = useState<boolean>(true);
  const [newError, setNewError] = useState<string | null>(null);
  const navigate = useNavigate()


  const handlerOnChange = () => {
    if(watch){
        setWatch(false)
    } else {
        setWatch(true)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      console.error("Escribe tu correo y contraseña");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user)
      navigate('/home')
      sessionStorage.setItem('id', user.uid)
      sessionStorage.setItem('email', user.email || '')
   

    } catch (error: any) {
      console.log("Error code:", error.code, "Error message:", error.message);
      setNewError("Error de autenticación, verifique que contraseña y correo sean correctos")
    }
  };

  return (
    <div className='login-email-container'>
        <div className='login-email-content'>
            <h3>Iniciar sesión</h3>
            <form onSubmit={handleSubmit} className='login-email_form'>
                <div className='login-email_form-item'>
                    <label>Correo Electrónico</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='email@example.com' required />
                </div>
                <div className='login-email_form-item_password'>
                    <label>Contraseña</label>
                    <div className='login-email_form-item_input'>
                        <input type={watch === true ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='******' required/>
                        <p onClick={() => handlerOnChange()}>
                            <img src={watch === true ? novisible : visible} alt="eye"/>
                        </p>
                        
                    </div>
                    
                </div>
                <button type="submit">Entrar</button>
                {newError !== null ?
                <div className='login-email-error'>
                    <p>{newError}</p>
                </div> : ""}
            </form>
            <Link to="/createaccount" className='login-email-redirection'>
                <h5>Aun no tienes cuenta, Registrate con nosotros</h5>
            </Link>
        </div>
        <div className='login-email-message'>
            <h3>Bienvenido a SalesApp</h3>
            <p>Inicia sesión digitando tu correo y contraseña.</p>
        </div>
        
    </div>
    
  );
};

export default LoginWithEmail;
