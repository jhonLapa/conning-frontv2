import React from "react";
import { cn, isLocationMatch } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

import { Link, useLocation } from "react-router-dom";
import { MenuItemProps } from "@/interfaces/menu-Interface";
const LinkButton = ({
  children,
  item,
  toggleMulti,
  index,
  multiIndex,
}: {
  children: React.ReactNode;
  item: MenuItemProps;
  toggleMulti: (index:number) => void;
  index: number;
  multiIndex: number | null;
}) => {
    const location = useLocation();
    const pathname = location.pathname
  return (
    <>
      {item.child ? (
        <button
          type="button"
          onClick={() => toggleMulti(index)}
          className={cn(
            "flex items-center justify-between w-full relative before:absolute  before: top-0 before:-left-[14px]  before:w-[2px] before:h-0 before:transition-all before:duration-200 ",
            {
              "text-[#efa159]  rounded before:bg-[#efa159]   before:h-full":
                multiIndex === index,
            }
          )}
        >
          <span>{children}</span>
          <span
            className={cn(
              "flex-none transition-all duration-200 text-[#efa159] ",
              {
                " transform rotate-90  text-[#efa159]": multiIndex === index,
              }
            )}
          >
            <ChevronRight className="w-3.5 h-3.5 " />
          </span>
        </button>
      ) : (
        <Link
          to={item.href!}
          className={cn("text-[#efa159] hover:text-[#efa159]/70", {
            " text-[#efa159] rounded": isLocationMatch(
              item.href!,
              pathname
            ),
            " text-[#efa159] hover:text-[#efa159]/70 ": !isLocationMatch(
              item.href!,
              pathname
            ),
          })}
        >
          {children}
        </Link>
      )}
    </>
  );
};

export default LinkButton;
