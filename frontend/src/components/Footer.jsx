
import './Components.css'
import React, { useEffect, useState } from 'react';

const Footer = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 5;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={scrolled ? 'scrolled' : 'block'}>
            {/* Contenido de tu componente */}
            <div id="footer">
                {"Autor: Franciosi Ignacio"+
                    "Copyright© 2025. Todos los derechos reservados"}
            </div>
        </div>
    );
};

export default Footer;
