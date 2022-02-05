export function signInWithGoogle(googleUser) {
  console.log("BasicProfile:", googleUser.getBasicProfile());
  console.log("AuthResponse:", googleUser.getAuthResponse());
}
