import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/auth.store";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
        <div className="flex items-center">
          <img
            src="https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png"
            alt="user"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48 p-1" align="end">
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-medium text-[#1e1d35] py-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-muted-foreground" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileInfo;
