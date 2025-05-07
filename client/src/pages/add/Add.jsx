import React, { useReducer, useState, useEffect } from "react"; // Added useEffect
import { useLocation, useNavigate } from "react-router-dom"; // Added useLocation
import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const Add = () => {
  const location = useLocation();
  const isEditing = location.search.includes("edit=true");
  
  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

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

  const handleUpload = async () => {
    setUploading(true);
    try {
      const cover = singleFile ? await upload(singleFile) : state.cover;

      const newImages = files.length > 0 
        ? await Promise.all(
            [...files].map(async (file) => {
              const url = await upload(file);
              return url;
            })
          )
        : [];
        
      const images = isEditing ? [...state.images, ...newImages] : newImages;
      
      setUploading(false);
      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
    } catch (err) {
      console.log(err);
      setUploading(false);
    }
  };

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (gig) => {
      return newRequest.post("/gigs", gig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
      navigate("/mygigs");
    },
  });

  // Added new mutation for updating
  const updateMutation = useMutation({
    mutationFn: ({ id, gig }) => {
      return newRequest.put(`/gigs/${id}`, gig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
      localStorage.removeItem("editGigData");
      navigate("/mygigs");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
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
      return;
    }

    if (isEditing && gigId) {
      updateMutation.mutate({ id: gigId, gig: state });
    } else {
      createMutation.mutate(state);
    }
  };

  return (
    <div className="add">
      <div className="container">
        <h1>{isEditing ? "Edit Gig" : "Add New Gig"}</h1>
        <div className="sections">
          <div className="info">
            <label htmlFor="">Title</label>
            <input
              type="text"
              name="title"
              value={state.title || ""}
              placeholder="e.g. I will do something I'm really good at"
              onChange={handleChange}
            />
            <label htmlFor="">Category</label>
            <select 
              name="cat" 
              id="cat" 
              value={state.cat || ""}
              onChange={handleChange}
            >
              <option value="design">Design</option>
              <option value="web">Web Development</option>
              <option value="animation">Animation</option>
              <option value="music">Music</option>
            </select>
            <div className="images">
              <div className="imagesInputs">
                <label htmlFor="">Cover Image</label>
                {state.cover && (
                  <div className="existingCover">
                    <img 
                      src={state.cover} 
                      alt="Current cover" 
                      style={{ maxWidth: '100px', marginBottom: '10px' }} 
                    />
                    <p>Current cover image</p>
                  </div>
                )}
                <input
                  type="file"
                  onChange={(e) => setSingleFile(e.target.files[0])}
                />
                <label htmlFor="">Upload Images</label>
                {state.images && state.images.length > 0 && (
                  <div className="existingImages" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                    {state.images.map((img, index) => (
                      <img 
                        key={index} 
                        src={img} 
                        alt={`Gig image ${index}`} 
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }} 
                      />
                    ))}
                  </div>
                )}
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                />
              </div>
              <button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
            <label htmlFor="">Description</label>
            <textarea
              name="desc"
              value={state.desc || ""}
              placeholder="Brief descriptions to introduce your service to customers"
              cols="0"
              rows="16"
              onChange={handleChange}
            ></textarea>
            <button onClick={handleSubmit}>
              {isEditing ? "Update" : "Create"}
            </button>
          </div>
          <div className="details">
            <label htmlFor="">Service Title</label>
            <input
              type="text"
              name="shortTitle"
              value={state.shortTitle || ""}
              placeholder="e.g. One-page web design"
              onChange={handleChange}
            />
            <label htmlFor="">Short Description</label>
            <textarea
              name="shortDesc"
              value={state.shortDesc || ""}
              onChange={handleChange}
              placeholder="Short description of your service"
              cols="30"
              rows="10"
            ></textarea>
            <label htmlFor="">Delivery Time (e.g. 3 days)</label>
            <input 
              type="number" 
              name="deliveryTime" 
              value={state.deliveryTime || ""} 
              onChange={handleChange} 
            />
            <label htmlFor="">Revision Number</label>
            <input
              type="number"
              name="revisionNumber"
              value={state.revisionNumber || ""}
              onChange={handleChange}
            />
            <label htmlFor="">Add Features</label>
            <form action="" className="add" onSubmit={handleFeature}>
              <input type="text" placeholder="e.g. page design" />
              <button type="submit">add</button>
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
                    <span>X</span>
                  </button>
                </div>
              ))}
            </div>
            <label htmlFor="">Price</label>
            <input 
              type="number" 
              name="price"
              value={state.price || ""} 
              onChange={handleChange} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;