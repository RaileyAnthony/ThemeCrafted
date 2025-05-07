import React from "react";
import "./Gig.scss";
import { Slider } from "infinite-react-carousel/lib";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import Reviews from "../../components/reviews/Reviews";

function Gig() {
  const { id } = useParams();

  // Fetch gig data
  const { isLoading, error, data } = useQuery({
    queryKey: ["gig"],
    queryFn: () => newRequest.get(`/gigs/single/${id}`).then((res) => res.data),
  });

  const userId = data?.userId;

  // Fetch user data
  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => newRequest.get(`/users/${userId}`).then((res) => res.data),
    enabled: !!userId,
  });

  return (
    <div className="gig">
      {isLoading ? (
        "loading"
      ) : error ? (
        "Something went wrong!"
      ) : (
        <div className="container">
          <div className="left">
            {/* Breadcrumbs */}
            <span className="breadcrumbs">
              ThemeCrafted {">"} Graphics & Design {">"}
            </span>

            {/* Gig Title */}
            <h1>{data.title}</h1>

            {/* User Info */}
            {isLoadingUser ? (
              "loading"
            ) : errorUser ? (
              "Something went wrong!"
            ) : (
              <div className="user">
                <img
                  className="pp"
                  src={dataUser.img || "/src/assets/noavatar.jpg"}
                  alt=""
                />
                <span>{dataUser.username}</span>

                {/* Rating */}
                {!isNaN(data.totalStars / data.starNumber) && (
                  <div className="stars">
                    {Array(Math.round(data.totalStars / data.starNumber))
                      .fill()
                      .map((item, i) => (
                        <img src="/src/assets/star.png" alt="" key={i} />
                      ))}
                    <span>{Math.round(data.totalStars / data.starNumber)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Image Slider */}
            <Slider slidesToShow={1} arrowsScroll={1} className="slider">
              {data.images.map((img) => (
                <img key={img} src={img} alt="" />
              ))}
            </Slider>

            {/* About This Gig */}
            <h2>About This Gig</h2>
            <p>{data.desc}</p>

            {/* About The Seller */}
            {isLoadingUser ? (
              "loading"
            ) : errorUser ? (
              "Something went wrong!"
            ) : (
              <div className="seller">
                <h2>About The Seller</h2>
                <div className="user">
                  <img
                    src={dataUser.img || "/src/assets/noavatar.jpg"}
                    alt=""
                  />
                  <div className="info">
                    <span>{dataUser.username}</span>

                    {/* Seller Rating */}
                    {!isNaN(data.totalStars / data.starNumber) && (
                      <div className="stars">
                        {Array(Math.round(data.totalStars / data.starNumber))
                          .fill()
                          .map((item, i) => (
                            <img src="/src/assets/star.png" alt="" key={i} />
                          ))}
                        <span>
                          {Math.round(data.totalStars / data.starNumber)}
                        </span>
                      </div>
                    )}

                    <button>Contact Me</button>
                  </div>
                </div>

                {/* Seller Details */}
                <div className="box">
                  <div className="items">
                    <div className="item">
                      <span className="title">From</span>
                      <span className="desc">{dataUser.country}</span>
                    </div>
                    <div className="item">
                      <span className="title">Member since</span>
                      <span className="desc">Aug 2022</span>
                    </div>
                    <div className="item">
                      <span className="title">Avg. response time</span>
                      <span className="desc">4 hours</span>
                    </div>
                    <div className="item">
                      <span className="title">Last delivery</span>
                      <span className="desc">1 day</span>
                    </div>
                    <div className="item">
                      <span className="title">Languages</span>
                      <span className="desc">English</span>
                    </div>
                  </div>
                  <hr />
                  <p>{dataUser.desc}</p>
                </div>
              </div>
            )}

            {/* Reviews */}
            <Reviews gigId={id} />
          </div>

          {/* Right Section (Price, Details, and Features) */}
          <div className="right">
            <div className="price">
              <h3>{data.shortTitle}</h3>
              <h2>$ {data.price}</h2>
            </div>

            <p>{data.shortDesc}</p>

            <div className="details">
              <div className="item">
                <img src="/src/assets/clock.png" alt="" />
                <span>{data.deliveryDate} Days Delivery</span>
              </div>
              <div className="item">
                <img src="/src/assets/recycle.png" alt="" />
                <span>{data.revisionNumber} Revisions</span>
              </div>
            </div>

            {/* Features */}
            <div className="features">
              {data.features.map((feature) => (
                <div className="item" key={feature}>
                  <img src="/src/assets/greencheck.png" alt="" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Continue Button */}
            <Link to={`/pay/${id}`} className="pay-button">
              Continue
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gig;
