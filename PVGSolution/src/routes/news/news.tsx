import React, { memo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface INews {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
}

// sampleNews nằm ngoài component => stable
const sampleNews: INews[] = [
  {
    id: 1,
    title:
      "Vietcombank chung tay đồng hành cùng các cơ quan thuế TP. Hồ Chí Minh",
    excerpt:
      "Sáng ngày 14/11/2025, tại trụ sở Thuế Tp.Hồ Chí Minh đã trang trọng diễn ra buổi Lễ ký kết th...",
    date: "17/11/25 09:55",
    image: "/images/news-1.jpg",
  },
  {
    id: 2,
    title:
      "Viecombank Hà Nội tổ chức tập huấn, diễn tập các phương án phòng chống tội phạm cướp ngân hàng",
    excerpt:
      "Tập huấn và diễn tập công tác phòng chống tội phạm cướp ngân hàng là một trong những hoạt động...",
    date: "17/11/25 08:39",
    image: "/images/news-2.jpg",
  },
  {
    id: 3,
    title:
      "Vietcombank Đà Nẵng đồng hành cùng Thuế thành phố trong chiến dịch 60 ngày hỗ trợ hộ kinh doanh",
    excerpt:
      "Sáng ngày 12/11/2025, Vietcombank Đà Nẵng và Thuế thành phố Đà Nẵng ký kết thỏa thuận...",
    date: "17/11/25 08:31",
    image: "/images/news-3.jpg",
  },
  {
    id: 4,
    title: "Vietcombank thông báo lãi suất trái phiếu VCBH2131005",
    excerpt:
      "Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank) thông báo lãi suất áp dụng cho trái...",
    date: "14/11/25 16:00",
    image: "/images/news-4.jpg",
  },
];

interface INewsCardProps {
  item: INews;
}

function NewsCardInner({ item }: INewsCardProps) {
  const navigate = useNavigate();
  // local fallback flag để tránh setState nhiều lần
  const [imgSrc, setImgSrc] = useState(item.image);

  // onError chỉ set 1 lần => không gây re-render loop
  const handleImgError = () => {
    if (imgSrc !== "/images/news-placeholder.png") {
      setImgSrc("/images/news-placeholder.png");
    }
  };

  return (
    <Card className="flex flex-col md:flex-row gap-4 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="w-full md:w-44 flex-shrink-0">
        <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
          <img
            src={imgSrc}
            alt={item.title}
            className="object-cover w-full h-full"
            onError={handleImgError}
            // prevent image from being focusable/tabbable unnecessarily
            draggable={false}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <CardHeader className="p-0">
          <CardTitle className="text-lg md:text-xl line-clamp-2 font-semibold">
            {item.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 mt-2 flex-1">
          <p className="text-sm md:text-base text-gray-600 line-clamp-3">
            {item.excerpt}
          </p>
        </CardContent>

        <CardFooter className="p-0 mt-4 flex items-center justify-between">
          <div className="text-xs text-gray-400">{item.date}</div>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => {
              navigate("/PVG-Solution/news/detail");
            }}
          >
            Xem chi tiết <ArrowRight size={16} />
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

// memo để tránh re-render khi props không đổi
const NewsCard = memo(NewsCardInner);

const NewsPage: React.FC = () => {
  // dev-help: bật console.log nếu vẫn nghi ngờ re-render
  // console.log("Rendering NewsPage");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6">
        Tin tức & Sự kiện
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sampleNews.map((n) => (
          <NewsCard key={n.id} item={n} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Trang trước
          </Button>
          <div className="px-3 py-1 rounded-md text-sm">1 / 10</div>
          <Button variant="outline" size="sm">
            Trang sau
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(NewsPage);
