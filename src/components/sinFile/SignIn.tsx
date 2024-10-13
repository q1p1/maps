// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const SignIn: React.FC = () => {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = () => {
//     const storedUsername = localStorage.getItem("username");
//     const storedPassword = localStorage.getItem("password");

//     if (username === storedUsername && password === storedPassword) {
//       alert("Login successful!");
//       navigate("/map");
//       window.location.reload();
//     } else {
//       alert("Incorrect username or password.");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
//         <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
//         <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Username
//             </label>
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Password
//             </label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//             />
//           </div>
//           <button
//             onClick={handleLogin}
//             className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
//           >
//             Sign In
//           </button>
//         </form>
//         <p className="mt-4 text-sm text-gray-600 text-center">
//           Don't have an account?{" "}
//           <button
//             onClick={() => navigate("/signup")}
//             className="text-indigo-600 hover:text-indigo-800"
//           >
//             Sign Up
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SignIn;
