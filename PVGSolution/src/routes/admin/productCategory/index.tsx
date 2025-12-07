import type { JSX } from "react";
import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

type CategoryStatus = "active" | "inactive";

interface ProductCategoryItem {
  id: string;
  name: string;
  status: CategoryStatus;
  createdAt: string;
  createdBy: string;
}

/**
 * Fake data + fake API search
 * Replace bằng API thật của ông
 */
const ALL_CATEGORIES: ProductCategoryItem[] = [
  {
    id: "1",
    name: "Điện thoại",
    status: "active",
    createdAt: "2025-01-10T10:30:00Z",
    createdBy: "Admin",
  },
  {
    id: "2",
    name: "Laptop",
    status: "inactive",
    createdAt: "2025-02-05T08:15:00Z",
    createdBy: "Admin",
  },
  {
    id: "3",
    name: "Phụ kiện",
    status: "active",
    createdAt: "2025-03-20T14:00:00Z",
    createdBy: "User A",
  },
];

async function searchCategories(params: {
  keyword?: string;
}): Promise<ProductCategoryItem[]> {
  console.log("Search categories với params:", params);
  await new Promise((r) => setTimeout(r, 300)); // giả lập call API

  const keyword = (params.keyword ?? "").trim().toLowerCase();
  if (!keyword) return ALL_CATEGORIES;

  return ALL_CATEGORIES.filter((c) => c.name.toLowerCase().includes(keyword));
}

// Fake update API
async function updateCategory(
  id: string,
  data: Partial<Pick<ProductCategoryItem, "name" | "status">>
): Promise<void> {
  console.log("Update category", id, data);
  await new Promise((resolve) => setTimeout(resolve, 300));
}

// Fake create API
async function createCategory(name: string): Promise<ProductCategoryItem> {
  console.log("Create category", name);
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    id: crypto.randomUUID(),
    name,
    status: "active",
    createdAt: new Date().toISOString(),
    createdBy: "Admin",
  };
}

export default function ProductCategory(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState<ProductCategoryItem[]>([]);
  const [listLoading, setListLoading] = useState(false);

  const [searchInput, setSearchInput] = useState("");

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState<"create" | "edit">("create");
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategoryItem | null>(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(false); // dùng cho create/update/inactive

  // ⬇️ Effect: mỗi khi URL searchParams đổi -> đọc keyword và call API search
  useEffect(() => {
    const keyword = searchParams.get("keyword") ?? "";

    // sync lại value lên input
    setSearchInput(keyword);

    const run = async () => {
      setListLoading(true);
      try {
        const data = await searchCategories({ keyword });
        setCategories(data);
      } finally {
        setListLoading(false);
      }
    };

    run();
  }, [searchParams]);

  const handleSearch = () => {
    const keyword = searchInput.trim();

    const params = new URLSearchParams(searchParams);
    if (keyword) {
      params.set("keyword", keyword);
    } else {
      params.delete("keyword");
    }

    // Thay đổi URL -> trigger useEffect ở trên
    setSearchParams(params);
  };

  const openCreateDialog = () => {
    setEditMode("create");
    setSelectedCategory(null);
    setEditName("");
    setIsEditDialogOpen(true);
  };

  const openEditDialog = (category: ProductCategoryItem) => {
    setEditMode("edit");
    setSelectedCategory(category);
    setEditName(category.name);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    const trimmed = editName.trim();
    if (!trimmed) return;

    try {
      setLoading(true);
      if (editMode === "create") {
        const newCat = await createCategory(trimmed);
        // có thể call lại searchCategories theo keyword hiện tại nếu muốn sync với server thật
        setCategories((prev) => [...prev, newCat]);
      } else if (editMode === "edit" && selectedCategory) {
        await updateCategory(selectedCategory.id, { name: trimmed });
        setCategories((prev) =>
          prev.map((c) =>
            c.id === selectedCategory.id ? { ...c, name: trimmed } : c
          )
        );
      }
      setIsEditDialogOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (category: ProductCategoryItem) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory) return;
    try {
      setLoading(true);
      const newStatus: CategoryStatus =
        selectedCategory.status === "active" ? "inactive" : "active";

      await updateCategory(selectedCategory.id, { status: newStatus });

      setCategories((prev) =>
        prev.map((c) =>
          c.id === selectedCategory.id ? { ...c, status: newStatus } : c
        )
      );
      setIsDeleteDialogOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString("vi-VN");
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <h1 className="text-2xl font-semibold">Danh mục sản phẩm</h1>
      {/* Header actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          <div className="flex flex-1 items-center gap-2">
            <Input
              placeholder="Nhập tên danh mục sản phẩm..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <Button type="button" onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              Tìm kiếm
            </Button>
          </div>
        </div>

        <Button type="button" onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm mới
        </Button>
      </div>

      {/* Table wrapper full height */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border">
        <ScrollArea className="h-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px] text-center">STT</TableHead>
                <TableHead>Tên danh mục</TableHead>
                <TableHead className="w-[140px] text-center">
                  Trạng thái
                </TableHead>
                <TableHead className="w-[200px]">Ngày tạo</TableHead>
                <TableHead className="w-40">Người tạo</TableHead>
                <TableHead className="w-40 text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((c, index) => (
                  <TableRow key={c.id}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={c.status === "active" ? "default" : "outline"}
                        className={
                          c.status === "active"
                            ? "bg-emerald-500/90 hover:bg-emerald-500"
                            : ""
                        }
                      >
                        {c.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(c.createdAt)}</TableCell>
                    <TableCell>{c.createdBy}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          type="button"
                          onClick={() => openEditDialog(c)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          type="button"
                          onClick={() => openDeleteDialog(c)}
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Edit / Create dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editMode === "create"
                ? "Thêm danh mục sản phẩm"
                : "Sửa danh mục"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tên danh mục</label>
            <Input
              autoFocus
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Nhập tên danh mục..."
            />
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleSaveEdit}
              disabled={!editName.trim() || loading}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete / Inactivate confirm */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedCategory?.status === "active"
                ? "Inactive danh mục?"
                : "Active lại danh mục?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedCategory?.status === "active"
                ? "Danh mục này sẽ bị chuyển sang trạng thái Inactive. Bạn có chắc chắn muốn tiếp tục?"
                : "Danh mục này sẽ được chuyển sang trạng thái Active. Bạn có chắc chắn muốn tiếp tục?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={loading}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
