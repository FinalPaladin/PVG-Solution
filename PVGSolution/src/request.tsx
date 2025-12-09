import React, { useState, type JSX } from "react";
import { requestCustomerSave } from "@/api/requestCustomer";
import type { IResponseUpdateImage } from "@/models/requestCustomer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Recycle, Send } from "lucide-react";

const matialStatus = [
  {code: "", name: "Chọn"},
  {code: "single", name: "Độc thân"},
  {code: "married", name: "Đã kết hôn"},
  {code: "divorced", name: "Đã ly dị"},
];

const salaryIncom = [
  {code: "", name: "Chọn"},
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
  birthday: Date;
  age: number;
  gender: string;
  cccd: string;
  cmnd: string;
  placeofissue: string;
  dateofissue: Date;
  nationality: string;
  matialstatus: string;
  email: string;
  companyname: string;
  jobtitle: string;
  department: string;
  companyphone: string;
  salaryincome: string;
  monthincome: string;
  loanpurpose: string;
  outstandingloansatotherbanks: string;
  loanamountequested: string;
  collateral: string;
  loanproducttype: string;
  otherinfo: string;
  otherincome: string;
};

type UploadedImage = IResponseUpdateImage;

const tabRequest = [
  {code: 1, name: "THÔNG TIN CÁ NHÂN"},
  {code: 2, name: "THÔNG TIN LIÊN LẠC"},
  {code: 3, name: "THÔNG TIN VIỆC LÀM"},
  {code: 4, name: "THÔNG TIN TÍN DỤNG"},
]

const defaultForm = {
    fullname: "",
    phone: "",
    address: "",
    redbookaddress: "",
    age: 0,
    birthday: new Date(),
    gender: "Nam",
    cccd: "",
    cmnd: "",
    placeofissue: "",
    dateofissue: new Date(),
    nationality: "Việt Nam",
    email: "",
    matialstatus: "",
    companyname: "",
    jobtitle: "",
    department: "",
    companyphone: "",
    salaryincome: "",
    monthincome: "Dưới 5 triệu",
    loanpurpose: "",
    outstandingloansatotherbanks: "",
    loanamountequested: "",
    collateral: "",
    loanproducttype: "",
    otherinfo: "",
    otherincome: "",
  } as FormState;

