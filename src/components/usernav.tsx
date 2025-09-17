import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuthStore } from "@/stores/auth.store";

export function UserNav() {
  const navigate = useNavigate();

  const { user, logout } = useAuthStore((state) => state);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <div className="flex gap-2 items-center">
                <Button
                  variant="outline"
                  className="relative h-10 w-10 rounded-full"
                >
                  <div className="flex gap-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="#" alt="Avatar" />
                      <AvatarFallback className="bg-transparent">
                        DP
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </Button>
                <div className="flex flex-col text-sm">
                  <h6 className="font-semibold text-pretty">
                    {user?.person.name} {user?.person.lastname}
                  </h6>
                  <span className="text-gray-600">
                    {user?.rol.name === "Cliente"
                      ? user?.person.documentNumber
                      : user?.rol.name}
                  </span>
                </div>
              </div>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Perfil</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <p className="font-semibold">Mi cuenta</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link to="/perfil" className="flex items-center">
              <User className="w-4 h-4 mr-3 text-muted-foreground" />
              Perfil
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
          Cerrar Sessión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
