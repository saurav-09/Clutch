import React from "react";
import { assets } from "../assets/assets";
import { Star } from "lucide-react";
import { SignIn } from "@clerk/react";

const Login = () => {
  return (
    <div className="relative min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* ── Background ── */}
      <div className="absolute inset-0 -z-10">
        <img
          src={assets.bgImage}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/60 via-rose-100/50 to-violet-200/70" />
      </div>

{/* ── Left Side ── */}
<div className='flex flex-col flex-1 px-10 md:pl-24 md:pr-10 py-10'>     
     {/* Logo — top left */}
        <img src={assets.logo} alt="Pingup" className="h-8 w-auto self-start" />

        {/* Centered branding block */}
        <div className="flex flex-col justify-center flex-1 max-w-md space-y-5 md:ml-8">
          {/* Social proof */}
          <div className="flex items-center gap-3">
            <img src={assets.group_users} alt="Users" className="h-10 w-auto" />
            <div>
              <div className="flex items-center gap-0.5">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
              </div>
              <p className="text-sm font-semibold text-indigo-900/60 mt-0.5">
                Used by 12k+ developers
              </p>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-3xl md:text-[2.75rem] font-extrabold leading-tight text-indigo-900 tracking-tight whitespace-nowrap">
            More than just friends <br />
            <span className="text-indigo-700">truly connect</span>
          </h1>
          {/* Subtext */}
          <p className="text-base md:text-lg text-indigo-800/60 leading-relaxed">
            connect with global community <br />
            on pingup.
          </p>
        </div>
      </div>

      {/* ── Right Side — Clerk untouched ── */}
      <div className="flex items-center justify-center px-6 py-12 md:flex-1 md:px-12">
        <SignIn />
      </div>
    </div>
  );
};

export default Login;
