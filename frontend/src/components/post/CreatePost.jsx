import React, { use, useEffect, useRef, useState } from "react";
import { Dialog, DialogTitle, DialogContent, Button, FormControlLabel, Checkbox, FormControl, FormLabel, RadioGroup, Radio } from "@mui/material";
import { readFileAsDataURL } from "../../lib/utils";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from 'react-toastify';
import useGetAllPost from "../../hooks/useGetAllPost";
import { useDispatch, useSelector } from "react-redux";
import store from './../../redux/store';
import { setPosts } from "../../redux/postSlice";

// API base URL from environment or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const CreatePost = ({ open, setOpen, refreshPosts }) => {
  const postRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [postPreview, setPostPreview] = useState("");
  const [category, setCategory] = useState("");
  const [vegetarian, setVegetarian] = useState(false);
  const [spicyLevel, setSpicyLevel] = useState("none");
  const dispatch=useDispatch();
  
  const {posts}=useSelector(store=>store.post)

  const handleCloseDialog = () => {
    setOpen(false);
    // Reset state on close
    setCaption("");
    setPrice("");
    setFile("");
    setPostPreview("");
    setCategory("");
    setVegetarian(false);
    setSpicyLevel("none");
    setLoading(false);
  };

  const createPostHandler = async (e) => {
    e.preventDefault();
    if (!caption || !file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("media", file);
    formData.append("caption", caption);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("vegetarian", vegetarian);
    formData.append("spicyLevel", spicyLevel);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/post/addpost`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        // useGetAllPost();
        dispatch(setPosts([res.data.post,...posts]))
        
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      // After successful post

      handleCloseDialog();
    } catch (error) {
      console.error("Error posting:", error);
      toast.error(error.response?.data?.message || "Failed to create post");
      setLoading(false);
    }
  };

  const fileChangeHandler = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const dataUrl = await readFileAsDataURL(selectedFile);
      setPostPreview(dataUrl);
    }
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
      <DialogTitle className="text-center font-semibold">
        Create New Post
      </DialogTitle>
      <DialogContent dividers>
        <form className="flex flex-col gap-4" onSubmit={createPostHandler}>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={200}
            placeholder="Caption..."
            className="border border-gray-300 p-2 rounded-md"
          />
          <select
            name="category"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
            required
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snacks">Snacks</option>
            <option value="Dessert">Dessert</option>
            <option value="Drinks">Drinks</option>
            <option value="FastFood">FastFood</option>
            <option value="Other">Other</option>
            <option value="All">All</option>
          </select>

          {/* Food properties */}
          <div className="flex flex-col gap-3 border border-gray-200 p-3 rounded-md bg-gray-50">
            <h3 className="font-medium text-gray-700">Food Properties</h3>
            
            {/* Vegetarian toggle */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={vegetarian}
                  onChange={(e) => setVegetarian(e.target.checked)}
                  color="success"
                />
              }
              label="Vegetarian"
            />
            
            {/* Spicy level selection */}
            <FormControl component="fieldset">
              <FormLabel component="legend" className="text-sm text-gray-600">Spicy Level</FormLabel>
              <RadioGroup
                row
                value={spicyLevel}
                onChange={(e) => setSpicyLevel(e.target.value)}
              >
                <FormControlLabel value="none" control={<Radio size="small" />} label="Not Spicy" />
                <FormControlLabel value="mild" control={<Radio size="small" />} label="Mild" />
                <FormControlLabel value="medium" control={<Radio size="small" />} label="Medium" />
                <FormControlLabel value="hot" control={<Radio size="small" />} label="Hot" />
              </RadioGroup>
            </FormControl>
          </div>

          {postPreview && (
            <div className="w-full h-96">
              {file.type.startsWith("image") ? (
                <img
                  src={postPreview}
                  alt="Post Preview"
                  className="w-full rounded h-full object-cover"
                />
              ) : (
                <video
                  controls
                  autoPlay
                  loop
                  className="w-full h-full object-cover rounded"
                >
                  <source src={postPreview} type={file.type} />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}
          <input
            type="file"
            ref={postRef}
            accept="image/*,video/*"
            className="hidden"
            onChange={fileChangeHandler}
            required
          />
          <button
            type="button"
            onClick={() => postRef.current.click()}
            className="w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf] p-2 rounded"
          >
            Select Post
          </button>
          {postPreview && (
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price..."
              className="border border-gray-300 p-2 rounded-md"
              required
            />
          )}
          {postPreview && (
            <button
              type="submit"
              disabled={loading}
              className="w-full mx-auto bg-[#0095F6] hover:bg-[#258bcf] p-2 rounded flex justify-center items-center"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                "Post"
              )}
            </button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
