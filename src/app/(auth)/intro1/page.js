'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const IntroPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-start">
      {/* Image Container - Top Half */}
      {/* <div className="w-[85%] h-full flex items-center justify-center m-8 rounded-[30px] border-4 border-gray-200 z-20">
        <Image
          src="/home.png" // Place your image in public/images/home.png
          alt="Voxify Home"
          width={800}
          height={800}
          className="w-full h-full object-cover rounded-[26px]"
          priority
        />
      </div> */}

      {/* Bottom Content Container */}
      <div className="bg-white absolute bottom-0 left-0 w-full h-1/2">
        <div className="p-5 flex flex-col items-center justify-center bg-white h-full z-[100]">
          {/* Text Content */}
          <div className="w-[99%] mt-2.5">
            <h1 className="text-center text-[27px] leading-[35px] font-bold">
              Transform Text into Speech with AI
            </h1>
            <p className="text-center text-base mt-4 leading-6 text-gray-500">
              Welcome to Voxify, the AI-powered app that brings your text to
              life. Convert any text to high-quality audio in a few taps.
            </p>
          </div>

          {/* Dots Indicator */}
          <div className="flex gap-[7px] mt-5">
            <div className="h-1.5 w-[30px] rounded-[20px] bg-[#3273F6]"></div>
            <div className="h-1.5 w-2.5 rounded-[20px] bg-[#cccc]"></div>
            <div className="h-1.5 w-2.5 rounded-[20px] bg-[#cccc]"></div>
          </div>

          {/* Buttons */}
          <div className="mt-[85px] flex justify-between items-center flex-row w-[99%]">
            <button
              onClick={() => router.push('/(auth)/signIn')}
              className="w-[150px] h-[45px] bg-[#eeee] rounded-[40px] flex items-center justify-center"
            >
              <span className="text-[#3273F6] text-base">Skip</span>
            </button>
            <button
              onClick={() => router.push('/(auth)/intro2')}
              className="w-[150px] h-[45px] bg-[#3273F6] rounded-[40px] flex items-center justify-center"
            >
              <span className="text-white text-base">Continue</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;