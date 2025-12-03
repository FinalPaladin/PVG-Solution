import React, { type JSX } from "react";
import { Link } from "react-router-dom";
import { paths } from "@/commons/paths";

export default function Header(): JSX.Element {
  const [showSearch, setShowSearch] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  // lock body scroll when menu open
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = prev || "";
    }
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [menuOpen]);

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between py-3 lg:py-4 gap-4">
          {/* Left - Logo */}
          <div className="flex items-center gap-3 shrink-0">
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
                    aria-label="Tìm kiếm"
                  />
                </div>
              </div>
            ) : (
              <nav
                className="hidden lg:flex items-center gap-8 text-sm lg:text-base text-gray-700 font-medium"
                aria-label="Primary navigation"
              >
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
            <button
              type="button"
              aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((s) => !s)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M3 6h18M3 12h18M3 18h18"}
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

      {/* Mobile menu overlay (small screens only) */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-opacity ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        aria-hidden={!menuOpen}
      >
        {/* backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${menuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMenuOpen(false)}
        />

        {/* sliding panel from right */}
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
          className={`absolute right-0 top-0 h-full w-[320px] max-w-full bg-white shadow-lg transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <svg
                width="28"
                height="22"
                viewBox="0 0 44 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path d="M22 0L44 36H0L22 0Z" fill="#2B8A3E" />
              </svg>
              <span className="font-semibold">PVG Solution</span>
            </div>

            <button
              type="button"
              aria-label="Đóng menu"
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 18L18 6M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <nav className="px-4 py-6 space-y-1" aria-label="Primary mobile">
            <Link
              to={paths.PRODUCTS}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between w-full px-3 py-3 rounded-md hover:bg-gray-50"
            >
              <div className="text-base font-medium">Sản phẩm &amp; Dịch vụ</div>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            <Link
              to={paths.NEWS}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between w-full px-3 py-3 rounded-md hover:bg-gray-50"
            >
              <div className="text-base font-medium">Tin tức</div>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            <Link
              to={paths.SUPPORT}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-3 rounded-md hover:bg-gray-50 text-gray-600"
            >
              Liên hệ &amp; Hỗ trợ
            </Link>

            <div className="mt-6 px-3">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  // ví dụ hành động: chuyển trang / mở modal
                }}
                className="w-full px-4 py-2 rounded-md border border-gray-200 bg-white text-sm font-medium"
              >
                Tải VCB Digibank
              </button>
            </div>
          </nav>
        </aside>
      </div>
    </header>
  );
}
