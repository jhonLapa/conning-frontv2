
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/auth.store";
import { LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const ProfileInfo = () => {
const navigate = useNavigate();

  const { clearSession } = useAuthStore((state) => state);

  const handleLogout = () => {
    clearSession();
    navigate("/");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <div className=" flex items-center  ">
          <img
            src='https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png'
            alt=""
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-0" align="end">
        <DropdownMenuLabel className="flex gap-2 items-center mb-1 p-3">
          <img
            src='https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png'
            alt=""
            width={36}
            height={36}
            className="rounded-full"
          />
          <div>
            <div className="text-sm font-medium text-default-800 capitalize ">
              {"Mcc Callem"}
            </div>
            <Link
              to="/dashboard"
              className="text-xs text-default-600 hover:text-primary"
            >
              @Leonard22Chavesta
            </Link>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {[
            {
              name: "profile",
              icon: "heroicons:user",
              href: "/user-profile"
            },
            {
              name: "Settings",
              icon: "heroicons:paper-airplane",
              href: "/dashboard"
            },
          ].map((item, index) => (
            <Link
              to={item.href}
              key={`info-menu-${index}`}
              className="cursor-pointer"
            >
              <DropdownMenuItem className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize px-3 py-1.5 dark:hover:bg-background cursor-pointer">
                <User className="w-4 h-4" />
                {item.name}
              </DropdownMenuItem>
            </Link>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-medium text-[#1e1d35] my-1 px-3 dark:hover:bg-background cursor-pointer"
        >
          <LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default ProfileInfo;
