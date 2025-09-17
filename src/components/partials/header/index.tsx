
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useSidebar, useThemeStore } from "@/stores/sidebar.store";
import ProfileInfo from "./profile-info";
import VerticalHeader from "./vertical-header";
// import NotificationMessage from "./notification-message";

import { useMediaQuery } from "@/hooks/use-media-query";
import MobileMenuHandler from "./mobile-menu-handler";
import ClassicHeader from "./layout/classic-header";


const NavTools = ({ isDesktop,  sidebarType }: { isDesktop: boolean; sidebarType: string }) => {
  return (
    <div className="nav-tools flex items-center  gap-2">
      {/* <ThemeButton /> */}
      {/* <NotificationMessage /> */}

      <div className="ltr:pl-3 rtl:pr-2">
        <ProfileInfo />
      </div>
      {!isDesktop && sidebarType !== "module" && <MobileMenuHandler />}
    </div>
  );
};


const Header = ({ handleOpenSearch }: { handleOpenSearch: () => void; }) => {
  
  const { collapsed, sidebarType,  setSidebarType } = useSidebar();
  const { layout, navbarType,  } = useThemeStore();

  const isDesktop = useMediaQuery("(min-width: 1280px)");

  // set header style to classic if isDesktop
  useEffect(() => {
    if (!isDesktop && layout === "horizontal") {
      setSidebarType("classic");
    }
  }, [isDesktop]);

  return (
    <ClassicHeader
      className={cn("", {
        "ltr:xl:ml-[300px] rtl:xl:mr-[300px]": !collapsed,
        "ltr:xl:ml-[72px] rtl:xl:mr-[72px]": collapsed,
        "sticky top-0": navbarType === "sticky",
      })}
    >
      <div className={cn("w-full flex flex-row items-center bg-card/90 backdrop-blur-lg md:px-6 px-[15px] py-3 border-b justify-between")}>
        <div className="flex items-center">
          <VerticalHeader handleOpenSearch={handleOpenSearch} />
        </div>
        <div className="flex items-center gap-4">
          <NavTools 
            isDesktop={isDesktop}
            sidebarType={sidebarType}
          />
        </div>
      </div>
    </ClassicHeader>
  );
};

export default Header;
