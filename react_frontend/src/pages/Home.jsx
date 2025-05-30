import React from 'react'
import { About, Contact, Hero, Navbar, Prices, Services } from "../components/Home";
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
      <Contact />
    </>
  )
}

export default Home