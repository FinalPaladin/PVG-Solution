import { Link } from "react-router-dom";
import { paths } from "@/commons/paths";

export default function Header() {
  return (
    <header className="max-w-7xl mx-auto px-6 bg-white">
      {/* Top small links bar */}

      {/* <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-10 text-sm">
          <div className="flex items-center gap-6">
            <nav className="flex gap-4">
              <a href="#" className="hover:text-black">
                Cá nhân
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-black">
              Tin tức
            </a>
          </div>
        </div>
      </div> */}

      {/* Main header */}
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between py-6">
          {/* Left - Logo */}
          <div className="flex items-center gap-6">
            <a href="#" className="flex items-center gap-3">
              {/* Simple green triangle logo to mimic Vietcombank */}
              <svg
                width="44"
                height="36"
                viewBox="0 0 44 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path d="M22 0L44 36H0L22 0Z" fill="#2B8A3E" />
              </svg>
              <span className="sr-only">Vietcombank</span>
            </a>

            {/* Primary nav (center area) - hidden on small screens */}
            <nav className="hidden lg:flex items-center gap-8 text-base text-gray-700 font-medium">
              <Link
                to={paths.PRODUCTS}
                className="flex items-center gap-1 hover:text-black"
              >
                Sản phẩm & Dịch vụ <span className="text-xs">▾</span>
              </Link>
              <Link
                to={paths.NEWS}
                className="flex items-center gap-1 hover:text-black"
              >
                Tin tức <span className="text-xs">▾</span>
              </Link>
              <Link
                to={paths.SUPPORT}
                className="flex items-center gap-1 hover:text-black"
              >
                Liên hệ & Hỗ trợ <span className="text-xs">▾</span>
              </Link>
            </nav>
          </div>

          {/* Right - Search, Login, Phone, Flag */}
          <div className="flex items-center gap-4">
            {/* Search circle */}
            <button
              aria-label="Tìm kiếm"
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:shadow-sm"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-600"
              >
                <path
                  d="M21 21l-4.35-4.35"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="11"
                  cy="11"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Phone */}
            {/* <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 16.92V21a1 1 0 0 1-1.11 1 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2 3.11 1 1 0 0 1 3 2h4.09a1 1 0 0 1 1 .75c.12.78.33 1.53.63 2.24a1 1 0 0 1-.24 1L7.91 8.91a15.06 15.06 0 0 0 6 6l1.92-1.11a1 1 0 0 1 1 .24c.71.3 1.46.51 2.24.63a1 1 0 0 1 .75 1V21z"
                  stroke="#374151"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>1900 545413</span>
            </div> */}

            {/* Mobile menu button (small screens) */}
            <button className="lg:hidden inline-flex items-center justify-center p-2 rounded-md border border-gray-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 6h18M3 12h18M3 18h18"
                  stroke="#374151"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
