import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { newsCreate, newsUpdate } from "@/api/admin/adNews.api";
import type { NewsCreateRequest } from "@/models/admin/news.model";
import { newsCategoryGetAll } from "@/api/admin/adNewsCategory";
import { mediaImageUpload } from "@/api/requestCustomer";
import NewsEditor from "@/components/Controls/Editor/editor";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/Controls/DatePicker/datePicker";

type Category = {
  id: string;
  name: string;
};

export default function NewsFormPage() {
  const navigate = useNavigate();
  const { newsId, categoryId: categoryFromUrl } = useParams();
  const isEdit = !!newsId;

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState(categoryFromUrl || "");
  const [slug] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const [form, setForm] = useState<NewsCreateRequest>({
    title: "",
    description: "",
    content: "",
    publishDate: "",
    expireDate: "",
    active: true,
    displayOrder: 0,
    isApproved: false,
  });

  useEffect(() => {
    newsCategoryGetAll().then((res) => {
      if (res.isSuccess && res.result) setCategories(res.result);
    });

    if (isEdit) {
      // TODO: load detail
    }
  }, [isEdit]);

  const setValue = (key: keyof NewsCreateRequest, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleUploadThumbnail = async (file: File) => {
    const res = await mediaImageUpload(file);
    if (res.isSuccess && res.result) {
      setImagePreview(res.result.publicUrl);
      setValue("thumbnailFile", {
        fileName: res.result.keyUrl,
        path: res.result.publicUrl,
      });
    }
  };

  const handleSubmit = async (approve = false) => {
    if (!categoryId) return;

    setLoading(true);

    const payload: NewsCreateRequest = {
      ...form,
      isApproved: approve ? true : form.isApproved,
    };

    if (isEdit && newsId) {
      await newsUpdate(newsId, categoryId, payload);
    } else {
      await newsCreate(categoryId, payload);
    }

    setLoading(false);
    navigate(-1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {isEdit ? "Cập nhật tin tức" : "Tạo tin tức"}
        </h1>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Hủy
          </Button>

          {isEdit && !form.isApproved && (
            <Button
              variant="secondary"
              disabled={loading}
              onClick={() => handleSubmit(true)}
            >
              Duyệt
            </Button>
          )}

          <Button onClick={() => handleSubmit(false)}>Lưu</Button>
        </div>
      </div>

      {/* Top section */}
      <div className="grid grid-cols-12 gap-6">
        {/* Thông tin tin tức */}
        <div className="col-span-8">
          <div className="rounded-md border bg-white p-6 space-y-5">
            <h2 className="text-lg font-semibold">Thông tin tin tức</h2>

            {/* Row 1: Danh mục | Trạng thái | Thứ tự hiển thị */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Danh mục</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="-- Chọn danh mục --" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Trạng thái</Label>
                <Select
                  value={form.active ? "active" : "inactive"}
                  onValueChange={(v) => setValue("active", v === "active")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hiệu lực</SelectItem>
                    <SelectItem value="inactive">Không hiệu lực</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Thứ tự hiển thị</Label>
                <Input
                  type="number"
                  className="w-full"
                  value={form.displayOrder}
                  onChange={(e) =>
                    setValue("displayOrder", Number(e.target.value))
                  }
                />
              </div>
            </div>

            {/* Row 2: Tiêu đề */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tiêu đề</Label>
              <Input
                placeholder="Nhập tiêu đề tin tức..."
                value={form.title}
                onChange={(e) => setValue("title", e.target.value)}
              />
            </div>

            {/* Slug (edit only) */}
            {isEdit && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Slug</Label>
                <Input value={slug} readOnly />
              </div>
            )}

            {/* Row 3: Miêu tả ngắn */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Miêu tả ngắn</Label>
              <Textarea
                placeholder="Nhập miêu tả ngắn..."
                value={form.description}
                onChange={(e) => setValue("description", e.target.value)}
              />
            </div>

            {/* Row 4: Ngày xuất bản | Ngày hết hạn */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Ngày xuất bản</label>
                <DatePicker
                  value={form.publishDate}
                  onChange={(v: unknown) => setValue("publishDate", v)}
                  placeholder="Chọn ngày xuất bản"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Ngày hết hạn</label>
                <DatePicker
                  value={form.expireDate}
                  onChange={(v: unknown) => setValue("expireDate", v)}
                  placeholder="Chọn ngày hết hạn"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hình ảnh */}
        <div className="col-span-4">
          <div className="rounded-md border bg-white p-6 space-y-4">
            <h2 className="text-lg font-semibold">Hình ảnh đại diện</h2>

            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files && handleUploadThumbnail(e.target.files[0])
              }
            />

            {imagePreview && (
              <img
                src={imagePreview}
                className="h-40 w-full rounded-md border object-cover"
              />
            )}
          </div>
        </div>
      </div>

      {/* Content full width */}
      <div className="rounded-md border bg-white p-6 space-y-4">
        <h2 className="text-lg font-semibold">Nội dung tin tức</h2>

        <NewsEditor
          value={form.content}
          onChange={(html) => setValue("content", html)}
        />
      </div>
    </div>
  );
}
