


import { Settings } from "lucide-react";
const FooterMenu = () => {

  return (
    <div className="space-y-5 flex flex-col items-center justify-center pb-6">
      <button className="w-10 h-10  mx-auto text-gray-500 flex items-center justify-center  rounded-md transition-all duration-200 hover:bg-[#efa159]/20 hover:text-[#efa159]">
        <Settings className=" h-7 w-7" />
      </button>
      <div>
        <img
          src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX4wVGjMQ37PaO4PdUVEAliSLi8-c2gJ1zvQ&s'
          alt=""
          width={36}
          height={36}
          className="rounded-full"
        />

      </div>
    </div>
  );
};
export default FooterMenu;
