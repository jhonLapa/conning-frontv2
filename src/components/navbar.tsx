import { SheetMenu } from "./sheet-menu";
import { UserNav } from "./usernav";

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
        </div>
        <div>
 
          <UserNav />
        </div>
      </div>
    </header>
  );
}
