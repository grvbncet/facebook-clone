import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import LeftSideBar from "../components/LeftSideBar";
import RightSideBar from "../components/RightSideBar";

const MainLayout = () => {
  return (
    <>
      <NavBar />
      <div className="flex bg-gray-100 min-h-[calc(100vh-64px)]">
        <div className="hidden md:block sticky top-0 h-screen">
          <LeftSideBar />
        </div>
        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </main>
        <div className="hidden lg:block sticky top-0 h-screen">
          <RightSideBar />
        </div>
      </div>
    </>
  );
};

export default MainLayout;
