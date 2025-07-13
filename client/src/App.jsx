import "./stylesheets/App.css"
import Create from "./pages/Create";
import HomePage from "./pages/HomePage";
import Set from "./components/Set"
import { useState, useEffect } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./components/Layout";
import Edit from "./pages/Edit";
import axios from "axios";

export const backendURL = import.meta.env.VITE_BACKEND_URL;

export default function App(){
  const router = createBrowserRouter([{
    path: '/',
    errorElement: <NotFoundPage/>,
    element: <Layout/>,
    children: [
      {
          index: true,
          element: <HomePage/>,
      },
      {
          path: '/create',
          element: <Create/>,
      },
      {
          path: '/view/:id',
          element: <Set/>,
      },
      {
        path: '/edit/:id',
        element: <Edit/>,
      },
    ]}]
  );
  
  return <RouterProvider router={router}/>
}