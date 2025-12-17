import { paths } from "@/commons/paths";
import type { JSX } from "react";
import { useNavigate } from "react-router-dom";

export default function SuccessPage(): JSX.Element {
    const navigate = useNavigate();

    return(
        <div className="flex min-h-screen items-start justify-center bg-gray-50 px-4 pt-24">
            <div className="rounded-2xl bg-white p-8 shadow-lg md:p-12">
                <h1 className="text-center text-lg font-semibold text-emerald-600 sm:text-xl md:text-3xl">
                Thao tác thành công
                </h1>

                <p className="mt-4 text-center text-sm text-gray-500 md:text-base">
                Yêu cầu của bạn đã được xử lý thành công.
                </p>
                <p className="mt-4 text-center text-sm text-gray-500 md:text-base">Nhấn để chuyển về <b className="cursor-pointer" onClick={() => {navigate(paths.PRODUCTS);}}><u>TRANG CHỦ</u></b></p>
            </div>
        </div>
    )
}