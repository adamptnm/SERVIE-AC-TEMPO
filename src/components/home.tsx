import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Hero from "./Hero";
import AboutUs from "./AboutUs";
import WhyChooseUs from "./WhyChooseUs";
import ServicesList from "./ServicesList";
import Testimonials from "./Testimonials";
import FAQ from "./FAQ";
import CallToAction from "./CallToAction";
import Footer from "./Footer";
import Cart from "./Cart";

interface ServiceItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const Home = () => {
  const [cartItems, setCartItems] = useState<ServiceItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();

  // Scroll to the appropriate section based on the current route
  useEffect(() => {
    const path = location.pathname;
    let targetId = "";

    if (path === "/services") {
      targetId = "services";
    } else if (path === "/about") {
      targetId = "about";
    } else if (path === "/contact") {
      targetId = "contact";
    }

    if (targetId) {
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location.pathname]);

  const handleAddToCart = (service: {
    id: string;
    name: string;
    price: number;
  }) => {
    setCartItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === service.id,
      );

      if (existingItemIndex >= 0) {
        // Increment quantity if item exists
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += 1;
        return newItems;
      } else {
        // Add new item with quantity 1
        return [...prevItems, { ...service, quantity: 1 }];
      }
    });

    // Open cart when adding an item
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleAddEmergencyService = (serviceId: string) => {
    // This would typically fetch the service details from a list of emergency services
    const emergencyServices = [
      { id: "e1", name: "Perbaikan Darurat", price: 150000 },
      { id: "e2", name: "Penggantian Komponen", price: 250000 },
      { id: "e3", name: "Konsultasi Teknis", price: 100000 },
      { id: "e4", name: "Pengecekan Sistem", price: 75000 },
    ];

    const service = emergencyServices.find((s) => s.id === serviceId);
    if (service) {
      handleAddToCart(service);
    }
  };

  const handleCheckout = () => {
    // Navigate to booking page with cart items
    window.location.href = "/booking";
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Fixed navbar with cart trigger */}
      <Navbar onCartOpen={() => setIsCartOpen(true)} />

      {/* Cart component */}
      <Cart
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onAddEmergencyService={handleAddEmergencyService}
        onCheckout={handleCheckout}
      />

      {/* Main content */}
      <main className="pt-20">
        {" "}
        {/* Add padding top to account for fixed navbar */}
        <Hero
          title="AC Home Jaya Teknik"
          subtitle="Layanan service AC terpercaya dengan teknisi berpengalaman untuk menjaga AC Anda tetap optimal"
          orderButtonText="Pesan Sekarang"
          pricesButtonText="Lihat Harga"
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          id="about"
        >
          <AboutUs />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <WhyChooseUs />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          id="services"
        >
          <ServicesList onAddToCart={handleAddToCart} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          id="testimonials"
        >
          <Testimonials />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          id="faq"
        >
          <FAQ />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <CallToAction
            title="Siap untuk service AC Anda?"
            description="Pesan layanan AC sekarang dan dapatkan perawatan profesional dari teknisi ahli kami."
            buttonText="Pesan Sekarang"
            buttonLink="/booking"
          />
        </motion.div>
      </main>

      <Footer id="contact" />
    </div>
  );
};

export default Home;
