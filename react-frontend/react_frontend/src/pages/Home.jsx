import React from 'react'
import { About, Contact, Hero, Navbar, Prices, Reviews, Services } from "../components/Home";
import Team from '../components/Home/Team';

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Team />
      <Prices />
      <Reviews />
      <Contact />
    </>
  )
}

export default Home