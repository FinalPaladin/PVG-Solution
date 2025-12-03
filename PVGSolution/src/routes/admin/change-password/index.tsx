import { changePassword } from "@/api/admin/adUser";
import { useAuth } from "@/auth/authContext";
import type { IRQ_ChangePasswordModel } from "@/models/admin/user.model";
import { useEffect, useState, type JSX } from "react";

export default function ChangePassword(): JSX.Element {
  const { auth } = useAuth();
  const [payload, setPayload] = useState<IRQ_ChangePasswordModel>({
    userName: auth.userName,
    currentPassword: "",
    newPassword: "",
  } as IRQ_ChangePasswordModel);
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    validateForm();
  }, [payload, confirmNewPassword]);

  const validateForm = () => {
    // if(!payload.userName)
    // {
    //     setMessage({
    //         type: "error",
    //         text: `Chưa nhập tài khoản`,
    //     });
    //     setIsValid(false);
    //     return;
    // }
    if (!payload.currentPassword) {
      setMessage({
        type: "error",
        text: `Chưa nhập mật khẩu cũ`,
      });
      setIsValid(false);
      return;
    }
    if (!payload.newPassword) {
      setMessage({
        type: "error",
        text: `Chưa nhập mật khẩu mới`,
      });
      setIsValid(false);
      return;
    }
    if (!confirmNewPassword) {
      setMessage({
        type: "error",
        text: `Chưa nhập xác nhận mật khẩu`,
      });
      setIsValid(false);
      return;
    }
    if (confirmNewPassword !== payload.newPassword) {
      setMessage({
        type: "error",
        text: `Xác nhận mật khẩu không khớp`,
      });
      setIsValid(false);
      return;
    }
    setMessage(null);
    setIsValid(true);
  };

  const handleChange = async () => {
    if (!isValid) {
      setMessage({
        type: "error",
        text: `Chưa hoàn tất nhập thông tin đổi mật khẩu`,
      });
      return;
    }
    try {
      const res = await changePassword(payload);
      if (!res.isSuccess) {
        throw new Error(res.message || `HTTP ${res.message}`);
      }

      setMessage({ type: "success", text: "Thay đổi mật khẩu thành công." });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";

      setMessage({
        type: "error",
        text: `Thay đổi mật khẩu thất bại: ${errorMessage}`,
      });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Đổi mật khẩu</h1>
      <div>
        {message && (
          <div
            className={`mb-4 px-4 py-2 rounded ${
              message.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
      {/* <div className="grid grid-cols-1">
                <span className="text-sm font-medium mb-1">Tài khoản:</span>
                <input type="text" className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                defaultValue={payload.userName}
                onChange={(e) => {setPayload({...payload, userName: e.target.value});}}/>
            </div> */}
      <div className="bg-white justify-content-center p-6 rounded shadow-sm grid grid-cols-1">
        <div className="grid grid-cols-1">
          <span className="text-sm font-medium mb-1">Mật khẩu cũ:</span>
          <input
            type="password"
            className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
            defaultValue={payload.currentPassword}
            onChange={(e) => {
              setPayload({ ...payload, currentPassword: e.target.value });
            }}
          />
        </div>
        <div className="grid grid-cols-1 mt-2">
          <span className="text-sm font-medium mb-1">Mật khẩu mới:</span>
          <input
            type="password"
            className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
            defaultValue={payload.newPassword}
            onChange={(e) => {
              setPayload({ ...payload, newPassword: e.target.value });
            }}
          />
        </div>
        <div className="grid grid-cols-1 mt-2">
          <span className="text-sm font-medium mb-1">
            Xác nhận mật khẩu mới:
          </span>
          <input
            type="password"
            className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
            defaultValue={confirmNewPassword}
            onChange={(e) => {
              setConfirmNewPassword(e.target.value);
            }}
          />
        </div>
        <div className="grid grid-cols-1">
          <div className="text-end">
            <button
              type="button"
              hidden={!isValid}
              disabled={!isValid}
              className="px-4 py-2 rounded-md border border-gray-200 bg-[#92B83D] text-white hover:bg-[#7DA22F] cursor-pointer"
              onClick={handleChange}
            >
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
