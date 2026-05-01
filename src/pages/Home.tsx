import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Feedback from '../components/Feedback';
import ProductSection from '../components/ProductSection';

export default function Home() {
  return (
    <>
      <Hero />
      <ProductSection />
      <About />
      <Feedback />
    </>
  );
}
