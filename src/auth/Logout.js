import { firebaseAuth } from "./firebaseApp";

async function Logout() {
  // Forces a sign out of the user, which also remove's the ID token from the user's local browser storage
  await firebaseAuth.signOut();
}

export { Logout };
