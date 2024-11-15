import { useUser } from "../store/userSlice.ts";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";

export enum PermissionEnum {
  USER = 0,
  ADMIN = 1,
}

interface ProtectedRoutesProps {
  permissions?: PermissionEnum | PermissionEnum[];
  redirectTo?: string;
}

const ProtectedRoutes = ({
  permissions = [PermissionEnum.USER],
  redirectTo = "/login",
}: ProtectedRoutesProps) => {
  const user = useUser();

  // Convert permissions to array if single permission is passed
  const requiredPermissions = Array.isArray(permissions)
    ? permissions
    : [permissions];

  // If no user, redirect to login
  if (!user) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: window.location.pathname }}
      />
    );
  }

  const hasPermission =
    requiredPermissions.some((permission) => user.permission === permission) ||
    user.permission === PermissionEnum.ADMIN;

  // If user doesn't have required permission, redirect to home
  if (!hasPermission) {
    toast.error("You don't have permission to access this page");
    return (
      <Navigate
        to="/"
        replace
        state={{
          error: "You don't have permission to access this page",
        }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoutes;
