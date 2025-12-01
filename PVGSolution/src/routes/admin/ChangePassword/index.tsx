
import type { JSX } from "react";

export default function ChangePassword(): JSX.Element {
    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">Đổi mật khẩu</h1>
            <div className="grid grid-cols-1 gap-4">
                <div className="bg-white p-6 rounded shadow-sm">
                Total requests: <span className="font-medium">—</span>
                </div>
            </div>
        </div>
    );
}