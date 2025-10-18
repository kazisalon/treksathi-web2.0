const tours = [
  {
    id: 1,
    title: "European Grand Tour",
    image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'><defs><linearGradient id='europe' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%234169E1;stop-opacity:1' /><stop offset='100%' style='stop-color:%236495ED;stop-opacity:1' /></linearGradient></defs><rect width='400' height='250' fill='url(%23europe)'/><rect x='50' y='100' width='80' height='60' fill='%23DEB887'/><rect x='60' y='80' width='60' height='20' fill='%23CD853F'/><rect x='200' y='120' width='60' height='40' fill='%23F5DEB3'/><rect x='210' y='100' width='40' height='20' fill='%23DEB887'/><rect x='300' y='90' width='70' height='70' fill='%23FFEFD5'/><rect x='310' y='70' width='50' height='20' fill='%23F5DEB3'/></svg>",
    duration: "14 days",
    price: "$2,499",
    originalPrice: "$2,999",
    countries: ["France", "Italy", "Germany", "Spain"],
    rating: 4.9,
    reviews: 234,
    highlights: ["Eiffel Tower", "Colosseum", "Neuschwanstein Castle"]
  },
  {
    id: 2,
    title: "Southeast Asia Adventure",
    image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'><defs><linearGradient id='asia' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%2332CD32;stop-opacity:1' /><stop offset='100%' style='stop-color:%23228B22;stop-opacity:1' /></linearGradient></defs><rect width='400' height='250' fill='url(%23asia)'/><polygon points='100,50 120,90 140,50' fill='%23654321'/><polygon points='200,40 220,80 240,40' fill='%238B4513'/><polygon points='300,60 320,100 340,60' fill='%23A0522D'/><path d='M0,200 Q200,180 400,200 L400,250 L0,250 Z' fill='%2387CEEB'/><circle cx='80' cy='30' r='20' fill='%23FFD700'/></svg>",
    duration: "12 days",
    price: "$1,899",
    originalPrice: "$2,299",
    countries: ["Thailand", "Vietnam", "Cambodia"],
    rating: 4.8,
    reviews: 189,
    highlights: ["Angkor Wat", "Ha Long Bay", "Bangkok Temples"]
  },
  {
    id: 3,
    title: "African Safari Experience",
    image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'><defs><linearGradient id='africa' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%23FF8C00;stop-opacity:1' /><stop offset='100%' style='stop-color:%23FF4500;stop-opacity:1' /></linearGradient></defs><rect width='400' height='250' fill='url(%23africa)'/><circle cx='100' cy='150' r='15' fill='%23654321'/><circle cx='120' cy='140' r='8' fill='%23654321'/><circle cx='250' cy='160' r='12' fill='%23696969'/><circle cx='270' cy='150' r='6' fill='%23696969'/><circle cx='320' cy='170' r='10' fill='%23D2691E'/><path d='M0,200 Q200,190 400,200 L400,250 L0,250 Z' fill='%23DAA520'/><circle cx='350' cy='40' r='25' fill='%23FFD700'/></svg>",
    duration: "10 days",
    price: "$3,299",
    originalPrice: "$3,799",
    countries: ["Kenya", "Tanzania"],
    rating: 4.9,
    reviews: 156,
    highlights: ["Serengeti", "Masai Mara", "Ngorongoro Crater"]
  }
];

const PopularTours = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Popular Tours
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of travelers on our most loved adventures around the globe
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tours.map((tour) => (
            <div
              key={tour.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Save ${parseInt(tour.originalPrice.replace('$', '').replace(',', '')) - parseInt(tour.price.replace('$', '').replace(',', ''))}
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-semibold text-gray-900">{tour.rating}</span>
                    <span className="text-xs text-gray-600">({tour.reviews})</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {tour.title}
                </h3>
                
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-gray-600 dark:text-gray-300">Duration:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{tour.duration}</span>
                </div>
                
                <div className="mb-4">
                  <span className="text-gray-600 dark:text-gray-300 block mb-2">Countries:</span>
                  <div className="flex flex-wrap gap-2">
                    {tour.countries.map((country, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                      >
                        {country}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <span className="text-gray-600 dark:text-gray-300 block mb-2">Highlights:</span>
                  <ul className="text-sm text-gray-700 dark:text-gray-300">
                    {tour.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className="text-green-500">✓</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {tour.price}
                    </span>
                    <span className="text-lg text-gray-500 line-through ml-2">
                      {tour.originalPrice}
                    </span>
                  </div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold">
                  Book This Tour
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularTours;