// ProductInfoPage.tsx
// React + Tailwind + TypeScript component that renders a 'Thông tin sản phẩm' page.
// Usage: place this file in your project, ensure Tailwind and Manrope font are configured,
// and import HeaderComponent (Header) in the same folder or adjust path.

import React, { useState, type JSX } from "react";
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
  { key: "fee", label: "Biểu phí" },
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

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex items-end gap-6 border-b border-[#e5e7eb] pb-3">
            {TABs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className={`relative pb-2 text-lg font-medium focus:outline-none ${
                  active === t.key
                    ? "text-[#14532d]"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {t.label}
                {/* underline indicator (separate element to avoid using before:content complexities) */}
                {active === t.key && (
                  <div className="absolute left-0 right-0 -bottom-3 h-1 bg-[#14532d] rounded-t-sm" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Content card list (left title + right content) */}
        <div className="space-y-6">
          <CardList active={active} />
        </div>
      </div>
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
