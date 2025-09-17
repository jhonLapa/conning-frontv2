import { SheetMenu } from "./sheet-menu";
import { cn } from "@/lib/utils";
import { UserNav } from "./usernav";
import { useAuthStore } from "@/stores/auth.store";
import MarcaSwitcher from "./marca-switcher";

export function Navbar() {
  const { user } = useAuthStore((state) => state);
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
        </div>
        <div
          className={cn(
            "flex flex-1 items-center",
            user?.rol.name === "Cliente"
              ? "justify-end lg:justify-between"
              : "justify-end"
          )}
        >
          {user?.rol?.name === "Cliente" && (
            <div className="hidden lg:block">
              <MarcaSwitcher />
            </div>
          )}
          <UserNav />
        </div>
      </div>
    </header>
  );
}
