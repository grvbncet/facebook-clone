import api from "./axios";

export const sendFriendRequest = async (requestReceiverId) => {
  const res = await api.post("/friends/send", { requestReceiverId });
  return res.data;
};
export const acceptFriendRequest = async (requestSenderId) => {
  const res = await api.post("/friends/accept", { requestSenderId });
  return res.data;
};

export const rejectFriendRequest = async (friendId) => {
  const res = await api.post("/friends/reject", { friendId });
  return res.data;
};

export const removeFriend = async (friendId) => {
  const res = await api.post("/friends/remove", { friendId });
  return res.data;
};

export const getFriendSuggestions = async () => {
  const res = await api.get("/friends/suggestions");
  return res.data;
};
