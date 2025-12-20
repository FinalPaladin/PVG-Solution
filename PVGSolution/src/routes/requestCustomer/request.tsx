import React, { useEffect, useState, type JSX } from "react";
import { insertRequestCustomer, RemoveImageRequestCustomer, SendEmailRequest, UploadImageRequestCustomer } from "@/api/requestCustomer";
import type { IResponseUpdateImage } from "@/models/requestCustomer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Recycle, Send } from "lucide-react";
import { useAlert } from "@/stores/useAlertStore";
import imageCompression from 'browser-image-compression';
import { ProgressBar } from "@/components/ui/progress-bar";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import type { IRQ_InserRequestCustomerModel, IRQ_RemoveImageRequestCustomerModel, IRS_InserRequestCustomerModel, IRS_UploadImageRequestCustomerModel } from "@/models/admin/requestCustomer";
import { useNavigate } from "react-router-dom";
import { paths } from "@/commons/paths";
import { useParams } from "react-router-dom";

const matialStatus = [
  {code: "", name: "Chọn"},
  {code: "single", name: "Độc thân"},
  {code: "married", name: "Đã kết hôn"},
  {code: "divorced", name: "Đã ly dị"},
];

const salaryIncom = [
  {code: "Không có thu nhập từ lương", name: "Không có thu nhập từ lương"},
  {code: "Chuyển khoản", name: "Chuyển khoản"},
  {code: "Tiền mặt", name: "Tiền mặt"},
];

const monthIncom = [
  {code: "Dưới 3 triệu", name: "Dưới 3 triệu"},
  {code: "Từ 3 - 5 triệu", name: "Từ 3 - 5 triệu"},
  {code: "Từ 6 - 10 triệu", name: "Từ 6 - 10 triệu"},
  {code: "Từ 11 - 20 triệu", name: "Từ 11 - 20 triệu"},
  {code: "Từ 21 - 50 triệu", name: "Từ 21 - 50 triệu"},
  {code: "Trên 50 triệu", name: "Trên 50 triệu"},
];

type FormState = {
  fullname: string;
  phone: string;
  address: string;
  redbookaddress: string;
  birthday: string;
  age: number;
  gender: string;
  cccd: string;
  cmnd: string;
  placeofissue: string;
  dateofissue: string;
  nationality: string;
  maritalstatus: string;
  email: string;
  companyname: string;
  jobtitle: string;
  department: string;
  companyphone: string;
  salaryincome: string;
  monthincome: string;
  loanpurpose: string;
  outstandingloansatotherbanks: string;
  loanamountrequested: string;
  collateral: string;
  loanproducttype: string;
  otherinfo: string;
  otherincome: string;
};

type UploadedImage = IResponseUpdateImage;

const tabRequest = [
  {code: 1, name: "THÔNG TIN CÁ NHÂN", percent: 0, text: "Bước 1/5"},
  {code: 2, name: "THÔNG TIN LIÊN LẠC", percent: 25, text: "Bước 2/5"},
  {code: 3, name: "THÔNG TIN VIỆC LÀM", percent: 50, text: "Bước 3/5"},
  {code: 4, name: "THÔNG TIN TÍN DỤNG", percent: 75, text: "Bước 4/5"},
  {code: 5, name: "TẢI HÌNH ẢNH", percent: 99, text: "Bước 5/5"},
]

