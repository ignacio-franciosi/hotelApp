
import { lazy } from "react";
import Home from "pages/Home.jsx";
import HotelDetails from "pages/HotelDetails.jsx";
import hotel_id from "frontend/src/pages/Home.jsx";
import user_id from "frontend/src/pages/Home.jsx";
import Login from "pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MyBookings from "./pages/MyBookings.jsx"
import AllBookings from "./pages/AllBookings.jsx"
import UploadHotel from "./pages/UploadHotel.jsx"
import ImageLinks from "./pages/ImageLinks.jsx"

const Home = lazy(() => import("pages/Home.jsx"));
//estas son las rutas de las paginas de nuestro programa a
export const navigation = [
    {
        id: 0,
        path: "/",
        Element: Home,
    },
    {
        id: 1,
        path: '/home',
        Element: Home,
    },
    {
        id: 2,
        path: '/login',
        Element: Login,
    },
    {
        id: 3,
        path: '/register',
        Element: Register,
    },
    {
        id: 4,
        path: `/hotelDetails/'${hotel_id}`,
        Element: HotelDetails,
    },
    {
        id: 5,
        path: `/myBookings/'${user_id}`,
        Element: MyBookings,
    },
    {
        id: 6,
        path: `/allBookings`,
        Element: AllBookings,
    },
    {
      id: 7,
      path: '/uploadHotel',
      Element: UploadHotel,
    },
    {
        id: 8,
        path: '/imageLinks',
        Element: ImageLinks,
    },

];
