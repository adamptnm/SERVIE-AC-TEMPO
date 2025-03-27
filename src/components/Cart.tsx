import React, { useState, useEffect } from "react";
import { ShoppingCart, Plus, Minus, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
}

interface EmergencyService {
  id: string;
  name: string;
  price: number;
}

const Cart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const navigate = useNavigate();

  const emergencyServices: EmergencyService[] = [
    { id: "e1", name: "Perbaikan Darurat", price: 150000 },
    { id: "e2", name: "Penggantian Komponen", price: 250000 },
    { id: "e3", name: "Konsultasi Teknis", price: 100000 },
    { id: "e4", name: "Pengecekan Sistem", price: 75000 },
  ];

  useEffect(() => {
    // Load cart items from localStorage
    const loadCart = () => {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      setIsLoading(false);
    };

    loadCart();

    // Listen for cart updates
    const handleCartUpdate = (e: any) => {
      setItems(e.detail || []);
    };

    window.addEventListener("cart-updated", handleCartUpdate);

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, []);

  const updateCart = (updatedItems: CartItem[]) => {
    setItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    window.dispatchEvent(
      new CustomEvent("cart-updated", { detail: updatedItems }),
    );
  };

  const handleQuantityChange = (id: string, change: number) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      const updatedItems = items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item,
      );
      updateCart(updatedItems);
    }
  };

  const handleRemoveItem = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id);
    updateCart(updatedItems);
  };

  const handleAddEmergencyService = (serviceId: string) => {
    const service = emergencyServices.find((s) => s.id === serviceId);
    if (!service) return;

    const existingItem = items.find((item) => item.id === service.id);
    if (existingItem) {
      handleQuantityChange(service.id, 1);
    } else {
      const updatedItems = [
        ...items,
        {
          id: service.id,
          name: service.name,
          price: service.price,
          quantity: 1,
          category: "emergency",
        },
      ];
      updateCart(updatedItems);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.11; // 11% tax
  const total = subtotal + tax;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-10 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Keranjang Belanja
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <ShoppingCart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Keranjang Anda Kosong
            </h2>
            <p className="text-gray-500 mb-6">
              Anda belum menambahkan layanan apapun ke keranjang
            </p>
            <Button
              onClick={() => navigate("/services")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Lihat Layanan
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Layanan yang dipilih
                  </h2>
                </div>

                <div className="divide-y">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between"
                      >
                        <div className="flex-1 mb-3 sm:mb-0">
                          <h3 className="font-medium text-gray-800">
                            {item.name}
                          </h3>
                          {item.category && (
                            <span className="text-xs text-gray-500">
                              {item.category}
                            </span>
                          )}
                          <div className="text-blue-600 font-semibold mt-1">
                            {formatPrice(item.price)}
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div className="flex items-center border rounded-md mr-4">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleQuantityChange(item.id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleQuantityChange(item.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Layanan Darurat/Tambahan
                  </h2>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                    {emergencyServices.map((service) => (
                      <Button
                        key={service.id}
                        variant="outline"
                        className="justify-between text-left h-auto py-2 px-3"
                        onClick={() => handleAddEmergencyService(service.id)}
                      >
                        <span className="text-sm">{service.name}</span>
                        <span className="text-sm font-medium">
                          {formatPrice(service.price)}
                        </span>
                      </Button>
                    ))}
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-md flex items-start space-x-2 text-sm">
                    <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <p className="text-yellow-700">
                      Layanan darurat/tambahan dapat ditambahkan jika diperlukan
                      saat teknisi berada di lokasi.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Ringkasan Pesanan
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pajak (11%)</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-blue-600">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <Input
                    placeholder="Kode Promo"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="secondary" className="ml-2">
                    Terapkan
                  </Button>
                </div>
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 mb-3"
                onClick={() => navigate("/booking")}
              >
                Lanjutkan ke Pemesanan
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/services")}
              >
                Tambah Layanan Lainnya
              </Button>

              <p className="text-xs text-center text-gray-500 mt-4">
                Dengan melanjutkan, Anda menyetujui syarat dan ketentuan kami
                termasuk kebijakan pembatalan.
              </p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
