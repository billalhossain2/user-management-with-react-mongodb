import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";
import AddUser from "../pages/AddUser";
import EditUser from "../pages/EditUser";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>,
  },
  {
    path: "/addUser",
    element: <AddUser></AddUser>,
  },
  {
    path: "/user/:userId",
    element: <EditUser></EditUser>,
  },
]);

export default router;
