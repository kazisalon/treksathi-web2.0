// ... existing code ...
import Header from '@/components/layout/Header';
import Hero from '@/components/sections/Hero';
import Posts from '@/components/sections/Posts'; // Travel Stories Section
import FeaturedDestinations from '@/components/sections/FeaturedDestinations';
import PopularTours from '@/components/sections/PopularTours'; // Now "Plan Your Path"
import WhyChooseUs from '@/components/sections/WhyChooseUs'; // Now "Seasonal Experiences"
import Testimonials from '@/components/sections/Testimonials'; // Now "Stories from Nepal"
import Marketplace from '@/components/sections/Marketplace';

import SustainabilityImpact from '@/components/sections/SustainabilityImpact';
import Newsletter from '@/components/sections/Newsletter'; // Now "Join Our Community"
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Posts /> {/* Travel Stories */}
      <FeaturedDestinations />
      <Marketplace /> {/* Marketplace below Travel Stories */}
      {/* Removed Testimonials (Stories from Nepal) */}
      <PopularTours /> {/* Plan Your Path */}
      <WhyChooseUs /> {/* Seasonal Experiences */}
      {/* Removed SustainabilityImpact */}
      <Newsletter /> {/* Join Our Community */}
      <Footer />
    </main>
  );
}
