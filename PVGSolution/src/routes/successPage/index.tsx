import { paths } from "@/commons/paths";
import type { JSX } from "react";
import { useNavigate } from "react-router-dom";

export default function SuccessPage(): JSX.Element {
    const navigate = useNavigate();

    return(
        <div className="flex min-h-screen items-start justify-center bg-white px-4 pt-24">
            <div className="w-full max-w-md text-center">
                
                {/* Icon */}
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                <svg
                    className="h-8 w-8 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                </div>

                {/* Title */}
                <h1 className="text-xl font-semibold text-emerald-600 sm:text-2xl md:text-3xl">
                Thao tác thành công
                </h1>

                {/* Description */}
                <p className="mt-3 text-sm text-gray-500 sm:text-base">
                Yêu cầu của bạn đã được xử lý thành công.
                </p>

                {/* Action */}
                <button
                onClick={() => navigate(paths.PRODUCTS)}
                className="mt-8 inline-flex items-center justify-center rounded-lg border border-emerald-600 px-6 py-3 text-sm font-medium text-emerald-600 transition hover:bg-emerald-50 active:scale-95 sm:text-base"
                >
                Quay về trang chủ
                </button>

            </div>
        </div>
    )
}