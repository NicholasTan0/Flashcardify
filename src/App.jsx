import "../src/stylesheets/App.css"
import Create from "./pages/Create";
import Header from "./components/header";
import HomePage from "./pages/HomePage";
import Set from "./components/Set"
import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./components/Layout";

export default function App(){
  const router = createBrowserRouter([
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
                path: '/create-set',
                element: <Create/>,
            },
            {
                path: 'set/:id',
                element: <Set/>
            },
        ],
    }
  ]);

  return (
    <>
    <RouterProvider router={router}/>
    </>
  )

  // return (
  //   <div className="App">
  //     <Header
  //     setPageView={setPageView}
  //     />
  //     {pageView === "main" && <Main
  //     sets={sets}
  //     viewSet={viewSet}
  //     setCurrentSet={setCurrentSet}/>}
  //     {pageView === "create" && <Create
  //     setPageView={setPageView}
  //     addSet={addSet}
  //     />}
  //     {pageView === "set" && <Set
  //     currentSet={currentSet}/>}
  //   </div>
  // );
}