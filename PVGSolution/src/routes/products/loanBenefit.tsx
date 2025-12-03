export function LoanBenefits() {
    return (
        <section className="w-full mt-6">
            <div className="max-w-7xl mx-auto">

                {/* Title */}
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                    Lợi ích khi lựa chọn sản phẩm vay tại PVG Solution
                </h2>

                {/* Benefit cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Item 1 */}
                    <div className="bg-emerald-50/60 rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex flex-col items-center text-center space-y-3">
                            {/* Icon */}
                            <div className="h-12 w-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-2xl">
                                ⚡
                            </div>

                            <h3 className="text-lg font-semibold text-slate-800">
                                Giải ngân nhanh chóng
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Thủ tục đơn giản, phê duyệt nhanh chóng, đáp ứng kịp thời mọi nhu cầu vay vốn.
                            </p>
                        </div>
                    </div>

                    {/* Item 2 */}
                    <div className="bg-emerald-50/60 rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="h-12 w-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-2xl">
                                %
                            </div>

                            <h3 className="text-lg font-semibold text-slate-800">
                                Lãi suất cạnh tranh
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Mức lãi suất minh bạch, nhiều ưu đãi giúp tối ưu chi phí vay của bạn.
                            </p>
                        </div>
                    </div>

                    {/* Item 3 */}
                    <div className="bg-emerald-50/60 rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="h-12 w-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-2xl">
                                💰
                            </div>

                            <h3 className="text-lg font-semibold text-slate-800">
                                Phương thức trả nợ linh hoạt
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Thanh toán khoản vay trước hạn hoặc theo kỳ dễ dàng, hỗ trợ online hoặc trực tiếp.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
