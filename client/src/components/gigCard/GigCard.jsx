import React from "react";
import "./GigCard.scss";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const GigCard = ({ item }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: [item.userId],
    queryFn: () =>
      newRequest.get(`/users/${item.userId}`).then((res) => {
        return res.data;
      }),
  });
  
  return (
    <Link to={`/gig/${item._id}`} className="gig-card">
      <div className="preview">
        <img className="desktop" src={item.cover} alt={item.shortDesc} />
        {item.phoneImage && (
          <img className="phone" src={item.phoneImage} alt="Mobile view" />
        )}
      </div>
      <div className="details">
        <div className="title-price">
          <h4 className="title">{item.title}</h4>
          <p className="price">
            {item.salesPrice && item.salesPrice < item.price ? (
              <>
                <span className="original">${item.price}</span>{" "}
                <span className="discount">${item.salesPrice}</span>
              </>
            ) : (
              <>${item.price}.00</>
            )}
          </p>
        </div>
        <p className="excerpt">{item.shortDesc}</p>
      </div>
    </Link>
  );
};

export default GigCard;