import { Button } from "@/components/ui/button";
import bannerImg from "@/assets/images/product-banner.png";

export function RedBookBanner() {
    return (
        <div className="mt-6">
            {/* Căn giữa giống phần danh sách sản phẩm */}
            <div className="max-w-7xl mx-auto">
                {/* CARD BANNER – chỗ này mới có nền xanh + bo góc */}
                <div className="bg-emerald-50/60 rounded-3xl overflow-hidden">
                    <div className="grid gap-10 md:grid-cols-2 items-center py-10 md:py-16 px-4 md:px-6">
                        {/* Text */}
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <p className="text-sm font-medium text-emerald-700 uppercase tracking-[0.12em]">
                                    Giải pháp vay từ sổ đỏ
                                </p>
                                <h1 className="text-3xl md:text-4xl font-semibold leading-tight text-slate-900">
                                    Vay thế chấp sổ đỏ{" "}
                                    <span className="text-emerald-700">nhanh chóng, minh bạch</span>
                                </h1>
                                <p className="text-sm md:text-base text-slate-600 max-w-xl">
                                    Tận dụng giá trị sổ đỏ nhà đất để có thêm nguồn vốn cho mua nhà,
                                    kinh doanh hoặc tiêu dùng, với quy trình đơn giản và rõ ràng.
                                </p>
                            </div>

                            {/* Bullets */}
                            <ul className="space-y-2 text-sm md:text-base text-slate-700">
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-semibold text-emerald-700">
                                        ✓
                                    </span>
                                    <span>
                                        Hạn mức vay đến <b>5 tỷ</b>
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-semibold text-emerald-700">
                                        ✓
                                    </span>
                                    <span>Lãi suất cạnh tranh, điều chỉnh minh bạch</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-semibold text-emerald-700">
                                        ✓
                                    </span>
                                    <span>Thẩm định nhanh, dự kiến giải ngân trong 24 giờ</span>
                                </li>
                            </ul>

                            {/* CTA */}
                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <Button size="lg" className="rounded-full px-7 shadow-sm">
                                    Đăng ký nhận tư vấn miễn phí
                                </Button>
                                <p className="text-xs md:text-sm text-slate-500">
                                    Chuyên viên sẽ liên hệ lại để hỗ trợ chi tiết hồ sơ của anh/chị.
                                </p>
                            </div>

                            {/* Trust mini stats */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-emerald-100 pt-6">
                                <div>
                                    <p className="text-lg font-semibold text-slate-900">1.500+</p>
                                    <p className="text-xs text-slate-500">
                                        Khách hàng đã được hỗ trợ tại TP HCM &amp; Bình Dương
                                    </p>
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-slate-900">&lt; 24h</p>
                                    <p className="text-xs text-slate-500">
                                        Thời gian thẩm định hồ sơ dự kiến
                                    </p>
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-slate-900">2025</p>
                                    <p className="text-xs text-slate-500">
                                        Chính sách &amp; quy trình được chuẩn hoá
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Image */}
                        <div className="relative">
                            <div className="aspect-4/3 md:aspect-5/4 rounded-3xl bg-white shadow-sm overflow-hidden">
                                <img
                                    src={bannerImg}
                                    alt="Khách hàng cầm sổ đỏ và ký hồ sơ vay"
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            {/* Badge nổi góc trên */}
                            <div className="absolute -top-4 -right-2 md:-right-6 bg-white/90 backdrop-blur border border-emerald-100 rounded-2xl px-4 py-2 shadow-sm">
                                <p className="text-xs font-medium text-emerald-700">
                                    Tỷ lệ duyệt cao
                                </p>
                                <p className="text-[11px] text-slate-500">
                                    Áp dụng cho khách có sổ đỏ nhà/đất hợp lệ
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
