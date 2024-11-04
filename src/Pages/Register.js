import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../Firebase/firebase';
import { useForm } from 'react-hook-form';
import visible from '../Images/visible.png'
import novisible from '../Images/novisible.png'
import '../Styles/register.css'
import { Link } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';

const Register = () => {

    const {register, handleSubmit, setError, formState: {isValid, errors}} = useForm()
    const [watch, setWatch] = useState(true)
    const [watch2, setWatch2] = useState(true)
    const [messageConfirm, setMessageConfirm] = useState(null)


    const handlerOnChange = () => {
        if(watch){
            setWatch(false)
        } else {
            setWatch(true)
        }
        
    }

    const secondHandlerOnChange = () => {
        if(watch2){
            setWatch2(false)
        } else {
            setWatch2(true)
        }
    }


    const onSubmit = async(res) => {
        const { name, id, emails, password, confirmPassword } = res;
        if (password !== confirmPassword) {
        setError("confirmPassword", {
            type: "manual",
            message: "Las contraseñas no coinciden",
        });
        return;
        }

        try {
            const email = `${emails}`;
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("Usuario creado:", user);
            setMessageConfirm(`Se ha registrado a ${name} con el Id ${id}`);

            await addDoc(collection(db, "Clients"), {
                uid: user.uid,
                name_client: name,
                email: email,
                nit_client: id
            })
            
          } catch (error) {
            console.log("Error code:", error.code, "Error message:", error.message);
            setError("id", {
              type: "manual",
              message: "Ocurrió un error al crear el usuario. Intenta nuevamente.",
            });
        }
    }

  return (
    <div className='register-container'>
        <div className='register-content'>
            <h3>Crear Cuenta</h3>
            <form onSubmit={handleSubmit(onSubmit)} className='register-form'>
                <div className='register-fields'>
                    <label htmlFor='name'>Nombre Completo</label>
                    <input type='text' placeholder='Escribe tu nombre' {...register("name", {
                        required: true
                    })}/>
                </div>
                <div className='register-fields'>
                    <label htmlFor='id'>No. de identificación</label>
                    <input type='text' placeholder='Numero de identificación' {...register("id", {
                        required: true
                    })}/>
                </div>
                <div className='register-fields'>
                    <label>Correo Electrónico:</label>
                    <input type="email" placeholder='email@example.com' {...register("emails", 
                    {
                        required: "El correo es obligatorio",
                        pattern: {
                        value: /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/,
                        message: "Ingresa un correo válido",
                        },
                    })}
                    />
                    {errors.email && <p>{errors.email.message}</p>}
                </div>
                <div className='register-fields-password'>
                    <label htmlFor='password'>Nueva contraseña</label>
                    <div className='register-password'>
                        <input type={watch === true ? "password" : "text"} placeholder='Contraseña' {...register("password", {
                            required: true
                        })}/>
                        <p onClick={() => handlerOnChange()}>
                            <img src={watch === true ? novisible : visible} alt="eyes"/>
                        </p>
                    </div>
                </div>
                <div className='register-fields-password'>
                    <label htmlFor='confirmPaswoord'>Repetir contraseña</label>
                    <div className='register-password'>
                        <input type={watch2 === true  ? "password" : "text"} placeholder='Confirmar contraseña' {...register("confirmPassword", {
                            required: true
                        })}/>
                        <p onClick={() => secondHandlerOnChange()}>
                            <img src={watch2 === true ? novisible : visible} alt="eye"/>
                        </p>
                    </div>
                </div>
                <button type="submit">Registrarse</button>
                {messageConfirm !== null ? 
                    <div className='register-confirm-account'> 
                        <p>{messageConfirm}</p>
                        <Link to="/signupwithcredential">Ir a inicio de sesión</Link>
                    </div>
                 : ""}
            </form>
        </div>
        
    </div>
  )
}

export default Register