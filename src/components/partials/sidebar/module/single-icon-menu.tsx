import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { MenuItemProps } from "@/interfaces/menu-Interface";




const SingleIconMenu = ({ index, activeIndex, item, locationName }: {
  index: number;
  activeIndex: number | null;
  item: MenuItemProps;
  locationName: string;
}) => {

  const { user } = useAuthStore()
  
  const type_usuario:string  = user?.name ?? 'Administrador'



  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {
              (item.rol == type_usuario || item.rol == 'Todos') && (
                
                item.href ? (
                  <Link
                    to={item.href}
                    className={cn(
                      "h-12 w-12 mx-auto rounded-md  transition-all duration-300 flex flex-col items-center justify-center cursor-pointer relative",
                      {
                        "bg-[#efa159]/20  text-[#efa159]": locationName === item.href,
                        "text-[#57536c]  hover:bg-[#efa159]/10  hover:text-[#efa159] ":
                          locationName !== item.href,
                      }
                    )}
                  >
                    <item.icon className="w-6 h-6" />
                  </Link>
                ) : (
                  <button
                    className={cn(
                      "h-12 w-12 mx-auto rounded-md transition-all duration-300 flex flex-col items-center justify-center cursor-pointer relative  ",
                      {
                        "bg-[#efa159]/10  text-[#efa159] data-[state=delayed-open]:bg-[#efa159]/10":
                          activeIndex === index,
                        " text-[#57536c]  data-[state=delayed-open]:bg-[#efa159]/10  data-[state=delayed-open]:text-[#efa159]":
                          activeIndex !== index,
                      }
                    )}
                  >
                    <item.icon className="w-6 h-6" />
                  </button>
                )
              )
            }
            
            
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-[#efa159] fill-[#efa159] text-white z-50 relative">
            {item.title}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

export default SingleIconMenu;
