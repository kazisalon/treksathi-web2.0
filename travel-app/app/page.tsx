// ... existing code ...
import Header from '@/components/layout/Header';
import Hero from '@/components/sections/Hero';
import NearbyDestinations from '@/components/sections/NearbyDestinations';
import FeaturedDestinations from '@/components/sections/FeaturedDestinations';
import PopularTours from '@/components/sections/PopularTours'; // Now "Plan Your Path"
import WhyChooseUs from '@/components/sections/WhyChooseUs'; // Now "Seasonal Experiences"
import Testimonials from '@/components/sections/Testimonials'; // Now "Stories from Nepal"
import LocalsWhoInspire from '@/components/sections/LocalsWhoInspire';
import SustainabilityImpact from '@/components/sections/SustainabilityImpact';
import Newsletter from '@/components/sections/Newsletter'; // Now "Join Our Community"
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <NearbyDestinations />
      <FeaturedDestinations />
      <Testimonials /> {/* Stories from Nepal */}
      <PopularTours /> {/* Plan Your Path */}
      <LocalsWhoInspire />
      <WhyChooseUs /> {/* Seasonal Experiences */}
      <SustainabilityImpact />
      <Newsletter /> {/* Join Our Community */}
      <Footer />
    </main>
  );
}
