import React from "react";
import {
  CalendarClock,
  ChevronDown,
  Gamepad2,
  LayoutGrid,
  Store,
  User,
  Users,
  Video,
} from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import { Link } from "react-router-dom";

const LeftSideBar = () => {
  const { user } = useAuthStore();

  const sideBarItems = [
    { icon: <User size={20} />, label: user.name || "Profile", to: "/profile" },
    { icon: <Users size={20} />, label: "Friends", to: "/friends" },
    { icon: <Video size={20} />, label: "Reels", to: "/reels" },
    { icon: <Store size={20} />, label: "Marketplace", to: "/marketplace" },
    { icon: <LayoutGrid size={20} />, label: "Groups", to: "/groups" },
    { icon: <Gamepad2 size={20} />, label: "Games", to: "/games" },
    { icon: <CalendarClock size={20} />, label: "Events", to: "/events" },
    { icon: <ChevronDown size={20} />, label: "See more", to: "/see-more" },
  ];
  return (
    <aside className="hidden md:block w-64 px-4 py-4">
      <ul className="space-y-2">
        {sideBarItems.map((item, index) => {
          return (
            <Link to={item.to} key={index}>
              <li
                key={index}
                className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded cursor-pointer"
              >
                <div className="text-blue-600">{item.icon}</div>
                <span className="text-sm font-medium text-gray-700 hover:text-blue-600">
                  {item.label}
                </span>
              </li>
            </Link>
          );
        })}
      </ul>
    </aside>
  );
};

export default LeftSideBar;
