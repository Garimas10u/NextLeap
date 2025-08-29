"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full h-[100vh] pt-36 md:pt-48 pb-10">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-10 px-24">
        
        <div className="flex-1 space-y-6 pl-6 text-center md:text-left">
          <h1 className="text-5xl text-[#15012b] font-bold md:text-5xl lg:text-6xl xl:text-7xl">
            Your Partner For Unlocking
            Professional Potential
          </h1>
          <p className="mx-auto md:mx-0 max-w-[600px] md:text-xl">
            Advance your career with personalized guidance, interview prep, and
            AI-powered tools for job success.
          </p>
          <Link href="/dashboard">
            <Button className="px-12 py-6 text-lg mt-6">Get Started</Button>
          </Link>
        </div>
        <div className="flex-1 hero-image-wrapper flex justify-center md:justify-end">
          <div ref={imageRef} className="hero-image">
            <Image
              src="/banner2.png"
              width={980}
              height={520}
              alt="Dashboard Preview"
              className="rounded-lg shadow-2xl border"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
