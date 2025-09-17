
import { LogOut } from "lucide-react";


const LogoutFooter = () => {


  return (
    <>
      <div className=" bg-default-50 dark:bg-default-200 items-center flex gap-3  px-4 py-2 mt-5">
        <div className="flex-1">
          <div className=" text-gray-700 font-semibold text-sm capitalize mb-0.5 truncate">
            Leonardo Chavesta
          </div>
          <div className=" text-xs text-gray-600  truncate">
            leonardo@gmail.com
          </div>
        </div>
        <div className=" flex-none">
          <button
            type="button"
            className="  text-gray-500 inline-flex h-9 w-9 rounded items-center  dark:bg-[#1e1d35] justify-center dark:text-[#1e1d35]"
          >
            <LogOut
              className=" h-5 w-5"
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default LogoutFooter;
