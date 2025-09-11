// src/hooks/useAuth.ts
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { RootState } from "@/store/store";
import { setUser, logout } from "@/store/slices/authSlice";
import { useGetMeQuery } from "@/store/api/usersApi";

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  const accessToken = Cookies.get("accessToken");
  const shouldFetchUser = accessToken && !user;

  const {
    data: userData,
    error,
    isLoading,
  } = useGetMeQuery(undefined, {
    skip: !shouldFetchUser,
  });

  useEffect(() => {
    if (userData?.success && userData.data) {
      dispatch(setUser(userData.data));
    }
  }, [userData, dispatch]);

  useEffect(() => {
    if (error || (!accessToken && !user)) {
      dispatch(logout());
    }
  }, [error, accessToken, user, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  return {
    user,
    isAuthenticated: !!accessToken && !!user,
    isLoading,
    isAdmin,
    logout: handleLogout,
  };
};
