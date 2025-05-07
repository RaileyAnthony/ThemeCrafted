import React, { useReducer, useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import Loader from "../../components/Loader/Loader";

const Add = () => {
  const location = useLocation();
  const isEditing = location.search.includes("edit=true");
  
  const [singleFile, setSingleFile] = useState(undefined);
  const [singleFileName, setSingleFileName] = useState("");
  const [files, setFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize state with either INITIAL_STATE or edit data
  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);
  const [gigId, setGigId] = useState(null);

  useEffect(() => {
    // Check if we're in edit mode and load the gig data
    if (isEditing) {
      const editGigData = JSON.parse(localStorage.getItem("editGigData"));
      if (editGigData) {
        setGigId(editGigData._id);
        
        // Update state with all fields from the gig
        dispatch({ 
          type: "INIT_EDIT_GIG", 
          payload: editGigData 
        });
      }
    }
  }, [isEditing]);

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };
  
  const handleFeature = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_FEATURE",
      payload: e.target[0].value,
    });
    e.target[0].value = "";
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSingleFile(file);
      setSingleFileName(file.name);
    }
  };

  const handleImagesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
      setFileNames(selectedFiles.map(file => file.name));
    }
  };

  // Auto-upload function
  const handleUpload = useCallback(async () => {
    if (!singleFile && !files.length) return;
    
    setUploading(true);
    try {
      let cover = state.cover;
      let newImages = [];
      
      // Upload cover image if selected
      if (singleFile) {
        cover = await upload(singleFile);
        setSingleFile(undefined); // Clear file after upload
        setSingleFileName(""); // Clear file name
      }

      // Upload additional images if selected
      if (files.length > 0) {
        newImages = await Promise.all(
          [...files].map(async (file) => {
            const url = await upload(file);
            return url;
          })
        );
        setFiles([]); // Clear files after upload
        setFileNames([]); // Clear file names
      }
      
      const images = isEditing 
        ? [...state.images, ...newImages] 
        : newImages.length > 0 ? newImages : state.images;
      
      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
    } catch (err) {
      console.error("Error uploading images:", err);
      alert("Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [singleFile, files, state.cover, state.images, isEditing]);

  // Trigger auto upload when files change
  useEffect(() => {
    if (singleFile || files.length > 0) {
      handleUpload();
    }
  }, [singleFile, files, handleUpload]);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (gig) => {
      return newRequest.post("/gigs", gig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
      setLoading(false);
      navigate("/mygigs");
    },
    onError: (error) => {
      console.error("Error creating gig:", error);
      setLoading(false);
      alert("Failed to create gig. Please try again.");
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, gig }) => {
      return newRequest.put(`/gigs/${id}`, gig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
      localStorage.removeItem("editGigData");
      setLoading(false);
      navigate("/mygigs");
    },
    onError: (error) => {
      console.error("Error updating gig:", error);
      setLoading(false);
      alert("Failed to update gig. Please try again.");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (
      !state.title ||
      !state.desc ||
      !state.cat ||
      !state.cover ||
      state.images.length === 0
    ) {
      alert(
        "Please fill in all fields and upload a cover image and additional images before submitting."
      );
      setLoading(false);
      return;
    }

    if (isEditing && gigId) {
      updateMutation.mutate({ id: gigId, gig: state });
    } else {
      createMutation.mutate(state);
    }
  };

  if (loading) {
    return <Loader size="large" color="primary" />;
  }

  return (
    <div className="add">
      <div className="container">
        <h1>{isEditing ? "Edit Gig" : "Add New Gig"}</h1>
        <div className="sections">
          <div className="info">
            <div className="input-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={state.title || ""}
                placeholder="e.g. I will do something I'm really good at"
                onChange={handleChange}
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="cat">Category</label>
              <select 
                name="cat" 
                id="cat" 
                value={state.cat || ""}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                <option value="design">Design</option>
                <option value="web">Web Development</option>
                <option value="animation">Animation</option>
                <option value="music">Music</option>
              </select>
            </div>
            
            <div className="upload-container">
              {/* COVER IMAGE */}
              <div className="input-group">
                <label htmlFor="cover-image">Cover Image</label>
                {state.cover && (
                  <div className="existing-image">
                    <img 
                      src={state.cover} 
                      alt="Current cover" 
                    />
                    <p>Current cover image</p>
                  </div>
                )}
                <div className={`file-dropzone ${singleFileName ? 'has-file' : ''} ${uploading && singleFile ? 'uploading' : ''}`}>
                  <div className="upload-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                  </div>
                  <div className="upload-text">
                    {uploading && singleFile ? "Uploading..." : (singleFileName ? singleFileName : "Select a cover image")}
                  </div>
                  <div className="upload-subtext">
                    {!singleFileName && !uploading && "or drag and drop it here"}
                  </div>
                  <input
                    type="file"
                    id="cover-image"
                    onChange={handleCoverChange}
                    disabled={uploading}
                    accept="image/*"
                  />
                </div>
              </div>
              
              {/* ADDITIONAL IMAGES */}
              <div className="input-group">
                <label htmlFor="additional-images">Additional Images</label>
                {state.images && state.images.length > 0 && (
                  <div className="existing-images">
                    {state.images.map((img, index) => (
                      <div className="image-item" key={index}>
                        <img src={img} alt={`Gig image ${index}`} />
                      </div>
                    ))}
                  </div>
                )}
                <div className={`file-dropzone ${fileNames.length ? 'has-file' : ''} ${uploading && files.length ? 'uploading' : ''}`}>
                  <div className="upload-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                  </div>
                  <div className="upload-text">
                    {uploading && files.length ? "Uploading..." : (fileNames.length ? `${fileNames.length} file(s) selected` : "Select additional images")}
                  </div>
                  <div className="upload-subtext">
                    {!fileNames.length && !uploading && "or drag and drop them here"}
                  </div>
                  <input
                    type="file"
                    id="additional-images"
                    multiple
                    onChange={handleImagesChange}
                    disabled={uploading}
                    accept="image/*"
                  />
                </div>
              </div>
            </div>

            
            <div className="input-group">
              <label htmlFor="desc">Description</label>
              <textarea
                id="desc"
                name="desc"
                value={state.desc || ""}
                placeholder="Brief descriptions to introduce your service to customers"
                cols="0"
                rows="16"
                onChange={handleChange}
              ></textarea>
            </div>
            
            <button className="primary-btn" onClick={handleSubmit}>
              {isEditing ? "Update" : "Create"}
            </button>
          </div>
          
          <div className="details">
            <div className="input-group">
              <label htmlFor="shortTitle">Service Title</label>
              <input
                type="text"
                id="shortTitle"
                name="shortTitle"
                value={state.shortTitle || ""}
                placeholder="e.g. One-page web design"
                onChange={handleChange}
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="shortDesc">Short Description</label>
              <textarea
                id="shortDesc"
                name="shortDesc"
                value={state.shortDesc || ""}
                onChange={handleChange}
                placeholder="Short description of your service"
                cols="30"
                rows="10"
              ></textarea>
            </div>
            
            <div className="input-group">
              <label htmlFor="deliveryTime">Delivery Time (e.g. 3 days)</label>
              <input 
                type="number" 
                id="deliveryTime"
                name="deliveryTime" 
                value={state.deliveryTime || ""} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="revisionNumber">Revision Number</label>
              <input
                type="number"
                id="revisionNumber"
                name="revisionNumber"
                value={state.revisionNumber || ""}
                onChange={handleChange}
              />
            </div>
            
            <div className="input-group">
              <label>Add Features</label>
              <form action="" className="features" onSubmit={handleFeature}>
                <input type="text" placeholder="e.g. page design" />
                <button className="primary-btn" type="submit">add</button>
              </form>
              <div className="addedFeatures">
                {state?.features?.map((f) => (
                  <div className="item" key={f}>
                    <button
                      onClick={() =>
                        dispatch({ type: "REMOVE_FEATURE", payload: f })
                      }
                    >
                      {f}
                      <span>×</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="input-group">
              <label htmlFor="price">Price</label>
              <input 
                type="number" 
                id="price"
                name="price"
                value={state.price || ""} 
                onChange={handleChange} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;