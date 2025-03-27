import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";

interface HeroProps {
  title?: string;
  subtitle?: string;
  orderButtonText?: string;
  pricesButtonText?: string;
}

const Hero = ({
  title = "AC Home Jaya Teknik",
  subtitle = "Layanan service AC terpercaya dengan teknisi berpengalaman untuk menjaga AC Anda tetap optimal",
  orderButtonText = "Pesan Sekarang",
  pricesButtonText = "Lihat Harga",
}: HeroProps) => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-gradient-to-b from-blue-50 to-white py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 mb-4">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              {subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full px-8"
                onClick={() => navigate("/booking")}
              >
                {orderButtonText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-blue-300 text-blue-700 hover:bg-blue-50 font-medium rounded-full px-8"
                onClick={() => navigate("/services")}
              >
                {pricesButtonText}
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="flex-1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute -top-4 -left-4 bg-yellow-400 rounded-full p-3 shadow-lg z-10">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80"
                  alt="AC Service Technician"
                  className="w-full h-auto object-cover"
                />
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Layanan Profesional
                  </h3>
                  <p className="text-gray-600">
                    Teknisi berpengalaman siap memberikan layanan terbaik untuk
                    AC Anda
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-blue-100 rounded-lg p-4 shadow-md">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-5 h-5 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    5.0 (500+ reviews)
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
