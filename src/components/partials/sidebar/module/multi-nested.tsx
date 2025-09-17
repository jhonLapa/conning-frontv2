
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { MenuItemProps } from "@/interfaces/menu-Interface";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";


const MultiNestedMenus = ({
  multiIndex,
  index,
  menus
}: {
  multiIndex: number | null;
  index: number;
  menus: MenuItemProps[];
}) => {
  return (
    <Collapsible open={multiIndex === index}>
      <CollapsibleContent className="CollapsibleContent">
        <ul className="sub-menu space-y-3  relative  ">
          {menus?.map((item, i: number) => (
            <li
              className={cn("block ml-2  relative first:pt-4 ")}
              key={`multi_sub_menu_${i}`}
            >
              <Link to={item.href!} className="">
                <div>
                  <div
                    className={cn(
                      "pl-2  text-sm font-normal capitalize hover:text-[#efa159] gap-2 flex items-center group  text-[#efa159] ",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex h-2 w-2  border  rounded-full  ring-[#efa159]/30   ring-[4px]  border-[#efa159]  ",
                      )}
                    ></span>
                    <span>{item.title}</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default MultiNestedMenus;
