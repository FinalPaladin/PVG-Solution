
import { configsGetall, configsSave } from "@/api/admin/adConfiguration";
import { useAuth } from "@/auth/authContext";
import ImageControl from "@/components/Controls/Image";
import { Button } from "@/components/ui/button";
import type { IImageConfigurationModel, IObjConfigurationModel } from "@/models/admin/config.model";
import { useAlert } from "@/stores/useAlertStore";
import { Save } from "lucide-react";
import { useEffect, useState, type JSX } from "react";

export default function ConfigurationPage(): JSX.Element {
    const { auth } = useAuth();
    const [config, setConfig] = useState<IObjConfigurationModel>({
        EmailFromName: "",
        EmailPort: "",
        EmailReceive: "",
        EmailSend: "",
        EmailSendPassword: "",
        EmailSmtpHost: "",
        ImgBackground: "",
        ImgBanner: "",
        ImgHome: "",
        ImgLogo: "",
        SDTSales: "",
        WebName: "",
    } as IObjConfigurationModel);
    const [dataImg, setDataImg] = useState<IImageConfigurationModel[]>([]);

    useEffect(() => {
        loadForm();
    }, []);

    const loadForm = async () => {
        const res = await configsGetall();

        if (!res.isSuccess) {
            throw new Error(res.message || `HTTP ${res.message}`);
        }

        if (res?.result?.data === undefined || res?.result?.data.length === 0) {
            throw new Error("Chưa có cài đặt chung");
        }

        const objConfig = Object.fromEntries(res?.result?.data.map(item => [item.key, item.value]) ?? []) as unknown as IObjConfigurationModel;
        setConfig({
            EmailFromName: objConfig.EmailFromName,
            EmailPort: objConfig.EmailPort,
            EmailReceive: objConfig.EmailReceive,
            EmailSend: objConfig.EmailSend,
            EmailSendPassword: objConfig.EmailSendPassword,
            EmailSmtpHost: objConfig.EmailSmtpHost,
            ImgBackground: objConfig.ImgBackground,
            ImgBanner: objConfig.ImgBanner,
            ImgHome: objConfig.ImgHome,
            ImgLogo: objConfig.ImgLogo,
            SDTSales: objConfig.SDTSales,
            WebName: objConfig.WebName
        } as IObjConfigurationModel);
    }

    const handleSave = async () => {
        try {
            const data = Object.entries(config).map(([key, value]) => ({
                key,
                value
            }));

            const formData = new FormData();
            formData.append("CreateUser", auth?.userName || "");

            formData.append('dataJson', JSON.stringify(data));

            dataImg.forEach((img, index) => {
                if (!img.imgFile) return;
                formData.append(`DataImage[${index}].key`, img.key);
                formData.append(`DataImage[${index}].imgFile`, img.imgFile, img.imgFile.name);
            });

            const res = await configsSave(formData);

            if (!res.isSuccess) {
                throw new Error(res.message || `HTTP ${res.message}`);
            }

            useAlert.getState().show(`Lưu dữ liệu thành công.`, "success");
        }
        catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Unknown error";

            useAlert.getState().showError(`Lưu thất bại: ${errorMessage}`);
        }
    }

    const AddImg = (_key: string, _img: File) => {
        if (!_img || !_key) {
            useAlert.getState().showError(`Thêm hình ảnh thất bại`);
            return;
        }

        const imgItem = [...dataImg].find(x => x.key === _key);
        if (imgItem) {
            imgItem.imgFile = _img;
        }
        else {
            setDataImg([...dataImg, { imgFile: _img, key: _key } as IImageConfigurationModel]);
        }
    }
    
    const inputClass =
    "h-10 w-full rounded-md border border-gray-300 px-3 text-sm " +
    "focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none";
    return (
        <div>
            <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-xl font-semibold text-gray-800 sm:text-2xl">
                    Cài Đặt Chung
                </h1>

                <Button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center justify-center gap-2
                            w-full sm:w-auto
                            px-4 py-2 rounded-md
                            bg-[#92B83D] text-white
                            hover:bg-[#7DA22F]
                            focus:outline-none focus:ring-2 focus:ring-green-200"
                >
                    <Save className="h-5 w-5" />
                    Lưu
                </Button>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

                {/* EMAIL */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                    <h6 className="mb-4 text-base font-semibold text-gray-700">
                    Email
                    </h6>

                    <div className="space-y-3">
                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Tên gửi</span>
                        <input
                        type="text"
                        className={inputClass}
                        defaultValue={config.EmailFromName}
                        onChange={(e) =>
                            setConfig({ ...config, EmailFromName: e.target.value })
                        }
                        />
                    </label>

                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Địa chỉ gửi</span>
                        <input
                        type="email"
                        className={inputClass}
                        defaultValue={config.EmailSend}
                        onChange={(e) =>
                            setConfig({ ...config, EmailSend: e.target.value })
                        }
                        />
                    </label>

                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Mật khẩu</span>
                        <input
                        type="password"
                        className={inputClass}
                        defaultValue={config.EmailSendPassword}
                        onChange={(e) =>
                            setConfig({ ...config, EmailSendPassword: e.target.value })
                        }
                        />
                    </label>

                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Địa chỉ nhận</span>
                        <input
                        type="email"
                        className={inputClass}
                        defaultValue={config.EmailReceive}
                        onChange={(e) =>
                            setConfig({ ...config, EmailReceive: e.target.value })
                        }
                        />
                    </label>

                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Máy chủ</span>
                        <input
                        type="text"
                        className={inputClass}
                        defaultValue={config.EmailSmtpHost}
                        onChange={(e) =>
                            setConfig({ ...config, EmailSmtpHost: e.target.value })
                        }
                        />
                    </label>

                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Cổng</span>
                        <input
                        type="number"
                        className={inputClass}
                        defaultValue={config.EmailPort}
                        onChange={(e) =>
                            setConfig({ ...config, EmailPort: e.target.value })
                        }
                        />
                    </label>
                    </div>
                </div>

                {/* THÔNG TIN CHUNG */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                    <h6 className="mb-4 text-base font-semibold text-gray-700">
                    Thông tin chung
                    </h6>

                    <div className="space-y-3">
                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Tên Web</span>
                        <input
                        type="text"
                        className={inputClass}
                        defaultValue={config.WebName}
                        onChange={(e) =>
                            setConfig({ ...config, WebName: e.target.value })
                        }
                        />
                    </label>

                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Hotline</span>
                        <input
                        type="tel"
                        className={inputClass}
                        defaultValue={config.SDTSales}
                        onChange={(e) =>
                            setConfig({ ...config, SDTSales: e.target.value })
                        }
                        />
                    </label>
                    </div>
                </div>

                {/* HÌNH ẢNH */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                    <h6 className="mb-4 text-base font-semibold text-gray-700">
                    Hình ảnh
                    </h6>

                    <div className="space-y-4">
                    <div>
                        <span className="text-sm font-medium">Logo</span>
                        <ImageControl
                        imageKey="ImgLogo"
                        img={config.ImgLogo}
                        isUpload
                        onImageChange={(file) => AddImg("ImgLogo", file!)}
                        />
                    </div>

                    <div>
                        <span className="text-sm font-medium">Ảnh trang chủ</span>
                        <ImageControl
                        imageKey="ImgHome"
                        img={config.ImgHome}
                        isUpload
                        onImageChange={(file) => AddImg("ImgHome", file!)}
                        />
                    </div>

                    <div>
                        <span className="text-sm font-medium">Ảnh nền trang chủ</span>
                        <ImageControl
                        imageKey="ImgBackground"
                        img={config.ImgBackground}
                        isUpload
                        onImageChange={(file) => AddImg("ImgBackground", file!)}
                        />
                    </div>

                    <div>
                        <span className="text-sm font-medium">Banner</span>
                        <ImageControl
                        imageKey="ImgBanner"
                        img={config.ImgBanner}
                        isUpload
                        onImageChange={(file) => AddImg("ImgBanner", file!)}
                        />
                    </div>
                    </div>
                </div>

                </div>
        </div>
    );
}