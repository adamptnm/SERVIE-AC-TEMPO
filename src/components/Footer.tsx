import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";

interface FooterProps {
  companyName?: string;
  address?: string;
  phone?: string;
  email?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  id?: string;
}

const Footer = ({
  companyName = "AC Home Jaya Teknik",
  address = "Jl. Raya Utama No. 123, Jakarta Selatan",
  phone = "+62 812 3456 7890",
  email = "info@achomejayateknik.com",
  socialLinks = {
    facebook: "https://facebook.com/achomejayateknik",
    instagram: "https://instagram.com/achomejayateknik",
    twitter: "https://twitter.com/achomejayateknik",
  },
  id,
}: FooterProps) => {
  const footerLinks = [
    {
      title: "Layanan",
      links: [
        { name: "Cuci AC", href: "/services" },
        { name: "Isi Freon", href: "/services" },
        { name: "Bongkar Pasang", href: "/services" },
        { name: "Perbaikan AC", href: "/services" },
      ],
    },
    {
      title: "Perusahaan",
      links: [
        { name: "Tentang Kami", href: "/about" },
        { name: "Testimoni", href: "/#testimonials" },
        { name: "FAQ", href: "/#faq" },
        { name: "Kontak", href: "/contact" },
      ],
    },
    {
      title: "Informasi",
      links: [
        { name: "Syarat & Ketentuan", href: "/terms" },
        { name: "Kebijakan Privasi", href: "/privacy" },
        { name: "Cara Pemesanan", href: "/how-to-order" },
        { name: "Area Layanan", href: "/service-areas" },
      ],
    },
  ];

  return (
    <footer
      id={id}
      className="bg-slate-900 text-white pt-12 pb-6 px-4 md:px-8 lg:px-12 w-full"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold">{companyName}</h3>
            <p className="text-slate-300 max-w-xs">
              Layanan AC terpercaya dengan teknisi berpengalaman untuk kebutuhan
              AC rumah dan kantor Anda.
            </p>
            <div className="flex space-x-4">
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-400 transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-pink-400 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-400 transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerLinks.map((column, idx) => (
            <motion.div
              key={column.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
              className="space-y-4"
            >
              <h4 className="text-lg font-semibold">{column.title}</h4>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-slate-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-slate-700 pt-6 mt-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-slate-400" />
                <span className="text-slate-300 text-sm">{address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-slate-400" />
                <span className="text-slate-300 text-sm">{phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-slate-400" />
                <span className="text-slate-300 text-sm">{email}</span>
              </div>
            </div>
            <div className="text-slate-400 text-sm">
              © {new Date().getFullYear()} {companyName}. Hak Cipta Dilindungi.
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
