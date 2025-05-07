import React from "react";

// component imports
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";

// page imports
import Home from "./pages/home/Home";
import Add from "./pages/add/Add";
import Messages from "./pages/messages/Messages";
import Message from "./pages/message/Message";
import Orders from "./pages/orders/Orders";
import Gig from "./pages/gig/Gig";
import Gigs from "./pages/gigs/Gigs";
import MyGigs from "./pages/myGigs/MyGigs";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register.jsx";
import Collections from "./pages/collections/Collections";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Make sure this is imported

import { createBrowserRouter, RouterProvider, Outlet, useLocation } from "react-router-dom";
import Pay from "./pages/pay/Pay.jsx";
import Success from "./pages/Success/Success.jsx";

function App() {
  const queryClient = new QueryClient();
  
  const Layout = () => {
    const location = useLocation();
    const hideNavbarRoutes = ["/login", "/register"];
    const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

    const hideFooterRoutes = ["/login", "/register"];
    const shouldHideFooter = hideNavbarRoutes.includes(location.pathname);

    return (
      <div className="app">
        {!shouldHideNavbar && <Navbar />}
        <Outlet />
        {!shouldHideFooter && <Footer />}
        <ToastContainer 
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <QueryClientProvider client={queryClient}>
          <Layout />
        </QueryClientProvider>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/gigs",
          element: <Gigs />,
        },
        {
          path: "/gig/:id",
          element: <Gig />,
        },
        {
          path: "/mygigs",
          element: <MyGigs />,
        },
        {
          path: "/messages",
          element: <Messages />,
        },
        {
          path: "/message/:id",
          element: <Message />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/orders",
          element: <Orders />,
        },
        {
          path: "/add",
          element: <Add />,
        },
        {
          path: "/collections",
          element: <Collections />,
        },
        {
          path: "/pay/:id",
          element: <Pay />,
        },
        {
          path: "/success",
          element: <Success />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;