import { useStore } from "@/hooks";
import { cn } from "@/lib/utils";
// import { Link } from "react-router-dom";
// import { Button } from "./ui/button";
import { useSidebar } from "@/stores/sidebar.store";
// import { SidebarToggle } from "./sidebar-toggle";
// import { Menu } from "./menu";

export function Sidebar() {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  // const { isOpen, toggleOpen, getOpenState, setIsHover, settings } = sidebar;
  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        // !getOpenState() ? "w-[90px]" : "w-72",
        // settings.disabled && "hidden"
      )}
    >
      {/* <SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} /> */}
      {/* <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="relative h-full flex flex-col overflow-auto scrollbar-none shadow-md"
      >
        <div className="flex flex-1 justify-center items-center mt-4 mb-4">
          <Button
            className={cn(
              "transition-transform ease-in-out duration-300",
              !getOpenState() ? "translate-x-1" : "translate-x-0"
            )}
            variant="link"
            asChild
          >
            <Link to="/" className="flex items-center gap-2">
              <img
                src={!getOpenState() ? "/favicon.ico" : "/image/logo.png"}
                alt="Dopitec"
                className={`${
                  !getOpenState() ? "w-10 mr-2" : "w-36"
                } object-contain`}
              />
            </Link>
          </Button>
        </div>

        <Menu isOpen={getOpenState()} />
      </div> */}
    </aside>
  );
}
