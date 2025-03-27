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

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface EmergencyService {
  id: string;
  name: string;
  price: number;
}

interface CartProps {
  items?: CartItem[];
  onCheckout?: () => void;
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onRemoveItem?: (id: string) => void;
  onAddEmergencyService?: (serviceId: string) => void;
}

const Cart = ({
  items = [
    { id: "1", name: "Cuci AC 0.5 - 2 PK", price: 70000, quantity: 1 },
    {
      id: "2",
      name: "Tambah Freon R22 0,5 - 1 PK",
      price: 175000,
      quantity: 1,
    },
  ],
  onCheckout = () => console.log("Checkout clicked"),
  onUpdateQuantity = () => {},
  onRemoveItem = () => {},
  onAddEmergencyService = () => {},
}: CartProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Update isOpen when props change
  useEffect(() => {
    if (items.length > 0) {
      setIsOpen(true);
    }
  }, [items.length]);
  const [promoCode, setPromoCode] = useState("");

  const emergencyServices: EmergencyService[] = [
    { id: "e1", name: "Perbaikan Darurat", price: 150000 },
    { id: "e2", name: "Penggantian Komponen", price: 250000 },
    { id: "e3", name: "Konsultasi Teknis", price: 100000 },
    { id: "e4", name: "Pengecekan Sistem", price: 75000 },
  ];

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.11; // 11% tax
  const total = subtotal + tax;

  const handleQuantityChange = (id: string, change: number) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      onUpdateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = (id: string) => {
    onRemoveItem(id);
  };

  const handleAddEmergencyService = (serviceId: string) => {
    onAddEmergencyService(serviceId);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative bg-white text-black hover:bg-gray-100"
        >
          <ShoppingCart className="h-5 w-5" />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {items.reduce((total, item) => total + item.quantity, 0)}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto bg-white">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Keranjang Anda</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500">Keranjang Anda kosong</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setIsOpen(false)}
            >
              Lanjutkan Belanja
            </Button>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Layanan yang dipilih</h3>
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between py-3 border-b border-gray-100"
                  >
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-500">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleQuantityChange(item.id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleQuantityChange(item.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
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

            <div className="space-y-4">
              <h3 className="font-medium">Layanan Darurat/Tambahan</h3>
              <div className="grid grid-cols-1 gap-2">
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

            <div className="space-y-3">
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

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pajak (11%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Button className="w-full" size="lg" onClick={onCheckout}>
              Lanjutkan ke Pembayaran
            </Button>

            <p className="text-xs text-center text-gray-500 mt-4">
              Dengan melanjutkan, Anda menyetujui syarat dan ketentuan kami
              termasuk kebijakan pembatalan.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
