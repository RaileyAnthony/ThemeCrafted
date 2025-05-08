import React from "react";
import "./NewestThemes.scss";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import GigCard from "../../components/gigCard/GigCard";
import { newDrawing } from "../../assets";

const NewestThemes = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["newestThemes"],
    queryFn: () =>
      newRequest.get("/gigs?sort=createdAt").then((res) => res.data),
  });

  return (
    <div className="newest-themes">
      <div className="container">
        <div className="header">
          <div className="title-desc">
            <h2>Newest Themes</h2>
            <p>
              Stand out with crafted themes that feel fresh, unique, and built
              to convert.
            </p>
          </div>
          <img src={newDrawing} className="drawing" alt="Decorative drawing" />
        </div>

        <div className="grid">
          {isLoading
            ? "Loading..."
            : error
            ? "Something went wrong!"
            : data
                .slice(0, 4)
                .map((gig) => <GigCard key={gig._id} item={gig} />)}
        </div>
      </div>
    </div>
  );
};

export default NewestThemes;
