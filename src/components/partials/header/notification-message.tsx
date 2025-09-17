
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { notifications } from "./notification-data";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";

const NotificationMessage = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative md:h-9 md:w-9 h-8 w-8 hover:bg-default-100  
          data-[state=open]:bg-white
           hover:text-gray-700 text-gray-700 rounded-full  "
        >
          <Bell className="h-8 w-8 " />
          <Badge className="w-4 h-4 p-0 text-xs  font-medium  items-center justify-center absolute left-[calc(100%-18px)] bottom-[calc(100%-16px)] ring-2 bg-[#efa159]">
            2
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[999] mx-4 lg:w-[412px] p-0">
        <DropdownMenuLabel style={{ backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-VPExqPq61L-aJCsESzUZONCqOuh0XpeZtQ&s')` }} className="w-full h-full bg-cover bg-no-repeat p-4 flex items-center">
          <span className="text-base font-semibold text-white flex-1">Notification</span>
        </DropdownMenuLabel>
        <div className="h-[300px] xl:h-[350px]">
          <ScrollArea className="h-full">
            {notifications.map((item, index) => (
              <DropdownMenuItem key={`inbox-${index}`} className="flex gap-9 py-2 px-4 cursor-pointer dark:hover:bg-background">
                <div className="flex-1 flex items-center gap-2">
                  <Avatar className="h-10 w-10 rounded">
                    <AvatarImage />
                    <AvatarFallback>SN</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-[2px] whitespace-nowrap">
                      {item.fullName}
                    </div>
                    <div className="text-xs text-default-900 truncate max-w-[100px] lg:max-w-[185px]">
                      {item.message}
                    </div>
                  </div>
                </div>
                <div
                  className={cn("text-xs font-medium text-gray-900 whitespace-nowrap",{ "text-[#1e1d35]": !item.unreadmessage })}>
                  {item.date}
                </div>
                <div
                  className={cn("w-2 h-2 rounded-full mr-2", {
                    "bg-[#1e1d35]": !item.unreadmessage,
                  })}
                ></div>
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        </div>
        <DropdownMenuSeparator />
        <div className="m-4 mt-5">
          <Button asChild className="w-full">
            <Link to="/dashboard">Ver Todos</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationMessage;
