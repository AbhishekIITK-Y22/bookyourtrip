import { SearchForm } from "@/components/SearchForm";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Zap, CreditCard, MapPin } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Zap className="h-8 w-8 text-blue-600" />,
      title: "Instant Booking",
      description: "Book your tickets in seconds with our streamlined process",
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Secure Payments",
      description: "Your transactions are protected with bank-level security",
    },
    {
      icon: <CreditCard className="h-8 w-8 text-blue-600" />,
      title: "Best Prices",
      description: "AI-powered dynamic pricing ensures competitive rates",
    },
    {
      icon: <MapPin className="h-8 w-8 text-blue-600" />,
      title: "Wide Network",
      description: "Access routes across the country from trusted providers",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Your Journey Starts Here
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Book bus and train tickets across the country with ease. Dynamic pricing, real-time availability, and instant confirmation.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <SearchForm variant="hero" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose BookYourTrip?</h2>
            <p className="text-gray-600 text-lg">Travel smarter with our innovative booking platform</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6 text-center"
              >
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Daily Routes</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">Happy Travelers</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100+</div>
              <div className="text-blue-100">Trusted Partners</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
