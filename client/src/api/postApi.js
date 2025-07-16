import api from "./axios.js";

export const createPost = async (data) => {
  const res = await api.post("/api/posts", data);
  return res.data.post;
};

export const getFeedPosts = async () => {
  const res = await api.get("/api/posts");
  return res.data.posts;
};

export const deletePost = async (id) => {
  const res = await api.delete("/posts", { data: { id } });
  return res.data;
};

export const updatePost = async (formData) => {
  const res = await api.patch("/posts", formData);
  console.log("Updated post:", res.data);

  return res.data;
};
