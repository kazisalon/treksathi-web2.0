const destinations = [
  {
    id: 1,
    name: "Santorini, Greece",
    image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><defs><linearGradient id='santorini' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%2387CEEB;stop-opacity:1' /><stop offset='100%' style='stop-color:%234169E1;stop-opacity:1' /></linearGradient></defs><rect width='400' height='300' fill='url(%23santorini)'/><path d='M0,200 Q100,150 200,180 T400,160 L400,300 L0,300 Z' fill='%23FFFFFF'/><circle cx='80' cy='120' r='15' fill='%23FFFFFF'/><rect x='70' y='105' width='20' height='30' fill='%23FFFFFF'/><circle cx='320' cy='100' r='12' fill='%23FFFFFF'/><rect x='312' y='88' width='16' height='24' fill='%23FFFFFF'/></svg>",
    price: "From $1,299",
    duration: "7 days",
    rating: 4.9,
    description: "Stunning sunsets and white-washed buildings"
  },
  {
    id: 2,
    name: "Bali, Indonesia",
    image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><defs><linearGradient id='bali' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%2332CD32;stop-opacity:1' /><stop offset='100%' style='stop-color:%23228B22;stop-opacity:1' /></linearGradient></defs><rect width='400' height='300' fill='url(%23bali)'/><path d='M0,250 Q100,200 200,220 T400,200 L400,300 L0,300 Z' fill='%2387CEEB'/><polygon points='150,100 170,140 190,100' fill='%23654321'/><polygon points='250,80 270,120 290,80' fill='%23654321'/><circle cx='100' cy='50' r='25' fill='%23FFD700'/></svg>",
    price: "From $899",
    duration: "10 days",
    rating: 4.8,
    description: "Tropical paradise with rich culture"
  },
  {
    id: 3,
    name: "Swiss Alps",
    image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><defs><linearGradient id='alps' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%2387CEEB;stop-opacity:1' /><stop offset='100%' style='stop-color:%234682B4;stop-opacity:1' /></linearGradient></defs><rect width='400' height='300' fill='url(%23alps)'/><polygon points='50,200 150,50 250,200' fill='%23FFFFFF'/><polygon points='200,180 300,30 400,180' fill='%23F0F8FF'/><polygon points='0,220 100,80 200,220' fill='%23E6E6FA'/><path d='M0,250 Q200,230 400,250 L400,300 L0,300 Z' fill='%2332CD32'/></svg>",
    price: "From $1,599",
    duration: "8 days",
    rating: 4.9,
    description: "Majestic mountains and pristine lakes"
  },
  {
    id: 4,
    name: "Tokyo, Japan",
    image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><defs><linearGradient id='tokyo' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%23FF69B4;stop-opacity:1' /><stop offset='100%' style='stop-color:%23FF1493;stop-opacity:1' /></linearGradient></defs><rect width='400' height='300' fill='url(%23tokyo)'/><rect x='50' y='100' width='20' height='100' fill='%23808080'/><rect x='100' y='80' width='25' height='120' fill='%23696969'/><rect x='150' y='60' width='30' height='140' fill='%23778899'/><rect x='200' y='90' width='20' height='110' fill='%23708090'/><rect x='250' y='70' width='25' height='130' fill='%23696969'/><rect x='300' y='50' width='35' height='150' fill='%23778899'/><circle cx='80' cy='40' r='8' fill='%23FFB6C1'/><circle cx='180' cy='30' r='6' fill='%23FFB6C1'/></svg>",
    price: "From $1,199",
    duration: "6 days",
    rating: 4.7,
    description: "Modern metropolis meets ancient tradition"
  }
];

const FeaturedDestinations = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Destinations
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover the world's most breathtaking destinations, carefully curated for unforgettable experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {destinations.map((destination) => (
            <div
              key={destination.id}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-semibold text-gray-900">{destination.rating}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {destination.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {destination.description}
                </p>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {destination.price}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {destination.duration}
                  </span>
                </div>
                
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold">
                  Explore Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;