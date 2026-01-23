import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../AuthContext";
import { Navigate } from "react-router-dom";
import { useState } from "react";

const Login=()=>{
const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  if (user) return <Navigate to="/dashboard" />;

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert(err.message);
    }
  };

  const handlegoogleLogin =async(e)=>{
    e.preventDefault();
    try{
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth,provider);
    }
    catch(error){
      alert(error.message);
    }
  };
return (
  <form >
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-2">Login</h2>
        <p className="text-gray-500 mb-6">Login to the Expense Tracker</p>
        <input type="email"
              placeholder="Enter your Email"
              value ={email}
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"              onChange={(e)=>setEmail(e.target.value)}
        />
        <input type="password"
        placeholder="Enter your password"
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"        value={password}
        onChange={(e)=>setPassword(e.target.password)}
        />

        <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition" onClick={handleLogin}>
          Login
        </button>
            <div className="flex items-center my-6">
              <div className="flex-row h-px bg-gray-300" />
              <span className="mx-4 text-sm text-gray-500">OR</span>
              <div className="flex-row h-px bg-gray-300" />
            </div>
            <button
            type="button"
            onClick={handlegoogleLogin}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span className="text-sm font-medium">
                Continue with Google
              </span>
            </button>
      </div>
      {/* <h2>Login</h2> */}
      {/* <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button> */}
    </div>
    </form>
  );
};

export default Login;
