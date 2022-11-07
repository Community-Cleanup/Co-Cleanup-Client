import { Outlet } from "react-router-dom";

// For any styling that will apply to everything besides the nav bar and footer
function Main() {
  return (
    <main>
      <Outlet />
    </main>
  );
}

export default Main;
