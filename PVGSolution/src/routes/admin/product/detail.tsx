// src/pages/ProductForm.tsx
import type { JSX } from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

type ProductDetailCategory = "general" | "document" | "process"; // 3 loại

const PRODUCT_DETAIL_CATEGORY_LABEL: Record<ProductDetailCategory, string> = {
  general: "Thông tin chung",
  document: "Hồ sơ chuẩn bị",
  process: "Quy trình & Ngày trả nợ",
};

type DetailStatus = "active" | "inactive";

interface ProductDetailItem {
  id: string;
  category: ProductDetailCategory;
  title: string; // bên trái (ví dụ: Đối tượng khách hàng)
  content: string; // bên phải (khối nội dung)
  status: DetailStatus;
}

interface ProductFormData {
  id?: string;
  name: string;
  categoryId: string;
  loanAmountId: string;
  loanTermId: string;
  imageUrl?: string;
  details: ProductDetailItem[];
}

// fake: data danh mục sản phẩm / mức vay / thời hạn vay
const PRODUCT_CATEGORIES = [
  { id: "cat-1", name: "Vay tiêu dùng" },
  { id: "cat-2", name: "Vay mua ô tô" },
  { id: "cat-3", name: "Vay nhu cầu bất động sản" },
];

const LOAN_AMOUNTS = [
  { id: "amount-1", name: "Linh hoạt" },
  { id: "amount-2", name: "02 tỷ VND" },
  { id: "amount-3", name: "100% giá trị tài sản bảo đảm" },
];

const LOAN_TERMS = [
  { id: "term-1", name: "Linh hoạt" },
  { id: "term-2", name: "84 tháng" },
  { id: "term-3", name: "120 tháng" },
];

// fake API
async function fetchProductById(id: string): Promise<ProductFormData | null> {
  console.log("Fetch product by id", id);
  await new Promise((r) => setTimeout(r, 300));

  // demo: trả về 1 sản phẩm mẫu
  if (id === "1") {
    return {
      id,
      name: "Vay tín chấp theo lương",
      categoryId: "cat-1",
      loanAmountId: "amount-1",
      loanTermId: "term-2",
      imageUrl: "",
      details: [
        {
          id: "d1",
          category: "general",
          title: "Đối tượng khách hàng",
          content:
            "Công dân Việt Nam từ 18 tuổi trở lên\nThu nhập sau thuế từ lương bình quân tối thiểu 07 triệu đồng/tháng...",
          status: "active",
        },
      ],
    };
  }

  // nếu ko có dữ liệu thật thì trả null
  return null;
}

async function createProduct(payload: ProductFormData): Promise<void> {
  console.log("Create product payload:", payload);
  await new Promise((r) => setTimeout(r, 300));
}

async function updateProduct(
  id: string,
  payload: ProductFormData
): Promise<void> {
  console.log("Update product", id, payload);
  await new Promise((r) => setTimeout(r, 300));
}

