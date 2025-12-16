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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { loadMData } from "@/api/admin/adMData";
import { MDataEnum_Group } from "@/commons/mData";
import { useAlert } from "@/stores/useAlertStore";
import { SelectBox } from "@/components/common/SelectBox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import { uploadImage } from "@/api/admin/adMediaUpload";
import {
  productCreate,
  productUpdate,
  productsGetById,
} from "@/api/admin/adProducts";
import type {
  ProductCreateRequest,
  ProductDetailModel,
  ProductUpdateRequest,
} from "@/models/admin/product.model";
import { adminPaths } from "@/commons/paths";
import { useAuth } from "@/auth/authContext";
import { productCategoryGetAll } from "@/api/admin/adProductCategory";

export default function ProductForm(): JSX.Element {
  const { auth } = useAuth();
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

  // details
  const [details, setDetails] = useState<ProductDetailModel[]>([]);

  // dialog state
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [detailEditMode, setDetailEditMode] = useState<"create" | "edit">(
    "create"
  );
  const [editingDetailId, setEditingDetailId] = useState<string | null>(null);
  const [detailTitle, setDetailTitle] = useState("");
  const [detailContent, setDetailContent] = useState("");

  const [PRODUCT_CATEGORIES, setProductCategories] = useState<
    { id: string; name: string }[]
  >([]);
  const [LOAN_AMOUNTS, setLoanAmounts] = useState<
    { id: string; name: string }[]
  >([]);
  const [LOAN_TERMS, setLoanTerms] = useState<{ id: string; name: string }[]>(
    []
  );
  const [PRODUCT_DETAIL_CATEGORY, setProductDetailCategoryLabel] = useState<
    { id: string; name: string }[]
  >([]);
  const [detailCategory, setDetailCategory] = useState<string>("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [inactive, setInactive] = useState<string>("");

  useEffect(() => {
    const run = async () => {
      await initGetMData();
      await initCategory();
    };
    run();
  }, []);

  /* ================= LOAD EDIT – API NEW ================= */
  useEffect(() => {
    if (!isEdit || !id) return;

    const run = async () => {
      setInitialLoading(true);
      try {
        const res = await productsGetById(id);

        if (!res.isSuccess || !res.result) {
          useAlert.getState().showError("Không tìm thấy sản phẩm");
          return;
        }

        const data = res.result;

        setName(data.name);
        setCategoryId(data.productCategoryId);
        setLoanAmountId(String(data.loanAmountId));
        setLoanTermId(String(data.loanTermId));
        setImagePreview(data.imageUrl || null);
        setDetails(
          data.details.map(
            (d) =>
              ({
                productDetailCategoryId: d.productDetailCategoryId,
                title: d.title,
                content: d.content,
              } as ProductDetailModel)
          )
        );
      } finally {
        setInitialLoading(false);
      }
    };

    run();
  }, [isEdit, id]);

  const initGetMData = async () => {
    const res = await loadMData(
      `?_group=${MDataEnum_Group.PRODUCT_CATEGORY}&_group=${MDataEnum_Group.PRODUCT_AMOUNT}&_group=${MDataEnum_Group.PRODUCT_TIME}&_group=${MDataEnum_Group.PRODUCT_CATEGORY_DETAIL}`
    );

    if (!res.isSuccess) {
      useAlert.getState().showError(res.message || "Hủy thất bại");
      return;
    }

    const mdata = res.result || [];

    setLoanAmounts(
      mdata
        .filter((m) => m.group === MDataEnum_Group.PRODUCT_AMOUNT)
        .map((a) => ({ id: a.key, name: a.value }))
    );

    setLoanTerms(
      mdata
        .filter((m) => m.group === MDataEnum_Group.PRODUCT_TIME)
        .map((t) => ({ id: t.key, name: t.value }))
    );

    setProductDetailCategoryLabel(
      mdata
        .filter((m) => m.group === MDataEnum_Group.PRODUCT_CATEGORY_DETAIL)
        .map((d) => ({ id: d.key, name: d.value }))
    );
  };

  const initCategory = async () => {
    const res = await productCategoryGetAll();
    if (res.isSuccess && res.result)
      setProductCategories(res.result.map((c) => ({ id: c.id, name: c.name })));
  };

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const openCreateDetailDialog = () => {
    setDetailEditMode("create");
    setEditingDetailId(null);
    setDetailTitle("");
    setDetailContent("");
    setDetailDialogOpen(true);
  };

  const openEditDetailDialog = (item: ProductDetailModel) => {
    setDetailEditMode("edit");
    setEditingDetailId(item.id ?? "");
    setDetailTitle(item.title);
    setDetailContent(item.content);
    setDetailDialogOpen(true);
    setDetailCategory(item.productDetailCategoryId.toString());
  };

  const handleSaveDetail = () => {
    const trimmedTitle = detailTitle.trim();
    const trimmedContent = detailContent.trim();
    if (!trimmedTitle || !trimmedContent) return;

    if (detailEditMode === "create") {
      setDetails((prev) => [
        ...prev,
        {
          tempId: crypto.randomUUID(),
          productDetailCategoryId: Number(detailCategory),
          title: trimmedTitle,
          content: trimmedContent,
        } as ProductDetailModel,
      ]);
    } else if (editingDetailId) {
      setDetails((prev) =>
        prev.map((d) =>
          d.tempId === editingDetailId
            ? { ...d, title: trimmedTitle, content: trimmedContent }
            : d
        )
      );
    }

    setDetailDialogOpen(false);
  };

  /* ================= SUBMIT – API NEW ================= */
  const handleSubmit = async () => {
    if (!name.trim() || !categoryId) return;

    try {
      setLoading(true);

      let uploadedImageUrl: string | null = imagePreview;

      if (imageFile) {
        const uploadRes = await uploadImage(imageFile);
        if (uploadRes.isSuccess && uploadRes.result) {
          uploadedImageUrl = uploadRes.result.keyUrl;
        }
      }

      let res;
      if (isEdit && id) {
        const payloadUpdate = {
          name: name.trim(),
          productCategoryId: categoryId,
          loanAmountId: Number(loanAmountId),
          loanTermId: Number(loanTermId),
          imageUrl: uploadedImageUrl ?? "",
          inactive: inactive === "inactive",
          userName: auth.userName,
          details: details.map((d) => ({
            id: isEdit ? d.id : undefined,
            productDetailCategoryId: d.productDetailCategoryId,
            title: d.title,
            content: d.content,
          })),
        } as ProductUpdateRequest;
        res = await productUpdate(id, payloadUpdate);
      } else {
        const payloadCreate = {
          name: name.trim(),
          productCategoryId: categoryId,
          loanAmountId: Number(loanAmountId),
          loanTermId: Number(loanTermId),
          imageUrl: uploadedImageUrl ?? "",
          inactive: inactive === "inactive",
          userName: auth.userName,
          details: details.map((d) => ({
            id: isEdit ? d.id : undefined,
            productDetailCategoryId: d.productDetailCategoryId,
            title: d.title,
            content: d.content,
          })),
        } as ProductCreateRequest;

        res = await productCreate(payloadCreate);
      }

      if (res.isSuccess) {
        navigate(adminPaths.ADMIN_PRODUCT);
      } else {
        useAlert.getState().showError(res.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const pageTitle = isEdit ? "Sửa sản phẩm" : "Thêm sản phẩm";

  const handleDeleteDetail = (id: string) => {
    setDetails((prev) => prev.filter((x) => x.id !== id));
  };

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

            <div className="grid gap-4 md:grid-cols-2">
              <SelectBox
                label="Danh mục sản phẩm"
                value={categoryId}
                placeholder="-- Chọn danh mục --"
                options={PRODUCT_CATEGORIES}
                onChange={setCategoryId}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Tên sản phẩm</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên sản phẩm..."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <SelectBox
                label="Mức vay"
                value={loanAmountId}
                placeholder="-- Chọn mức vay --"
                options={LOAN_AMOUNTS}
                onChange={setLoanAmountId}
              />

              <SelectBox
                label="Thời hạn vay"
                value={loanTermId}
                placeholder="-- Chọn thời hạn vay --"
                options={LOAN_TERMS}
                onChange={setLoanTermId}
              />

              <SelectBox
                label="Trạng thái"
                value={inactive === "inactive" ? "inactive" : "active"}
                placeholder="-- Chọn trạng thái sản phẩm --"
                options={[
                  { id: "active", name: "Hiệu lực" },
                  { id: "inactive", name: "Không hiệu lực" },
                ]}
                onChange={setInactive}
              />
            </div>
          </div>

          {/* Hình ảnh */}
          <div className="space-y-4 rounded-md border p-4">
            <h2 className="text-lg font-semibold">Hình ảnh sản phẩm</h2>

            <div className="flex items-center gap-3">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="max-w-sm"
              />

              {imagePreview && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {imagePreview && (
              <div className="relative overflow-hidden rounded-md border">
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
          <h2 className="text-lg font-semibold">Chi tiết</h2>
          <Button type="button" onClick={openCreateDetailDialog}>
            Thêm mới
          </Button>
        </div>
        <ScrollArea className="h-[300px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px] text-center">STT</TableHead>
                <TableHead>Loại nội dung</TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Nội dung</TableHead>
                <TableHead className="w-40 text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {details.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Chưa có thông tin, nhấn "Thêm mới" để tạo.
                  </TableCell>
                </TableRow>
              ) : (
                details.map((d, index) => (
                  <TableRow key={d.id}>
                    <TableCell className="text-center">{index + 1}</TableCell>

                    <TableCell>
                      {
                        PRODUCT_DETAIL_CATEGORY.find(
                          (c) => c.id === String(d.productDetailCategoryId)
                        )?.name
                      }
                    </TableCell>

                    <TableCell>{d.title}</TableCell>

                    {/* CỘT NỘI DUNG */}
                    <TableCell className="max-w-[300px]">
                      <div className="line-clamp-2 text-sm text-muted-foreground">
                        {Array.isArray(d.content)
                          ? d.content.join(", ")
                          : d.content}
                      </div>
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
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                            >
                              Xóa
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                              <AlertDialogDescription>
                                Hành động này không thể hoàn tác. Nội dung sẽ bị
                                xóa vĩnh viễn.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteDetail(d.tempId ?? "")
                                }
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
              <SelectBox
                label="Loại nội dung"
                value={detailCategory}
                placeholder="-- Chọn loại nội dung --"
                options={PRODUCT_DETAIL_CATEGORY}
                onChange={setDetailCategory}
              />
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
