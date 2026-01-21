import Header from '@/components/layout/Header';
import Hero from '@/components/sections/Hero';
import Posts from '@/components/sections/Posts';
import FeaturedDestinations from '@/components/sections/FeaturedDestinations';
import PopularTours from '@/components/sections/PopularTours';
import WhyChooseUs from '@/components/sections/WhyChooseUs';
import Marketplace from '@/components/sections/Marketplace';
import Newsletter from '@/components/sections/Newsletter';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Posts />
      <FeaturedDestinations />
      <Marketplace />
      <PopularTours />
      <WhyChooseUs />
      <Newsletter />
      <Footer />
    </main>
  );
}
