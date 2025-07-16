import React from "react";
import PostCard from "../components/PostCard";
import PostCreate from "../components/PostCreate";
import api from "../api/axios.js";
import { deletePost, updatePost } from "../api/postApi.js";

const Home = () => {
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/posts");
        setPosts(res.data.posts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleAddPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  // Delete handler here in Home
  const handlePostDelete = async (postId) => {
    try {
      const deletedPost = await deletePost(postId);

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId)); // update UI
    } catch (error) {
      console.log("Failed to delete post", error);
    }
  };

  const onUpdatePost = async (formData) => {
    try {
      console.log("Updating post with ID:", formData);
      const receivedUpdatedPost = await updatePost(formData); // send formData
      console.log("Received updated post:", receivedUpdatedPost);

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === receivedUpdatedPost.updatedPost.id
            ? receivedUpdatedPost.updatedPost
            : post
        )
      );
    } catch (error) {
      console.log("Failed to update post", error);
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Loading posts...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto pt-6">
      <PostCreate onPost={handleAddPost} />
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available</p>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onDelete={handlePostDelete}
            onUpdate={onUpdatePost}
          />
        ))
      )}
    </div>
  );
};
export default Home;
