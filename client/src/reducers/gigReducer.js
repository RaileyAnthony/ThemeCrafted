export const INITIAL_STATE = {
  title: "",
  cat: "",
  cover: "",
  phoneImage: "",
  images: [], // Keeping the array but it will be empty
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
        images: action.payload.images || [], // Default to empty array if not provided
        phoneImage: action.payload.phoneImage || state.phoneImage,
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
        // Ensure images is always an array even if it's missing in the payload
        images: action.payload.images || [],
      };
    default:
      return state;
  }
};