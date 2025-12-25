import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Calendar, Printer, Share2, ArrowRight } from "lucide-react";
import { getNewsBySlug, initNewsPage } from "@/api/news.api";
import type { NewsDetailResponse, NewsListItem } from "@/models/appNews.model";
import clsx from "clsx";
import { paths } from "@/commons/paths";

/* =======================
   Helpers
======================= */
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

/* =======================
   Skeleton
======================= */
const Skeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-6 bg-gray-200 rounded w-2/3" />
    <div className="h-4 bg-gray-200 rounded w-1/3" />
    <div className="h-64 bg-gray-200 rounded-xl" />
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
      <div className="h-4 bg-gray-200 rounded w-4/6" />
    </div>
  </div>
);

/* =======================
   Page
======================= */
function NewsDetailPageInner() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<NewsDetailResponse | null>(null);
  const [related, setRelated] = useState<NewsListItem[]>([]);
  const [loading, setLoading] = useState(true);
  // const [imgSrc, setImgSrc] = useState<string | null>(null);

  /* Fetch detail */
  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    getNewsBySlug(slug)
      .then((res) => {
        if (res.result) {
          setData(res.result);
          // setImgSrc(res.result.thumbnail || res.result.imageLink);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  /* Fetch related news */
  useEffect(() => {
    if (!data?.categoryId) return;

    initNewsPage().then((res) => {
      if (!res.result) return;

      const sameCategory = res.result.news.filter(
        (n) => n.categoryId === data.categoryId && n.slug !== data.slug
      );

      setRelated(sameCategory.slice(0, 4));
    });
  }, [data]);

  // const handleImgError = useCallback(() => {
  //   setImgSrc("/images/news-placeholder.png");
  // }, []);

  const handleShare = useCallback(() => {
    if (!data) return;

    if (navigator.share) {
      navigator
        .share({
          title: data.title,
          text: data.description,
          url: `${window.location.origin}/${paths.NEWS_SHARE}/${data.slug}`,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(
        `${window.location.origin}/${paths.NEWS_SHARE}/${data.slug}`
      );
    }
  }, [data]);

  const pageTitle = useMemo(
    () => (data ? `${data.title} | Tin tức` : "Tin tức"),
    [data]
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Skeleton />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-10 text-center text-gray-400">
        Không tìm thấy bài viết
      </div>
    );
  }

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={data.description} />
        <meta property="og:title" content={data.title} />
        <meta property="og:description" content={data.description} />
        <meta property="og:image" content={data.thumbnail} />
      </Helmet>

      <div className="container mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-4">
          <Link to="/" className="hover:underline">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <Link to={paths.NEWS} className="hover:underline">
            Tin tức & Sự kiện
          </Link>
          <span className="mx-2">/</span>
          <span
            className={clsx(
              "inline-block px-4 py-1 rounded-full text-sm font-medium",
              "bg-green-100 text-green-700"
            )}
          >
            {data.categoryName}
          </span>
        </nav>

        {/* Category pill */}
        {/* <div className="mb-6">
          <span
            className={clsx(
              "inline-block px-4 py-1 rounded-full text-sm font-medium",
              "bg-green-100 text-green-700"
            )}
          >
            {data.categoryName}
          </span>
        </div> */}

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
            {data.title}
          </h1>

          <div className="mt-4 flex items-center justify-between flex-wrap gap-4">
            <div className="text-sm text-gray-400 flex items-center gap-2">
              <Calendar size={16} />
              <span>{formatDate(data.createdDate)}</span>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
              >
                <Printer size={16} />
              </Button>

              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 size={16} />
                <span className="ml-2 hidden md:inline">Chia sẻ</span>
              </Button>
            </div>
          </div>

          <hr className="mt-6 border-gray-200" />
        </header>

        {/* Content */}
        <main>
          <p className="text-lg md:text-xl font-medium">{data.description}</p>

          <div
            className="article-content mt-6"
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
        </main>

        {/* Related news */}
        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xl font-bold mb-6">Tin liên quan</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((n) => (
                <div
                  key={n.id}
                  className="p-4 border rounded-xl hover:shadow-sm transition cursor-pointer"
                  onClick={() => navigate(`/news/${n.slug}`)}
                >
                  <div className="font-semibold line-clamp-2">{n.title}</div>
                  <div className="mt-2 text-sm text-gray-400 flex items-center gap-2">
                    <Calendar size={14} />
                    {formatDate(n.createdDate)}
                  </div>

                  <div className="mt-3 text-sm text-green-600 flex items-center gap-1">
                    Xem chi tiết <ArrowRight size={14} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-12">
          <Link
            to={paths.NEWS}
            className="text-sm text-green-600 hover:underline"
          >
            ← Quay lại danh sách tin
          </Link>
        </div>
      </div>
    </>
  );
}

export default memo(NewsDetailPageInner);
