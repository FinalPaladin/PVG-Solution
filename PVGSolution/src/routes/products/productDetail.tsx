import FAQSection from "@/components/common/FAQSections";
import React, { useEffect, useMemo, useState, type JSX } from "react";
import { DollarSign, Shield, Zap, type LucideIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { initProductDetailPage } from "@/api/product";
import type {
  ProductDetailResponseModel,
  ProductResponseModel,
} from "@/models/admin/product.model";
import { useAlert } from "@/stores/useAlertStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { paths } from "@/commons/paths";

// --- Types ---
export type TabKey = "info" | "docs" | "process" | "fee";

type Item = {
  title: string;
  body: string[];
};

type CardListProps = {
  active: TabKey;
  details: ProductDetailResponseModel[];
};

// --- Tabs ---
const TABs: { key: TabKey; label: string }[] = [
  { key: "info", label: "Thông tin chung" },
  { key: "docs", label: "Hồ sơ chuẩn bị" },
  { key: "process", label: "Quy trình & Ngày trả nợ" },
  // { key: "fee", label: "Biểu phí" },
];

// --- Mapping productDetailCategoryId → TabKey ---
const DETAIL_CATEGORY_MAP: Record<number, TabKey> = {
  1: "info",
  2: "docs",
  3: "process",
  4: "fee",
};

// --- Component ---
export default function ProductInfoPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();

  const [active, setActive] = useState<TabKey>("info");
  const [product, setProduct] = useState<ProductResponseModel | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ===== Load product detail =====
  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        const res = await initProductDetailPage(id);
        if (res.isSuccess && res.result) {
          setProduct(res.result);
        }
      } catch (error) {
        if (error instanceof Error) {
          useAlert.getState().showError(error.message);
        } else {
          useAlert.getState().showError("Đã xảy ra lỗi không xác định");
        }
      }
    };

    fetchDetail();
  }, [id]);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* separator */}
      <div className="w-full h-px bg-[#e5e7eb]" />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-semibold mb-6">Thông tin sản phẩm</h1>

        {/* --- HERO / Banner --- */}
        <section className="rounded-xl overflow-hidden bg-white shadow-sm mb-10">
          <div className="relative flex flex-col md:flex-row items-stretch">
            {/* Left */}
            <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-center bg-linear-to-r from-white/90 via-white/70 to-transparent">
              <span className="inline-block text-xs font-semibold bg-white rounded-full px-3 py-1 text-[#14532d] shadow-sm mb-4">
                SẢN PHẨM
              </span>

              <h2 className="text-3xl md:text-4xl font-extrabold text-[#14532d] mb-4">
                {product?.name}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 text-gray-700">
                <div>
                  <div className="text-xs uppercase text-gray-500">Mức vay</div>
                  <div className="text-lg font-semibold">
                    {product?.loanAmount ?? "-"}
                  </div>
                </div>

                <div>
                  <div className="text-xs uppercase text-gray-500">
                    Thời hạn vay
                  </div>
                  <div className="text-lg font-semibold">
                    {product?.loanTerm ?? "-"}
                  </div>
                </div>
              </div>

              <Button
                type="button"
                size="lg"
                className="bg-emerald-400 text-[#064e3b] hover:bg-emerald-500 shadow-sm"
                onClick={() =>
                  navigate(paths.REQUEST.replace(":idproduct", id ?? ""))
                }
              >
                Đăng ký ngay
              </Button>
            </div>

            {/* Right image */}
            <div className="md:w-1/3 relative h-56 md:h-auto">
              <img
                src={product?.imageUrl}
                alt={product?.name}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 bg-linear-to-l from-transparent via-white/40 to-white/90"
                aria-hidden
              />
            </div>
          </div>
        </section>

        {/* --- Info cards --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <InfoCard
            Icon={DollarSign}
            title="Mức vay"
            body={product?.loanAmount ?? "Linh hoạt"}
          />
          <InfoCard
            Icon={Shield}
            title="Lãi suất"
            body="Cạnh tranh theo chính sách hiện hành"
          />
          <InfoCard
            Icon={Zap}
            title="Thời hạn vay"
            body={product?.loanTerm ?? "Linh hoạt"}
          />
        </section>

        {/* Tabs */}
        <div className="mb-6">
          <nav className="hidden sm:flex items-end gap-6 border-b border-[#e5e7eb] pb-3">
            {TABs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className={`relative pb-2 text-lg font-medium ${
                  active === t.key
                    ? "text-[#14532d]"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {t.label}
                {active === t.key && (
                  <div className="absolute left-0 right-0 -bottom-3 h-1 bg-[#14532d] rounded-t-sm" />
                )}
              </button>
            ))}
          </nav>

          {/* Mobile select */}
          <div className="sm:hidden">
            <Select
              value={active}
              onValueChange={(value) => setActive(value as TabKey)}
            >
              <SelectTrigger className="w-full px-4 py-3">
                <SelectValue placeholder="Chọn nội dung" />
              </SelectTrigger>

              <SelectContent>
                {TABs.map((t) => (
                  <SelectItem key={t.key} value={t.key}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Detail content */}
        <CardList active={active} details={product?.details ?? []} />

        <FAQSection />
      </div>
    </div>
  );
}

// --- InfoCard ---
function InfoCard({
  Icon,
  title,
  body,
}: {
  Icon: LucideIcon;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-[#f7f7f8] rounded-xl p-6 flex flex-col gap-4 shadow-sm">
      <div className="w-12 h-12 rounded-full bg-white/60 flex items-center justify-center shadow">
        <Icon className="w-6 h-6 text-[#14532d]" />
      </div>
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="text-sm text-gray-600">{body}</p>
    </div>
  );
}

// --- CardList ---
function CardList({ active, details }: CardListProps): JSX.Element {
  const items: Item[] = useMemo(() => {
    return details
      .filter((d) => DETAIL_CATEGORY_MAP[d.productDetailCategoryId] === active)
      .map((d) => ({
        title: d.title,
        body: d.content
          .split("\n")
          .map((x) => x.trim())
          .filter(Boolean),
      }));
  }, [details, active]);

  const DEFAULT_VISIBLE = 3;
  const [collapsed, setCollapsed] = React.useState(true);

  const isCollapsible = items.length > DEFAULT_VISIBLE;
  const visibleList = collapsed ? items.slice(0, DEFAULT_VISIBLE) : items;

  return (
    <div className="space-y-6">
      {visibleList.map((item, idx) => (
        <div key={idx} className="bg-[#f7f7f8] rounded-lg p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4 lg:col-span-3">
              <h3 className="text-xl font-semibold">{item.title}</h3>
            </div>
            <div className="md:col-span-8 lg:col-span-9">
              {item.body.map((b, i) => (
                <p key={i} className="mb-2">
                  {b}
                </p>
              ))}
            </div>
          </div>
        </div>
      ))}

      {isCollapsible && (
        <div className="flex justify-center">
          <button
            onClick={() => setCollapsed((s) => !s)}
            className="px-6 py-3 border rounded-md text-[#14532d]"
          >
            {collapsed ? "Xem thêm ▾" : "Thu gọn ▴"}
          </button>
        </div>
      )}
    </div>
  );
}
