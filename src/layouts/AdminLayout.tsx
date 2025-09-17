import { cn } from "@/lib/utils";
import { useSidebar } from "@/stores/sidebar.store";
import { useState } from "react";
import { motion } from "framer-motion";
import { useMounted } from "@/hooks/use-mounted";
import Header from "@/components/partials/header";
import Sidebar from "@/components/partials/sidebar";
import Footer from "@/components/partials/footer";
import LayoutLoader from "@/components/layout-loader";
import { Outlet } from "react-router-dom";
// import { useAuthStore } from "@/stores/auth.store";


const AdminLayout = () => {

    const { collapsed } = useSidebar();
    const [open, setOpen] = useState(false);
    const mounted = useMounted();
  
    // const { isAuthenticated, user } = useAuthStore((state) => state);

    // if (!isAuthenticated || !user) {
    //   return <Navigate to="/auth" replace />;
    // }


    if (!mounted) {
      return <LayoutLoader />;
    }




  return (
    <>
      <Header handleOpenSearch={() => setOpen(true)}  />
      <Sidebar  />

      <div
        className={cn("content-wrapper transition-all duration-150 ", {
          "ltr:xl:ml-[300px] rtl:xl:mr-[300px]": !collapsed,
          "ltr:xl:ml-[72px] rtl:xl:mr-[72px]": collapsed,
        })}
      >
        <div className={cn("layout-padding px-6 pt-6  page-min-height bg-[#eef1f9]")}>
          <LayoutWrapper  open={open}>
            <Outlet />
          </LayoutWrapper>
        </div>
      </div>
      <Footer handleOpenSearch={() => setOpen(true)} />
    </>
  );
};

export default AdminLayout;


const LayoutWrapper = ({ children  }: { children: React.ReactNode, open: boolean }) => {
  return (
    <>
      <motion.div
        initial="pageInitial"
        animate="pageAnimate"
        exit="pageExit"
        variants={{
          pageInitial: {
            opacity: 0,
            y: 50,
          },
          pageAnimate: {
            opacity: 1,
            y: 0,
          },
          pageExit: {
            opacity: 0,
            y: -50,
          },
        }}
        transition={{
          type: "tween",
          ease: "easeInOut",
          duration: 0.5,
        }}
      >
        <main>{children}</main>
      </motion.div>
    </>
  );
};
