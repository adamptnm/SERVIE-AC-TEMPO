import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Phone, ShoppingCart } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

interface NavbarProps {
  onCartOpen?: () => void;
}

const Navbar = ({ onCartOpen = () => {} }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Admin", path: "/admin/login" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold text-blue-600">AC Home</span>
          <span className="text-lg font-medium ml-1">Jaya Teknik</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Contact and Cart Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={() => window.open("tel:+6281234567890")}
          >
            <Phone className="h-4 w-4 mr-2" />
            <span>Call Us</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onCartOpen}
            className="relative"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              0
            </span>
          </Button>

          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate("/booking")}
          >
            Order Now
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCartOpen}
            className="relative"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              0
            </span>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="text-gray-700 hover:text-blue-600 transition-colors py-2 border-b border-gray-100"
                  >
                    {item.name}
                  </Link>
                ))}
                <Button
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate("/booking")}
                >
                  Order Now
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center"
                  onClick={() => window.open("tel:+6281234567890")}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  <span>Call Us</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
