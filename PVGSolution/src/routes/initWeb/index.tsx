import { initWeb } from "@/api/initWeb";
import { useEffect, useState, type JSX } from "react";

export default function InitWeb(): JSX.Element {
    const [message, setMessage] = useState("Lỗi đã xảy ra");

    useEffect(() => {
        loadPage();
    },[]);

    const loadPage = async () => {
        const res = await initWeb();
        if(res)
        {
            if(res.isSuccess)
            {
                setMessage("Khởi tạo dữ liệu thành công");
                return;
            }
        }
    }

    return (
        <div>{message}</div>
    );
}
