import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loginError, setLoginError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleGoogleSuccess = async (response) => {
    console.log("Google Login Success:", response);
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex">
      {/* Left Side - Image */}
      <div className="w-1/2 hidden md:flex items-center justify-center ">
        <img
          src="images/login.avif"
          alt="Login"
          className="w-full h-[90%] object-cover rounded-l-lg"
        />
      </div>
      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          <h1 className="text-3xl font-bold mb-8 text-center">Login</h1>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <div className="my-6 flex items-center">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-4 text-gray-500">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>
          <GoogleOAuthProvider clientId="973552216525-joh96vth4emhraa7l60ugu98fe6471n8.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setLoginError("Google Login Failed")}
              disabled={loading}
            />
            {loginError && <p className="error text-red-500 mt-2">{loginError}</p>}
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
}