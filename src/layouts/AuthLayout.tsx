
import { ChartNoAxesCombined } from "lucide-react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  
  
  return (
    
    <>
      <div className="min-h-screen bg-[#EEF1F9]  flex items-center  overflow-hidden w-full">
        <div className="min-h-screen basis-full flex flex-wrap w-full  justify-center overflow-y-auto">
          <div className="basis-1/2 bg-[#EEF1F9] w-full  relative hidden xl:flex justify-center items-center bg-gradient-to-br from-[#1e1d35] via-[#57536c] to-[#1e1d35]"
          >
            <img
              src="/image/line.png"
              alt="image"
              className="absolute top-0 left-0 w-full h-full "
            />
            <div className="relative z-10 backdrop-blur bg-[#57536c]/30 py-14 px-16 2xl:py-[84px] 2xl:pl-[50px] 2xl:pr-[136px] rounded max-w-[640px]">
              <div>
                  <ChartNoAxesCombined  size={78} className="text-white" />
                {/* <Button className="bg-transparent hover:bg-transparent h-fit w-fit p-0"> */}
                  {/* <img src="/image/logo.png" className="w-[178px] -ml-2"/> */}
                  {/* <img src="/image/logo.png" className="w-[90px] -ml-2"/> */}
                {/* </Button> */}
                <div className="text-4xl leading-[50px] 2xl:text-6xl 2xl:leading-[72px] font-semibold mt-2.5">
                  <span className="text-[#e0d9e1] ">
                      Mejora tu <br />
                      operación <br />
                    </span>
                    <span className="text-[#e0d9e1] ">
                      logística
                    </span>
                  </div>
                  <div className="mt-5 2xl:mt-8 text-[#e0d9e1]  text-2xl font-medium">
                    No necesitas saberlo todo. <br />
                    Solo moverte con inteligencia.
                  </div>

              </div>
            </div>
          </div>

          <div className=" min-h-screen basis-full md:basis-1/2 w-full px-4 py-5 flex justify-center items-center">
            <div className="lg:w-[480px] ">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
      
    </>


     
  );
}
