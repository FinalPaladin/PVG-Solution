import { useState } from "react";
import { Link } from "react-router-dom";
import { paths } from "@/commons/paths";

export default function Header() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between py-3 lg:py-4 gap-4">
          {/* Left - Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to={paths.PRODUCTS} className="flex items-center gap-3">
              <svg
                width="32"
                height="26"
                viewBox="0 0 44 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path d="M22 0L44 36H0L22 0Z" fill="#2B8A3E" />
              </svg>
              <span className="text-base lg:text-lg font-semibold text-slate-900">
                PVG Solution
              </span>
            </Link>
          </div>

          {/* Right - nav + search + mobile menu (dồn về bên phải) */}
          <div className="flex-1 flex items-center justify-end gap-3">
            {/* Nav OR Search (desktop) */}
            {showSearch ? (
              <div className="hidden lg:block w-full max-w-md">
                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 shadow-sm">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-gray-500"
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
                  <input
                    className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-gray-400 focus:outline-none"
                    placeholder="Tìm kiếm sản phẩm vay, tin tức..."
                  />
                </div>
              </div>
            ) : (
              <nav className="hidden lg:flex items-center gap-8 text-sm lg:text-base text-gray-700 font-medium">
                <Link
                  to={paths.PRODUCTS}
                  className="flex items-center gap-1 hover:text-black"
                >
                  Sản phẩm &amp; Dịch vụ <span className="text-xs">▾</span>
                </Link>
                <Link
                  to={paths.NEWS}
                  className="flex items-center gap-1 hover:text-black"
                >
                  Tin tức
                </Link>
                <Link
                  to={paths.SUPPORT}
                  className="flex items-center gap-1 hover:text-black"
                >
                  Liên hệ &amp; Hỗ trợ <span className="text-xs">▾</span>
                </Link>
              </nav>
            )}

            {/* Search button */}
            <button
              type="button"
              aria-label="Tìm kiếm"
              onClick={() => setShowSearch((v) => !v)}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition
                ${showSearch
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-gray-200 hover:shadow-sm text-gray-600"
                }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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

            {/* Mobile menu button */}
            <button className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200">
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
