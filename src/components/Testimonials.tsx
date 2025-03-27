import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { getTestimonials } from "@/lib/api";
import { cn } from "../lib/utils";

interface TestimonialProps {
  id: number;
  name: string;
  role?: string;
  rating: number;
  comment: string;
  avatar?: string;
}

interface TestimonialsProps {
  testimonials?: TestimonialProps[];
  title?: string;
  subtitle?: string;
}

const defaultTestimonials: TestimonialProps[] = [
  {
    id: 1,
    name: "Budi Santoso",
    role: "Pemilik Rumah",
    rating: 5,
    comment:
      "Teknisi sangat profesional dan cepat. AC saya kembali dingin seperti baru. Sangat merekomendasikan jasa AC Home Jaya Teknik!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
  },
  {
    id: 2,
    name: "Siti Rahayu",
    role: "Pemilik Apartemen",
    rating: 5,
    comment:
      "Pelayanan cepat dan harga terjangkau. Teknisi datang tepat waktu dan menjelaskan masalah AC dengan detail. Puas dengan hasilnya!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti",
  },
  {
    id: 3,
    name: "Ahmad Hidayat",
    role: "Pemilik Toko",
    rating: 4,
    comment:
      "Sudah 3 kali menggunakan jasa AC Home dan selalu puas dengan hasilnya. Teknisi ramah dan berpengalaman.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
  },
  {
    id: 4,
    name: "Dewi Lestari",
    role: "Ibu Rumah Tangga",
    rating: 5,
    comment:
      "Sangat puas dengan layanan cuci AC. Sekarang AC jadi lebih dingin dan hemat listrik. Terima kasih AC Home!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dewi",
  },
  {
    id: 5,
    name: "Rudi Hartono",
    role: "Pengusaha",
    rating: 5,
    comment:
      "Respon cepat dan hasil memuaskan. AC yang tadinya tidak dingin sekarang sudah normal kembali. Harga juga sesuai dengan kualitas.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rudi",
  },
];

const Testimonials: React.FC<TestimonialsProps> = ({
  testimonials: propTestimonials,
  title = "Apa Kata Pelanggan Kami",
  subtitle = "Lihat pengalaman pelanggan yang telah menggunakan jasa service AC kami",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleTestimonials, setVisibleTestimonials] = useState<
    TestimonialProps[]
  >([]);
  const [testimonials, setTestimonials] = useState<TestimonialProps[]>(
    propTestimonials || defaultTestimonials,
  );
  const [isLoading, setIsLoading] = useState<boolean>(!propTestimonials);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (propTestimonials) {
      setTestimonials(propTestimonials);
      return;
    }

    const fetchTestimonials = async () => {
      try {
        setIsLoading(true);
        // Try to fetch testimonials, but use defaults if there's any issue
        try {
          const data = await getTestimonials();

          if (data && data.length > 0) {
            const mappedTestimonials = data.map((item, index) => ({
              id: index + 1,
              name: item.name,
              role: item.role || undefined,
              rating: item.rating,
              comment: item.comment,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name.replace(/\s+/g, "")}`,
            }));

            setTestimonials(mappedTestimonials);
          } else {
            // Use default testimonials if no data
            setTestimonials(defaultTestimonials);
          }
        } catch (fetchError) {
          console.error("Error fetching testimonials:", fetchError);
          // Use default testimonials on fetch error
          setTestimonials(defaultTestimonials);
        }
      } catch (err) {
        console.error("Error in testimonials component:", err);
        setError("Failed to load testimonials");
        setTestimonials(defaultTestimonials);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, [propTestimonials]);

  // Determine how many testimonials to show based on screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let visibleCount = 1;

      if (width >= 1280) {
        // xl
        visibleCount = 3;
      } else if (width >= 768) {
        // md
        visibleCount = 2;
      }

      // Make sure we don't go out of bounds
      const safeIndex = Math.min(
        currentIndex,
        testimonials.length - visibleCount,
      );
      setVisibleTestimonials(
        testimonials.slice(safeIndex, safeIndex + visibleCount),
      );
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentIndex, testimonials]);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      return newIndex >= testimonials.length ? 0 : newIndex;
    });
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - 1;
      return newIndex < 0 ? testimonials.length - 1 : newIndex;
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={18}
        className={cn(
          "inline-block",
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300",
        )}
      />
    ));
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-lg text-gray-600">
              Loading testimonials...
            </span>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <div className="relative">
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl">
                {visibleTestimonials.map((testimonial, index) => (
                  <motion.div
                    key={`${testimonial.id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-full"
                  >
                    <div className="flex items-center mb-4">
                      {testimonial.avatar && (
                        <div className="mr-4">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg">
                          {testimonial.name}
                        </h3>
                        {testimonial.role && (
                          <p className="text-gray-600 text-sm">
                            {testimonial.role}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mb-4">
                      {renderStars(testimonial.rating)}
                    </div>
                    <p className="text-gray-700 flex-grow italic">
                      "{testimonial.comment}"
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-center mt-8 space-x-4">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 mx-1 rounded-full ${index === currentIndex ? "bg-blue-600" : "bg-gray-300"}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
