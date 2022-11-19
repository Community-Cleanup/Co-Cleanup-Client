import { useNavigate, useLocation } from "react-router-dom";

// Custom component hook code sourced from this sandbox website https://codesandbox.io/s/usebacksafe-ik66n?file=/src/index.js (last viewed 19/11/2022),
// which is in relation to this Stack Overflow answer: https://stackoverflow.com/a/66084680
// The purpose of this for our app is, for example:
// If the user on an event details page, clicks a nav link to go the /sign-in page route, this hook will redirect the user back to the event details page on successful
// sign-in based on the browser's history (i.e. navigate(-1)), but if going back one page would normally direct the user outside of our website entirely,
// default the navigation to our landing page (i.e. navigate("/"))
function useBackSafe(safePath = "/") {
  const navigate = useNavigate();
  const location = useLocation();
  const hasPreviousState = location.key !== "default";
  const goBackSafe = () =>
    hasPreviousState ? navigate(-1) : navigate(safePath);

  return { goBackSafe, hasPreviousState };
}

export default useBackSafe;
