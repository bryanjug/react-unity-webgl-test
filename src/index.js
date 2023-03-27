import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './css/style.css';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Home from './components/Home';
import DayStats from './components/DayStats';
import WeekStats from './components/WeekStats';
import MonthStats from './components/MonthStats';
import YearStats from './components/YearStats';
import ErrorPage from "./components/error-page";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/stats/day",
        element: <DayStats />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/stats/week",
        element: <WeekStats />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/stats/month",
        element: <MonthStats />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/stats/year",
        element: <YearStats />,
        errorElement: <ErrorPage />,
    }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
);