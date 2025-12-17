import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/layout/header";
import { useWebConfig } from "./auth/webConfigContext";

function App() {
  const {webConfig} = useWebConfig();

  return (
    <>
      <Header webConfig={webConfig}/>
      <div className="w-full h-px bg-[#e5e7eb]" />
      <div className="max-w-7xl mx-auto px-6">
        <Outlet />
      </div>
      <footer className="w-full py-10 bg-white">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          {/* <img src="/vietcombank-logo.png" className="h-10" /> */}
          <p className="text-sm text-gray-600">
            © 2025 Bản quyền thuộc về {webConfig.WebName}
          </p>
          <div className="w-10"></div> {/* block rỗng để cân 3 cột */}
        </div>
      </footer>
      ;
    </>
  );
}

export default App;
