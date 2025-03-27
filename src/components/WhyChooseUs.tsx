import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  Award,
  Shield,
  ThumbsUp,
  Wrench,
} from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature = ({ icon, title, description = "" }: FeatureProps) => {
  return (
    <motion.div
      className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-3 mb-4 bg-blue-100 text-blue-600 rounded-full">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </motion.div>
  );
};

const WhyChooseUs = () => {
  const features = [
    {
      icon: <CheckCircle size={24} />,
      title: "Kualitas Terjamin",
      description:
        "Kami hanya menggunakan suku cadang berkualitas tinggi dan menjamin hasil kerja kami.",
    },
    {
      icon: <Clock size={24} />,
      title: "Layanan Tepat Waktu",
      description:
        "Teknisi kami selalu datang tepat waktu dan menyelesaikan pekerjaan dengan cepat.",
    },
    {
      icon: <Award size={24} />,
      title: "Teknisi Berpengalaman",
      description:
        "Tim teknisi kami telah berpengalaman dan tersertifikasi dalam perbaikan berbagai jenis AC.",
    },
    {
      icon: <Shield size={24} />,
      title: "Garansi Layanan",
      description:
        "Semua layanan kami dilengkapi dengan garansi untuk ketenangan pikiran Anda.",
    },
    {
      icon: <ThumbsUp size={24} />,
      title: "Harga Transparan",
      description:
        "Tidak ada biaya tersembunyi. Kami memberikan estimasi biaya sebelum memulai pekerjaan.",
    },
    {
      icon: <Wrench size={24} />,
      title: "Solusi Lengkap",
      description:
        "Dari pemasangan hingga perbaikan, kami menyediakan solusi lengkap untuk semua kebutuhan AC Anda.",
    },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Mengapa Memilih Kami
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            AC Home Jaya Teknik menawarkan layanan terbaik dengan teknisi
            berpengalaman dan harga yang kompetitif.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
