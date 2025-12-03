
import { configsGetall, configsSave } from "@/api/admin/adConfiguration";
import { useAuth } from "@/auth/authContext";
import ImageControl from "@/components/Controls/Image";
import type { IImageConfigurationModel, IObjConfigurationModel } from "@/models/admin/config.model";
import { useEffect, useState, type JSX } from "react";

export default function ConfigurationPage(): JSX.Element {
    const { auth } = useAuth();
    const [config, setConfig] = useState<IObjConfigurationModel>({} as IObjConfigurationModel);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);
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

        setConfig(objConfig);
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

            setMessage({ type: "success", text: "Lưu dữ liệu thành công." });
        }
        catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Unknown error";

            setMessage({
                type: "error",
                text: `Lưu thất bại: ${errorMessage}`,
            });
        }
    }

    const AddImg = (_key: string, _img: File) => {
        if (!_img || !_key) {
            setMessage({
                type: "error",
                text: `Thêm hình ảnh thất bại`,
            });
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

    return (
        <div>
            <div className="grid grid-cols-2 gap-4">
                <h1 className="text-2xl font-semibold mb-4">Cài Đặt Chung</h1>
                <div className="text-end">
                    <button type="button"
                        className="px-4 py-2 rounded-md border border-gray-200 bg-[#92B83D] text-white hover:bg-[#7DA22F] cursor-pointer"
                        onClick={handleSave}>Lưu</button>
                </div>
            </div>
            <div>
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
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded shadow-sm grid-cols-1">
                    <h6 className="font-semibold mb-4">Email</h6>
                    <div className="grid grid-cols-1">
                        <span className="text-sm font-medium mb-1">Tên gửi:</span>
                        <input type="text" className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                            defaultValue={config.EmailFromName}
                            onChange={(e) => { setConfig({ ...config, EmailFromName: e.target.value }) }} />
                    </div>
                    <div className="grid grid-cols-1 mt-2">
                        <span className="text-sm font-medium mb-1">Địa chỉ gửi:</span>
                        <input type="email" className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                            defaultValue={config.EmailSend}
                            onChange={(e) => { setConfig({ ...config, EmailSend: e.target.value }) }} />
                    </div>
                    <div className="grid grid-cols-1 mt-2">
                        <span className="text-sm font-medium mb-1">Mật khẩu đ/c gửi:</span>
                        <input type="password" className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                            defaultValue={config.EmailSendPassword}
                            onChange={(e) => { setConfig({ ...config, EmailSendPassword: e.target.value }) }} />
                    </div>
                    <div className="grid grid-cols-1 mt-2">
                        <span className="text-sm font-medium mb-1">Địa chỉ nhận:</span>
                        <input type="email" className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                            defaultValue={config.EmailReceive}
                            onChange={(e) => { setConfig({ ...config, EmailReceive: e.target.value }) }} />
                    </div>
                    <div className="grid grid-cols-1 mt-2">
                        <span className="text-sm font-medium mb-1">Máy chủ:</span>
                        <input type="text" className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                            defaultValue={config.EmailSmtpHost}
                            onChange={(e) => { setConfig({ ...config, EmailSmtpHost: e.target.value }) }} />
                    </div>
                    <div className="grid grid-cols-1 mt-2">
                        <span className="text-sm font-medium mb-1">Cổng:</span>
                        <input type="number" className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                            defaultValue={config.EmailPort}
                            onChange={(e) => { setConfig({ ...config, EmailPort: e.target.value }) }} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded shadow-sm grid-cols-1">
                    <h6 className="font-semibold mb-4">Thông tin chung</h6>
                    <div className="grid grid-cols-1 mb-1">
                        <span className="text-sm font-medium mb-1">Tên Web:</span>
                        <input type="text" className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                            defaultValue={config.WebName}
                            onChange={(e) => { setConfig({ ...config, WebName: e.target.value }) }} />
                    </div>
                    <div className="grid grid-cols-1">
                        <span className="text-sm font-medium mb-1">Hotline:</span>
                        <input type="tel" className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                            defaultValue={config.SDTSales}
                            onChange={(e) => { setConfig({ ...config, SDTSales: e.target.value }) }} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded shadow-sm grid-cols-1">
                    <h6 className="font-semibold mb-4">Hình ảnh</h6>
                    <div className="grid grid-cols-1">
                        <span className="text-sm font-medium mb-1">Logo:</span>
                        <ImageControl imageKey="ImgLogo" img={config.ImgLogo} isUpload={true} onImageChange={(file) => {AddImg("ImgLogo", file!);}}/>
                    </div>
                    <div className="grid grid-cols-1 mt-2">
                        <span className="text-sm font-medium mb-1">Ảnh trang chủ:</span>
                        <ImageControl imageKey="ImgHome" img={config.ImgHome} isUpload={true} onImageChange={(file) => { AddImg("ImgHome", file!); }} />
                    </div>
                    <div className="grid grid-cols-1 mt-2">
                        <span className="text-sm font-medium mb-1">Ảnh nền trang chủ:</span>
                        <ImageControl imageKey="ImgBackground" img={config.ImgBackground} isUpload={true} onImageChange={(file) => { AddImg("ImgBackground", file!); }} />
                    </div>
                </div>
            </div>
        </div>
    );
}