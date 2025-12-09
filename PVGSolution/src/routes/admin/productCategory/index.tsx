import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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

import {
  productCategorySearch,
  productCategoryUpdate,
  productCategoryDelete,
  productCategorySave,
} from "@/api/admin/adProductCategory";
import type {
  ISaveProductCategoryRequest,
  IUpdateProductCategoryRequest,
} from "@/models/admin/productCategory.model";
import { useAuth } from "@/auth/authContext";
import { useAlert } from "@/stores/useAlertStore";

type CategoryStatus = "active" | "inactive";

interface ProductCategoryItem {
  id: string;
  name: string;
  status: CategoryStatus;
  createdDate: string;
  createdByName: string;
}

interface FetchResult {
  items: ProductCategoryItem[];
  total: number;
}

async function fetchCategoriesFromApi(
  keyword: string,
  page: number,
  pageSize: number
): Promise<FetchResult> {
  const params = new URLSearchParams();
  if (keyword) params.set("keyword", keyword);
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));

  const qs = `?${params.toString()}`;
  const res = await productCategorySearch(qs);

  // support multiple shapes for items and total count
  const rawItems = res.result?.items ?? [];
  const total = res.result?.totalItems ?? rawItems.length;

  const items = rawItems.map((it) => ({
    id: it.id,
    name: it.name,
    status: it.inactive ? "inactive" : "active",
    createdDate: new Date(it.createdDate).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    createdByName: it.createdByName ?? "",
  })) as ProductCategoryItem[];

  return { items, total };
}

