import { logout } from "@/actions/auth-actions";

export const Logout = () => {
  return (
    <form id="logout" action={logout}>
      <button >Logout</button>
    </form>
  );
};