const today = new Date();
const todayString =
  today.getFullYear() +
  "-" +
  String(today.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(today.getDate()).padStart(2, "0");
const defaultForm = {
    fullname: "",
    phone: "",
    address: "",
    redbookaddress: "",
    age: 0,
    birthday: todayString,
    gender: "Nam",
    cccd: "",
    cmnd: "",
    placeofissue: "",
    dateofissue: todayString,
    nationality: "Việt Nam",
    email: "",
    maritalstatus: matialStatus[0].code,
    companyname: "",
    jobtitle: "",
    department: "",
    companyphone: "",
    salaryincome: salaryIncom[0].code,
    monthincome: monthIncom[0].code,
    loanpurpose: "",
    outstandingloansatotherbanks: "",
    loanamountrequested: "",
    collateral: "",
    loanproducttype: "",
    otherinfo: "",
    otherincome: "",
  } as FormState;

const optionsResizeImg = {
    maxSizeMB: 1, // tối đa 1MB sau khi nén
    maxWidthOrHeight: 1920,        // chỉ giới hạn cạnh lớn
    useWebWorker: true,
    initialQuality: 0.8,          // 🔑 quan trọng
    fileType: "image/jpeg",
  };
  
export default function RequestCustomerPage(): JSX.Element {
  const navigate = useNavigate();
  const { idproduct } = useParams<{ idproduct: string }>();
  const [form, setForm] = useState<FormState>(defaultForm);

  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState<UploadedImage[]>([]);

  const [tab, setTab] = useState(tabRequest[0]);

  const { executeRecaptcha } = useGoogleReCaptcha();

  const [requestCode, setRequestCode] = useState("");
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, []);

  const compressImage = async (file: File) => {
    return await imageCompression(file, optionsResizeImg);
  }

  function onChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  function validate(): string | null {
    if (!form.fullname.trim()) return "Vui lòng nhập Họ & Tên";
    if (!form.phone.trim()) return "Vui lòng nhập SĐT";
    if (!/^[0-9+()\s-]{7,20}$/.test(form.phone.trim()))
      return "Số điện thoại không hợp lệ";
    return null;
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const err = validate();
    if (err) {
      useAlert.getState().showError(err);
      return;
    }

    setLoading(true);
    try {
      if (!executeRecaptcha) return;
      const token = await executeRecaptcha("request");

      if(!form.birthday)
      {
        useAlert.getState().show("Ngày sinh chưa nhập hoàn tất.", "warning");
        return;
      }

      if(!form.dateofissue)
      {
        useAlert.getState().show("Ngày cấp CCCD chưa nhập hoàn tất.", "warning");
        return;
      }

      const ageStr = form.age.toString();

      const data = Object.entries(form).map(([key, value]) => ({
        key: key,
        value: (key === 'age') ? ageStr : value
      }));

      const payload = {
        token: token,
        fullName: form.fullname,
        phone: form.phone,
        productId: idproduct ? idproduct : "",
        data: data,
      } as IRQ_InserRequestCustomerModel;

      const res = await insertRequestCustomer(payload);

      if (!res.isSuccess) {
        throw new Error(res.message || `HTTP lỗi`);
      }

      const dataRes = res.result as IRS_InserRequestCustomerModel;

      if(!dataRes)
      {
        throw new Error(res.message || `HTTP lỗi`);
      }
      
      useAlert.getState().show("Gửi yêu cầu thành công.", "success");
      setRequestCode(dataRes?.requestCode);
      setTab(tabRequest[tabRequest.length - 1]);
      // setForm(defaultForm);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error";

      useAlert.getState().showError(`Gửi thất bại: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectFiles(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainSlots = 5 - images.length;
    const toUpload = Array.from(files).slice(0, remainSlots);
    
    const listImg = [...images] as UploadedImage[];
    for (const file of toUpload) {
      const newFile = await compressImage(file);

      const payload = new FormData();
      payload.append("ImgFile", newFile);
      payload.append("RequestCode", requestCode);
      const res = await UploadImageRequestCustomer(payload);
      if(res.isSuccess)
      {
        const datares = res.result as IRS_UploadImageRequestCustomerModel;

        listImg.push({
          file: file,
          keyUrl: datares.key,
          publicUrl: datares.publicUrl
        } as UploadedImage);
      }
    }
    setImages(listImg);

    // reset input để có thể chọn lại cùng file
    e.target.value = "";
  }

  async function handleRemoveImage(img: UploadedImage) {
    const res = await RemoveImageRequestCustomer({
      key: img.keyUrl,
      requestCode: requestCode
    } as IRQ_RemoveImageRequestCustomerModel);
    if(!res.isSuccess)
    {
      useAlert.getState().show("Xóa ảnh không thành công.", "warning");
    }
    setImages((prev) => prev.filter((x) => x.publicUrl !== img.publicUrl));
  }

  const handleSendEmail = async () => {
    try
    {
      const res = await SendEmailRequest(requestCode);
      if (!res.isSuccess) {
        throw new Error(res.message || `HTTP lỗi`);
      }

      useAlert.getState().show("Yêu cầu đã hoàn tất.", "success");
      navigate(paths.SUCCESS)
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error";

      useAlert.getState().showError(`Gửi thất bại: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 mt-8">
      {/* form align left, không card wrapper */}
      <form onSubmit={handleSubmit} className="max-w-xl">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Đăng ký tư vấn hỗ trợ
          </h2>
          <div className="mt-2 h-[2px] w-12 bg-[#92B83D] rounded-full"></div>
        </div>
        <div className="space-y-4">

        {/* Step title */}
        <div className="flex items-center justify-between">
          <h4 className="text-base font-semibold text-gray-800">
            {tab.name}
          </h4>

          {!requestCode && (
            <div className="flex gap-2">
              <Button
                type="button"
                disabled={tab === tabRequest[0]}
                onClick={() => {
                  if (tab.code > tabRequest[0].code) {
                    const prevTab = tabRequest.find(x => x.code === tab.code - 1);
                    if (prevTab) setTab(prevTab);
                  }
                }}
                className="h-9 px-3 rounded-md border border-gray-300
                          text-gray-700 bg-white
                          hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Trở lại
              </Button>

              <Button
                type="button"
                disabled={tab === tabRequest[tabRequest.length - 2]}
                onClick={() => {
                  if (tab.code < tabRequest[tabRequest.length - 1].code) {
                    const nextTab = tabRequest.find(x => x.code === tab.code + 1);
                    if (nextTab) setTab(nextTab);
                  }
                }}
                className="h-9 px-4 rounded-md bg-[#4d588b] text-white
                          hover:bg-[#3f4974] disabled:opacity-50"
              >
                Tiếp tục
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            )}
          </div>

          {/* Progress */}
          <div className="flex items-center">
            <ProgressBar value={tab.percent} text={tab.text} />
          </div>

        </div>
        {
          tabRequest[0].code == tab.code ?//Thông tin cá nhân
          <>
            <div className="grid grid-cols-1 gap-5">

              {/* Họ & tên */}
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">
                  Họ &amp; Tên <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  value={form.fullname}
                  onChange={(e) => onChange("fullname", e.target.value)}
                  placeholder="Nhập họ và tên"
                  required
                  className="h-10 rounded-md border border-gray-300 px-3 text-sm
                            focus:border-green-500 focus:ring-2 focus:ring-green-100
                            outline-none transition"
                />
              </label>

              {/* Giới tính */}
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Giới tính <span className="text-red-500">*</span>
                </span>
                <div className="flex items-center gap-6 text-sm text-gray-700">
                  {["Nam", "Nữ"].map((g) => (
                    <label key={g} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={form.gender === g}
                        onChange={(e) => onChange("gender", e.target.value)}
                        className="accent-green-600 cursor-pointer"
                      />
                      {g}
                    </label>
                  ))}
                </div>
              </label>

              {/* Ngày sinh */}
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">
                  Ngày sinh <span className="text-gray-400">(MM/DD/YYYY)</span>
                  <span className="text-red-500 ml-1">*</span>
                </span>
                <input
                  type="date"
                  value={form.birthday ?? ""}
                  onChange={(e) => onChange("birthday", e.target.value)}
                  className="h-10 rounded-md border border-gray-300 px-3 text-sm
                            focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
                />
              </label>

              {/* Tuổi */}
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">
                  Tuổi <span className="text-red-500">*</span>
                </span>
                <input
                  type="number"
                  value={form.age}
                  onChange={(e) => onChange("age", parseInt(e.target.value))}
                  placeholder="Tuổi"
                  required
                  className="h-10 rounded-md border border-gray-300 px-3 text-sm
                            focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
                />
              </label>

              {/* CCCD */}
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">
                  Căn cước công dân <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  value={form.cccd}
                  onChange={(e) => onChange("cccd", e.target.value)}
                  placeholder="CCCD"
                  required
                  className="h-10 rounded-md border border-gray-300 px-3 text-sm
                            focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
                />
              </label>

              {/* Nơi cấp CCCD */}
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">
                  Nơi cấp CCCD <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  value={form.placeofissue}
                  onChange={(e) => onChange("placeofissue", e.target.value)}
                  placeholder="Nơi cấp CCCD"
                  required
                  className="h-10 rounded-md border border-gray-300 px-3 text-sm
                            focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
                />
              </label>

              {/* Ngày cấp CCCD */}
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">
                  Ngày cấp CCCD <span className="text-gray-400">(MM/DD/YYYY)</span>
                  <span className="text-red-500 ml-1">*</span>
                </span>
                <input
                  type="date"
                  value={form.dateofissue ?? ""}
                  onChange={(e) => onChange("dateofissue", e.target.value)}
                  className="h-10 rounded-md border border-gray-300 px-3 text-sm
                            focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
                />
              </label>

              {/* CMND */}
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">
                  Chứng minh nhân dân
                </span>
                <input
                  type="text"
                  value={form.cmnd}
                  onChange={(e) => onChange("cmnd", e.target.value)}
                  placeholder="CMND"
                  className="h-10 rounded-md border border-gray-300 px-3 text-sm
                            focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
                />
              </label>

              {/* Quốc tịch */}
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">
                  Quốc tịch <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  value={form.nationality}
                  onChange={(e) => onChange("nationality", e.target.value)}
                  placeholder="Quốc tịch"
                  required
                  className="h-10 rounded-md border border-gray-300 px-3 text-sm
                            focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
                />
              </label>

              {/* Tình trạng hôn nhân */}
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">
                  Tình trạng hôn nhân
                </span>
                <select
                  defaultValue={form.maritalstatus}
                  onChange={(e) => onChange("maritalstatus", e.target.value)}
                  className="h-10 rounded-md border border-gray-300 px-3 text-sm
                            focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                >
                  {matialStatus.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </label>

            </div>
          </>
          :
          tabRequest[1].code == tab.code ?//Thông tin liên lạc
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Số điện thoại */}
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">
                  Số điện thoại <span className="text-red-500">*</span>
                </span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => onChange("phone", e.target.value)}
                  placeholder="Nhập số điện thoại"
                  required
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm
                            focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              {/* Email */}
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">
                  Địa chỉ Email
                </span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  placeholder="example@email.com"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm
                            focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              {/* Địa chỉ */}
              <label className="flex flex-col gap-1 md:col-span-2">
                <span className="text-sm font-medium text-gray-700">
                  Địa chỉ <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => onChange("address", e.target.value)}
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  required
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm
                            focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </label>
            </div>
          </>
          :
          tabRequest[2].code == tab.code ?//Thông tin việc làm
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Thu nhập từ lương */}
            <label className="flex flex-col gap-1 md:col-span-2">
              <span className="text-sm font-medium text-gray-700">
                Thu nhập từ lương
              </span>
              <select
                value={form.salaryincome}
                onChange={(e) => onChange("salaryincome", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                          focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              >
                {salaryIncom.map((salary) => (
                  <option key={salary.code} value={salary.code}>
                    {salary.name}
                  </option>
                ))}
              </select>
            </label>

            {/* KHÔNG có lương */}
            {form?.salaryincome === salaryIncom[0].code ? (
              <label className="flex flex-col gap-1 md:col-span-2">
                <span className="text-sm font-medium text-gray-700">
                  Thu nhập khác
                </span>
                <input
                  type="text"
                  value={form.otherincome}
                  onChange={(e) => onChange("otherincome", e.target.value)}
                  placeholder="Nhập nguồn thu nhập khác"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm
                            focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </label>
            ) : (
              <>
                {/* Tên công ty */}
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-700">
                    Tên công ty
                  </span>
                  <input
                    type="text"
                    value={form.companyname}
                    onChange={(e) => onChange("companyname", e.target.value)}
                    placeholder="Tên công ty"
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm
                              focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                </label>

                {/* Vị trí */}
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-700">
                    Vị trí
                  </span>
                  <input
                    type="text"
                    value={form.jobtitle}
                    onChange={(e) => onChange("jobtitle", e.target.value)}
                    placeholder="Vị trí công tác"
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm
                              focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                </label>

                {/* Phòng ban */}
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-700">
                    Phòng ban
                  </span>
                  <input
                    type="text"
                    value={form.department}
                    onChange={(e) => onChange("department", e.target.value)}
                    placeholder="Phòng ban"
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm
                              focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                </label>

                {/* SĐT công ty */}
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-700">
                    Số điện thoại công ty
                  </span>
                  <input
                    type="text"
                    value={form.companyphone}
                    onChange={(e) => onChange("companyphone", e.target.value)}
                    placeholder="Số điện thoại công ty"
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm
                              focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                </label>

                {/* Thu nhập hàng tháng */}
                <label className="flex flex-col gap-1 md:col-span-2">
                  <span className="text-sm font-medium text-gray-700">
                    Thu nhập hàng tháng
                  </span>
                  <select
                    value={form.monthincome}
                    onChange={(e) => onChange("monthincome", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                              focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  >
                    {monthIncom.map((month) => (
                      <option key={month.code} value={month.code}>
                        {month.name}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            )}
          </div>
          </>
          :
          tabRequest[3].code == tab.code ?//Thông tin tín dụng
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <label className="flex flex-col gap-1 md:col-span-2">
                <span className="text-sm font-medium text-gray-700">
                  Mục đích vay
                </span>
                <input
                  type="text"
                  value={form.loanpurpose}
                  onChange={(e) => onChange("loanpurpose", e.target.value)}
                  placeholder="Mục đích vay"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                            focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">
                  Dư nợ tại các ngân hàng khác
                </span>
                <input
                  type="text"
                  value={form.outstandingloansatotherbanks}
                  onChange={(e) =>
                    onChange("outstandingloansatotherbanks", e.target.value)
                  }
                  placeholder="Dư nợ hiện tại"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                            focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">
                  Số tiền muốn vay
                </span>
                <input
                  type="text"
                  value={form.loanamountrequested}
                  onChange={(e) =>
                    onChange("loanamountrequested", e.target.value)
                  }
                  placeholder="Số tiền muốn vay"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                            focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <label className="flex flex-col gap-1 md:col-span-2">
                <span className="text-sm font-medium text-gray-700">
                  Tài sản đảm bảo
                </span>
                <input
                  type="text"
                  value={form.collateral}
                  onChange={(e) => onChange("collateral", e.target.value)}
                  placeholder="Nhà đất, ô tô, tài sản khác"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                            focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <label className="flex flex-col gap-1 md:col-span-2">
                <span className="text-sm font-medium text-gray-700">
                  Địa chỉ sổ đỏ
                </span>
                <input
                  type="text"
                  value={form.redbookaddress}
                  onChange={(e) => onChange("redbookaddress", e.target.value)}
                  placeholder="Địa chỉ ghi trên sổ đỏ"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                            focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <label className="flex flex-col gap-1 md:col-span-2">
                <span className="text-sm font-medium text-gray-700">
                  Thông tin khác
                </span>
                <input
                  type="text"
                  value={form.otherinfo}
                  onChange={(e) => onChange("otherinfo", e.target.value)}
                  placeholder="Thông tin bổ sung (nếu có)"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                            focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </label>
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex justify-end gap-3">
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium
                  ${
                    loading
                      ? "bg-gray-200 text-gray-600"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
              >
                <Send className="h-4 w-4" />
                {loading ? "Đang gửi..." : "Lưu yêu cầu"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setForm(defaultForm);
                  setImages([]);
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2 text-sm
                          text-gray-700 hover:bg-gray-50"
              >
                <Recycle className="h-4 w-4" />
                Làm lại
              </button>
            </div>
          </>
          :
          tabRequest[4].code == tab.code ?//Tải ảnh lên
          <>
            <div className="grid grid-cols-1 gap-4">
              {/* Ảnh đính kèm */}
              <div className="flex flex-col">
                <span className="text-sm font-medium mb-1">
                  Ảnh sổ đỏ / giấy tờ (tối đa 5)
                </span>
                <div className="mt-2 flex flex-wrap gap-3">
                  {images.map((img) => (
                    <div
                      key={img.keyUrl}
                      className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200"
                    >
                      <img
                        src={img.publicUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {handleRemoveImage(img)}}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-gray-300 text-xs font-semibold flex items-center justify-center hover:bg-red-50 hover:border-red-400 hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {images.length < 5 && (
                    <label className="w-24 h-24 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 text-xs text-gray-500 cursor-pointer hover:border-green-400 hover:text-green-600">
                      <span className="text-lg">＋</span>
                      <span>Thêm ảnh</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleSelectFiles}
                      />
                    </label>
                  )}
                </div>
              </div>
              
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSendEmail}
                  className={`inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium
                    ${
                      loading
                        ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                >
                  <Send className="h-4 w-4" />
                  {loading ? "Đang gửi..." : "Hoàn tất yêu cầu"}
                </button>
              </div>
            </div>
          </>
          :
          <></>
        }
      </form>
    </div>
  );
}