export default function ProductCategory(): JSX.Element {
  const { auth } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState<ProductCategoryItem[]>([]);
  const [listLoading, setListLoading] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState<"create" | "edit">("create");
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategoryItem | null>(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isInactive, setIsInactive] = useState(false);

  // pagination state stored in URL so back/forward/bookmark works
  const pageParam = parseInt(searchParams.get("page") ?? "1", 10);
  const pageSizeParam = parseInt(searchParams.get("pageSize") ?? "10", 10);

  const [page, setPage] = useState<number>(
    isNaN(pageParam) || pageParam < 1 ? 1 : pageParam
  );
  const [pageSize, setPageSize] = useState<number>(
    isNaN(pageSizeParam) || pageSizeParam < 1 ? 10 : pageSizeParam
  );
  const [total, setTotal] = useState<number>(0);

  // keep local state in sync when user presses back/forward or URL changed externally
  useEffect(() => {
    const p = parseInt(searchParams.get("page") ?? "1", 10);
    const ps = parseInt(searchParams.get("pageSize") ?? "10", 10);

    setPage(isNaN(p) || p < 1 ? 1 : p);
    setPageSize(isNaN(ps) || ps < 1 ? 10 : ps);

    const keyword = searchParams.get("keyword") ?? "";
    setSearchInput(keyword);
    // fetch will be triggered by separate effect below
  }, [searchParams]);

  // fetch when keyword/page/pageSize changes
  useEffect(() => {
    const keyword = searchParams.get("keyword") ?? "";

    const run = async () => {
      setListLoading(true);
      try {
        const { items, total: tot } = await fetchCategoriesFromApi(
          keyword,
          page,
          pageSize
        );
        setCategories(items);
        setTotal(tot);
      } catch (err) {
        console.error("Failed to load categories", err);
        setCategories([]);
        setTotal(0);
      } finally {
        setListLoading(false);
      }
    };

    run();
  }, [searchParams, page, pageSize]);

  // new helper: apply search by keyword and force a URL change (with timestamp)
  const applySearch = (keyword: string | null) => {
    const params = new URLSearchParams(searchParams);

    if (keyword && keyword.trim()) params.set("keyword", keyword.trim());
    else params.delete("keyword");

    // reset to page 1 when searching/clearing
    params.set("page", "1");

    // only set pageSize if not default 10 to keep URLs clean
    if (pageSize && pageSize !== 10) params.set("pageSize", String(pageSize));
    else params.delete("pageSize");

    // add timestamp to force URL change even when keyword hasn't changed
    params.set("_ts", String(Date.now()));

    setSearchParams(params);
  };

  const handleSearch = () => {
    applySearch(searchInput);
  };

  // ----- CHANGED: clear button now only clears input and focuses it, DOES NOT reload data -----
  const handleClearSearch = () => {
    setSearchInput("");
    // focus input after clearing
    if (inputRef.current) inputRef.current.focus();
  };

  const goToPage = (p: number) => {
    const lastPage = Math.max(1, Math.ceil(total / pageSize));
    const np = Math.max(1, Math.min(p, lastPage));
    setPage(np);
    const params = new URLSearchParams(searchParams);
    if (np > 1) params.set("page", String(np));
    else params.delete("page");
    // keep pageSize if present
    if (pageSize && pageSize !== 10) params.set("pageSize", String(pageSize));
    else params.delete("pageSize");
    // add ts so effect definitely runs
    params.set("_ts", String(Date.now()));
    setSearchParams(params);
  };

  const changePageSize = (ps: number) => {
    setPageSize(ps);
    const params = new URLSearchParams(searchParams);
    if (ps && ps !== 10) params.set("pageSize", String(ps));
    else params.delete("pageSize");
    // when pageSize changes, reset to page 1
    params.set("page", "1");
    params.set("_ts", String(Date.now()));
    setSearchParams(params);
  };

  const openCreateDialog = () => {
    setEditMode("create");
    setSelectedCategory(null);
    setEditName("");
    setIsEditDialogOpen(true);
    setIsInactive(false);
  };

  const openEditDialog = (category: ProductCategoryItem) => {
    setEditMode("edit");
    setSelectedCategory(category);
    setEditName(category.name);
    setIsEditDialogOpen(true);
    setIsInactive(category.status === "inactive");
  };

  const handleSaveEdit = async () => {
    const trimmed = editName.trim();
    if (!trimmed) return;

    try {
      setLoading(true);
      if (editMode === "create") {
        const payload = {
          name: trimmed,
          inactive: isInactive,
          createdBy: auth.userName ?? "",
        } as ISaveProductCategoryRequest;

        const res = await productCategorySave(payload);

        if (!res.isSuccess) {
          useAlert.getState().showError(res.message || "Lưu thất bại");
          return;
        }

        useAlert.getState().show("Lưu thành công", "success");

        // create local entity (note: server may return id in result)
        const newCat: ProductCategoryItem = {
          id: res.result || String(Date.now()),
          name: trimmed,
          status: payload.inactive ? "inactive" : "active",
          createdDate: new Date().toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          createdByName: payload.createdBy || "",
        };

        // If we are on first page, prepend; otherwise navigate to first page to show it
        if (page === 1) {
          setCategories((prev) => [newCat, ...prev]);
        } else {
          // go to first page so user can immediately see new item
          goToPage(1);
        }
        setTotal((t) => t + 1);
      } else if (editMode === "edit" && selectedCategory) {
        const payload = {
          id: selectedCategory.id,
          name: trimmed,
          inactive: isInactive,
          createdBy: auth.userName ?? "",
        } as IUpdateProductCategoryRequest;
        const res = await productCategoryUpdate(payload);
        if (!res.isSuccess) {
          useAlert.getState().showError(res.message || "Cập nhật thất bại");
          return;
        }

        useAlert.getState().show("Cập nhật thành công", "success");

        setCategories((prev) =>
          prev.map((c) =>
            c.id === selectedCategory.id
              ? {
                  ...c,
                  name: trimmed,
                  status: isInactive ? "inactive" : "active",
                }
              : c
          )
        );
      }
      setIsEditDialogOpen(false);
    } catch {
      useAlert.getState().showError("Cập nhật thất bại");
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

      // Toggle inactive state instead of hard delete
      const newStatus: CategoryStatus =
        selectedCategory.status === "active" ? "inactive" : "active";

      const res = await productCategoryDelete(selectedCategory.id);
      if (!res.isSuccess) {
        useAlert.getState().showError(res.message || "Hủy thất bại");
      }

      useAlert.getState().show("Cập nhật thành công", "success");

      setCategories((prev) =>
        prev.map((c) =>
          c.id === selectedCategory.id ? { ...c, status: newStatus } : c
        )
      );
      setIsDeleteDialogOpen(false);
    } catch {
      useAlert.getState().showError("Lỗi hệ thống, vui lòng thử lại sau");
    } finally {
      setLoading(false);
    }
  };

  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(total, page * pageSize);

  return (
    <div className="flex h-full flex-col gap-4">
      <h1 className="text-2xl font-semibold">Danh mục sản phẩm</h1>
      {/* Header actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          <div className="flex flex-1 items-center gap-2">
            <div className="flex w-full items-center gap-3">
              {/* INPUT FULL WIDTH */}
              <div className="relative flex-1">
                <Input
                  ref={inputRef}
                  placeholder="Nhập tên danh mục sản phẩm..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  className="w-full pr-10"
                />
                {searchInput !== "" && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="
                      absolute right-3 top-1/2 -translate-y-1/2 
                      p-1 
                      text-gray-500 
                      hover:text-gray-800 
                      transition 
                      rounded 
                      bg-transparent
                    "
                    aria-label="Clear input"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* NÚT SEARCH */}
              <Button type="button" onClick={handleSearch} className="shrink-0">
                <Search className="mr-2 h-4 w-4" />
                Tìm kiếm
              </Button>
            </div>
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
                    <TableCell className="text-center">
                      {(page - 1) * pageSize + index + 1}
                    </TableCell>
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
                    <TableCell>{c.createdDate}</TableCell>
                    <TableCell>{c.createdByName}</TableCell>
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

      {/* Pagination controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          {total === 0
            ? "0 items"
            : `Hiển thị ${startItem} - ${endItem} trên ${total} mục`}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="outline"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1 || listLoading}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-2">
              <span>{page}</span>
              <span className="mx-1">/</span>
              <span>{lastPage}</span>
            </div>
            <Button
              size="icon"
              variant="outline"
              onClick={() => goToPage(page + 1)}
              disabled={page >= lastPage || listLoading}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm">Kết quả / Trang</label>
            <select
              value={pageSize}
              onChange={(e) => changePageSize(parseInt(e.target.value, 10))}
              className="rounded border px-2 py-1"
              disabled={listLoading}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
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
            <div>
              <label className="text-sm font-medium mr-2">Trạng thái</label>
              <select
                value={isInactive ? "inactive" : "active"}
                onChange={(e) => setIsInactive(e.target.value === "inactive")}
                className="ml-2 rounded border px-2 py-1"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
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
