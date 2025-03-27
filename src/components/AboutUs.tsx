import React from "react";
import { motion, useInView } from "framer-motion";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight, Award, Clock, Shield, Wrench } from "lucide-react";
import { Link } from "react-router-dom";

interface AboutUsProps {
  title?: string;
  description?: string;
  features?: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }[];
  ctaText?: string;
  ctaLink?: string;
}

const AboutUs = ({
  title = "Tentang AC Home Jaya Teknik",
  description = "AC Home Jaya Teknik adalah penyedia layanan servis AC terpercaya dengan pengalaman lebih dari 10 tahun. Kami menawarkan berbagai layanan perawatan dan perbaikan AC untuk rumah dan bisnis Anda dengan teknisi berpengalaman dan berlisensi.",
  features = [
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Teknisi Berpengalaman",
      description:
        "Tim teknisi kami telah bersertifikasi dan memiliki pengalaman bertahun-tahun dalam industri ini.",
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Layanan Tepat Waktu",
      description:
        "Kami menghargai waktu Anda dan selalu berusaha memberikan layanan tepat waktu sesuai jadwal.",
    },
    {
      icon: <Wrench className="h-8 w-8 text-primary" />,
      title: "Peralatan Modern",
      description:
        "Menggunakan peralatan dan teknologi terbaru untuk memastikan kualitas servis terbaik.",
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Garansi Layanan",
      description:
        "Semua layanan kami dilengkapi dengan garansi untuk memberikan ketenangan pikiran kepada pelanggan.",
    },
  ],
  ctaText = "Pelajari Lebih Lanjut",
  ctaLink = "/services",
}: AboutUsProps) => {
  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
              {title}
            </h2>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button asChild>
                <Link to={ctaLink} className="inline-flex items-center gap-2">
                  {ctaText} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full bg-white shadow-md hover:shadow-lg transition-shadow">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
