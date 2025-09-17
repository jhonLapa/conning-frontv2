import { Badge } from "@/components/ui/badge";
import { MenuItemProps } from "@/interfaces/menu-Interface";
import { cn, isLocationMatch } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
const SingleMenuItem = ({ item, collapsed }: {
  item: MenuItemProps;
  collapsed: boolean
}) => {
  const location = useLocation();
  const pathname = location.pathname
  return (
    <Link to={item.href ?? ''}>
      <>
        {collapsed ? (
          <div>
            <span
              className={cn(
                "h-12 w-12 mx-auto rounded-md  transition-all duration-300 inline-flex flex-col items-center justify-center  relative  ",
                {
                  "bg-primary text-primary-foreground ": isLocationMatch(
                    item.href ?? '',
                    pathname
                  ),
                  " text-default-600  ": !isLocationMatch(item.href ?? '', pathname),
                }
              )}
            >
              <item.icon className="w-6 h-6" />
            </span>
          </div>
        ) : (
          <div
            className={cn(
              "flex gap-3  text-default-700 text-sm capitalize px-[10px] py-3 rounded cursor-pointer hover:bg-primary hover:text-primary-foreground",
              {
                "bg-primary text-primary-foreground": isLocationMatch(
                  item.href ?? '',
                  pathname
                ),
              }
            )}
          >
            <span className="flex-grow-0">
              <item.icon className="w-5 h-5" />
            </span>
            <div className="text-box flex-grow">{item.title}</div>
            {item.badge && <Badge className=" rounded">{item.badge}</Badge>}
          </div>
        )}
      </>
    </Link>
  );
};

export default SingleMenuItem;
