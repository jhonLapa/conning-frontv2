import { MenuIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "./ui/sheet";
import { Link } from "react-router-dom";
import { Menu } from "./menu";
import { useAuthStore } from "@/stores/auth.store";
import MarcaSwitcher from "./marca-switcher";

export function SheetMenu() {
  const { user } = useAuthStore((state) => state);

  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
        <SheetHeader>
          <SheetTitle />
          <Button
            className="flex justify-center items-center pb-2 pt-1 mt-2"
            variant="link"
            asChild
          >
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/image/logo.png"
                alt="Dopitec"
                className="w-36 object-contain"
              />
            </Link>
          </Button>
        </SheetHeader>
        {user?.rol?.name === "Cliente" && (
          <div className="mx-auto">
            <MarcaSwitcher />
          </div>
        )}
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
}
