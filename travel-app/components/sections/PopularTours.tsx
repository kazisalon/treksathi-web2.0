const tours = [
  {
    id: 1,
    title: "Everest Base Camp Trek",
    image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'><defs><linearGradient id='everest' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%2387CEEB;stop-opacity:1' /><stop offset='100%' style='stop-color:%234169E1;stop-opacity:1' /></linearGradient></defs><rect width='400' height='250' fill='url(%23everest)'/><polygon points='200,30 150,180 250,180' fill='%23FFFFFF'/><polygon points='100,50 50,180 150,180' fill='%23F0F8FF'/><polygon points='300,40 250,180 350,180' fill='%23E6E6FA'/><path d='M0,180 Q200,160 400,180 L400,250 L0,250 Z' fill='%2332CD32'/><circle cx='80' cy='20' r='15' fill='%23FFD700'/></svg>",
    duration: "14 days",
    price: "$1,899",
    originalPrice: "$2,299",
    regions: ["Khumbu Valley", "Sagarmatha National Park"],
    rating: 4.9,
    reviews: 342,
    highlights: ["Everest Base Camp", "Sherpa Culture", "Himalayan Views"]
  },
  {
    id: 2,
    title: "Annapurna Circuit Trek",
    image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'><defs><linearGradient id='annapurna' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%2332CD32;stop-opacity:1' /><stop offset='100%' style='stop-color:%23228B22;stop-opacity:1' /></linearGradient></defs><rect width='400' height='250' fill='url(%23annapurna)'/><polygon points='100,40 80,160 120,160' fill='%23FFFFFF'/><polygon points='200,30 180,150 220,150' fill='%23F0F8FF'/><polygon points='300,50 280,170 320,170' fill='%23E6E6FA'/><path d='M0,170 Q200,150 400,170 L400,250 L0,250 Z' fill='%2332CD32'/><circle cx='350' cy='25' r='18' fill='%23FFD700'/></svg>",
    duration: "16 days",
    price: "$1,599",
    originalPrice: "$1,999",
    regions: ["Annapurna Conservation Area", "Mustang District"],
    rating: 4.8,
    reviews: 267,
    highlights: ["Thorong La Pass", "Muktinath Temple", "Diverse Landscapes"]
  },
  {
    id: 3,
    title: "Nepal Cultural Heritage Tour",
    image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'><defs><linearGradient id='heritage' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%23DAA520;stop-opacity:1' /><stop offset='100%' style='stop-color:%23B8860B;stop-opacity:1' /></linearGradient></defs><rect width='400' height='250' fill='url(%23heritage)'/><rect x='150' y='60' width='100' height='120' fill='%238B4513'/><polygon points='150,60 200,20 250,60' fill='%23654321'/><rect x='170' y='100' width='15' height='30' fill='%23654321'/><rect x='215' y='100' width='15' height='30' fill='%23654321'/><rect x='190' y='140' width='20' height='40' fill='%23654321'/><circle cx='80' cy='30' r='20' fill='%23FFD700'/></svg>",
    duration: "8 days",
    price: "$899",
    originalPrice: "$1,199",
    regions: ["Kathmandu Valley", "Pokhara", "Lumbini"],
    rating: 4.7,
    reviews: 198,
    highlights: ["UNESCO World Heritage Sites", "Buddhist Temples", "Local Markets"]
  }
];

const PopularTours = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            Most Popular Nepal Adventures
          </h2>
          <h3 className="text-2xl md:text-3xl font-semibold text-emerald-600 dark:text-emerald-400 mb-4">
            सबैभन्दा लोकप्रिय नेपाली साहसिक यात्राहरू
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-2">
            Experience the best of Nepal with our top-rated treks and cultural tours, 
            loved by thousands of international travelers
          </p>
          <p className="text-lg text-emerald-700 dark:text-emerald-300 max-w-3xl mx-auto">
            हजारौं अन्तर्राष्ट्रिय यात्रुहरूले मन पराएका उत्कृष्ट ट्रेक र सांस्कृतिक भ्रमणहरू
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
                  <span className="text-gray-600 dark:text-gray-300 block mb-2">Regions:</span>
                  <div className="flex flex-wrap gap-2">
                    {tour.regions.map((region, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                      >
                        {region}
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