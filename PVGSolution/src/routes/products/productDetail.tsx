import FAQSection from "@/components/common/FAQSections";
import React, { useState, type JSX } from "react";
import { DollarSign, Shield, Zap, type LucideIcon } from "lucide-react";

// --- Types ---
export type TabKey = "info" | "docs" | "process" | "fee";

type Item = {
  title: string;
  body: string[];
};

type CardListProps = {
  active: TabKey;
};

// --- Tabs ---
const TABs: { key: TabKey; label: string }[] = [
  { key: "info", label: "Thông tin chung" },
  { key: "docs", label: "Hồ sơ chuẩn bị" },
  { key: "process", label: "Quy trình & Ngày trả nợ" },
  // { key: "fee", label: "Biểu phí" },
];

// --- Component ---
export default function ProductInfoPage(): JSX.Element {
  const [active, setActive] = useState<TabKey>("info"); // typed state — no more TS error

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* separator */}
      <div className="w-full h-px bg-[#e5e7eb]" />

      {/* Page content container */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-semibold mb-6">Thông tin sản phẩm</h1>

        {/* --- HERO / Banner --- */}
        <section className="rounded-xl overflow-hidden bg-white shadow-sm mb-10">
          <div className="relative flex flex-col md:flex-row items-stretch">
            {/* Left content */}
            <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-center bg-linear-to-r from-white/90 via-white/70 to-transparent">
              <span className="inline-block text-xs font-semibold bg-white rounded-full px-3 py-1 text-[#14532d] shadow-sm mb-4">
                VAY TIÊU DÙNG
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#14532d] mb-4">
                Vay tín chấp theo lương
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 text-gray-700">
                <div>
                  <div className="text-xs uppercase text-gray-500">Mức vay</div>
                  <div className="text-lg font-semibold">Linh hoạt</div>
                </div>

                <div>
                  <div className="text-xs uppercase text-gray-500">
                    Thời hạn vay tối đa
                  </div>
                  <div className="text-lg font-semibold">84 tháng</div>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  className="inline-block px-6 py-3 rounded-md bg-emerald-400 text-[#064e3b] font-medium shadow-sm hover:brightness-95"
                >
                  Đăng ký ngay
                </button>
              </div>
            </div>

            {/* Right image */}
            <div className="md:w-1/3 relative h-56 md:h-auto">
              <img
                src="https://www.vietcombank.com.vn/-/media/Project/VCB-Sites/VCB/KHCN/San-pham-Dich-vu/Vay/SAN-PHAM-TIN-DUNG/Ava_Vay-tin-chap-voi-nguoi-LD_195-x-343_.jpg?h=1125&w=2436&ts=20250529074158"
                alt="banner"
                className="w-full h-full object-cover"
              />
              {/* overlay to mimic soft fade like mockup */}
              <div
                className="absolute inset-0 bg-linear-to-l from-transparent via-white/40 to-white/90"
                aria-hidden
              />
            </div>
          </div>
        </section>

        {/* --- 3 Info cards under banner --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <InfoCard
            Icon={DollarSign}
            title="Số tiền cho vay tối đa"
            body="Linh hoạt, theo chính sách áp dụng với từng phân khúc khách hàng."
          />

          <InfoCard
            Icon={Shield}
            title="Lãi suất cạnh tranh"
            body="Lãi suất cạnh tranh trên thị trường."
          />

          <InfoCard
            Icon={Zap}
            title="Không cần Tài sản bảo đảm"
            body="Không yêu cầu Tài sản bảo đảm."
          />
        </section>

        {/* Tabs */}
        <div className="mb-6">
          {/* Desktop Tabs: hidden on small screens */}
          <nav
            className="hidden sm:flex items-end gap-6 border-b border-[#e5e7eb] pb-3"
            role="tablist"
            aria-label="Product info tabs"
          >
            {TABs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                role="tab"
                aria-selected={active === t.key}
                className={`relative pb-2 text-lg font-medium focus:outline-none transition-colors ${
                  active === t.key
                    ? "text-[#14532d]"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {t.label}
                {/* underline indicator */}
                {active === t.key && (
                  <div className="absolute left-0 right-0 -bottom-3 h-1 bg-[#14532d] rounded-t-sm" />
                )}
              </button>
            ))}
          </nav>

          {/* Mobile: show select/dropdown (block on small, hidden on sm+) */}
          <div className="sm:hidden">
            <label htmlFor="product-info-select" className="sr-only">
              Chọn thông tin
            </label>
            <div className="border border-[#e5e7eb] rounded-md overflow-hidden bg-white">
              <select
                id="product-info-select"
                className="w-full px-4 py-3 text-base appearance-none focus:outline-none"
                value={active}
                onChange={(e) => setActive(e.target.value as TabKey)}
              >
                {TABs.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content card list (left title + right content) */}
        <div className="space-y-6">
          <CardList active={active} />
        </div>

        <FAQSection />
      </div>
    </div>
  );
}

// --- small InfoCard component ---
function InfoCard({
  Icon,
  title,
  body,
}: {
  Icon: LucideIcon;
  title: string;
  body: string;
}): JSX.Element {
  return (
    <div className="bg-[#f7f7f8] rounded-xl p-6 flex flex-col items-start gap-4 shadow-sm">
      <div className="w-12 h-12 rounded-full bg-white/60 flex items-center justify-center shadow">
        <Icon className="w-6 h-6 text-[#14532d]" />
      </div>
      <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
      <p className="text-sm text-gray-600">{body}</p>
    </div>
  );
}

// --- CardList (typed) ---
function CardList({ active }: CardListProps): JSX.Element {
  const content: Record<TabKey, Item[]> = {
    info: [
      {
        title: "Đối tượng khách hàng",
        body: [
          "Công dân Việt Nam từ 18 tuổi trở lên",
          "Khách hàng đã ký Hợp đồng lao động có thời hạn từ 01 năm trở lên",
          "Thu nhập sau thuế từ lương bình quân tối thiểu 07 triệu đồng/tháng (không áp dụng điều kiện này với khách hàng hưởng lương từ Ngân sách Nhà nước)",
          "Khách hàng đáp ứng yêu cầu về cấp tín dụng của VCB.",
        ],
      },
      {
        title: "Phương thức cho vay",
        body: [
          "Vay từng lần",
          "Vay thấu chi (Khách hàng được chi vượt số tiền có trên tài khoản thanh toán).",
        ],
      },
      {
        title: "Thời gian vay tối đa",
        body: ["84 tháng với vay từng lần và 12 tháng với vay thấu chi"],
      },
    ],

    docs: [
      {
        title: "Hồ sơ nhân thân của Khách hàng",
        body: [
          "CMND/CCCD/Hộ chiếu.",
          "Thông tin cư trú của khách hàng.",
          "Giấy đăng ký kết hôn/Chứng nhận độc thân.",
        ],
      },
      {
        title: "Hồ sơ chứng minh mục đích vay vốn và nguồn thu nhập",
        body: ["Theo hướng dẫn của Vietcombank"],
      },
      {
        title: "Phương án sử dụng vốn",
        body: ["Theo mẫu biểu/biểu mẫu của Vietcombank."],
      },
      {
        title: "Hồ sơ khác",
        body: ["Theo hướng dẫn của Vietcombank"],
      },
    ],

    process: [
      {
        title: "Quy trình vay",
        body: [
          "Bước 1: Khách hàng được tư vấn về điều kiện và hồ sơ vay vốn",
          "Bước 2: Khách hàng chuẩn bị và nộp hồ sơ theo hướng dẫn",
          "Bước 3: Vietcombank thực hiện thẩm định và thông báo kết quả phê duyệt",
          "Bước 4: Khách hàng và Vietcombank ký kết hợp đồng cho vay",
          "Bước 5: Vietcombank giải ngân khoản vay từng lần hoặc khách hàng chủ động sử dụng hạn mức thấu chi trên các kênh giao dịch của VCB (Digibank, tại quầy,.....)",
        ],
      },
      {
        title: "Ngày trả nợ",
        body: [
          "- Kỳ trả nợ gốc:",
          "Vay từng lần: Hàng tháng",
          "Vay thấu chi: Cuối kỳ",
          "- Kỳ trả nợ lãi: Hàng tháng.",
        ],
      },
    ],

    fee: [
      {
        title: "Biểu phí",
        body: [
          "Thông tin về biểu phí sẽ cập nhật theo thông báo của Vietcombank.",
        ],
      },
    ],
  };

  // Collapsible logic: show first N items (cards) by default
  const DEFAULT_VISIBLE = 3;
  const [collapsed, setCollapsed] = React.useState<boolean>(true);

  const list = content[active] || [];
  const isCollapsible = list.length > DEFAULT_VISIBLE;
  const visibleList = collapsed ? list.slice(0, DEFAULT_VISIBLE) : list;

  return (
    <div className="space-y-6">
      {visibleList.map((item, idx) => (
        <div key={idx} className="bg-[#f7f7f8] rounded-lg p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <div className="md:col-span-4 lg:col-span-3">
              <h3 className="text-xl font-semibold text-gray-800">
                {item.title}
              </h3>
            </div>
            <div className="md:col-span-8 lg:col-span-9 text-gray-700">
              {item.body.map((b, i) => (
                <p key={i} className="mb-2">
                  {b}
                </p>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Toggle button center with dashed lines, only show when collapsible */}
      {isCollapsible && (
        <div className="mt-2 flex items-center justify-center">
          <div className="flex items-center gap-6 w-full max-w-md">
            <div className="flex-1 border-t border-dashed border-[#e5e7eb]" />

            <button
              aria-expanded={!collapsed}
              onClick={() => setCollapsed((s) => !s)}
              className="px-6 py-3 rounded-md border border-[#e5e7eb] shadow-sm bg-white text-[#14532d] font-medium hover:bg-gray-50 flex items-center gap-2"
            >
              {collapsed ? (
                <>
                  Xem thêm <span>▾</span>
                </>
              ) : (
                <>
                  Thu gọn <span>▴</span>
                </>
              )}
            </button>

            <div className="flex-1 border-t border-dashed border-[#e5e7eb]" />
          </div>
        </div>
      )}
    </div>
  );
}
