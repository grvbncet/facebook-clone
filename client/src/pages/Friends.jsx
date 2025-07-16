import React from "react";
import useDummyData from "../store/useDummyDataStore";
import useAuthStore from "../store/useAuthStore";
import { Search } from "lucide-react";
import api from "../api/axios";
import {
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
} from "../api/friends";

const Freinds = () => {
  const { getInitials } = useAuthStore();

  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("All");
  const [displaySent, setDisplaySent] = React.useState(false);
  const [displayReceived, setDisplayReceived] = React.useState(false);

  // Get all friends list
  const [friends, setFriends] = React.useState([]);

  React.useEffect(() => {
    const fetchFriendsData = async () => {
      try {
        const [friends, receivedRes, sentRes] = await Promise.all([
          api.get("/friends/list"),
          api.get("/friends/received-requests"),
          api.get("/friends/sent-requests"),
        ]);

        // Map each friend/request into unified object
        const formattedFriends = [
          ...friends.data.friendsList.map((f) => ({
            id: f.id,
            name: f.name,
            status: "Online", // or from socket later
            isFriend: true,
          })),
          ...receivedRes.data.receivedRequest.map((r) => ({
            id: r.id,
            name: r.sender.name,
            status: "Offline", // or from socket later
            isRequest: true,
          })),
          ...sentRes.data.sendRequests.map((r) => ({
            id: r.id,
            name: r.receiver.name,
            status: "Offline", // or from socket later
            isPending: true,
          })),
        ];

        setFriends(formattedFriends);
      } catch (error) {
        console.error("Error loading friends", error);
      }
    };

    fetchFriendsData();
  }, []);

  // Remove a friend
  const handleRemoveFriend = async (id) => {
    try {
      await removeFriend(id);
      setFriends((prev) =>
        prev.map((f) => (f.id === id ? { ...f, isFriend: false } : f))
      );
    } catch (error) {
      console.log("Failed to remove friend", error);
    }
  };

  // Accept friend request
  const handleAccept = async (id) => {
    try {
      await acceptFriendRequest(id);

      setFriends((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, isRequest: false, isFriend: true } : f
        )
      );
    } catch (error) {
      console.log("Failed to accept friend request", error);
    }
  };
  const handleReject = async (id) => {
    try {
      await rejectFriendRequest(id);
      setFriends((prev) => prev.filter((f) => f.id !== id));
    } catch (error) {
      console.log("Failed to reject friend request", error);
    }
  };

  // Revoke sent Request

  const handleRevokeRequest = async (id) => {
    try {
      await rejectFriendRequest(id);
      setFriends((prev) => prev.filter((f) => f.id !== id));
    } catch (error) {
      console.log("Failed to reject friend request", error);
    }
  };

  // Filtered friends list
  const filteredFriends = friends.filter(
    (f) =>
      f.isFriend &&
      (filter === "All" || f.status === filter) &&
      f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto pt-6">
      <h2 className="text-2xl font-semibold mb-4">Friends</h2>
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 border border-gray-600 w-full sm:w-1/2  px-3 py-2 rounded">
          <Search />
          <input
            type="text"
            name=""
            id=""
            placeholder="Search friends"
            value={search}
            className="w-full outline-none"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          name=""
          id=""
          value={filter}
          className="border px-3 py-2 rounded"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
        </select>
      </div>
      {/* Friend Requests */}
      <div className="flex gap-4 py-2 mb-4 justify-center md:justify-start  items-center">
        <button
          className="bg-gray-300 px-3 py-1 rounded-md hover:bg-gray-400"
          onClick={() => {
            setDisplaySent(true);
            setDisplayReceived(false);
          }}
        >
          Sent
        </button>
        <button
          className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
          onClick={() => {
            setDisplaySent(false);
            setDisplayReceived(true);
          }}
        >
          Received
        </button>
        <button
          className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
          onClick={() => {
            setDisplaySent(false);
            setDisplayReceived(false);
          }}
        >
          Friends
        </button>
      </div>

      {displaySent && friends.some((f) => f.isPending) && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Sent Requests</h3>
          <div className="space-y-3">
            {friends
              .filter((f) => f.isPending)
              .map((f) => (
                <div
                  key={f.id}
                  className="bg-white p-4 rounded shadow flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                      {getInitials(f.name)}
                    </div>
                    <span>{f.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                      onClick={() => handleRevokeRequest(f.id)}
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      {displayReceived && friends.some((f) => f.isRequest) && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Received Requests</h3>
          <div className="space-y-3">
            {friends
              .filter((f) => f.isRequest)
              .map((f) => (
                <div
                  key={f.id}
                  className="bg-white p-4 rounded shadow flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                      {getInitials(f.name)}
                    </div>
                    <span>{f.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      onClick={() => handleAccept(f.id)}
                    >
                      Accept
                    </button>

                    <button
                      className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                      onClick={() => handleReject(f.id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      {/* Friends List */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Friends</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFriends.length > 0 ? (
            filteredFriends.map((f) => (
              <div
                key={f.id}
                className="bg-white p-4 rounded shadow flex items-center justify-between"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                  {getInitials(f.name)}
                </div>
                <div>
                  <h3 className="font-medium">{f.name}</h3>
                  <p
                    className={`text-sm ${
                      f.status === "Online" ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {f.status}
                  </p>
                </div>
                <div>
                  {f.isFriend ? (
                    <button
                      onClick={() => handleRemoveFriend(f.id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddFriend(f.id)}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No friends found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Freinds;
