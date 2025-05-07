export const INITIAL_STATE = {
  title: "",
  cat: "",
  cover: "",
  phoneImage: "", // Added new field for phone image
  images: [],
  desc: "",
  shortTitle: "",
  shortDesc: "",
  deliveryTime: 0,
  revisionNumber: 0,
  features: [],
  price: 0,
};

export const gigReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_INPUT":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case "ADD_IMAGES":
      return {
        ...state,
        cover: action.payload.cover,
        images: action.payload.images,
        phoneImage: action.payload.phoneImage || state.phoneImage, // Handle the new phoneImage
      };
    case "ADD_FEATURE":
      return {
        ...state,
        features: [...state.features, action.payload],
      };
    case "REMOVE_FEATURE":
      return {
        ...state,
        features: state.features.filter(
          (feature) => feature !== action.payload
        ),
      };
    case "INIT_EDIT_GIG":
      return {
        ...action.payload,
      };
    default:
      return state;
  }
};