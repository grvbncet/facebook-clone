import api from "./axios.js";

export const createLike = async (data) => {
  const res = await api.post("/likes", data);

  return res.data.reaction;
};

export const removeLike = async (data) => {
  const res = await api.delete("/likes", { data: data });

  return res.data.reaction;
};
