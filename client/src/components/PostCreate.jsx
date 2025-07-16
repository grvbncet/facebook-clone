import React from "react";
import api from "../api/axios";
import useAuthStore from "../store/useAuthStore";
import { ImagePlus } from "lucide-react";

const PostCreate = ({ onPost }) => {
  const [text, setText] = React.useState("");
  const [image, setImage] = React.useState(null);
  const [imageFile, setImageFile] = React.useState(null); // store actual File object
  const { user } = useAuthStore();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file)); // preview image
    setImageFile(file); // save file for upload
  };
  const handlePost = async () => {
    if (!imageFile && !text.trim()) return;

    try {
      const formData = new FormData();
      formData.append("content", text);
      if (imageFile) formData.append("image", imageFile);
      const resposne = await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onPost(resposne.data.post);
      setText("");
      setImage(null);
      setImageFile(null);
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <textarea
        value={text}
        name=""
        id=""
        onChange={(e) => setText(e.target.value)}
        placeholder={`What's on your mind ${user.name.split(" ")[0]}?`}
        className="w-full rounded-xl border bg-gray-100 text-gray-700 border-gray-300 rounded p-2 resize-none focus:outline-none focus:border-blue-500"
        rows={3}
      ></textarea>
      {image && (
        <div className="my-2">
          <img
            className="w-full max-h-60 object-cover rounded"
            src={image}
            alt="Preview"
          />
        </div>
      )}

      <div className="flex items-center justify-between mt-2">
        <label
          htmlFor="file-upload-create"
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <ImagePlus className="h-5 w-5 text-blue-500" />

          <input
            id="file-upload-create"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
        <button
          onClick={handlePost}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default PostCreate;
