import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css"

function LandingPage() {
  return (
    <main className="landing-main">
      <h1>LandingPage</h1>
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor aliquid quasi, debitis voluptates odio asperiores voluptatem! Est praesentium quos, suscipit, impedit cumque, eius tenetur et sequi saepe aliquid rerum repellendus.</p>
        <button><Link to="sign-up">Sign Up</Link></button>
        <button><Link to="events">View Events</Link></button>
    </main>
  );
}

export default LandingPage;
