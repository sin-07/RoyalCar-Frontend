import React from "react";
import Hero from "../components/Hero";
import FeaturedSection from "../components/FeaturedSection";
import Banner from "../components/Banner";
import Testimonial from "../components/Testimonial";
import Newsletter from "../components/Newsletter";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <div className="relative z-10">
        <FeaturedSection />
        <Banner />
        <Testimonial />
        <Newsletter />
      </div>
    </div>
  );
};

export default Home;
