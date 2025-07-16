import { Cake, UserPlus } from "lucide-react";
import React from "react";
import useDummyDataStore from "../store/useDummyDataStore";
import useAuthStore from "../store/useAuthStore";
import { getFriendSuggestions, sendFriendRequest } from "../api/friends";

const RightSidebar = () => {
  const [suggestions, setSuggestions] = React.useState([]);
  const { getInitials } = useAuthStore();

  // const { Friends } = useDummyDataStore();

  React.useEffect(() => {
    const fetchSuggestions = async () => {
      const data = await getFriendSuggestions();
      if (data.suggestedMutualUsers.length > 5) {
        setSuggestions(data.suggestedMutualUsers);
      } else {
        setSuggestions(data.suggestedUsers);
      }
    };
    fetchSuggestions();
  }, []);

  const handleSendRequest = async (id) => {
    console.log("Sending friend request to", id);

    const res = await sendFriendRequest(id);
    console.log("Friend request sent", res);

    setSuggestions((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <aside className="hidden lg:block w-64 px-4 py-4">
      <div className="space-y-6 text-sm text-gray-800">
        {/* Birthdays */}
        <div>
          <h3 className="font-semibold mb-2">Birthdays</h3>
          <p className="flex items-center gap-2 hover:bg-gray-200 p-2 rounded cursor-pointer text-gray-600">
            <Cake />
            Alice and 2 others have birthdays today.
          </p>
        </div>

        {/* Your Pages */}
        <div>
          <h3 className="font-semibold mb-2">Your Pages</h3>
          <ul className="space-y-1">
            <li className="hover:bg-gray-200 p-2 rounded cursor-pointer">
              My Business Page
            </li>
            <li className="hover:bg-gray-200 p-2 rounded cursor-pointer">
              Social Media Tips
            </li>
          </ul>
        </div>

        {/* Contacts */}
        <div>
          <h3 className="font-semibold mb-2">Friend Suggestions</h3>
          <ul className="space-y-2">
            {suggestions.map((contact, index) => (
              <li
                key={index}
                className="flex items-center gap-2 hover:bg-gray-200 p-2 rounded cursor-pointer"
              >
                <span className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center font-bold text-white text-xs">
                  {getInitials(contact.name)}
                </span>
                <span>{contact.name}</span>
                <span className="ml-auto flex items-center gap-2 ">
                  <button
                    onClick={() => handleSendRequest(contact.id)}
                    title="Add Friend"
                    className="bg-blue-600 text-white px-2 py-0.5 rounded-md hover:bg-blue-700 "
                  >
                    <UserPlus />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
