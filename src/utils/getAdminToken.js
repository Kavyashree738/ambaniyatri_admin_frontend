import { getAuth } from "firebase/auth";

export async function getAdminToken(forceRefresh = false) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Admin not logged in");
  }

  // 🔥 Always fresh token
  return await user.getIdToken(forceRefresh);
}
