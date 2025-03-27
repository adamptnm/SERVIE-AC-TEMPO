import React from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  title?: string;
  subtitle?: string;
  faqItems?: FAQItem[];
  className?: string;
}

const FAQ = ({
  title = "Pertanyaan Umum",
  subtitle = "Jawaban untuk pertanyaan yang sering ditanyakan tentang layanan kami",
  faqItems = [
    {
      question: "Berapa lama waktu yang dibutuhkan untuk service AC?",
      answer:
        "Waktu yang dibutuhkan untuk service AC standar biasanya sekitar 1-2 jam tergantung pada kondisi AC dan jenis layanan yang dipilih. Untuk perbaikan yang lebih kompleks mungkin membutuhkan waktu lebih lama.",
    },
    {
      question: "Apakah saya perlu menyediakan peralatan tambahan?",
      answer:
        "Tidak, teknisi kami akan membawa semua peralatan yang diperlukan untuk melakukan service AC. Anda hanya perlu memastikan akses ke unit AC Anda.",
    },
    {
      question: "Bagaimana jika ada kerusakan tambahan yang ditemukan?",
      answer:
        "Jika teknisi kami menemukan masalah tambahan, mereka akan menginformasikan Anda terlebih dahulu dan memberikan estimasi biaya sebelum melakukan perbaikan tambahan. Anda memiliki hak untuk menyetujui atau menolak layanan tambahan tersebut.",
    },
    {
      question: "Apakah layanan Anda mencakup garansi?",
      answer:
        "Ya, semua layanan kami dilengkapi dengan garansi selama 30 hari untuk pekerjaan yang dilakukan. Jika terjadi masalah dalam periode tersebut, kami akan memperbaikinya tanpa biaya tambahan.",
    },
    {
      question:
        "Bagaimana cara membatalkan atau menjadwal ulang janji service?",
      answer:
        "Anda dapat membatalkan atau menjadwal ulang janji service dengan menghubungi kami minimal 2 jam sebelum waktu yang dijadwalkan. Pembatalan kurang dari 2 jam sebelumnya atau di lokasi akan dikenakan biaya kunjungan sebesar Rp 75.000.",
    },
  ],
  className = "",
}: FAQProps) => {
  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="px-6 text-left font-medium text-gray-900 hover:text-blue-600">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 text-gray-600">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <p className="text-gray-600">
            Masih punya pertanyaan?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                const footerSection = document.querySelector("footer");
                if (footerSection)
                  footerSection.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-blue-600 font-medium hover:underline"
            >
              Hubungi kami
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
