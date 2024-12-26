import "../src/stylesheets/App.css"
import Create from "./pages/Create";
import HomePage from "./pages/HomePage";
import Set from "./components/Set"
import { useState, useEffect } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./components/Layout";
import Edit from "./pages/Edit";

export default function App(){
  const [sets, setSets] = useState(() => {
    const storage = localStorage.getItem('SETS');
    return storage ? JSON.parse(storage) : [];
  });
  
  useEffect(() => {
    localStorage.setItem('SETS', JSON.stringify(sets));
  }, [sets]);
  
  const router = createBrowserRouter([
    {
        path: '/',
        errorElement: <NotFoundPage/>,
        element: <Layout/>,
        children: [
            {
                index: true,
                element: <HomePage sets={sets} setSets={setSets}/>,
            },
            {
                path: '/create-set',
                element: <Create sets={sets} setSets={setSets}/>,
            },
            {
                path: '/:id',
                element: <Set sets={sets} setSets={setSets}/>,
            },
            {
              path: '/:id/edit',
              element: <Edit sets={sets} setSets={setSets}/>,
            },
        ],
    }
  ]);

  return <RouterProvider router={router}/>
}