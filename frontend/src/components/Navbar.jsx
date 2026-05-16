import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import {
  BellIcon,
  HomeIcon,
  LogOutIcon,
  ShipWheelIcon,
  UsersIcon,
} from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  // const queryClient = useQueryClient();
  // const { mutate: logoutMutation } = useMutation({
  //   mutationFn: logout,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  // });

  const { logoutMutation } = useLogout();

  return (
    <nav className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b border-base-300 bg-base-200">
      <div className="flex w-full min-w-0 items-center gap-1 px-2 sm:gap-2 sm:px-6 lg:px-8">
        <Link
          to="/"
          className={`flex min-w-0 items-center gap-2 ${
            isChatPage ? "" : "lg:hidden"
          }`}
        >
          <ShipWheelIcon className="size-8 shrink-0 text-primary" />
          <span className="hidden truncate bg-gradient-to-r from-primary to-secondary bg-clip-text font-mono text-xl font-bold tracking-normal text-transparent sm:inline">
            Streamify
          </span>
        </Link>

        <div className="ml-auto flex min-w-0 items-center gap-1 sm:gap-2">
          <Link to="/" className="btn btn-ghost btn-circle btn-sm lg:hidden">
            <HomeIcon className="size-5 text-base-content opacity-70" />
          </Link>

          <Link to="/friends" className="btn btn-ghost btn-circle btn-sm lg:hidden">
            <UsersIcon className="size-5 text-base-content opacity-70" />
          </Link>

          <Link to="/notifications" className="btn btn-ghost btn-circle btn-sm sm:btn-md">
            <BellIcon className="size-5 text-base-content opacity-70 sm:size-6" />
          </Link>

          {/* TODO */}
          <ThemeSelector />

          <div className="avatar shrink-0">
            <div className="w-8 rounded-full sm:w-9">
              <img src={authUser?.profilePic} alt="User Avatar" rel="noreferrer" />
            </div>
          </div>

          {/* Logout button */}
          <button className="btn btn-ghost btn-circle btn-sm sm:btn-md" onClick={logoutMutation}>
            <LogOutIcon className="size-5 text-base-content opacity-70 sm:size-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
