// Option A: import hero image from src/assets
// import hero from "../assets/hero.jpg";

// Option B (recommended for big background): place the image in /public and use '/hero.jpg'
const heroUrl = "/hero.jpg";

export default function HomePage() {
  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroUrl})`,
        }}
        aria-hidden="true"
      />

      {/* dark gradient overlay for readability */}
      <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/20 to-transparent" />

      {/* content container (keep it aligned with your App max-width) */}
      <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
        <div className="max-w-3xl">
          {/* greeting */}
          <div className="flex items-center gap-4 text-white mb-6">
            <div
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20"
              aria-hidden="true"
            >
              {/* simple moon+cloud icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-yellow-300"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            </div>

            <div>
              <h1 className="text-3xl lg:text-4xl font-semibold text-white leading-tight">
                Chào buổi tối
              </h1>
              <p className="text-sm text-white/80">
                Bạn đang tìm kiếm gì hôm nay?
              </p>
            </div>
          </div>

          {/* search pill */}
          <div className="mt-4">
            <form className="w-full">
              <label htmlFor="site-search" className="sr-only">
                Tìm kiếm sản phẩm/dịch vụ
              </label>
              <div className="flex items-center bg-white/95 rounded-full shadow-md max-w-xl">
                <button
                  type="button"
                  className="px-4 py-3 rounded-l-full hover:bg-white/90"
                  aria-hidden="true"
                >
                  {/* magnifier icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-4.35-4.35M17 10.5A6.5 6.5 0 104 10.5a6.5 6.5 0 0013 0z"
                    />
                  </svg>
                </button>

                <input
                  id="site-search"
                  type="search"
                  placeholder="Thẻ tín dụng, vay tiêu dùng,..."
                  className="flex-1 px-4 py-3 rounded-r-full outline-none bg-transparent text-gray-800 placeholder-gray-400"
                />

                <button
                  type="submit"
                  className="ml-2 mr-2 px-4 py-2 rounded-full bg-green-700 text-white font-medium hover:bg-green-800 shadow-sm"
                >
                  Tìm
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* bottom floating nav bar */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-8 w-[88%] max-w-3xl">
        <div className="bg-white/95 rounded-3xl shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-5 divide-x">
            {[
              { label: "Gợi ý sản phẩm", icon: "⭐" },
              { label: "Tin nổi bật", icon: "📰" },
              { label: "Đăng ký trực tuyến", icon: "📝" },
              { label: "VCB Loyalty", icon: "🎁" },
              { label: "Ưu đãi", icon: "⚡" },
            ].map((it) => (
              <button
                key={it.label}
                className="py-3 px-4 flex flex-col items-center justify-center text-sm text-gray-700 hover:bg-white/60"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-50 mb-1 text-green-700">
                  <span aria-hidden="true">{it.icon}</span>
                </div>
                <span className="text-[12px]">{it.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
