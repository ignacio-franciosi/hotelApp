import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../App.css';

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        let emptyRegister = false;

        if (name === '') {
            document.getElementById('inputNameRegister').style.borderColor = 'red';
            emptyRegister = true;
        } else {
            document.getElementById('inputNameRegister').style.borderColor = '';
        }
        if (email === '') {
            document.getElementById('inputEmailRegister').style.borderColor = 'red';
            emptyRegister = true;
        } else {
            document.getElementById('inputEmailRegister').style.borderColor = '';
        }
        if (password === '') {
            document.getElementById('inputPasswordRegister').style.borderColor = 'red';
            emptyRegister = true;
        } else {
            document.getElementById('inputPasswordRegister').style.borderColor = '';
        }

        if (emptyRegister) {
            alert("Debes completar todos los campos");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                }),
            });

            if (response.ok) {
                alert("Gracias por registrarte! ahora puedes iniciar sesión :)");
                navigate('/login');
            } else {
                alert("El correo electrónico ya está registrado");
                console.log('El usuario ya existe');
            }
        } catch (error) {
            console.log('Error al realizar la solicitud al backend:', error);
        }
    };

    return (
        <div id="body">
            <h1 id="h1Register">Registrarse</h1>
            <form id="formRegister" onSubmit={handleSubmit}>
                <input
                    id="inputNameRegister"
                    type="text"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    id="inputEmailRegister"
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    id="inputPasswordRegister"
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br/>
                <button id="botonLogin" type="submit">
                    Registrarse
                </button>
            </form>
        </div>
    );
};

export default Register;
