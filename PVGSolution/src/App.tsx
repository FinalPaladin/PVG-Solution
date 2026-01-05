import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/layout/header";
import { useWebConfig } from "./auth/webConfigContext";

function App() {
  const { webConfig } = useWebConfig();

  return (
    <>
      <Header webConfig={webConfig} />
      <div className="w-full h-px bg-[#e5e7eb]" />
      <div className="max-w-7xl mx-auto px-6">
        <Outlet />
      </div>
      <footer className="w-full py-10 bg-white">
        <div className="max-w-[1400px] mx-auto flex items-center justify-center">
          <p className="text-sm text-gray-600 text-center">163 phan đăng lưu, phường Cầu Kiệu, quận Phú Nhuận , TP.HCM</p>
        </div>
        <div className="max-w-[1400px] mx-auto flex items-center justify-center">
          <p className="text-sm text-gray-600 text-center">
            © 2025 Bản quyền thuộc về {webConfig.WebName}
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
