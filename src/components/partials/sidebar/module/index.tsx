import { useEffect, useState } from "react";
import { MenuConfigProps, menusConfig } from "@/config/menus";
import { cn, isLocationMatch } from "@/lib/utils";
import SingleIconMenu from "./single-icon-menu";
import { useSidebar, useThemeStore } from "@/stores/sidebar.store";
import MenuItem from "./menu-item";
import NestedMenus from "./nested-menus";
import FooterMenu from "./footer-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import LogoutFooter from "./logout-footer";
import { useMediaQuery } from "@/hooks/use-media-query";
import MenuOverlayPortal from "./MenuOverlayPortal";
import { ChartNoAxesCombined, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { MenuItemProps } from "@/interfaces/menu-Interface";
interface MenuProps {
  menuIndex: number, 
  nestedMenuIndex?: number,
  childMenu: MenuItemProps[] | []
}


const ModuleSidebar = () => {
  
  const menu: MenuConfigProps = menusConfig();

  const [menus ,setMenus] = useState<MenuItemProps[]>(menu.sidebarNav.modern)
  
  const { subMenu, setSubmenu, collapsed, setCollapsed, sidebarBg } =
    useSidebar();
  const { isRtl } = useThemeStore();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [currentSubMenu, setCurrentSubMenu] = useState<MenuItemProps[]>([]);
  const [nestedIndex, setNestedIndex] = useState<number | null>(0);
  const [multiNestedIndex, setMultiNestedIndex] = useState<number | null>(null);
  // mobile menu overlay
  const [menuOverlay, setMenuOverlay] = useState<boolean>(false);
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  

  const location = useLocation();
  const pathname = location.pathname
  
  const getMenu = async () => {
    const response = await menusConfig();
    setMenus(response.sidebarNav.modern)
  }

  useEffect(() =>{
    getMenu()
  },[])

   

  const toggleSubMenu = (index: number) => {
    setActiveIndex(index);
    if (menus && menus[index].child) {
      setCurrentSubMenu(menus[index].child);
      setSubmenu(false);
      setCollapsed(false);
      if (!isDesktop) {
        setMenuOverlay(true);
      }
    } else {
      setSubmenu(true);
      setCollapsed(true);

      if (!isDesktop) {
        // when location match need to close the sub menu
        if(menus){
          if (isLocationMatch(menus[index].title, pathname!)) {
            setSubmenu(false);
          }
        }
      }
    }
  };
  // for second level  menu
  // const toggleNested = (subIndex: number) => {
  //   if (nestedIndex === subIndex) {
  //     setNestedIndex(0);
  //   } else {
  //     setNestedIndex(subIndex);
  //   }
  // };
  const toggleNested = (subIndex: number) => {
  setNestedIndex(prev => (prev === subIndex ? null : subIndex));
};

  // for third level menu
  const toggleMultiNested = (index: number) => {
    if (multiNestedIndex === index) {
      setMultiNestedIndex(null);
    } else {
      setMultiNestedIndex(index);
    }
  };

  function setActiveMenu({ childMenu , menuIndex }:MenuProps  ) {
    setActiveIndex(menuIndex);
    setCurrentSubMenu(childMenu);
    setSubmenu(false);
    setCollapsed(false);
  }

  function setActiveNestedMenu({ childMenu , nestedMenuIndex , menuIndex }:MenuProps) {
    setActiveIndex(menuIndex);
    setNestedIndex(nestedMenuIndex!);
    setCurrentSubMenu(childMenu);
    setSubmenu(false);
    setCollapsed(false);
  }
  //
  const getMenuTitle = () => {
    if (menus && activeIndex !== null) {
      return menus[activeIndex].title;
    }
    return "";
  };

  useEffect(() => {
    let isMenuMatched = false;
    menus?.forEach((item , index) => {
      const forEachtItems : MenuProps = {
          childMenu: item.child ?? [],
          menuIndex: index
      }

      if (item?.href) {
        if (isLocationMatch(item.href, pathname!)) {
          isMenuMatched = true;
          setSubmenu(true);
          setCollapsed(true);
          setMenuOverlay(false);
        }
      }

      item?.child?.forEach(( childItem , j: number) => {
        if (isLocationMatch(childItem.href!, pathname!)) {
          setActiveMenu(forEachtItems);
          setMenuOverlay(false);
          isMenuMatched = true;
        }

        if (childItem.nested) {
          childItem.nested.forEach((nestedItem: MenuItemProps) => {
            if (isLocationMatch(nestedItem.href!, pathname!)) {
              forEachtItems.nestedMenuIndex = j
              setActiveNestedMenu(forEachtItems);
              setMenuOverlay(false);
              isMenuMatched = true;
            }
            if (nestedItem.child) {
              nestedItem.child.forEach((multiItem: MenuItemProps) => {
                if (isLocationMatch(multiItem.href!, pathname!)) {
                  forEachtItems.nestedMenuIndex = j
                  setActiveNestedMenu(forEachtItems);
                  setMenuOverlay(false);
                  isMenuMatched = true;
                }
              });
            }
          });
        }
      });

    });
    if (!isMenuMatched) {
      setSubmenu(false);
    }
    if (!isDesktop) {
      setSubmenu(true);
    }
  }, [pathname, isDesktop]);


  



  return (
    <>
      <div className="main-sidebar  pointer-events-none fixed start-0 top-0 z-[60] flex h-full xl:z-10 print:hidden">
        <div
          className={cn(
            "border-default-200  dark:border-default-300 pointer-events-auto relative z-20 flex h-full w-[72px] flex-col border-r border-dashed   bg-card transition-all duration-300",
            {
              "ltr:-translate-x-full rtl:translate-x-full ltr:xl:translate-x-0  rtl:xl:translate-x-0":
                !collapsed && subMenu,
              "translate-x-0": collapsed,
            }
          )}
        >
          <div className="flex items-center justify-center p-4">
            <Link to="/">
              <ChartNoAxesCombined size={40} className=" mx-auto text-[#efa159] w-16" />
            </Link>
          </div>
          {/* end logo */}
          <ScrollArea className=" pt-6 grow ">
            {menus?.map((item, i) => (
              <div
                key={i}
                onClick={() => toggleSubMenu(i)}
                className=" mb-3 last:mb-0"
              >
                <SingleIconMenu
                  index={i}
                  activeIndex={activeIndex}
                  item={item}
                  locationName={pathname}
                />
              </div>
            ))}
          </ScrollArea>
          <FooterMenu />
        </div>
        {/* end small menu */}

        <div
          className={cn(
            "border-default-200 pointer-events-auto relative z-10 flex flex-col h-full w-[228px] border-r  bg-card   transition-all duration-300",
            {
              "rtl:translate-x-[calc(100%_+_72px)] translate-x-[calc(-100%_-_72px)]":
                collapsed || subMenu,
            }
          )}
        >
          {sidebarBg !== "none" && (
            <div
              className=" absolute left-0 top-0   z-[-1] w-full h-full bg-cover bg-center opacity-[0.07]"
              style={{ backgroundImage: `url(${sidebarBg})` }}
            ></div>
          )}
          <h2 className="text-lg  bg-transparent   z-50   font-semibold  flex gap-4 items-center   text-default-700 sticky top-0 py-4  px-4   capitalize ">
            <span className=" block ">{getMenuTitle()}</span>
            {!isDesktop && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setCollapsed(true);
                  setSubmenu(true);
                  setMenuOverlay(false);
                }}
                className="rounded-full h-8 w-8"
              >
                <ChevronLeft className="w-5 h-5  " />
              </Button>
            )}
          </h2>
          <ScrollArea className="h-[calc(100%-40px)]  grow ">
            <div className="px-4 " dir={isRtl ? "rtl" : "ltr"}>
              <ul>
                {currentSubMenu?.map((childItem, j) => (
                  <li key={j} className="mb-1.5 last:mb-0">
                    <MenuItem
                      childItem={childItem}
                      toggleNested={toggleNested}
                      index={j}
                      nestedIndex={nestedIndex}
                    />
                    <NestedMenus
                      index={j}
                      nestedIndex={nestedIndex}
                      nestedMenus={childItem.nested!}
                      locationName={pathname!}
                      toggleMulti={toggleMultiNested}
                      multiIndex={multiNestedIndex}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </ScrollArea>
          <LogoutFooter />
        </div>
        {/* end main panel */}
      </div>
      {!isDesktop && (
        <MenuOverlayPortal
          isOpen={menuOverlay || collapsed}
          onClose={() => {
            setMenuOverlay(false);
            setSubmenu(true);
            setCollapsed(false);
          }}
        />
      )}
    </>
  );
};

export default ModuleSidebar;
