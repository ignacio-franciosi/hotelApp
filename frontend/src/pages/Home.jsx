
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './../App.css';

const Home = () => {
    const [hoteles, setHoteles] = useState([]);

    useEffect(() => {
        const fetchHoteles = async () => {
            try {
                const response = await fetch('http://localhost:8080/hotels');
                const data = await response.json();
                setHoteles(data);
            } catch (error) {
                console.log('Error al obtener la lista de hoteles:', error);
            }
        };

        fetchHoteles();
    }, []);

    return (
        <div id="backHotelSearch">
            {hoteles.length > 0 ? (
                <div className="hotelContainer">
                    {hoteles.map((hotel, index) => (
                        <div key={index} className="hotelCard">
                            <p><strong>Ciudad:</strong> {hotel.city}</p>
                            <p><strong>Precio por noche:</strong> ${hotel.price}</p>
                            <p><strong>Habitaciones:</strong> {hotel.rooms}</p>
                        </div>
                    ))}
                    <div style={{ height: '100px' }}></div>
                </div>
            ) : (
                <div id="noHotels">
                    <p>No se encontraron hoteles.</p>
                </div>
            )}
        </div>
    );
};

export default Home;
