import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

// For any styling that will apply to everything besides the nav bar and footer
function SharedLayout() {
  return (
    <main>
      <NavBar />
      <Outlet />
    </main>
  );
}

export default SharedLayout;
