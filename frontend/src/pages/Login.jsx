import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './../App.css';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    let emptyRegister = false;

    const register = () => {
        navigate("/register");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        emptyRegister = false;

        if (email === '') {
            document.getElementById('inputEmailLogin').style.borderColor = 'red';
            emptyRegister = true;
        } else {
            document.getElementById('inputEmailLogin').style.borderColor = '';
        }

        if (password === '') {
            document.getElementById('inputPasswordLogin').style.borderColor = 'red';
            emptyRegister = true;
        } else {
            document.getElementById('inputPasswordLogin').style.borderColor = '';
        }

        if (!emptyRegister) {
            try {
                const response = await fetch('http://localhost:8080/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data.id_user) {
                        Cookies.set('user_id', data.id_user);
                        Cookies.set('email', email);
                        Cookies.set('token', data.token);
                        Cookies.set('type', data.tipo);
                        navigate('/home');
                        window.location.reload(); 
                    }
                } else {
                    alert("Usuario no registrado");
                }
            } catch (error) {
                console.log('Error al realizar la solicitud al backend:', error);
                Cookies.set('user_id', "-1");
            }
        } else {
            alert("Debes completar todos los campos");
        }
    };

    return (
        <div id="body">
            <h1 id="h1Login">Iniciar sesión</h1>
            <form id="formLogin" onSubmit={handleSubmit}>
                <input
                    id="inputEmailLogin"
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    id="inputPasswordLogin"
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button id="botonLogin" type="submit">Iniciar sesión</button>
                <br />
                <button id="botonLogin" type="button" onClick={register}>Registrarse</button>
            </form>
        </div>
    );
};

export default Login;



