import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/authContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminPaths } from "@/commons/paths";
import type { ILoginRequest } from "@/models/admin/authen.model";
import { loginAsync } from "@/api/admin/adLogin";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // TODO: call API thật ở đây
      const res = await loginAsync({
        userName: userName,
        password: password,
      } as ILoginRequest);
      const token = res.result?.token ?? "";
      const permission = res.result?.permission ?? "";

      login({ token, userName , permission});
      navigate(adminPaths.ADMIN, { replace: true });
    } catch {
      setError("Đăng nhập thất bại. Vui lòng kiểm tra lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* LEFT: form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-10 lg:px-20 bg-white">
        <div className="max-w-md">
          <h1 className="text-3xl font-semibold mb-2">Đăng nhập</h1>
          <p className="text-gray-600 mb-8">
            Nhập thông tin bên dưới để đăng nhập hệ thống.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input
                id="username"
                placeholder="Nhập tên đăng nhập"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>

          <p className="mt-10 text-xs text-gray-400">
            Version REAPS.SIT.v8.50.00.251105
          </p>
        </div>
      </div>

      {/* RIGHT: image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-sky-100 via-blue-100 to-emerald-100" />

        {/* Hình minh hoạ – bro có thể đổi url khác nếu muốn */}
        <div className="relative h-full flex items-center justify-center p-10">
          <div className="max-w-xl w-full bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden">
            <div
              className="w-full h-72 bg-cover bg-center"
              style={{
                backgroundImage:
                  'url("https://images.pexels.com/photos/4968633/pexels-photo-4968633.jpeg")',
              }}
            />
            <div className="p-6 space-y-2">
              <p className="text-xs font-semibold uppercase text-emerald-600">
                Giải pháp tài chính
              </p>
              <h2 className="text-xl font-semibold">
                Quản lý vay thế chấp sổ đỏ, dòng tiền minh bạch
              </h2>
              <p className="text-sm text-gray-600">
                Theo dõi hợp đồng, lịch thanh toán và trạng thái giải ngân trên
                một hệ thống duy nhất.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
