
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { cn, isLocationMatch } from "@/lib/utils";
import LinkButton from "./link-or-button";
import MultiNestedMenus from "./multi-nested";
import { useLocation } from "react-router-dom";
import { MenuItemProps } from "@/interfaces/menu-Interface";

const NestedMenus = ({
  nestedIndex,
  index,
  nestedMenus,
  toggleMulti,
  multiIndex,
  // trans,
}: {
  nestedIndex: number | null;
  index: number;
  nestedMenus: MenuItemProps[];
  locationName: string;
  toggleMulti:  (index:number) => void;
  multiIndex: number | null;
  // trans: any
}) => {
  const location = useLocation();
  const pathname = location.pathname

  return (
    <Collapsible open={nestedIndex === index}>
      <CollapsibleContent className="CollapsibleContent">
        <ul className="sub-menu space-y-3 relative before:absolute before:left-4 before:top-0  before:h-[calc(100%-5px)]  before:w-[2px] before:bg-[#efa159]/10 dark:before:bg-[#efa159]/20 before:rounded">
          {nestedMenus?.map((item, j: number) => (
            <li
              className={cn(
                "block ml-[30px]  relative first:pt-4  before:absolute first:before:top-4 before: top-0 before:-left-[14px]  before:w-[2px]  before:h-0 before:transition-all before:duration-200 ",
                {
                  "before:bg-[#efa159] first:before:h-[calc(100%-16px)]  before:h-full":
                    isLocationMatch(item.href!, pathname),
                  "last:pb-1": nestedIndex === index,
                }
              )}
              key={`sub_menu_${j}`}
            >
              <LinkButton
                toggleMulti={toggleMulti}
                item={item}
                index={j}
                multiIndex={multiIndex}

              >
                <div className={cn("pl-3  text-sm capitalize  font-normal ")}>
                  {item.title}
                </div>
              </LinkButton>
              <MultiNestedMenus
                menus={item?.child ?? []}
                multiIndex={multiIndex}
                index={j}
              />
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default NestedMenus;