export default function ProductForm(): JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();

  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  // main form
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loanAmountId, setLoanAmountId] = useState("");
  const [loanTermId, setLoanTermId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>();

  // details
  const [details, setDetails] = useState<ProductDetailItem[]>([]);

  // dialog state
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [detailEditMode, setDetailEditMode] = useState<"create" | "edit">(
    "create"
  );
  const [editingDetailId, setEditingDetailId] = useState<string | null>(null);
  const [detailCategory, setDetailCategory] =
    useState<ProductDetailCategory>("general");
  const [detailTitle, setDetailTitle] = useState("");
  const [detailContent, setDetailContent] = useState("");

  // load data khi edit
  useEffect(() => {
    if (!isEdit || !id) return;

    const run = async () => {
      setInitialLoading(true);
      try {
        const data = await fetchProductById(id);
        if (data) {
          setName(data.name);
          setCategoryId(data.categoryId);
          setLoanAmountId(data.loanAmountId);
          setLoanTermId(data.loanTermId);
          setImagePreview(data.imageUrl);
          setDetails(data.details);
        }
      } finally {
        setInitialLoading(false);
      }
    };

    run();
  }, [isEdit, id]);

  // handle file change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const openCreateDetailDialog = () => {
    setDetailEditMode("create");
    setEditingDetailId(null);
    setDetailCategory("general");
    setDetailTitle("");
    setDetailContent("");
    setDetailDialogOpen(true);
  };

  const openEditDetailDialog = (item: ProductDetailItem) => {
    setDetailEditMode("edit");
    setEditingDetailId(item.id);
    setDetailCategory(item.category);
    setDetailTitle(item.title);
    setDetailContent(item.content);
    setDetailDialogOpen(true);
  };

  const handleSaveDetail = () => {
    const trimmedTitle = detailTitle.trim();
    const trimmedContent = detailContent.trim();
    if (!trimmedTitle || !trimmedContent) return;

    if (detailEditMode === "create") {
      const newItem: ProductDetailItem = {
        id: crypto.randomUUID(),
        category: detailCategory,
        title: trimmedTitle,
        content: trimmedContent,
        status: "active",
      };
      setDetails((prev) => [...prev, newItem]);
    } else if (detailEditMode === "edit" && editingDetailId) {
      setDetails((prev) =>
        prev.map((d) =>
          d.id === editingDetailId
            ? {
                ...d,
                category: detailCategory,
                title: trimmedTitle,
                content: trimmedContent,
              }
            : d
        )
      );
    }

    setDetailDialogOpen(false);
  };

  const toggleDetailStatus = (id: string) => {
    setDetails((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, status: d.status === "active" ? "inactive" : "active" }
          : d
      )
    );
  };

  const handleSubmit = async () => {
    const payload: ProductFormData = {
      id,
      name: name.trim(),
      categoryId,
      loanAmountId,
      loanTermId,
      imageUrl: imagePreview, // tạm thời, thực tế ông upload rồi lấy URL
      details,
    };

    if (!payload.name || !payload.categoryId) return;

    try {
      setLoading(true);
      if (isEdit && id) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      // sau khi lưu xong quay về list
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  const pageTitle = isEdit ? "Sửa sản phẩm" : "Thêm sản phẩm";

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{pageTitle}</h1>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/products")}
          >
            Hủy
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={loading}>
            Lưu
          </Button>
        </div>
      </div>

      {initialLoading ? (
        <div className="mt-10 text-center">Đang tải dữ liệu...</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Thông tin cơ bản */}
          <div className="space-y-4 rounded-md border p-4 lg:col-span-2">
            <h2 className="text-lg font-semibold">Thông tin sản phẩm</h2>

            <div className="space-y-1">
              <label className="text-sm font-medium">Tên sản phẩm</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên sản phẩm..."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Danh mục sản phẩm</label>
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">-- Chọn danh mục --</option>
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Mức vay</label>
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={loanAmountId}
                  onChange={(e) => setLoanAmountId(e.target.value)}
                >
                  <option value="">-- Chọn mức vay --</option>
                  {LOAN_AMOUNTS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Thời hạn vay</label>
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={loanTermId}
                  onChange={(e) => setLoanTermId(e.target.value)}
                >
                  <option value="">-- Chọn thời hạn vay --</option>
                  {LOAN_TERMS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Hình ảnh */}
          <div className="space-y-4 rounded-md border p-4">
            <h2 className="text-lg font-semibold">Hình ảnh sản phẩm</h2>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <div className="mt-2 overflow-hidden rounded-md border">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-40 w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Thông tin sản phẩm (list) */}
      <div className="mt-4 flex min-h-0 flex-1 flex-col rounded-md border">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-semibold">Thông tin sản phẩm</h2>
          <Button type="button" onClick={openCreateDetailDialog}>
            Thêm mới
          </Button>
        </div>
        <ScrollArea className="h-[300px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px] text-center">STT</TableHead>
                <TableHead>Danh mục thông tin</TableHead>
                <TableHead>Tiêu đề (bên trái)</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-40 text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {details.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Chưa có thông tin, nhấn "Thêm mới" để tạo.
                  </TableCell>
                </TableRow>
              ) : (
                details.map((d, index) => (
                  <TableRow key={d.id}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell>
                      {PRODUCT_DETAIL_CATEGORY_LABEL[d.category]}
                    </TableCell>
                    <TableCell>{d.title}</TableCell>
                    <TableCell>
                      <Badge
                        variant={d.status === "active" ? "default" : "outline"}
                        className={
                          d.status === "active"
                            ? "bg-emerald-500/90 hover:bg-emerald-500"
                            : ""
                        }
                      >
                        {d.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDetailDialog(d)}
                        >
                          Sửa
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => toggleDetailStatus(d.id)}
                        >
                          {d.status === "active" ? "Disable" : "Enable"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Dialog thêm / sửa detail */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {detailEditMode === "create"
                ? "Thêm thông tin sản phẩm"
                : "Sửa thông tin sản phẩm"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Category detail</label>
              <select
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={detailCategory}
                onChange={(e) =>
                  setDetailCategory(e.target.value as ProductDetailCategory)
                }
              >
                <option value="general">Thông tin chung</option>
                <option value="document">Hồ sơ chuẩn bị</option>
                <option value="process">Quy trình &amp; Ngày trả nợ</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">
                Tiêu đề (cột bên trái)
              </label>
              <Input
                value={detailTitle}
                onChange={(e) => setDetailTitle(e.target.value)}
                placeholder="Ví dụ: Đối tượng khách hàng"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">
                Nội dung (cột bên phải)
              </label>
              <Textarea
                rows={6}
                value={detailContent}
                onChange={(e) => setDetailContent(e.target.value)}
                placeholder="Nhập mô tả chi tiết..."
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDetailDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleSaveDetail}
              disabled={!detailTitle.trim() || !detailContent.trim()}
            >
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
