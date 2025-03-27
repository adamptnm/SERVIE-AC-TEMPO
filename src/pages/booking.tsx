import React, { useState } from "react";
import { motion } from "framer-motion";
import BookingForm from "@/components/BookingForm";
import OrderSummary from "@/components/OrderSummary";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingPageProps {
  // Props can be added here if needed
}

const BookingPage = ({}: BookingPageProps) => {
  const [formData, setFormData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sample services data - in a real app this would come from cart/context
  const services = [
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
  ];

  const subtotal = services.reduce(
    (total, service) => total + service.price * service.quantity,
    0,
  );
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleFormSubmit = (data: any) => {
    setIsSubmitting(true);
    setFormData(data);

    // The actual API call is now handled in the BookingForm component
    // Here we just update the UI state
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleCheckout = () => {
    if (!formData) {
      console.error("No form data available");
      return;
    }
    // In a real app, this would handle payment processing
    console.log("Processing payment with form data:", formData);
    // Redirect to confirmation page or show confirmation modal
  };

  const handleBackToHome = () => {
    // In a real app, this would navigate back to home page
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="flex items-center text-gray-600 hover:text-gray-900"
            onClick={handleBackToHome}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>

        {/* Page title */}
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-extrabold text-gray-900 sm:text-4xl"
          >
            Book Your AC Service
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Complete the form below to schedule your AC service appointment with
            our professional technicians.
          </motion.p>
        </div>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-lg max-w-3xl mx-auto"
          >
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100">
              <svg
                className="h-16 w-16 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Booking Submitted!
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Your booking request has been submitted successfully. Our team
              will review your request and contact you shortly for confirmation.
            </p>
            <div className="mt-8">
              <Button
                onClick={handleBackToHome}
                className="px-6 py-3 text-base font-medium"
              >
                Return to Home
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <BookingForm onSubmit={handleFormSubmit} />
            </div>
            <div className="lg:col-span-1">
              <OrderSummary
                services={services}
                subtotal={subtotal}
                tax={tax}
                total={total}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
