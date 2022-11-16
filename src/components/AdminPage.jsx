import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//import axios from "axios";
import axios from "../utils/AxiosInterceptor";

function AdminPage() {
  const navigate = useNavigate();

  const [showUsers, setShowUsers] = useState(false);
  const [showEvents, setShowEvents] = useState(false);

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
        <button id="users" name="users">
          Users
        </button>
        <button id="events" name="events">
          Events
        </button>
      </div>
    </div>
  );
}

export default AdminPage;
