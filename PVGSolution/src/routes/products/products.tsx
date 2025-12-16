import { paths } from "@/commons/paths";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { RedBookBanner } from "./redbookBanner";
import { LoanBenefits } from "./loanBenefit";
import { useEffect, useMemo, useState } from "react";
import { initProductPage } from "@/api/product";
import type { appCategories, appProducts } from "@/models/appProducts.model";

export default function ProductsPage() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<appCategories[]>([]);
  const [products, setProducts] = useState<appProducts[]>([]);
  const [value, setValue] = useState<string>("");

  // ===== Load init data =====
  useEffect(() => {
    const fetchInitData = async () => {
      try {
        const res = await initProductPage();
        if (res.isSuccess && res.result) {
          setCategories(res.result.categories);
          setProducts(res.result.products);

          // default tab = first category (thường là "")
          setValue(res.result.categories?.[0]?.id ?? "");
        }
      } catch (err) {
        console.error("Init product page error:", err);
      }
    };

    fetchInitData();
  }, []);

  // ===== Filter products by category =====
  const filteredProducts = useMemo(() => {
    if (!value) return products;
    return products.filter((p) => p.productCategoryId === value);
  }, [products, value]);

  return (
    <>
      <RedBookBanner />

      <h1 className="text-3xl font-bold mb-6 mt-6">Danh sách sản phẩm</h1>

      {/* ===== Mobile select ===== */}
      <div className="md:hidden mb-4">
        <label htmlFor="productTabsSelect" className="sr-only">
          Chọn danh mục sản phẩm
        </label>

        <select
          id="productTabsSelect"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full appearance-none rounded-md border border-gray-200 px-4 py-3 text-base font-medium bg-white focus:border-green-600 focus:ring-0"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* ===== Desktop / Tablet tabs ===== */}
      <div className="hidden md:block">
        <Tabs value={value} onValueChange={setValue}>
          <div className="relative pb-4">
            <div
              className="absolute left-0 right-0 h-px pointer-events-none"
              style={{ bottom: "25px", backgroundColor: "#e5e7eb", zIndex: 30 }}
            />

            <TabsList className="flex gap-8 pb-6 bg-transparent border-none shadow-none">
              {categories.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id} // ⬅️ QUAN TRỌNG
                  className="tabs-trigger relative px-3 pb-3 text-lg text-gray-700 font-medium bg-transparent border-none shadow-none focus:outline-none"
                  style={{ backgroundColor: "transparent", boxShadow: "none" }}
                >
                  <span className="tabs-trigger-label">{tab.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>
      </div>

      {/* ===== Product cards ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all rounded-2xl p-0">
              <div
                className="w-full h-56 bg-center bg-cover rounded-t-xl"
                style={{ backgroundImage: `url(${item.imageUrl})` }}
              />

              <CardContent className="p-6 space-y-3">
                <h3 className="text-lg font-semibold">{item.name}</h3>

                <div className="flex justify-between text-sm text-gray-700">
                  <div>
                    <p className="font-medium uppercase text-gray-500">
                      Mức vay
                    </p>
                    <p className="font-semibold">{item.loanAmount}</p>
                  </div>

                  <div>
                    <p className="font-medium uppercase text-gray-500">
                      Thời hạn vay
                    </p>
                    <p className="font-semibold">{item.loanTerm}</p>
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
                  onClick={() =>
                    navigate(`${paths.PRODUCT_DETAIL.replace(":id", item.id)}`)
                  }
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
