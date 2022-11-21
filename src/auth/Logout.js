import { firebaseAuth } from "./firebaseApp";

async function Logout() {
  await firebaseAuth.signOut();
}

export { Logout };