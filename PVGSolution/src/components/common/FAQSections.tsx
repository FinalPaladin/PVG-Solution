import React, { type JSX } from "react";

type FAQ = {
    question: string;
    answer: string;
};

const FAQ_LIST: FAQ[] = [
    {
        question: "Ai có thể sử dụng dịch vụ HHGSolution?",
        answer: "Dịch vụ HHG solution được cung cấp cho khách hàng cá nhân là công dân Việt Nam trên 18 tuổi có năng lực pháp luật và hành vi dân sự đầy đủ.",
    },
    {
        question: "Có phải dịch vụ HHGSolution hoạt động liên tục 24 giờ?",
        answer:
            "Đúng, dịch vụ HHG solution hoạt động 24/7, bao gồm cả ngày nghỉ/ngày lễ.",
    },
    {
        question: "Dịch vụ HHGSolution là gì?",
        answer:
            "Giải pháp hỗ trợ tiếp nhận vốn, Kết nối nhà đầu tư & khách hàng, Fintech kết nối nguồn vốn, Nền tảng kết nối tài chính - ngân hàng.",
    },
    // thêm câu hỏi khác nếu cần
];

export default function FAQSection(): JSX.Element {
    // lưu index các mục đang mở (cho phép mở nhiều)
    const [openIndices, setOpenIndices] = React.useState<number[]>([]);

    // refs để đọc scrollHeight cho animation
    const contentRefs = React.useRef<Record<number, HTMLDivElement | null>>({});

    const isOpen = (idx: number) => openIndices.includes(idx);

    const toggle = (idx: number) => {
        setOpenIndices((prev) =>
            prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
        );
    };

    // helper để set inline style maxHeight dựa trên scrollHeight
    const getMaxHeight = (idx: number) => {
        const node = contentRefs.current[idx];
        if (!node) return "0px";
        return isOpen(idx) ? `${node.scrollHeight}px` : "0px";
    };

    return (
        <div className="mt-16">
            <h2 className="text-3xl font-semibold mb-6">Câu hỏi thường gặp</h2>

            <div className="divide-y divide-gray-200">
                {FAQ_LIST.map((item, i) => {
                    const open = isOpen(i);

                    return (
                        <div key={i} className="py-5">
                            {/* Question Row */}
                            <button
                                onClick={() => toggle(i)}
                                className="flex w-full items-center justify-between text-left"
                                aria-expanded={open}
                                aria-controls={`faq-content-${i}`}
                                id={`faq-btn-${i}`}
                                type="button"
                            >
                                <div className="flex gap-3 items-start">
                                    <span className="text-xl font-medium">{i + 1}.</span>
                                    <span className="text-xl font-semibold text-gray-800">
                                        {item.question}
                                    </span>
                                </div>

                                {/* SVG Arrow (nice chevron) */}
                                <svg
                                    className={`w-6 h-6 transform transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"
                                        }`}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden
                                >
                                    <path
                                        d="M6 9l6 6 6-6"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>

                            {/* Answer (slide down) */}
                            <div
                                id={`faq-content-${i}`}
                                role="region"
                                aria-labelledby={`faq-btn-${i}`}
                                ref={(el) => { contentRefs.current[i] = el; }}
                                className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
                                style={{
                                    maxHeight: getMaxHeight(i),
                                }}
                            >
                                <p className="mt-3 pl-9 text-gray-700 leading-relaxed">
                                    {item.answer}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
