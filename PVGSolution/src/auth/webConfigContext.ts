import {
createElement,
createContext,
useContext,
useEffect,
useState,
type ReactNode,
} from "react";
import type { IObjConfigurationModel } from "@/models/admin/config.model";
import { key_WebConfig } from "@/commons/const";
import { configsGetall } from "@/api/admin/adConfiguration";

const webConfigDefault = {
    EmailFromName: "",    
    EmailSend: "",
    EmailSendPassword: "",
    EmailReceive: "",
    EmailSmtpHost: "",
    EmailPort: "",
    SDTSales: "",
    WebName: "" ,
    ImgLogo: "",
    ImgHome: "",
    ImgBackground: "",
} as IObjConfigurationModel;

type WebConfigContextType = {
    webConfig: IObjConfigurationModel;
};

const WebConfigContext = createContext<WebConfigContextType | undefined>(undefined);

export function WebConfigProvider({ children }: { children: ReactNode }) {
    const [webConfig, setWebConfig] = useState<IObjConfigurationModel>(webConfigDefault);

    // load từ localStorage / cookie
    useEffect(() => {
        const fetchData = async () => {
            await getConfig();
        };
        fetchData();
    }, []);

    const getConfig = async () => {
        const webconfigSession = sessionStorage.getItem(key_WebConfig);

        if(webconfigSession)
        {
            const parsed: IObjConfigurationModel = JSON.parse(webconfigSession);
            setWebConfig(parsed);
            return;
        }

        const res = await configsGetall();

        // if (!res.isSuccess) {
        //     Error(res.message || `HTTP ${res.message}`);
        // }

        // if (res?.result?.data === undefined || res?.result?.data.length === 0) {
        //     Error("Chưa có cài đặt chung");
        // }

        const objConfig = Object.fromEntries(res?.result?.data.map(item => [item.key, item.value]) ?? []) as unknown as IObjConfigurationModel;

        setWebConfig(objConfig);
        sessionStorage.setItem(key_WebConfig, JSON.stringify(objConfig));
    }

    return createElement(
        WebConfigContext.Provider,
        { value: { webConfig } },
        children
    );
}

export function useWebConfig() {
    const ctx = useContext(WebConfigContext);
    if (!ctx) throw new Error("WebConfig must be used within WebConfigProvider");
    return ctx;
}
