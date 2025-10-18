const destinations = [
  {
    id: 1,
    name: "Everest Base Camp",
    nameNp: "एभरेस्ट बेस क्याम्प",
    image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><defs><linearGradient id='everest' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%2310B981;stop-opacity:1' /><stop offset='100%' style='stop-color:%23059669;stop-opacity:1' /></linearGradient></defs><rect width='400' height='300' fill='url(%23everest)'/><polygon points='200,50 150,200 250,200' fill='%23FFFFFF'/><polygon points='100,80 50,200 150,200' fill='%23F0FDF4'/><polygon points='300,70 250,200 350,200' fill='%23F0FDF4'/><path d='M0,200 Q200,180 400,200 L400,300 L0,300 Z' fill='%2315803D'/><circle cx='80' cy='40' r='15' fill='%23FFD700'/></svg>",
    price: "From $1,899",
    duration: "14 days",
    rating: 4.9,
    description: "World's highest peak base camp trek",
    descriptionNp: "संसारको सबैभन्दा अग्लो पर्वतको आधार शिविर ट्रेक"
  },
  {
    id: 2,
    name: "Pokhara Valley",
    nameNp: "पोखरा उपत्यका",
    image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><defs><linearGradient id='pokhara' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%2314B8A6;stop-opacity:1' /><stop offset='100%' style='stop-color:%230D9488;stop-opacity:1' /></linearGradient></defs><rect width='400' height='300' fill='url(%23pokhara)'/><ellipse cx='200' cy='200' rx='150' ry='50' fill='%23F0FDFA'/><polygon points='50,150 100,50 150,150' fill='%23FFFFFF'/><polygon points='250,140 300,40 350,140' fill='%23F0FDF4'/><circle cx='100' cy='30' r='20' fill='%23FFD700'/></svg>",
    price: "From $699",
    duration: "7 days",
    rating: 4.8,
    description: "Serene lakes with Himalayan backdrop",
    descriptionNp: "शान्त तालहरू र पहाडी दृश्यहरू"
  },
  {
    id: 3,
    name: "Chitwan National Park",
    nameNp: "चितवन राष्ट्रिय निकुञ्ज",
    image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><defs><linearGradient id='chitwan' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%2316A34A;stop-opacity:1' /><stop offset='100%' style='stop-color:%2315803D;stop-opacity:1' /></linearGradient></defs><rect width='400' height='300' fill='url(%23chitwan)'/><circle cx='100' cy='150' r='20' fill='%23654321'/><rect x='90' y='140' width='20' height='30' fill='%23654321'/><circle cx='300' cy='180' r='15' fill='%23D2691E'/><rect x='292' y='170' width='16' height='25' fill='%23D2691E'/><path d='M0,250 Q200,230 400,250 L400,300 L0,300 Z' fill='%2315803D'/></svg>",
    price: "From $599",
    duration: "4 days",
    rating: 4.7,
    description: "Wildlife safari and jungle adventures",
    descriptionNp: "वन्यजन्तु सफारी र जंगली साहसिक"
  },
  {
    id: 4,
    name: "Kathmandu Heritage",
    nameNp: "काठमाडौं सम्पदा",
    image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><defs><linearGradient id='kathmandu' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%23059669;stop-opacity:1' /><stop offset='100%' style='stop-color:%23047857;stop-opacity:1' /></linearGradient></defs><rect width='400' height='300' fill='url(%23kathmandu)'/><rect x='150' y='80' width='100' height='120' fill='%23CD853F'/><polygon points='150,80 200,40 250,80' fill='%23A0522D'/><rect x='170' y='120' width='15' height='30' fill='%23654321'/><rect x='215' y='120' width='15' height='30' fill='%23654321'/><rect x='190' y='160' width='20' height='40' fill='%23654321'/><circle cx='80' cy='50' r='20' fill='%23FFD700'/></svg>",
    price: "From $499",
    duration: "5 days",
    rating: 4.6,
    description: "Ancient temples and cultural wonders",
    descriptionNp: "पुरातन मन्दिरहरू र सांस्कृतिक अजूबाहरू"
  }
];

const FeaturedDestinations = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            Explore Nepal's Wonders
          </h2>
          <h3 className="text-2xl md:text-3xl font-semibold text-emerald-600 dark:text-emerald-400 mb-4">
            नेपालका अजूबाहरू अन्वेषण गर्नुहोस्
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-2">
            From the world's highest peaks to ancient temples and wildlife sanctuaries - 
            discover Nepal's most iconic destinations that will leave you breathless
          </p>
          <p className="text-lg text-emerald-700 dark:text-emerald-300 max-w-3xl mx-auto">
            संसारका सबैभन्दा अग्लो शिखरहरूदेखि पुरातन मन्दिरहरू र वन्यजन्तु अभयारण्यहरूसम्म
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