import { changePassword } from "@/api/admin/adUser";
import { useAuth } from "@/auth/authContext";
import { Button } from "@/components/ui/button";
import type { IRQ_ChangePasswordModel } from "@/models/admin/user.model";
import { useAlert } from "@/stores/useAlertStore";
import { Eye, EyeOff, RotateCcwKey } from "lucide-react";
import { useState, type JSX } from "react";

const eyePw = {
  old: false,
  new: false,
  confirm: false
}

export default function ChangePassword(): JSX.Element {
  const { auth } = useAuth();
  const [payload, setPayload] = useState<IRQ_ChangePasswordModel>({
    userName: auth.userName,
    currentPassword: "",
    newPassword: "",
  } as IRQ_ChangePasswordModel);
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [eye, setEye] = useState(eyePw);

  const validateForm = () => {
    if (!payload.currentPassword) {
      useAlert.getState().show(`Chưa nhập mật khẩu cũ`, "warning");      
      return false;
    }
    if (!payload.newPassword) {
      useAlert.getState().show(`Chưa nhập mật khẩu mới`, "warning"); 
      return false;
    }
    if (!confirmNewPassword) {
      useAlert.getState().show(`Chưa nhập xác nhận mật khẩu`, "warning"); 
      return false;
    }
    if (confirmNewPassword !== payload.newPassword) {
      useAlert.getState().show(`Xác nhận mật khẩu không khớp`, "warning"); 
      return false;
    } 
    return true;
  };

  const handleChange = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      const res = await changePassword(payload);
      if (!res.isSuccess) {
        throw new Error(res.message || `HTTP ${res.message}`);
      }

      useAlert.getState().show(`Thay đổi mật khẩu thành công`, "success");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";

      useAlert.getState().showError(`Thay đổi mật khẩu thất bại: ${errorMessage}`);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Title */}
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="inline-block h-6 w-1 rounded-full bg-gradient-to-b from-green-500 to-green-700" />
        Đổi mật khẩu
      </h1>
      {/* Card */}
      <div className="bg-white p-5 sm:p-6 rounded-lg shadow-sm space-y-4">
        {/* Old password */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Mật khẩu cũ
          </label>
          <div className="relative">
            <input
              type={eye.old ? "text" : "password"}
              value={payload.currentPassword}
              onChange={(e) =>
                setPayload({ ...payload, currentPassword: e.target.value })
              }
              className="w-full h-10 rounded-md border border-gray-300 px-3 pr-10 text-sm
                        focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
            />
            <button
              type="button"
              onClick={() => setEye({ ...eye, old: !eye.old })}
              className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
            >
              {eye.old ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* New password */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Mật khẩu mới
          </label>
          <div className="relative">
            <input
              type={eye.new ? "text" : "password"}
              value={payload.newPassword}
              onChange={(e) =>
                setPayload({ ...payload, newPassword: e.target.value })
              }
              className="w-full h-10 rounded-md border border-gray-300 px-3 pr-10 text-sm
                        focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
            />
            <button
              type="button"
              onClick={() => setEye({ ...eye, new: !eye.new })}
              className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
            >
              {eye.new ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm password */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Xác nhận mật khẩu mới
          </label>
          <div className="relative">
            <input
              type={eye.confirm ? "text" : "password"}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full h-10 rounded-md border border-gray-300 px-3 pr-10 text-sm
                        focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
            />
            <button
              type="button"
              onClick={() => setEye({ ...eye, confirm: !eye.confirm })}
              className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
            >
              {eye.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Action */}
        <div className="pt-2">
          <Button
            type="button"
            onClick={handleChange}
            className="inline-flex items-center justify-center gap-2
                      w-full sm:w-auto
                      px-4 py-2 rounded-md font-medium
                      bg-[#92B83D] text-white
                      hover:bg-[#7DA22F]
                      disabled:bg-gray-200 disabled:text-gray-500"
          >
            <RotateCcwKey className="h-5 w-5" />
            Đổi mật khẩu
          </Button>
        </div>
      </div>
    </div>
  );
}
