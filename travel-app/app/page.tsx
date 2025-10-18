// ... existing code ...
import Header from '../components/layout/Header';
import Hero from '../components/sections/Hero';
import FeaturedDestinations from '../components/sections/FeaturedDestinations';
import PopularTours from '../components/sections/PopularTours';
import WhyChooseUs from '../components/sections/WhyChooseUs';
import Testimonials from '../components/sections/Testimonials';
import Newsletter from '../components/sections/Newsletter';
import Footer from '../components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <main>
        <Hero />
        <FeaturedDestinations />
        <PopularTours />
        <WhyChooseUs />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
