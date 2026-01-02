import { loginSchema } from "@/schema/loginSchema";
import { auth } from "@/services/firebaseConfig";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import NProgress from "nprogress";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/wrong-password": "Mật khẩu không đúng. Vui lòng kiểm tra lại!",
  "auth/user-not-found": "Tài khoản không tồn tại.",
  "auth/invalid-email": "Email không hợp lệ.",
  "auth/too-many-requests":
    "Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau!",
  "auth/invalid-credential": "Thông tin đăng nhập không hợp lệ.",
};

const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    NProgress.start();
    setLoginError(null);

    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast.success("Đăng nhập thành công!");
      navigate("/portfolio/videos");
    } catch (error: unknown) {
      const firebaseError = error as { code?: string; message?: string };
      const errorCode = firebaseError.code || "";
      const errorMessage =
        AUTH_ERROR_MESSAGES[errorCode] || "Đã xảy ra lỗi khi đăng nhập.";
      setLoginError(errorMessage);
    } finally {
      NProgress.done();
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Đã xảy ra lỗi khi đăng xuất.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const checkIsLogin = user !== null;

  return {
    user,
    isAuthLoading,
    form,
    onSubmit,
    handleSignOut,
    checkIsLogin,
    loginError,
  };
};

export default useAuth;
