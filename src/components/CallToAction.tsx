import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface CallToActionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: string;
}

const CallToAction = ({
  title = "Ready for your AC service?",
  description = "Book your AC service today and experience professional maintenance from our expert technicians.",
  buttonText = "Order Now",
  buttonLink = "/booking",
  backgroundColor = "bg-blue-600",
}: CallToActionProps) => {
  const navigate = useNavigate();

  return (
    <section
      className={`${backgroundColor} w-full py-16 px-4 md:px-8 lg:px-16 text-white`}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="text-center md:text-left max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            <p className="text-lg text-white/90 mb-6 md:mb-0">{description}</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className="text-base font-semibold px-8 py-6 h-auto bg-white text-blue-600 hover:bg-white/90 hover:text-blue-700 shadow-lg"
              onClick={() => navigate(buttonLink)}
            >
              {buttonText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
