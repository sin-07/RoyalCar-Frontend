import React from 'react'
import Hero from '../components/Hero'
import FeaturedSection from '../components/FeaturedSection'
import Banner from '../components/Banner'
import Testimonial from '../components/Testimonial'
import Newsletter from '../components/Newsletter'

const Home = () => {
  return (
    <div className="w-full">
      <Hero />
      <main className="w-full bg-white">
        <FeaturedSection />
        <Banner />
        <Testimonial />
        <Newsletter />
      </main>
    </div>
  )
}

export default Home
