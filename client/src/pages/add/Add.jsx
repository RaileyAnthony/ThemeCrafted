import React, { useReducer, useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import Loader from "../../components/loader/Loader";
import { toast } from "react-toastify";

const Add = () => {
  const location = useLocation();
  const isEditing = location.search.includes("edit=true");

  const [singleFile, setSingleFile] = useState(undefined);
  const [singleFileName, setSingleFileName] = useState("");
  // Add new states for phone image
  const [phoneFile, setPhoneFile] = useState(undefined);
  const [phoneFileName, setPhoneFileName] = useState("");
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
          payload: editGigData,
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
    const feature = e.target[0].value.trim();

    if (!feature) {
      toast.warning("Please enter a feature first");
      return;
    }

    if (state.features.includes(feature)) {
      toast.info("This feature already exists");
      return;
    }

    dispatch({
      type: "ADD_FEATURE",
      payload: feature,
    });
    e.target[0].value = "";

    toast.success("Feature added successfully");
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic validation for image type
      if (!file.type.includes("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      setSingleFile(file);
      setSingleFileName(file.name);
    }
  };

  // Add handler for phone image change
  const handlePhoneImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic validation for image type
      if (!file.type.includes("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      setPhoneFile(file);
      setPhoneFileName(file.name);
    }
  };

  // Auto-upload function
  const handleUpload = useCallback(async () => {
    if (!singleFile && !phoneFile) return;

    setUploading(true);
    try {
      let cover = state.cover;
      let phoneImage = state.phoneImage;

      // Upload cover image if selected
      if (singleFile) {
        cover = await upload(singleFile);
        setSingleFile(undefined); // Clear file after upload
        setSingleFileName(""); // Clear file name
        toast.success("Cover image uploaded successfully");
      }

      // Upload phone image if selected
      if (phoneFile) {
        phoneImage = await upload(phoneFile);
        setPhoneFile(undefined); // Clear file after upload
        setPhoneFileName(""); // Clear file name
        toast.success("Phone image uploaded successfully");
      }

      dispatch({
        type: "ADD_IMAGES",
        payload: { cover, images: state.images, phoneImage },
      });
    } catch (err) {
      console.error("Error uploading images:", err);
      toast.error("Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [singleFile, phoneFile, state.cover, state.images, state.phoneImage]);

  // Trigger auto upload when files change
  useEffect(() => {
    if (singleFile || phoneFile) {
      handleUpload();
    }
  }, [singleFile, phoneFile, handleUpload]);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (gig) => {
      return newRequest.post("/gigs", gig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
      setLoading(false);
      toast.success("Theme created successfully!");
      navigate("/mygigs");
    },
    onError: (error) => {
      console.error("Error creating theme:", error);
      setLoading(false);
      toast.error(
        error?.response?.data?.message ||
          "Failed to create theme. Please try again."
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, gig }) => {
      return newRequest.put(`/gigs/${id}`, gig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
      localStorage.removeItem("editGigData");
      setLoading(false);
      toast.success("Theme updated successfully!");
      navigate("/mygigs");
    },
    onError: (error) => {
      console.error("Error updating theme:", error);
      setLoading(false);
      toast.error(
        error?.response?.data?.message ||
          "Failed to update theme. Please try again."
      );
    },
  });

  const validateForm = () => {
    const missingFields = [];

    if (!state.title) missingFields.push("Title");
    if (!state.desc) missingFields.push("Description");
    if (!state.cat) missingFields.push("Category");
    if (!state.cover) missingFields.push("Cover Image");
    if (!state.shortTitle) missingFields.push("Service Title");
    if (!state.shortDesc) missingFields.push("Short Description");
    if (!state.deliveryTime) missingFields.push("Delivery Time");
    if (!state.revisionNumber) missingFields.push("Revision Number");
    if (!state.price) missingFields.push("Price");

    return missingFields;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const missingFields = validateForm();

    if (missingFields.length > 0) {
      toast.error(
        <div>
          <p>Please fill in the following required fields:</p>
          <ul style={{ marginLeft: "20px", marginTop: "8px" }}>
            {missingFields.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </div>
      );
      return;
    }

    setLoading(true);

    if (isEditing && gigId) {
      // For edit, send the whole state (may include userId)
      updateMutation.mutate({ id: gigId, gig: state });
    } else {
      // For create, NEVER send userId
      const { userId, ...gigData } = state;
      createMutation.mutate(gigData);
    }
  };

  if (loading) {
    return <Loader size="large" color="primary" />;
  }

  return (
    <div className="add">
      <div className="container">
        <h1>{isEditing ? "Edit Theme" : "Add New Theme"}</h1>
        <div className="sections">
          <div className="info">
            <div className="input-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={state.title || ""}
                placeholder="e.g. Minimalist Portfolio"
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
                <option value="ecommerce">E-Commerce</option>
                <option value="booking">Booking</option>
                <option value="portfolio">Portfolio</option>
                <option value="restaurant">Restaurant</option>
                <option value="tech-startup">Tech Startup</option>
              </select>
            </div>

            <div className="upload-container">
              {/* COVER IMAGE */}
              <div className="input-group">
                <label htmlFor="cover-image">Cover Image</label>
                {state.cover && (
                  <div className="existing-image">
                    <img src={state.cover} alt="Current cover" />
                    <p>Current cover image</p>
                  </div>
                )}
                <div
                  className={`file-dropzone ${
                    singleFileName ? "has-file" : ""
                  } ${uploading && singleFile ? "uploading" : ""}`}
                >
                  <div className="upload-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                  </div>
                  <div className="upload-text">
                    {uploading && singleFile
                      ? "Uploading..."
                      : singleFileName
                      ? singleFileName
                      : "Select a cover image"}
                  </div>
                  <div className="upload-subtext">
                    {!singleFileName &&
                      !uploading &&
                      "or drag and drop it here"}
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

              {/* PHONE IMAGE */}
              <div className="input-group">
                <label htmlFor="phone-image">Phone Image</label>
                {state.phoneImage && (
                  <div className="existing-image">
                    <img src={state.phoneImage} alt="Current phone view" />
                    <p>Current phone image</p>
                  </div>
                )}
                <div
                  className={`file-dropzone ${
                    phoneFileName ? "has-file" : ""
                  } ${uploading && phoneFile ? "uploading" : ""}`}
                >
                  <div className="upload-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                  </div>
                  <div className="upload-text">
                    {uploading && phoneFile
                      ? "Uploading..."
                      : phoneFileName
                      ? phoneFileName
                      : "Select phone image"}
                  </div>
                  <div className="upload-subtext">
                    {!phoneFileName && !uploading && "or drag and drop it here"}
                  </div>
                  <input
                    type="file"
                    id="phone-image"
                    onChange={handlePhoneImageChange}
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
                placeholder="Detailed description of your theme"
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
                placeholder="e.g. One-page theme"
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
                placeholder="Brief description of your theme"
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
                <input type="text" placeholder="e.g. responsive design" />
                <button className="primary-btn" type="submit">
                  add
                </button>
              </form>
              <div className="addedFeatures">
                {state?.features?.map((f) => (
                  <div className="item" key={f}>
                    <button
                      onClick={() => {
                        dispatch({ type: "REMOVE_FEATURE", payload: f });
                        toast.info("Feature removed");
                      }}
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
