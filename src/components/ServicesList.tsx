import React, { useState, useEffect } from "react";
import { PlusCircle, ShoppingCart, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { getServices } from "@/lib/api";

interface ServiceItem {
  id: string;
  name: string;
  price: number;
  description?: string;
}

interface ServiceCategory {
  id: string;
  title: string;
  services: ServiceItem[];
}

interface ServicesListProps {
  categories?: ServiceCategory[];
  onAddToCart?: (service: ServiceItem) => void;
}

const defaultCategories: ServiceCategory[] = [
  {
    id: "cleaning",
    title: "Layanan Pembersihan AC",
    services: [
      {
        id: "clean-1",
        name: "Cuci AC 0.5 - 2 PK",
        price: 70000,
        description:
          "Pembersihan standar untuk AC ukuran kecil hingga menengah",
      },
      {
        id: "clean-2",
        name: "Cuci AC Inverter 0.5 - 1 PK",
        price: 85000,
        description: "Pembersihan khusus untuk AC inverter ukuran kecil",
      },
      {
        id: "clean-3",
        name: "Cuci AC 1.5 - 2 PK",
        price: 95000,
        description:
          "Pembersihan standar untuk AC ukuran menengah hingga besar",
      },
      {
        id: "clean-4",
        name: "Cuci AC Inverter 0.5 - 2 PK",
        price: 85000,
        description: "Pembersihan khusus untuk AC inverter berbagai ukuran",
      },
      {
        id: "clean-5",
        name: "Cuci Besar (Perombakan)",
        price: 350000,
        description: "Pembersihan menyeluruh dengan pembongkaran komponen",
      },
    ],
  },
  {
    id: "freon",
    title: "Layanan Freon",
    services: [
      {
        id: "freon-1",
        name: "Tambah Freon R22 0.5 - 1 PK",
        price: 175000,
        description: "Penambahan freon tipe R22 untuk AC ukuran kecil",
      },
      {
        id: "freon-2",
        name: "Tambah Freon R22 1.5 - 2 PK",
        price: 250000,
        description: "Penambahan freon tipe R22 untuk AC ukuran besar",
      },
      {
        id: "freon-3",
        name: "Tambah Freon R32/R410 0.5 - 1 PK",
        price: 185000,
        description: "Penambahan freon tipe R32/R410 untuk AC ukuran kecil",
      },
      {
        id: "freon-4",
        name: "Tambah Freon R32/R410 1.5 - 2 PK",
        price: 250000,
        description: "Penambahan freon tipe R32/R410 untuk AC ukuran besar",
      },
      {
        id: "freon-5",
        name: "Isi Freon R22 0.5 - 1 PK",
        price: 285000,
        description: "Pengisian penuh freon tipe R22 untuk AC ukuran kecil",
      },
      {
        id: "freon-6",
        name: "Isi Freon R22 1.5 - 2 PK",
        price: 350000,
        description: "Pengisian penuh freon tipe R22 untuk AC ukuran besar",
      },
      {
        id: "freon-7",
        name: "Isi Freon R32/R410 0.5 - 1 PK",
        price: 285000,
        description:
          "Pengisian penuh freon tipe R32/R410 untuk AC ukuran kecil",
      },
      {
        id: "freon-8",
        name: "Isi Freon R32/R410 1.5 - 2 PK",
        price: 400000,
        description:
          "Pengisian penuh freon tipe R32/R410 untuk AC ukuran besar",
      },
    ],
  },
  {
    id: "installation",
    title: "Layanan Pemasangan & Bongkar",
    services: [
      {
        id: "install-1",
        name: "Bongkar 0.5 - 1 PK",
        price: 150000,
        description: "Pembongkaran AC ukuran kecil",
      },
      {
        id: "install-2",
        name: "Pasang 0.5 - 1 PK (3-5mtr pipa)",
        price: 250000,
        description: "Pemasangan AC ukuran kecil dengan pipa 3-5 meter",
      },
      {
        id: "install-3",
        name: "Pasang 1.5 - 2 PK (3-5mtr pipa)",
        price: 450000,
        description: "Pemasangan AC ukuran besar dengan pipa 3-5 meter",
      },
      {
        id: "install-4",
        name: "Bongkar Pasang 0.5 - 1 PK (3-5mtr pipa)",
        price: 350000,
        description: "Bongkar dan pasang ulang AC ukuran kecil",
      },
      {
        id: "install-5",
        name: "Bongkar Pasang 1.5 - 2 PK (3-5mtr pipa)",
        price: 550000,
        description: "Bongkar dan pasang ulang AC ukuran besar",
      },
      {
        id: "install-6",
        name: "Tarik pipa lebih dari 5mtr, naik plafon, dan bologin flapon",
        price: 25000,
        description: "Biaya per meter untuk penarikan pipa tambahan",
      },
    ],
  },
  {
    id: "repair",
    title: "Layanan Perbaikan & Pengecekan",
    services: [
      {
        id: "repair-1",
        name: "Pengecekan AC",
        price: 75000,
        description: "Diagnosa permasalahan pada AC",
      },
      {
        id: "repair-2",
        name: "Bobok Tembok /m/lobang",
        price: 50000,
        description: "Pembuatan lubang pada tembok untuk instalasi",
      },
      {
        id: "repair-3",
        name: "Las Sambungan Pipa Freon /titik",
        price: 75000,
        description: "Pengelasan sambungan pipa freon per titik",
      },
      {
        id: "repair-4",
        name: "Las Perbaikan Kebocoran Pipa Freon + Isi Freon",
        price: 600000,
        description: "Perbaikan kebocoran dan pengisian ulang freon",
      },
      {
        id: "repair-5",
        name: "Pergantian Kapasitor 0.5-1 PK (Part dan Jasa)",
        price: 255000,
        description: "Penggantian kapasitor untuk AC ukuran kecil",
      },
      {
        id: "repair-6",
        name: "Pergantian Kapasitor 1.5-2 PK (Part dan Jasa)",
        price: 330000,
        description: "Penggantian kapasitor untuk AC ukuran besar",
      },
      {
        id: "repair-7",
        name: "Rusak 1 PK",
        price: 75000,
        description: "Biaya perbaikan kerusakan AC 1 PK",
      },
      {
        id: "repair-8",
        name: "Rusak 2 PK",
        price: 95000,
        description: "Biaya perbaikan kerusakan AC 2 PK",
      },
    ],
  },
  {
    id: "additional",
    title: "Layanan Tambahan",
    services: [
      {
        id: "add-1",
        name: "Biaya Apartemen",
        price: 20000,
        description: "Biaya tambahan untuk servis di apartemen",
      },
      {
        id: "add-2",
        name: "Vacuum & Flushing AC",
        price: 350000,
        description: "Pembersihan sistem dengan vakum dan flushing",
      },
      {
        id: "add-3",
        name: "Pembilasan Evaporator",
        price: 200000,
        description: "Pembersihan khusus untuk evaporator",
      },
      {
        id: "add-4",
        name: "Vakum",
        price: 100000,
        description: "Proses vakum pada sistem AC",
      },
      {
        id: "add-5",
        name: "Daptip pipa",
        price: 15000,
        description: "Pemasangan daptip pada pipa",
      },
      {
        id: "add-6",
        name: "Tip daptip",
        price: 15000,
        description: "Biaya tambahan untuk tip daptip",
      },
    ],
  },
];

const ServicesList: React.FC<ServicesListProps> = ({
  categories: propCategories,
  onAddToCart = () => {},
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string>("cleaning");
  const [addedServices, setAddedServices] = useState<Record<string, boolean>>(
    {},
  );
  const [categories, setCategories] = useState<ServiceCategory[]>(
    propCategories || defaultCategories,
  );
  const [isLoading, setIsLoading] = useState<boolean>(!propCategories);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (propCategories) {
      setCategories(propCategories);
      return;
    }

    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const services = await getServices();

        // If no services returned, use default categories
        if (!services || services.length === 0) {
          setCategories(defaultCategories);
          return;
        }

        // Group services by category
        const servicesByCategory: Record<string, ServiceItem[]> = {};

        services.forEach((service) => {
          if (!service.category) {
            // Skip services without category
            return;
          }

          if (!servicesByCategory[service.category]) {
            servicesByCategory[service.category] = [];
          }

          servicesByCategory[service.category].push({
            id: service.id,
            name: service.name,
            price: service.price,
            description: service.description || undefined,
          });
        });

        // If no valid categorized services, use default categories
        if (Object.keys(servicesByCategory).length === 0) {
          setCategories(defaultCategories);
          return;
        }

        // Convert to categories array
        const fetchedCategories: ServiceCategory[] = Object.keys(
          servicesByCategory,
        ).map((category) => {
          const title =
            category === "cleaning"
              ? "Layanan Pembersihan AC"
              : category === "freon"
                ? "Layanan Freon"
                : category === "installation"
                  ? "Layanan Pemasangan & Bongkar"
                  : category === "repair"
                    ? "Layanan Perbaikan & Pengecekan"
                    : category === "additional"
                      ? "Layanan Tambahan"
                      : category;

          return {
            id: category,
            title,
            services: servicesByCategory[category],
          };
        });

        setCategories(fetchedCategories);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services. Please try again later.");
        // Use default categories when there's an error
        setCategories(defaultCategories);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [propCategories]);

  const handleAddToCart = (service: ServiceItem) => {
    setAddedServices((prev) => ({ ...prev, [service.id]: true }));

    // Reset the "added" status after 2 seconds for visual feedback
    setTimeout(() => {
      setAddedServices((prev) => ({ ...prev, [service.id]: false }));
    }, 2000);

    onAddToCart(service);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div id="services" className="w-full bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Layanan Kami
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Kami menyediakan berbagai layanan perawatan dan perbaikan AC untuk
            memastikan kenyamanan rumah dan kantor Anda.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-lg text-gray-600">
              Loading services...
            </span>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <div className="mt-8">
            <Accordion
              type="single"
              collapsible
              value={expandedCategory}
              onValueChange={setExpandedCategory}
              className="w-full"
            >
              {categories.map((category) => (
                <AccordionItem
                  key={category.id}
                  value={category.id}
                  className="border border-gray-200 rounded-lg mb-4 overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 bg-gray-50 hover:bg-gray-100 text-lg font-medium">
                    {category.title}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      {category.services.map((service) => (
                        <motion.div
                          key={service.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <Card className="h-full flex flex-col">
                            <CardHeader>
                              <CardTitle>{service.name}</CardTitle>
                              <CardDescription className="text-lg font-semibold text-primary">
                                {formatPrice(service.price)}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                              <p className="text-gray-600">
                                {service.description}
                              </p>
                            </CardContent>
                            <CardFooter>
                              <Button
                                onClick={() => handleAddToCart(service)}
                                className="w-full"
                                variant={
                                  addedServices[service.id]
                                    ? "secondary"
                                    : "default"
                                }
                              >
                                {addedServices[service.id] ? (
                                  <span className="flex items-center">
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    Ditambahkan
                                  </span>
                                ) : (
                                  <span className="flex items-center">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Tambah ke Keranjang
                                  </span>
                                )}
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesList;
