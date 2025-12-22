import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
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
import { paths } from "@/commons/paths";
import { initNewsPage } from "@/api/news.api";
import type {
  NewsCategory,
  NewsListItem,
} from "@/models/appNews.model";
import clsx from "clsx";

/* =======================
   Helpers
======================= */
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

/* =======================
   Category Pills
======================= */
interface CategoryTabsProps {
  categories: NewsCategory[];
  activeId: string;
  onChange: (id: string) => void;
}

const CategoryTabs = memo(
  ({ categories, activeId, onChange }: CategoryTabsProps) => {
    return (
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className={clsx(
              "px-5 py-2 rounded-full text-sm font-medium transition",
              activeId === c.id
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {c.name}
          </button>
        ))}
      </div>
    );
  }
);

/* =======================
   News Card
======================= */
interface NewsCardProps {
  item: NewsListItem;
}

const NewsCard = memo(({ item }: NewsCardProps) => {
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState(item.thumbnail);

  const handleImgError = useCallback(() => {
    setImgSrc("/images/news-placeholder.png");
  }, []);

  return (
    <Card className="flex flex-col md:flex-row gap-4 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="w-full md:w-44 shrink-0">
        <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
          <img
            src={imgSrc}
            alt={item.title}
            className="object-cover w-full h-full"
            onError={handleImgError}
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
          {/* backend chưa trả excerpt → để trống */}
        </CardContent>

        <CardFooter className="p-0 mt-4 flex items-center justify-between">
          <div className="text-xs text-gray-400">
            {formatDate(item.createdDate)}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => {
              navigate(`${paths.NEWS_DETAIL.replace(":category", item.slugCategory).replace(":slug", item.slug)}`)
            }}
          >
            Xem chi tiết <ArrowRight size={16} />
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
});

/* =======================
   Page
======================= */
const NewsPage: React.FC = () => {
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [news, setNews] = useState<NewsListItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initNewsPage()
      .then((res) => {
        if (!res.result) return;

        setCategories([
          { id: "all", name: "Tất cả" },
          ...res.result.categories,
        ]);
        setNews(res.result.news);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredNews = useMemo(() => {
    if (activeCategory === "all") return news;
    return news.filter((n) => n.categoryId === activeCategory);
  }, [news, activeCategory]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 text-center text-gray-400">
        Đang tải tin tức...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6">
        Tin tức & Sự kiện
      </h1>

      <CategoryTabs
        categories={categories}
        activeId={activeCategory}
        onChange={setActiveCategory}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredNews.map((n) => (
          <NewsCard key={n.id} item={n} />
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center text-gray-400 mt-10">
          Không có tin tức
        </div>
      )}
    </div>
  );
};

export default memo(NewsPage);
