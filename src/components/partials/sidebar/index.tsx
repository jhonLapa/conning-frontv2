import { JSX } from "react";
import { useSidebar } from "@/stores/sidebar.store";
import ModuleSidebar from "./module";



const Sidebar = () => {
  const { sidebarType } = useSidebar();

  let selectedSidebar = null;

  const sidebarComponents: { [key: string]: JSX.Element } = {
    module: <ModuleSidebar />,
  };

  selectedSidebar = sidebarComponents[sidebarType] || <ModuleSidebar />;

  return <div>{selectedSidebar}</div>;
};

export default Sidebar;
