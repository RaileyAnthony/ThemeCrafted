const getCurrentUser = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  // Add this line to copy _id to id if needed
  if (user && !user.id && user._id) user.id = user._id;
  return user;
};

export default getCurrentUser;