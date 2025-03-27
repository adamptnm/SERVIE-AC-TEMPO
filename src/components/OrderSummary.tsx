import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";

interface ServiceItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderSummaryProps {
  services?: ServiceItem[];
  subtotal?: number;
  tax?: number;
  total?: number;
  onCheckout?: () => void;
}

const OrderSummary = ({
  services = [
    {
      id: "1",
      name: "Cuci AC 0.5 - 2 PK",
      price: 70000,
      quantity: 1,
    },
    {
      id: "2",
      name: "Tambah Freon R22 0,5 - 1 PK",
      price: 175000,
      quantity: 1,
    },
  ],
  subtotal = 245000,
  tax = 24500,
  total = 269500,
  onCheckout = () => console.log("Checkout clicked"),
}: OrderSummaryProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md bg-white rounded-lg shadow-md"
    >
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold text-center text-primary">
            Ringkasan Pesanan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex justify-between items-start"
                >
                  <div className="flex-1">
                    <p className="font-medium">
                      {service.name}
                      {service.quantity > 1 && (
                        <span className="text-sm text-gray-500">
                          x{service.quantity}
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="font-medium text-right">
                    Rp{" "}
                    {(service.price * service.quantity).toLocaleString("id-ID")}
                  </p>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-gray-600">Subtotal</p>
                <p className="font-medium">
                  Rp {subtotal.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Pajak (10%)</p>
                <p className="font-medium">Rp {tax.toLocaleString("id-ID")}</p>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between">
              <p className="font-bold text-lg">Total</p>
              <p className="font-bold text-lg text-primary">
                Rp {total.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="pt-4">
              <Button
                onClick={onCheckout}
                className="w-full py-6 text-base font-semibold group"
              >
                Lanjutkan ke Pembayaran
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="mt-4 bg-green-50 p-3 rounded-md">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-green-700">
                  Teknisi kami akan menghubungi Anda untuk konfirmasi setelah
                  pesanan diterima.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OrderSummary;
