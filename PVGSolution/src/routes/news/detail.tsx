import { memo, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Printer, Share2 } from "lucide-react";

/**
 * NOTE:
 * - Nếu vẫn reload vô hạn sau khi thay code này: mở DevTools -> Console & Network.
 * - Kiểm tra xem có lỗi "Maximum update depth exceeded" (setState trong render/effect).
 * - Kiểm tra Network: có request lặp cho 1 URL (ảnh / api / route)? paste cho t.
 */

// Sample data (demo)
const sampleNews = [
  {
    id: "1",
    title:
      "Vietcombank chung tay đồng hành cùng các cơ quan thuế TP. Hồ Chí Minh và các hộ kinh doanh trên địa bàn thực hiện chuyển đổi mô hình, phương thức quản lý thuế",
    date: "17/11/2025 09:55",
    intro:
      "Sáng ngày 14/11/2025, tại trụ sở Thuế Tp.Hồ Chí Minh đã trang trọng diễn ra buổi Lễ ký kết thỏa thuận hợp tác 'Các giải pháp hỗ trợ đối với hộ kinh doanh giữa Thuế Tp.Hồ Chí Minh và các nhà cung cấp giải pháp'.",
    content: [
      "Tham dự buổi lễ có ông Nguyễn Văn Thành - Phó trưởng Thuế Tp.Hồ Chí Minh; bà Nguyễn Thị Cúc - Chủ tịch Hội tư vấn Thuế Việt Nam; đại diện lãnh đạo các đơn vị nghiệp vụ Thuế Tp.Hồ Chí Minh và 29 Thuế cơ sở trên địa bàn, cùng đại diện của các ngân hàng, nhà cung cấp giải pháp và các cơ quan thông tin báo chí, truyền hình.",
      "Về phía Vietcombank có bà Đoàn Hồng Nhung - Thành viên Ban điều hành, Giám đốc Khối bán lẻ; các ông/bà là lãnh đạo các đơn vị có liên quan của Trụ sở chính và đại diện Ban Giám đốc của 27 chi nhánh Vietcombank trên địa bàn thành phố.",
      "Tại buổi Lễ, ông Nguyễn Văn Thành - Phó trưởng Thuế Tp.Hồ Chí Minh đã phát biểu: “Việc thực hiện chuyển đổi mô hình từ thuế khoán sang thuế kê khai theo Nghị định 198 của Quốc hội từ ngày 1/1/2026 là rất đúng đắn và cần thiết, giúp các hộ kinh doanh quản lý, thực hiện nghĩa vụ thuế với nhà nước một cách hiệu quả và bền vững.”",
    ],
    image: "/images/news-1.jpg",
  },
];

function NewsDetailPageInner() {
  const { id } = useParams();

  // debug help: bật nếu muốn theo dõi render
  // console.log("NewsDetailPage render, id=", id);

  // stable item computation (bảo đảm không chạy logic nặng mỗi render)
  const item = useMemo(() => {
    if (!id) return sampleNews[0];
    return sampleNews.find((s) => s.id === id) ?? sampleNews[0];
  }, [id]);

  // Image fallback state: chỉ set fallback 1 lần để tránh loop khi file placeholder không tồn tại
  const [imgSrc, setImgSrc] = useState(
    item.image ?? "/images/news-placeholder.png"
  );
  const [didFallback, setDidFallback] = useState(false);

  const handleImgError = () => {
    // nếu đã fallback rồi thì thôi (ngăn setState lặp)
    if (didFallback) return;
    setDidFallback(true);
    setImgSrc("/images/news-placeholder.png");
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <nav className="text-sm text-gray-400 mb-4">
        <Link to="/PVG-Solution" className="hover:underline">
          Trang thông tin điện tử
        </Link>
        <span className="mx-2">/</span>
        <Link to="/PVG-Solution/news" className="hover:underline">
          Tin tức và sự kiện
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-500">Đơn vị thành viên</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
          {item.title}
        </h1>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-400 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{item.date}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // simple share dialog — không setState
                if (navigator.share) {
                  navigator
                    .share({ title: item.title, text: item.intro })
                    .catch(() => {});
                } else {
                  navigator.clipboard?.writeText(window.location.href);
                }
              }}
            >
              <Share2 size={16} />
              <span className="ml-2 hidden md:inline">Chia sẻ</span>
            </Button>
          </div>
        </div>

        <hr className="mt-6 border-gray-200" />
      </header>

      <main className="prose max-w-none">
        <p className="lead text-lg md:text-xl font-medium">{item.intro}</p>

        <figure className="my-6 rounded-lg overflow-hidden shadow-sm">
          <img
            src={imgSrc}
            alt={item.title}
            className="w-full object-cover"
            onError={handleImgError}
            draggable={false}
          />
        </figure>

        {item.content.map((p, idx) => (
          <p key={idx} className="text-base text-gray-700">
            {p}
          </p>
        ))}

        <div className="mt-8">
          <Link
            to="/PVG-Solution/news"
            className="text-sm text-green-600 hover:underline"
          >
            ← Quay lại danh sách tin
          </Link>
        </div>
      </main>
    </div>
  );
}

export default memo(NewsDetailPageInner);
