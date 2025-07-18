import "./stylesheets/App.css"
import { createBrowserRouter, Navigate, RouterProvider, useParams } from "react-router-dom";
import Layout from "./components/Layout";
import Create from "./pages/Create";
import HomePage from "./pages/HomePage";
import Set from "./pages/Set";
import NotFoundPage from "./pages/NotFoundPage";
import Edit from "./pages/Edit";
import Study from "./pages/Study";
import Match from "./pages/Match";
import { useEffect } from "react";

export const backendURL = import.meta.env.VITE_BACKEND_URL;

export default function App(){
  function Redirect(){
    const { id } = useParams();
    return <Navigate to={`/${id}`}/>
  }

  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if(saved)
      document.documentElement.setAttribute("data-theme", saved);
    else{
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
    }
  },[]);


  const router = createBrowserRouter([
    {
      path: '/error',
      element: <NotFoundPage/>
    },
    {
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
          path: '/:id',
          // element: <Set/>,
          children: [
            {
              index: true,
              element: <Set/>
            },
            {
              path: 'edit',
              element: <Edit/>
            },
            {
              path: 'flashcards',
              element: <Study/>
            },
            {
              path: 'match',
              element: <Match/>,
            },
            {
              path: '*',
              element: <Redirect/>
            }
          ]
        },
      ]
    }
  ]);
  
  return <RouterProvider router={router}/>
}