import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MyGigs.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { Trash2, Edit, Plus, ArrowUpRight } from "lucide-react";
import Loader from "../../components/loader/Loader";

function MyGigs() {
  const currentUser = getCurrentUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["myGigs"],
    queryFn: () =>
      newRequest.get(`/gigs?userId=${currentUser.id}`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      console.log("Deleting gig with ID:", id);
      return newRequest.delete(`/gigs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
    onError: (error) => {
      console.error("Error deleting gig:", error);
      alert("Failed to delete gig. Please try again.");
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this gig?")) {
      mutation.mutate(id);
    }
  };

  const handleEdit = (gig) => {
    localStorage.setItem("editGigData", JSON.stringify(gig));
    navigate("/add?edit=true");
  };

  // Format date helper function
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // --- SALES COUNTS ---
  const [salesCounts, setSalesCounts] = useState({});

  useEffect(() => {
    if (data && data.length > 0) {
      data.forEach((gig) => {
        newRequest
          .get(`/orders/sales/${gig._id}`)
          .then((res) => {
            setSalesCounts((prev) => ({
              ...prev,
              [gig._id]: res.data.sales,
            }));
          })
          .catch(() => {
            setSalesCounts((prev) => ({
              ...prev,
              [gig._id]: 0,
            }));
          });
      });
    }
  }, [data]);

  return (
    <div className="my-gigs">
      {isLoading ? (
        <Loader size="large" color="primary" />
      ) : error ? (
        <div className="error">Error: {error.message}</div>
      ) : (
        <div className="container">
          <div className="title">
            <h1>My Themes</h1>
            {currentUser?.isSeller && (
              <Link className="link" to="/add">
                <button className="primary-btn">
                  <Plus size={18} /> Add New Theme
                </button>
              </Link>
            )}
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Details</th>
                  <th>Price</th>
                  <th>Sales</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((gig) => (
                  <tr key={gig._id}>
                    <td>
                      <img src={gig.cover} alt="" className="img" />
                    </td>
                    <td>
                      <div className="details">
                        <h4>{gig.title}</h4>
                        <p>{formatDate(gig.createdAt || new Date())}</p>
                        <Link to={`/gig/${gig._id}`} className="view">
                          View <ArrowUpRight size={16} />
                        </Link>
                      </div>
                    </td>
                    <td>${gig.price}.00</td>
                    <td>
                      {salesCounts[gig._id] !== undefined ? (
                        salesCounts[gig._id]
                      ) : (
                        <Loader size="small" color="gray" />
                      )}
                    </td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(gig)}
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(gig._id)}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
export default MyGigs;
