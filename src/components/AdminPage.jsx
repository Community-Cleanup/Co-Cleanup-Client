import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//import axios from "axios";
import axios from "../utils/AxiosInterceptor";

import AdminPageUsers from "./AdminPageUsers";
import AdminPageEvents from "./AdminPageEvents";

function AdminPage() {
  const navigate = useNavigate();

  const [showUsersComponents, setShowUsersComponents] = useState(false);
  const [showEventsComponents, setShowEventsComponents] = useState(false);

  useEffect(() => {
    confirmAdminUser();
    // eslint-disable-next-line
  }, []);

  async function confirmAdminUser() {
    try {
      await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/admin`);
    } catch (e) {
      console.log(e);
      navigate("/");
    }
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div>
        <button
          onClick={(e) => {
            setShowUsersComponents(true);
            setShowEventsComponents(false);
          }}
        >
          Users
        </button>
        <button
          onClick={(e) => {
            setShowUsersComponents(false);
            setShowEventsComponents(true);
          }}
        >
          Events
        </button>
      </div>
      {showUsersComponents && <AdminPageUsers />}
      {showEventsComponents && <AdminPageEvents />}
    </div>
  );
}

export default AdminPage;
