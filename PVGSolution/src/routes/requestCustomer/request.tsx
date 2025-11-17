import React, { useState, type JSX } from "react";

type FormState = {
  fullname: string;
  phone: string;
  address: string;
  redBookAddress: string;
};

export default function RequestCustomerPage(): JSX.Element {
  const [form, setForm] = useState<FormState>({
    fullname: "",
    phone: "",
    address: "",
    redBookAddress: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function onChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  function validate(): string | null {
    if (!form.fullname.trim()) return "Vui lòng nhập Họ & Tên";
    if (!form.phone.trim()) return "Vui lòng nhập SĐT";
    // simple phone check
    if (!/^[0-9+()\\s-]{7,20}$/.test(form.phone.trim()))
      return "Số điện thoại không hợp lệ";
    // address optional? requirement didn't state mandatory — keep it optional, but you can make required:
    // if (!form.address.trim()) return 'Vui lòng nhập Địa chỉ';
    return null;
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setMessage(null);
    const err = validate();
    if (err) {
      setMessage({ type: "error", text: err });
      return;
    }

    setLoading(true);
    try {
      // Build payload as array of key/value objects with phone included per example
      const payload = {
        data: [
          { phone: form.phone, key: "fullname", value: form.fullname },
          { phone: form.phone, key: "phone", value: form.phone },
          { phone: form.phone, key: "address", value: form.address },
          {
            phone: form.phone,
            key: "redBookAddress",
            value: form.redBookAddress,
          },
        ],
      };

      const res = await fetch("/api/request_customer/Save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      // try parse JSON response
      // let result: unknown = null;
      // try {
      //   result = await res.json();
      // } catch {
      //   result = null;
      // }

      setMessage({ type: "success", text: "Gửi yêu cầu thành công." });
      // optionally clear form:
      setForm({ fullname: "", phone: "", address: "", redBookAddress: "" });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";

      setMessage({
        type: "error",
        text: `Gửi thất bại: ${errorMessage}`,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white p-6 rounded-md shadow-sm"
    >
      <h2 className="text-xl font-semibold mb-4">Gửi yêu cầu khách hàng</h2>

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

      <div className="grid grid-cols-1 gap-4">
        <label className="flex flex-col">
          <span className="text-sm font-medium mb-1">Họ & Tên</span>
          <input
            type="text"
            value={form.fullname}
            onChange={(e) => onChange("fullname", e.target.value)}
            className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
            placeholder="Nhập họ và tên"
            required
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-medium mb-1">SĐT</span>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
            placeholder="Nhập số điện thoại"
            required
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-medium mb-1">Địa chỉ</span>
          <input
            type="text"
            value={form.address}
            onChange={(e) => onChange("address", e.target.value)}
            className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
            placeholder="Số nhà, đường, quận, TP"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-medium mb-1">Địa chỉ sổ đỏ</span>
          <input
            type="text"
            value={form.redBookAddress}
            onChange={(e) => onChange("redBookAddress", e.target.value)}
            className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
            placeholder="Số nhà, đường, quận, TP (Địa chỉ trên sổ đỏ)"
          />
        </label>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className={`inline-flex items-center justify-center px-4 py-2 rounded-md font-medium ${
            loading
              ? "bg-gray-200 text-gray-700"
              : "bg-[#92B83D] text-white hover:bg-[#7DA22F]"
          }`}
        >
          {loading ? "Đang gửi..." : "Gửi yêu cầu"}
        </button>

        <button
          type="button"
          onClick={() =>
            setForm({
              fullname: "",
              phone: "",
              address: "",
              redBookAddress: "",
            })
          }
          className="px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          Xóa
        </button>
      </div>
    </form>
  );
}
