import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PlusCircle,
  ShoppingCart,
  Loader2,
  Search,
  Filter,
} from "lucide-react";
import { getServices } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import CallToAction from "@/components/CallToAction";

interface ServiceItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
}

const ServicesPage = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedView, setSelectedView] = useState<string>("grid");
  const [addedServices, setAddedServices] = useState<Record<string, boolean>>(
    {},
  );
  const [sortOrder, setSortOrder] = useState<string>("default");

  // Categories for the services
  const categories = [
    { id: "all", name: "Semua Layanan" },
    { id: "cleaning", name: "Pembersihan AC" },
    { id: "freon", name: "Layanan Freon" },
    { id: "installation", name: "Pemasangan & Bongkar" },
    { id: "repair", name: "Perbaikan & Pengecekan" },
    { id: "additional", name: "Layanan Tambahan" },
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const fetchedServices = await getServices();
        setServices(fetchedServices);
        setFilteredServices(fetchedServices);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Gagal memuat layanan. Silakan coba lagi nanti.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    // Filter services based on search query and category
    let result = [...services];

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (service) =>
          service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (service.description &&
            service.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase())),
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(
        (service) => service.category === selectedCategory,
      );
    }

    // Sort services
    if (sortOrder === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOrder === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "name-desc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredServices(result);
  }, [services, searchQuery, selectedCategory, sortOrder]);

  const handleAddToCart = (service: ServiceItem) => {
    setAddedServices((prev) => ({ ...prev, [service.id]: true }));

    // Reset the "added" status after 2 seconds for visual feedback
    setTimeout(() => {
      setAddedServices((prev) => ({ ...prev, [service.id]: false }));
    }, 2000);

    // Add the service to the cart
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Check if service already exists in cart
    const existingServiceIndex = existingCart.findIndex(
      (item: any) => item.id === service.id,
    );

    if (existingServiceIndex >= 0) {
      // Increment quantity if service already in cart
      existingCart[existingServiceIndex].quantity += 1;
    } else {
      // Add new service to cart
      existingCart.push({
        id: service.id,
        name: service.name,
        price: service.price,
        quantity: 1,
        category: service.category,
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));

    // Dispatch a custom event to notify other components
    window.dispatchEvent(
      new CustomEvent("cart-updated", { detail: existingCart }),
    );

    console.log("Added to cart:", service);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryName = (categoryId: string | undefined) => {
    if (!categoryId) return "Lainnya";
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Lainnya";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 pb-16">
        {/* Hero section */}
        <div className="bg-blue-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Daftar Layanan AC Home Jaya Teknik
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl max-w-3xl mx-auto mb-8"
            >
              Kami menyediakan berbagai layanan perawatan dan perbaikan AC untuk
              memastikan kenyamanan rumah dan kantor Anda dengan harga
              terjangkau dan kualitas terbaik.
            </motion.p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Search and filter section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Cari layanan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger>
                  <SelectValue placeholder="Urutkan berdasarkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Urutan Default</SelectItem>
                  <SelectItem value="price-asc">
                    Harga: Rendah ke Tinggi
                  </SelectItem>
                  <SelectItem value="price-desc">
                    Harga: Tinggi ke Rendah
                  </SelectItem>
                  <SelectItem value="name-asc">Nama: A-Z</SelectItem>
                  <SelectItem value="name-desc">Nama: Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                Menampilkan {filteredServices.length} layanan
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={selectedView === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedView("grid")}
                >
                  Grid
                </Button>
                <Button
                  variant={selectedView === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedView("list")}
                >
                  List
                </Button>
              </div>
            </div>
          </div>

          {/* Services content */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-lg text-gray-600">
                Memuat layanan...
              </span>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : (
            <div>
              <Tabs defaultValue="all" className="mb-8">
                <TabsList className="mb-6">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="all" className="mt-0">
                  {selectedView === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredServices.map((service) => (
                        <ServiceCard
                          key={service.id}
                          service={service}
                          onAddToCart={handleAddToCart}
                          isAdded={addedServices[service.id]}
                          formatPrice={formatPrice}
                          getCategoryName={getCategoryName}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredServices.map((service) => (
                        <ServiceListItem
                          key={service.id}
                          service={service}
                          onAddToCart={handleAddToCart}
                          isAdded={addedServices[service.id]}
                          formatPrice={formatPrice}
                          getCategoryName={getCategoryName}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                {categories
                  .filter((category) => category.id !== "all")
                  .map((category) => (
                    <TabsContent
                      key={category.id}
                      value={category.id}
                      className="mt-0"
                    >
                      {selectedView === "grid" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredServices.map((service) => (
                            <ServiceCard
                              key={service.id}
                              service={service}
                              onAddToCart={handleAddToCart}
                              isAdded={addedServices[service.id]}
                              formatPrice={formatPrice}
                              getCategoryName={getCategoryName}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {filteredServices.map((service) => (
                            <ServiceListItem
                              key={service.id}
                              service={service}
                              onAddToCart={handleAddToCart}
                              isAdded={addedServices[service.id]}
                              formatPrice={formatPrice}
                              getCategoryName={getCategoryName}
                            />
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  ))}
              </Tabs>
            </div>
          )}
        </div>

        {/* Pricing information */}
        <div className="bg-gray-100 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Informasi Harga Layanan
              </h2>
              <p className="mt-2 text-gray-600">
                Kami menawarkan harga yang kompetitif dan transparan untuk semua
                layanan kami
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-600">
                    Layanan Pembersihan AC
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Cuci AC 0.5 - 2 PK</span>
                      <span className="font-medium">Rp 70.000</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Cuci AC Inverter 0.5 - 1 PK</span>
                      <span className="font-medium">Rp 85.000</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Cuci AC 1.5 - 2 PK</span>
                      <span className="font-medium">Rp 95.000</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Cuci AC Inverter 0.5 - 2 PK</span>
                      <span className="font-medium">Rp 85.000</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Cuci Besar (Perombakan)</span>
                      <span className="font-medium">Rp 350.000</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-600">
                    Layanan Freon
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Tambah Freon R22 0.5 - 1 PK</span>
                      <span className="font-medium">Rp 175.000</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Tambah Freon R22 1.5 - 2 PK</span>
                      <span className="font-medium">Rp 250.000</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Tambah Freon R32/R410 0.5 - 1 PK</span>
                      <span className="font-medium">Rp 185.000</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Tambah Freon R32/R410 1.5 - 2 PK</span>
                      <span className="font-medium">Rp 250.000</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Isi Freon R22 0.5 - 1 PK</span>
                      <span className="font-medium">Rp 285.000</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-600">
                    Pemasangan & Bongkar
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Bongkar 0.5 - 1 PK</span>
                      <span className="font-medium">Rp 150.000</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Pasang 0.5 - 1 PK (3-5mtr pipa)</span>
                      <span className="font-medium">Rp 250.000</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Pasang 1.5 - 2 PK (3-5mtr pipa)</span>
                      <span className="font-medium">Rp 450.000</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Bongkar Pasang 0.5 - 1 PK</span>
                      <span className="font-medium">Rp 350.000</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Bongkar Pasang 1.5 - 2 PK</span>
                      <span className="font-medium">Rp 550.000</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Untuk informasi lebih lanjut tentang layanan dan harga,
                  silakan hubungi kami
                </p>
                <Button
                  onClick={() => window.open("tel:+6281234567890")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Hubungi Kami
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <CallToAction
          title="Siap untuk memesan layanan AC?"
          description="Pesan layanan AC Anda sekarang dan dapatkan pelayanan profesional dari teknisi ahli kami."
          buttonText="Pesan Sekarang"
          buttonLink="/booking"
        />
      </div>
      <Footer />
    </div>
  );
};

interface ServiceCardProps {
  service: ServiceItem;
  onAddToCart: (service: ServiceItem) => void;
  isAdded: boolean;
  formatPrice: (price: number) => string;
  getCategoryName: (categoryId: string | undefined) => string;
}

const ServiceCard = ({
  service,
  onAddToCart,
  isAdded,
  formatPrice,
  getCategoryName,
}: ServiceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{service.name}</CardTitle>
              <CardDescription className="text-sm">
                {getCategoryName(service.category)}
              </CardDescription>
            </div>
            <div className="text-lg font-semibold text-blue-600">
              {formatPrice(service.price)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-gray-600 text-sm">
            {service.description || "Layanan profesional untuk AC Anda"}
          </p>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => onAddToCart(service)}
            className="w-full"
            variant={isAdded ? "secondary" : "default"}
          >
            {isAdded ? (
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
  );
};

const ServiceListItem = ({
  service,
  onAddToCart,
  isAdded,
  formatPrice,
  getCategoryName,
}: ServiceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card>
        <div className="flex flex-col md:flex-row md:items-center p-4">
          <div className="flex-grow">
            <h3 className="font-medium text-lg">{service.name}</h3>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                {getCategoryName(service.category)}
              </span>
            </div>
            <p className="text-gray-600 mt-2 text-sm">
              {service.description || "Layanan profesional untuk AC Anda"}
            </p>
          </div>
          <div className="mt-4 md:mt-0 md:ml-4 flex flex-col md:flex-row items-center md:space-x-4">
            <div className="text-xl font-bold text-blue-600 mb-2 md:mb-0">
              {formatPrice(service.price)}
            </div>
            <Button
              onClick={() => onAddToCart(service)}
              variant={isAdded ? "secondary" : "default"}
              className="w-full md:w-auto"
            >
              {isAdded ? (
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
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ServicesPage;
