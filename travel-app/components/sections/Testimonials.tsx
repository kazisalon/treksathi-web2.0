const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York, USA",
    image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23FF69B4'/><circle cx='35' cy='40' r='3' fill='%23FFF'/><circle cx='65' cy='40' r='3' fill='%23FFF'/><path d='M35,65 Q50,75 65,65' stroke='%23FFF' stroke-width='2' fill='none'/></svg>",
    rating: 5,
    text: "TrekSathi made our European honeymoon absolutely magical! Every detail was perfectly planned, and our guide Maria was incredible. We'll definitely book with them again!",
    trip: "European Grand Tour"
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Toronto, Canada",
    image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%234169E1'/><circle cx='35' cy='40' r='3' fill='%23FFF'/><circle cx='65' cy='40' r='3' fill='%23FFF'/><path d='M35,65 Q50,75 65,65' stroke='%23FFF' stroke-width='2' fill='none'/></svg>",
    rating: 5,
    text: "The African safari exceeded all expectations. Seeing the Big Five in their natural habitat was a dream come true. The accommodations were luxurious and the service was top-notch.",
    trip: "African Safari Experience"
  },
  {
    id: 3,
    name: "Emma Williams",
    location: "London, UK",
    image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%2332CD32'/><circle cx='35' cy='40' r='3' fill='%23FFF'/><circle cx='65' cy='40' r='3' fill='%23FFF'/><path d='M35,65 Q50,75 65,65' stroke='%23FFF' stroke-width='2' fill='none'/></svg>",
    rating: 5,
    text: "Southeast Asia was an adventure of a lifetime! From the temples of Angkor Wat to the bustling streets of Bangkok, every moment was perfectly curated. Highly recommended!",
    trip: "Southeast Asia Adventure"
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our amazing travelers have to say about their experiences with TrekSathi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Rating Stars */}
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-500 text-xl">★</span>
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic">
                "{testimonial.text}"
              </p>

              {/* Trip Info */}
              <div className="mb-6">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-semibold">
                  {testimonial.trip}
                </span>
              </div>

              {/* User Info */}
              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Trusted by travelers worldwide and featured in:
          </p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-2xl font-bold text-gray-400">CNN Travel</div>
            <div className="text-2xl font-bold text-gray-400">Lonely Planet</div>
            <div className="text-2xl font-bold text-gray-400">Travel + Leisure</div>
            <div className="text-2xl font-bold text-gray-400">National Geographic</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;