"use client";
import { useEffect } from "react";

export default function Callback() {
     useEffect(() => {

          const hash = window.location.hash.substring(1);
          const params = new URLSearchParams(hash);

          const accessToken = params.get("access_token");
          const idToken = params.get("id_token");

          if (accessToken && idToken) {
               localStorage.setItem("accessToken", accessToken);
               localStorage.setItem("idToken", idToken);

               window.location.href = "/dashboard";
          } else {
               window.location.href = "/?error=auth_failed";
          }
     }, []);

     return (
          <div className="flex items-center justify-center h-screen bg-gray-100">
               <div className="bg-white shadow-lg rounded-2xl p-10 w-[350px] text-center">
                    <h1 className="text-xl font-semibold mb-2 text-gray-700">
                         Authenticating...
                    </h1>
                    <p className="text-gray-500 text-sm">
                         Please wait while we verify your account.
                    </p>

                    <div className="mt-6 flex justify-center">
                         <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
               </div>
          </div>
     );
}
