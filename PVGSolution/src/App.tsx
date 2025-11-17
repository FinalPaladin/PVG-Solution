import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/layout/header";

function App() {
  return (
    <>
      <Header />
      <div className="w-full h-px bg-[#e5e7eb]" />
      <div className="max-w-7xl mx-auto px-6">
        <Outlet />
      </div>
    </>
  );
}

export default App;