export default function RequestCustomerPage(): JSX.Element {
  const [form, setForm] = useState<FormState>(defaultForm);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [images, setImages] = useState<UploadedImage[]>([]);

  const [tab, setTab] = useState(tabRequest[0]);
  // const [uploading, setUploading] = useState(false);
  // const [uploadError, setUploadError] = useState<string | null>(null);

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

  /*
  async function uploadImage(file: File) {
    setUploading(true);
    setUploadError(null);
    try {
      const res = await mediaImageUpload(file);

      if (!res.isSuccess || !res.result) {
        throw new Error(res.message || "Upload ảnh thất bại");
      }

      const { keyUrl, publicUrl } = res.result;
      setImages((prev) => [...prev, { keyUrl, publicUrl }]);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Không upload được ảnh";
      setUploadError(msg);
    } finally {
      setUploading(false);
    }
  }
  */

  async function handleSelectFiles(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainSlots = 3 - images.length;
    const toUpload = Array.from(files).slice(0, remainSlots);
    
    let listImg = [...images] as UploadedImage[];
    for (const file of toUpload) {
      let url = URL.createObjectURL(file);
      listImg.push({
        file: file,
        keyUrl: "",
        publicUrl: url
      } as UploadedImage);
    }
    setImages(listImg);

    // reset input để có thể chọn lại cùng file
    e.target.value = "";
  }

  async function handleRemoveImage(img: UploadedImage) {
    // setUploading(true);
    // setUploadError(null);
    // try {
      // const res = await mediaImageDelete(img.keyUrl);
      // if (!res.isSuccess) {
      //   throw new Error(res.message || "Xoá ảnh thất bại");
      // }

    //   setImages((prev) => prev.filter((x) => x.keyUrl !== img.keyUrl));
    // } catch (err) {
    //   const msg =
    //     err instanceof Error ? err.message : "Không xoá được ảnh";
    //   setUploadError(msg);
    // } finally {
    //   setUploading(false);
    // }
    
    setImages((prev) => prev.filter((x) => x.keyUrl !== img.keyUrl));
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
      // const data: { key: string; value: string }[] = [
      //   { key: "fullname", value: form.fullname },
      //   { key: "phone", value: form.phone },
      //   { key: "address", value: form.address },
      //   { key: "redBookAddress", value: form.redBookAddress },
      // ];

      // if (images.length > 0) {
      //   // tuỳ BE, nếu muốn mỗi ảnh 1 item thì map; tạm gộp list key
      //   data.push({
      //     key: "imageKeys",
      //     value: images.map((x) => x.keyUrl).join(","),
      //   });
      // }

      // const payload = {
      //   phone: form.phone,
      //   productId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      //   data,
      // };
      let payload = new FormData();
      payload.append("Phone", form.phone);
      payload.append("ProductId", "3fa85f64-5717-4562-b3fc-2c963f66afa6");
      payload.append("FullName", form.fullname);
      debugger
      
      let dataJson = JSON.stringify([
          { key: "fullname", value: form.fullname },
          { key: "phone", value: form.phone },
          { key: "address", value: form.address },
          { key: "redbookaddress", value: form.redbookaddress },
          { key: "birthday", value: form.birthday.toLocaleDateString("vi-VN") },
          { key: "age", value: form.age.toString() },
          { key: "gender", value: form.gender },
          { key: "cccd", value: form.cccd },
          { key: "cmnd", value: form.cmnd },
          { key: "placeofissue", value: form.placeofissue },
          { key: "dateofissue", value: form.dateofissue.toLocaleDateString("vi-VN") },
          { key: "nationality", value: form.nationality },
          { key: "matialstatus", value: form.matialstatus },
          { key: "email", value: form.email },
          { key: "companyname", value: form.companyname },
          { key: "jobtitle", value: form.jobtitle },
          { key: "department", value: form.department },
          { key: "companyphone", value: form.companyphone },
          { key: "salaryincome", value: form.salaryincome },
          { key: "monthincome", value: form.monthincome },
          { key: "loanpurpose", value: form.loanpurpose },
          { key: "outstandingloansatotherbanks", value: form.outstandingloansatotherbanks },
          { key: "loanamountequested", value: form.loanamountequested },
          { key: "collateral", value: form.collateral },
          { key: "loanproducttype", value: form.loanproducttype },
          { key: "otherinfo", value: form.otherinfo },
          { key: "otherincome", value: form.otherincome },
        ]);
      payload.append('dataJson', dataJson);

      images.forEach((img, index) => {
        if (!img.file) return;
          payload.append(`DataImage[${index}].key`, img.keyUrl);
          payload.append(`DataImage[${index}].imgFile`, img.file, img.file.name);
      });

      const res = await requestCustomerSave(payload);

      if (!res.isSuccess) {
        throw new Error(res.message || `HTTP lỗi`);
      }

      setMessage({ type: "success", text: "Gửi yêu cầu thành công." });
      setForm(defaultForm);
      setImages([]);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error";

      setMessage({
        type: "error",
        text: `Gửi thất bại: ${errorMessage}`,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 mt-8">
      {/* form align left, không card wrapper */}
      <form onSubmit={handleSubmit} className="max-w-xl">
        <h2 className="text-xl font-semibold mb-4">
          Đăng ký vay
        </h2>

        {message && (
          <div
            className={`mb-4 px-4 py-2 rounded ${message.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
              }`}
          >
            {message.text}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <h4 className="text-l font-semibold mb-4">
              {tab.name}
            </h4>
          </div>
          <div className="text-end">          
            <Button type="button" disabled={tab == tabRequest[0]} 
              onClick={() => {
                if(tab.code > tabRequest[0].code){
                  let prevTab = tabRequest.find(x => x.code == (tab.code - 1));
                  if(prevTab){setTab(prevTab)};
                }
              }} 
              className="bg-[#8FA3FF]  hover:bg-[white] hover:text-[black] mr-2">
              <span className="flex">
                  <ChevronLeft className="h-5 w-5"/>&nbsp;Trở lại                
              </span>
            </Button>
            <Button type="button" disabled={tab == tabRequest[tabRequest.length-1]} 
              onClick={() => {
                if(tab.code < tabRequest[tabRequest.length-1].code){                
                  let nextTab = tabRequest.find(x => x.code == (tab.code + 1));
                  console.log(nextTab);
                  if(nextTab){setTab(nextTab)}
                }
              }} 
              className="bg-[#8FA3FF]  hover:bg-[white] hover:text-[black]">
              <span className="flex">
                  Tiếp tục&nbsp;<ChevronRight className="h-5 w-5"/>
              </span>
            </Button>
          </div>
        </div>

        {
          tabRequest[0].code == tab.code ?//Thông tin cá nhân
          <>
            <div className="grid grid-cols-1 gap-4">
              <label className="flex flex-col">
                <span className="text-sm font-medium mb-1">Họ &amp; Tên</span>
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
                <span className="text-sm font-medium mb-1">Giới tính</span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="Nam"
                      checked={form.gender === "Nam"}
                      onChange={(e) => {onChange("gender", e.target.value)}}
                      className="cursor-pointer"
                    />
                    Nam
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="Nữ"
                      checked={form.gender === "Nữ"}
                      onChange={(e) => {onChange("gender", e.target.value)}}
                      className="cursor-pointer"
                    />
                    Nữ
                  </label>
                </div>
              </label>
              <label className="flex flex-col">
                <span className="text-sm font-medium mb-1">Ngày sinh</span>
                <input type="date" onChange={(e) => {onChange("birthday", new Date(e.target.value))}}
                className="border rounded-md px-3 py-2 w-full"/>
              </label>
              <label className="flex flex-col">
                <span className="text-sm font-medium mb-1">Tuổi</span>
                <input
                  type="number"
                  value={form.age}
                  onChange={(e) => onChange("age", parseInt(e.target.value))}
                  className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="Tuổi"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-sm font-medium mb-1">Căn cước công dân</span>
                <input
                  type="text"
                  value={form.cccd}
                  onChange={(e) => onChange("cccd", e.target.value)}
                  className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="CCCD"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-sm font-medium mb-1">Nơi cấp CCCD</span>
                <input
                  type="text"
                  value={form.placeofissue}
                  onChange={(e) => onChange("placeofissue", e.target.value)}
                  className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="Nơi cấp CCCD"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-sm font-medium mb-1">Ngày cấp CCCD</span>
                <input type="date" onChange={(e) => {onChange("dateofissue", new Date(e.target.value))}}
                className="border rounded-md px-3 py-2 w-full"/>
              </label>
              <label className="flex flex-col">
                <span className="text-sm font-medium mb-1">Chứng minh nhân nhân</span>
                <input
                  type="text"
                  value={form.cmnd}
                  onChange={(e) => onChange("cmnd", e.target.value)}
                  className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="CMND"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-sm font-medium mb-1">Quốc tịch</span>
                <input
                  type="text"
                  value={form.nationality}
                  onChange={(e) => onChange("nationality", e.target.value)}
                  className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="Quốc tịch"
                />
              </label>  
              <label className="flex flex-col">
                <span className="text-sm font-medium mb-1">Tình trạng hôn nhân</span>
                <select className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={form.matialstatus}
                onChange={(e) => {onChange("matialstatus", e.target.value)}}>
                  {
                    matialStatus.map((matial) =>
                      <option value={matial.name}>{matial.name}</option>
                    )
                  }
                </select>
              </label>    
            </div>
          </>
          :
          tabRequest[1].code == tab.code ?//Thông tin liên lạc
          <>
            <div className="grid grid-cols-1 gap-4">
              <label className="flex flex-col">
                <span className="text-sm font-medium mb-1">Số điện thoại</span>
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
                <span className="text-sm font-medium mb-1">Địa chỉ Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="Địa chỉ Email"
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
            </div>
          </>
          :
          tabRequest[2].code == tab.code ?//Thông tin việc làm
          <>
            <div className="grid grid-cols-1 gap-4">
              <label className="flex flex-col">
                <span className="text-sm font-medium mb-1">Thu nhập từ lương</span>
                <select className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={form.salaryincome}
                onChange={(e) => {onChange("salaryincome", e.target.value)}}>
                  {
                    salaryIncom.map((salary) =>
                      <option value={salary.code}>{salary.name}</option>
                    )
                  }
                </select>
              </label>
              {
                form?.salaryincome === salaryIncom[0].code ?
                <>                  
                  <label className="flex flex-col">
                    <span className="text-sm font-medium mb-1">Thu nhập khác</span>
                  <input
                    type="text"
                    value={form.otherincome}
                    onChange={(e) => onChange("otherincome", e.target.value)}
                    className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                    placeholder="Thu nhập khác"
                  />
                  </label> 
                </>
                :
                <>
                  <label className="flex flex-col">
                    <span className="text-sm font-medium mb-1">Tên công ty</span>
                    <input
                      type="text"
                      value={form.companyname}
                      onChange={(e) => onChange("companyname", e.target.value)}
                      className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                      placeholder="Tên công ty"
                    />
                  </label> 
                  <label className="flex flex-col">
                    <span className="text-sm font-medium mb-1">Vị trí</span>
                    <input
                      type="text"
                      value={form.jobtitle}
                      onChange={(e) => onChange("jobtitle", e.target.value)}
                      className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                      placeholder="Vị trí"
                    />
                  </label> 
                  <label className="flex flex-col">
                    <span className="text-sm font-medium mb-1">Phòng ban</span>
                    <input
                      type="text"
                      value={form.department}
                      onChange={(e) => onChange("department", e.target.value)}
                      className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                      placeholder="Phòng ban"
                    />
                  </label> 
                  <label className="flex flex-col">
                    <span className="text-sm font-medium mb-1">Số điện thoại công ty</span>
                    <input
                      type="text"
                      value={form.companyphone}
                      onChange={(e) => onChange("companyphone", e.target.value)}
                      className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                      placeholder="Số điện thoại công ty"
                    />
                  </label> 
                  <label className="flex flex-col">
                    <span className="text-sm font-medium mb-1">Thu nhập hàng tháng</span>
                    <select className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={form.monthincome}
                    onChange={(e) => {onChange("monthincome", e.target.value)}}>
                      {
                        monthIncom.map((month) =>
                          <option value={month.code}>{month.name}</option>
                        )
                      }
                    </select>
                  </label>
                </>
              }
            </div>
          </>
          :
          tabRequest[3].code == tab.code ?//Thông tin tín dụng
          <>
            <div className="grid grid-cols-1 gap-4">
              <label className="flex flex-col">
                <span className="text-sm font-medium mb-1">Mục đích vay</span>
                <input
                  type="text"
                  value={form.loanpurpose}
                  onChange={(e) => onChange("loanpurpose", e.target.value)}
                  className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="Mục đích vay"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-sm font-medium mb-1">Dư nợ tại các ngân hàng khác</span>
                <input
                  type="text"
                  value={form.outstandingloansatotherbanks}
                  onChange={(e) => onChange("outstandingloansatotherbanks", e.target.value)}
                  className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="Dư nợ tại các ngân hàng khác"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-sm font-medium mb-1">Số tiền muốn vay</span>
                <input
                  type="text"
                  value={form.loanamountequested}
                  onChange={(e) => onChange("loanamountequested", e.target.value)}
                  className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="Số tiền muốn vay"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-sm font-medium mb-1">Tài sản đảm bảo</span>
                <input
                  type="text"
                  value={form.collateral}
                  onChange={(e) => onChange("collateral", e.target.value)}
                  className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="Tài sản đảm bảo"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-sm font-medium mb-1">Địa chỉ sổ đỏ</span>
                <input
                  type="text"
                  value={form.redbookaddress}
                  onChange={(e) => onChange("redbookaddress", e.target.value)}
                  className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="Số nhà, đường, quận, TP (Địa chỉ trên sổ đỏ)"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-sm font-medium mb-1">Thông tin khác</span>
                <input
                  type="text"
                  value={form.otherinfo}
                  onChange={(e) => onChange("otherinfo", e.target.value)}
                  className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="Thông tin khác"
                />
              </label>
              {/* Ảnh đính kèm */}
              <div className="flex flex-col">
                <span className="text-sm font-medium mb-1">
                  Ảnh sổ đỏ / giấy tờ (tối đa 3)
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
                        onClick={() => handleRemoveImage(img)}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-gray-300 text-xs font-semibold flex items-center justify-center hover:bg-red-50 hover:border-red-400 hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {images.length < 3 && (
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
                {/* {uploadError && (
                  <p className="mt-1 text-xs text-red-600">{uploadError}</p>
                )}
                {uploading && (
                  <p className="mt-1 text-xs text-gray-500">
                    Đang xử lý ảnh...
                  </p>
                )} */}
              </div>
            </div>
          </>
          :
          <></>
        }
        <div className="mt-6 text-end gap-3">
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center justify-center px-4 py-2 rounded-md font-medium mr-2 ${loading
              ? "bg-gray-200 text-gray-700"
              : "bg-[#92B83D] text-white hover:bg-[#7DA22F]"
              }`}
          >
            <Send className="h-5 w-5"/>&nbsp;{loading ? "Đang gửi..." : "Gửi yêu cầu"}
          </button>

          <button
            type="button"
            onClick={() => {
              setForm(defaultForm);
              setImages([]);
            }}
            className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            <Recycle className="h-5 w-5"/>&nbsp;Làm lại
          </button>
        </div>
      </form>
    </div>
  );
}
