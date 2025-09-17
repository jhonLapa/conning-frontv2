import { cn, isLocationMatch } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { MenuItemProps } from "@/interfaces/menu-Interface";




function NavLink({ childItem }: {
  childItem: MenuItemProps;
}) {
  
  const location = useLocation();
  const pathname = location.pathname

  return (
    <Link
      to={childItem.href!}
      className={cn(
        "flex text-sm capitalize px-[10px] py-3 gap-3 rounded-md cursor-pointer ",
        {
          "bg-[#efa159] text-white ": isLocationMatch(
            childItem.href!,
            pathname
          ),
          "text-gray-700 ": !isLocationMatch(childItem.href!, pathname),
        }
      )}
    >
      {childItem.icon && (
        <span className="inline-flex items-center  flex-grow-0">
          <childItem.icon className=" h-5 w-5" />
        </span>
      )}
      <div className="flex-grow truncate">{childItem.title}</div>
      {childItem.badge && <Badge className="rounded h-min ">{childItem.badge}</Badge>}
    </Link>
  );
}

const MenuItem = ({
  childItem,
  toggleNested,
  nestedIndex,
  index,
}: {
  childItem: MenuItemProps;
  toggleNested: (subIndex: number) => void;
  nestedIndex: number | null;
  index: number;
}) => {
  return (
    <div>
      {childItem?.nested ? (
        <div
          className={cn("flex items-center gap-3 px-[10px] py-3 rounded-md text-gray-500 ", {
            "bg-white ": nestedIndex === index,
            "text-gray-500": nestedIndex !== index,
          })}
        >
          <div
            className={cn(
              "flex  font-medium   text-sm capitalize  gap-3 cursor-pointer flex-1 "
            )}
            onClick={() => toggleNested(index)}
          >
            <span className="inline-flex items-center  flex-grow-0 text-[#1e1d35]">
              <childItem.icon className=" h-6.5 w-6.5" />
            </span>
            <span className="flex-grow truncate ">
              {childItem.title}
            </span>
          </div>
          {childItem.nested && (
            <div
              className={cn(
                "flex-none transition-all duration-200 text-[#1e1d35] ",
                {
                  "transform rotate-90   text-[#57536c]":
                    nestedIndex === index,
                }
              )}
            >
              <ChevronRight className="w-3.5 h-3.5 " />
            </div>
          )}
        </div>
      ) : (
        <div className=" flex-1">
          <NavLink
            childItem={childItem}
          />
        </div>
      )}
    </div>
  );
};

export default MenuItem;
