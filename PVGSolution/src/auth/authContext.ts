import {
  createElement,
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Cookies from "js-cookie";

type AuthData = {
  token: string | null;
  userName: string | null;
};

type AuthContextType = {
  auth: AuthData;
  login: (data: AuthData) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "app_auth";
const AUTH_COOKIE_KEY = "auth_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthData>({ token: null, userName: null });

  // load từ localStorage / cookie
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      const cookieToken = Cookies.get(AUTH_COOKIE_KEY);

      if (stored) {
        const parsed: AuthData = JSON.parse(stored);
        // ưu tiên token trong cookie nếu có
        const token = cookieToken ?? parsed.token;
        if (token) {
          setAuth({ token, userName: parsed.userName });
        }
      } else if (cookieToken) {
        setAuth({ token: cookieToken, userName: null });
      }
    } catch {
      // ignore
    }
  }, []);

  const login = (data: AuthData) => {
    setAuth(data);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
    if (data.token) {
      Cookies.set(AUTH_COOKIE_KEY, data.token, { expires: 7 }); // 7 ngày
    }
  };

  const logout = () => {
    setAuth({ token: null, userName: null });
    localStorage.removeItem(AUTH_STORAGE_KEY);
    Cookies.remove(AUTH_COOKIE_KEY);
  };

  return createElement(
    AuthContext.Provider,
    { value: { auth, login, logout } },
    children
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
