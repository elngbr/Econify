import React, { useState } from "react";
import { auth, provider, signInWithPopup, signOut } from "./firebase-config"; // Import Firebase Authentication methods
import "./App.css"; // Your existing CSS file

function App() {
  const [user, setUser] = useState(null);


  ///                                Pay some attention here
  ///We are basically defining a fucntion which contains methods
  //then we return html using the js.....................remember what React does!!!!!!!!!!!!!

  // asynchronous operation when you sign in
  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider); 
      //we sign in with pop becaue the "dialog" comes in..and I choose an gmail from there
      setUser(result.user); // we retrive the user that is selected
    } catch (error) {
      console.error("Error signing in: ", error); ///////aslways throw an exception
    }
  };

  // handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth); // sse signOut from Firebase
      setUser(null); // clear user state on sign-out
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Show the logo if no user is signed in */}
        {!user ? (
          <div>
            <h2>Welcome to the App!</h2>
            <button onClick={handleSignIn}>Sign In with Google</button>
          </div>
        ) : (
          <div>
            <h2>Welcome, {user.displayName}</h2>
            <p>Email: {user.email}</p>
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
