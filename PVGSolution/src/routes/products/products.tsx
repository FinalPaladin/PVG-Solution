import { paths } from "@/commons/paths";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { RedBookBanner } from "./redbookBanner";
import { LoanBenefits } from "./loanBenefit";

const products = [
  {
    title: "Vay tín chấp theo lương",
    img: "https://www.vietcombank.com.vn/-/media/Project/VCB-Sites/VCB/KHCN/San-pham-Dich-vu/Vay/SAN-PHAM-TIN-DUNG/Ava_Vay-tin-chap-voi-nguoi-LD_195-x-343_.jpg?h=1125&w=2436&ts=20250529074158",
    subtitle1: "Mức vay",
    value1: "Linh hoạt",
    subtitle2: "Thời hạn vay tối đa",
    value2: "84 tháng",
  },
  {
    title: "Vay cầm cố giấy tờ có giá",
    img: "https://www.vietcombank.com.vn/-/media/Project/VCB-Sites/VCB/KHCN/San-pham-Dich-vu/Vay/SAN-PHAM-TIN-DUNG/Ava_Vay-cam-co-giay-to-co-gia_195-x-343_.jpg?h=1125&w=2436&ts=20230815090526",
    subtitle1: "Mức vay lên tới",
    value1: "100% giá trị giấy tờ có giá",
    subtitle2: "Thời hạn vay",
    value2: "Linh hoạt",
  },
  {
    title: "Vay tiêu dùng có tài sản bảo đảm",
    img: "https://www.vietcombank.com.vn/-/media/Project/VCB-Sites/VCB/KHCN/San-pham-Dich-vu/Vay/SAN-PHAM-TIN-DUNG/Ava_Vay-tieu-dung-co-tai-san-dam-bao_195-x-343_.jpg?h=1125&w=2436&ts=20230816033310",
    subtitle1: "Mức vay lên tới",
    value1: "02 tỷ VND",
    subtitle2: "Thời hạn vay tối đa",
    value2: "120 tháng",
  },
];

const tabs = [
  { value: "all", label: "Tất cả sản phẩm" },
  { value: "vaytieu", label: "Vay tiêu dùng" },
  { value: "vayoto", label: "Vay mua ô tô" },
  { value: "vaykd", label: "Vay sản xuất kinh doanh" },
  { value: "vaybds", label: "Vay nhu cầu bất động sản" },
];

export default function ProductsPage() {
  const navigate = useNavigate();

  return (
    <>
      <RedBookBanner />
      <h1 className="text-3xl font-bold mb-6 mt-6">Danh sách sản phẩm</h1>
      <Tabs defaultValue="all">
        <div className="relative pb-4">
          {/* move the gray baseline slightly up and above the green underline, with higher z-index */}
          <div
            className="absolute left-0 right-0 h-px pointer-events-none"
            style={{ bottom: "25px", backgroundColor: "#e5e7eb", zIndex: 30 }}
          />
          <TabsList className="flex gap-8 pb-6 bg-transparent border-none shadow-none">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="tabs-trigger relative px-3 pb-3 text-lg text-gray-700 font-medium bg-transparent border-none shadow-none focus:outline-none"
                style={{ backgroundColor: "transparent", boxShadow: "none" }}
              >
                <span className="tabs-trigger-label">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all rounded-2xl p-0">
              <div
                className="w-full h-56 bg-center bg-cover rounded-t-xl"
                style={{ backgroundImage: `url(${item.img})` }}
              />

              <CardContent className="p-6 space-y-3">
                <h3 className="text-lg font-semibold">{item.title}</h3>

                <div className="flex justify-between text-sm text-gray-700">
                  <div>
                    <p className="font-medium uppercase text-gray-500">
                      {item.subtitle1}
                    </p>
                    <p className="font-semibold">{item.value1}</p>
                  </div>
                  <div>
                    <p className="font-medium uppercase text-gray-500">
                      {item.subtitle2}
                    </p>
                    <p className="font-semibold">{item.value2}</p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex gap-3 px-6 pb-6">
                <Button
                  className="bg-[#9cc31c] hover:bg-[#8bb019] text-white flex-1 rounded-md"
                  onClick={() => navigate(paths.REQUEST)}
                >
                  Đăng ký ngay
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 rounded-md"
                  onClick={() => navigate(paths.PRODUCT_DETAIL)}
                >
                  Xem chi tiết
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      <LoanBenefits />
    </>
  );
}
