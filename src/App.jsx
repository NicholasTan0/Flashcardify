import "../src/stylesheets/App.css"
import Create from "./components/Create";
import Header from "./components/header";
import Main from "./components/Main";
import Set from "./components/Set"
import { useState, useEffect } from "react";

export default function App(){
  const [pageView, setPageView] = useState("main");

  const [currentSet, setCurrentSet] = useState(null);

  const [sets, setSets] = useState(
    ()=> {
    const localValue = localStorage.getItem("SETS");
    if(localValue == null) return [];
    return JSON.parse(localValue);
  }
  )

  
  useEffect(() => {
      localStorage.setItem("SETS", JSON.stringify(sets))
  }, [sets])

  function addSet(newSet){
    setSets(currentSets => [...currentSets, newSet]);
  }

  function viewSet(set){
    setCurrentSet(set);
    setPageView("set");
  }

  return (
    <div className="App">
      <Header
      setPageView={setPageView}
      />
      {pageView === "main" && <Main
      sets={sets}
      viewSet={viewSet}
      setCurrentSet={setCurrentSet}/>}
      {pageView === "create" && <Create
      setPageView={setPageView}
      addSet={addSet}
      />}
      {pageView === "set" && <Set
      currentSet={currentSet}/>}
    </div>
  );
}