
import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import './Components.css';
import { useNavigate } from "react-router-dom";
import CustomModal2 from "./CustomModal2";

const Buttons = () => {
    const navigate = useNavigate();
    const userEmail = Cookies.get("email");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const user_id = Cookies.get('user_id')

    const [showAlert, setShowAlert] = useState(false);

    const openAlert = () => {
        setShowAlert(true);
    };
    const closeAlert = () => {
        Cookies.set('user_id', -1);
        Cookies.remove('type');
        Cookies.remove('email');
        Cookies.remove('token');
        window.location.reload();
        navigate("/home");

    };
    const CancelUnlogin = () =>{
        setShowAlert(false);
    }
    const login = () => {
        navigate("/login");
    };

    const MyBookings = () => {
        navigate(`/myBookings/${user_id}`);
    };

    const AllBookings = () => {
        navigate(`/allbookings`);
    };

    const UploadHotel = () => {
        navigate(`/uploadHotel`);
    };
    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        const type_user = Cookies.get('type');
        if (type_user === 'true') {
            setIsAdmin(true);
        }
    }, []);

    return (
        <div>
            <header id="header">
                {isAuthenticated ? (
                    <>
                        <button id="loginButton" onClick={openAlert}>
                            {userEmail ? `Bienvenido, ${userEmail}` : "Bienvenido"}
                        </button>
                        <button id="BookingButton" onClick={MyBookings}>Mis reservas</button>
                        {isAdmin && (
                            <>
                                <button id="AdminButton" onClick={AllBookings}>Todas las reservas</button>
                                <button id="uploadButton" onClick={UploadHotel}>Subir hotel</button>
                            </>
                        )}
                    </>
                ) : (
                    <button id="loginButton" onClick={login}>Iniciar sesión</button>
                )}
                <CustomModal2
                    showModal2={showAlert}
                    closeModal2={closeAlert}
                    closeModal22={CancelUnlogin}
                    content2="¿Cerrar sesión?"
                />
            </header>
        </div>
    );
};

export default Buttons;
