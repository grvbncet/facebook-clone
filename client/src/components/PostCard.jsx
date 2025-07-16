import React from "react";

import {
  ImagePlus,
  MessageCircle,
  Pencil,
  Share2,
  ThumbsUp,
  Trash,
  X,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { createLike, removeLike } from "../api/likeApi";

import useAuthStore from "../store/useAuthStore";

const PostCard = ({ post, onDelete, onUpdate }) => {
  const [displayComments, setDisplayComments] = React.useState(false);
  const [showReactions, setShowReactions] = React.useState(false);
  const [reactionEmoji, setReactionEmoji] = React.useState(null);
  const [liked, setLiked] = React.useState(false);
  const timerRef = React.useRef(null);
  const [currentUserPost, setCurrentUserPost] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [content, setContent] = React.useState(post.content);
  const [imageFile, setImageFile] = React.useState(null);
  const [removeImage, setRemoveImage] = React.useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState(null);

  const { user } = useAuthStore();

  React.useEffect(() => {
    if (post?.User?.id === user?.id) {
      setCurrentUserPost(true);
    } else {
      setCurrentUserPost(false);
    }
  }, [post, user]);

  React.useEffect(() => {
    if (imageFile) {
      const preview = URL.createObjectURL(imageFile);
      setImagePreviewUrl(preview);

      // Cleanup when component unmounts or imageFile changes
      return () => URL.revokeObjectURL(preview);
    } else {
      setImagePreviewUrl(null);
    }
  }, [imageFile]);

  React.useEffect(() => {
    if (post.currentUserReaction) {
      const match = emojiOptions.find(
        (emoji) => emoji.title === post.currentUserReaction
      );

      if (match) {
        setReactionEmoji(match);
        setLiked(true);
      }
    }
  }, [post.currentUserReaction]);

  const emojiOptions = [
    { image: "👍", title: "Like" },
    { image: "❤️", title: "Love" },
    { image: "😂", title: "Laugh" },
    { image: "😮", title: "Wow" },
    { image: "😢", title: "Sad" },
    { image: "😡", title: "Angry" },
  ];

  const handleMouseEnter = () => {
    clearTimeout(timerRef.current);
    setShowReactions(true);
  };

  const handleOnShare = () => {};

  const handlePostEdit = async () => {
    setIsEditing(true);
    if (!post.imageUrl) {
      setRemoveImage(true);
    }
  };

  const onDeleteClick = async () => {
    onDelete(post.id);
  };

  const removeReaction = async () => {
    try {
      removeLike({ postId: post.id });
      setLiked(false);
    } catch (error) {}
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setShowReactions(false);
    }, 1000);
  };

  const handlePostComment = () => {
    setDisplayComments(!displayComments);
  };

  const handleReactionClick = async (emoji) => {
    try {
      createLike({ postId: post.id, reaction: emoji.title });
      setReactionEmoji(emoji);
      setShowReactions(false);
      setLiked(true);
      clearTimeout(timerRef.current);
    } catch (error) {}
  };

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  return (
    <div className="bg-white rounded shadow p-4 mb-6">
      {/* User Info */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
          {post.User.name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-sm">
            {(currentUserPost && "You") || post.User.name}
          </p>
          <p className="text-xs text-gray-500">{timeAgo}</p>
        </div>
        {currentUserPost && (
          <div className="ml-auto flex gap-2">
            <button onClick={handlePostEdit}>
              <Pencil
                size={16}
                className="cursor-pointer hover:text-blue-500"
              />
            </button>
            <button onClick={onDeleteClick}>
              <Trash size={16} className="cursor-pointer hover:text-red-500" />
            </button>
          </div>
        )}
      </div>

      {/* Post Content */}

      {isEditing ? (
        <div className="mb-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border p-2 rounded"
          />
          {/* Show existing or newly selected image with remove button */}
          {!removeImage && (imageFile || post.imageUrl) && (
            <div className="relative w-full mb-2">
              <img
                src={
                  imagePreviewUrl
                    ? imagePreviewUrl
                    : `${import.meta.env.VITE_API_BASE_URL}${post.imageUrl}`
                }
                alt="Selected"
                className="w-full h-auto max-h-96 object-cover rounded"
              />
              <button
                onClick={() => {
                  setImageFile(null);
                  setRemoveImage(true);
                }}
                className="absolute top-2 right-2 cursor-pointer rounded-full w-6 h-6 flex items-center justify-center"
                title="Remove Image"
              >
                <X
                  size={16}
                  className="text-white bg-red-500 rounded-full hover:text-red-500 hover:bg-white"
                />
              </button>
            </div>
          )}
          {/* File upload only shown if no image */}
          {removeImage && (
            <label
              htmlFor="file-upload-update"
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <ImagePlus className="h-5 w-5 text-blue-500" />

              {/* Hidden input */}
              <input
                id="file-upload-update"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  setImageFile(e.target.files[0]);
                  setRemoveImage(false); //hide upload after choosing
                  e.target.value = "";
                }}
              />
            </label>
          )}
          <div className="flex gap-2 mt-2 justify-end">
            <button
              onClick={() => {
                setIsEditing(false);
                setContent(post.content); // reset if canceled
                setImageFile(null);
                setRemoveImage(false);
              }}
              className="text-sm px-3 py-1 rounded border hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const formData = new FormData();
                formData.append("content", content);
                formData.append("postId", post.id);
                if (imageFile) formData.append("image", imageFile);
                if (removeImage) formData.append("removeImage", "true");
                onUpdate(formData); // update API
                setIsEditing(false);
              }}
              className="text-sm px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-800 mb-3">{post.content}</div>
      )}

      {!isEditing && post.imageUrl && (
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}${post.imageUrl}`}
          alt="post"
          className="w-full h-auto max-h-96 object-cover rounded mb-3"
        />
      )}

      {/* Reactions Count Summary */}
      {post.reactionCount && (
        <div className="flex gap-3 items-center text-sm text-gray-600 mb-2">
          {Object.entries(post.reactionCount).map(([type, count]) => {
            const emojiImage = emojiOptions.find(
              (e) => e.title === type
            )?.image;
            return (
              <span key={type} className="flex items-center gap-1">
                {emojiImage} {count}
              </span>
            );
          })}
        </div>
      )}

      {/* Like / Comment / Share Bar */}
      <div className="flex justify-around text-gray-600 border-t pt-2 text-sm">
        <div
          className="relative inline-block"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            onClick={() => removeReaction()}
            className={`flex items-center gap-1 hover:text-blue-600 ${
              liked ? "text-blue-600" : "text-gray-600"
            }`}
          >
            {liked ? (
              <span className="text-xl">{reactionEmoji.image}</span>
            ) : (
              <ThumbsUp size={16} />
            )}
            <span>
              {liked ? (
                <span className="flex items-center gap-1 hover:text-blue-600">
                  {reactionEmoji.title}
                </span>
              ) : (
                "Like"
              )}
            </span>
          </button>
          {/* Emoji Panel */}
          {showReactions && (
            <div className="sm:-translate-x-[30%] absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 flex gap-1 sm:gap-2 bg-white border shadow-lg p-1 sm:p-2 rounded-xl z-20 max-w-[90vw] sm:max-w-xs overflow-x-auto whitespace-nowrap">
              {emojiOptions.map((emoji) => (
                <span
                  key={emoji.image}
                  onClick={() => handleReactionClick(emoji)}
                  className="text-base sm:text-lg md:text-xl cursor-pointer hover:scale-110 transition  "
                  title={emoji.title}
                >
                  {emoji.image}
                </span>
              ))}
            </div>
          )}
        </div>
        <button
          className="flex items-center gap-1 hover:text-blue-600"
          onClick={() => {
            setDisplayComments(!displayComments);
          }}
        >
          <MessageCircle size={16} /> Comment
        </button>
        <button
          onClick={() => {
            handleOnShare;
          }}
          className="flex items-center gap-1 hover:text-blue-600"
        >
          <Share2 size={16} /> Share
        </button>
      </div>
      <div className={displayComments ? "block" : "hidden"}>
        <div className="flex items-center gap-2  ">
          <input
            type="text"
            placeholder="Write a comment"
            className=" w-full mt-2 p-2 focus:outline-none border rounded-full bg-gray-100 border-none "
          />
          <button
            onClick={handlePostComment}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
