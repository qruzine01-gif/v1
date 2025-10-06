"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, ShoppingCart, QrCode, Utensils, CheckCircle, ListChecks, List } from "lucide-react";

export default function ScreensShowcase() {
  const [activeTab, setActiveTab] = useState('restaurantMenu');

  const screens = {
    restaurantMenu: {
      title: "Restaurant Menu",
      description: "Beautiful digital menu for your customers to browse and order from their devices.",
      image: "/images/landing/menuu.jpeg",
      type: 'mobile',
      features: [
        "Category-based menu organization",
        "High-quality food images",
        "Item details and customization",
        "Add to cart with one tap",
        "Search and dietary filters",
        "Recommended and combo deals",
        "Allergen and nutrition labels",
        "Multi-language support"
      ]
    },
    checkout: {
      title: "Checkout Process",
      description: "Streamlined checkout experience for your customers with multiple payment options.",
      image: "/images/landing/checkout.jpeg",
      type: 'mobile',
      features: [
        "Secure payment processing",
        "Split bills functionality",
        "Order summary and modifications",
        "Multiple payment methods",
        "Tip suggestions and receipt email",
        "Saved cards and popular wallets",
        "Promo codes and discounts",
        "GST/Tax calculation and invoice generation"
      ]
    },
    orderComplete: {
      title: "Order Confirmation",
      description: "Clear and informative order confirmation with next steps for your customers.",
      image: "/images/landing/confirmation.jpg",
      type: 'mobile',
      features: [
        "Order confirmation details",
        "Estimated preparation time",
        "Order tracking information",
        "Customer feedback options",
        "Live status notifications",
        "Download/print receipt",
        "Reorder in one tap",
        "Support chat or contact options"
      ]
    },
    overview: {
      title: "Dashboard Overview",
      description: "Get a comprehensive view of your restaurant's performance at a glance with real-time metrics and key insights.",
      image: "/images/landing/overview.jpg",
      type: 'mobile',
      features: [
        "Real-time sales and revenue tracking",
        "Popular items and categories",
        "Daily, weekly, and monthly performance metrics",
        "Quick access to important functions",
        "Low-stock and wastage alerts",
        "Peak hour heatmaps",
        "Staff performance insights",
        "Exportable reports (CSV/PDF)"
      ]
    },
    orders: {
      title: "Orders Management",
      description: "Efficiently manage all your restaurant orders in one place with our intuitive order management system.",
      image: "/images/landing/order.jpg",
      type: 'mobile',
      features: [
        "Real-time order tracking",
        "Table status and management",
        "Order history and receipts",
        "Kitchen display system (KOT) integration",
        "Notify kitchen with priorities",
        "Merge/split orders",
        "Hold and resume tickets",
        "Auto-assign orders to staff"
      ]
    },
    qr: {
      title: "QR Management",
      description: "Create and manage QR codes for your tables and digital menu access with our powerful QR management system.",
      image: "/images/landing/qr.jpg",
      type: 'mobile',
      features: [
        "Generate unlimited QR codes",
        "Table-specific QR codes",
        "Track QR code scans",
        "Dynamic menu linking",
        "Branded QR designs",
        "Batch print/export options",
        "Expire or disable codes",
        "Short links and deep-linking"
      ]
    },
    menu: {
      title: "Menu Management",
      description: "Easily manage your restaurant's menu with our comprehensive menu management system.",
      image: "/images/landing/menu2.jpg",
      type: 'mobile',
      features: [
        "Create and organize menu categories",
        "Add/Edit/Remove items with images",
        "Set availability and timings",
        "Manage pricing and variations",
        "Bulk import via CSV",
        "Drag-and-drop item sorting",
        "Modifiers and add-ons",
        "Nutrition and allergen tags"
      ]
    },
    qrPreview: {
      title: "QR Code",
      description: "See how your QR code will look to customers when they scan it to access your digital menu.",
      image: "/images/landing/qrcode.png",
      type: 'mobile',
      features: [
        "Professional QR code design",
        "Customizable with your logo",
        "Preview before printing",
        "Multiple size options",
        "High-resolution download",
        "Table number integration",
        "Scan test functionality",
        "Print-ready templates"
      ]
    }
  };

  const tabs = [
    { id: 'restaurantMenu', label: 'Restaurant Menu', icon: <List className="w-5 h-5" /> },
    { id: 'checkout', label: 'Checkout', icon: <ListChecks className="w-5 h-5" /> },
    { id: 'orderComplete', label: 'Order Complete', icon: <CheckCircle className="w-5 h-5" /> },
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart className="w-5 h-5" /> },
    { id: 'qr', label: 'QR Management', icon: <QrCode className="w-5 h-5" /> },
    { id: 'menu', label: 'Menu Management', icon: <Utensils className="w-5 h-5" /> },
    { id: 'qrPreview', label: 'QR Preview', icon: <QrCode className="w-5 h-5" /> },
  ];

  // Auto-slide functionality
  const intervalRef = useRef();

  useEffect(() => {
    const goToNext = () => {
      const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
      const nextIndex = (currentIndex + 1) % tabs.length;
      setActiveTab(tabs[nextIndex].id);
    };

    intervalRef.current = setInterval(goToNext, 7000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeTab, tabs]);

  // Animation variants
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    })
  };

  // Track animation direction
  const [[page, direction], setPage] = useState([0, 0]);
  const currentIndex = tabs.findIndex(tab => tab.id === activeTab);

  const currentScreen = screens[activeTab];

  // Update direction when active tab changes
  useEffect(() => {
    const newIndex = tabs.findIndex(tab => tab.id === activeTab);
    setPage([newIndex, newIndex > currentIndex ? 1 : -1]);
    // eslint-disable-next-line
  }, [activeTab]);

  return (
    <section id="showcase" className="py-8 md:py-14 bg-gray-50 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold py-2 restaurant-gradient-text-strong sm:text-4xl">
            Restaurant Management Platform
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Discover how our platform transforms your restaurant operations with powerful features
            designed for modern dining experiences.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto hide-scrollbar" aria-label="Tabs">
              <div className="flex space-x-1 px-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-bronze-100 text-bronze-700 border-b-2 border-bronze-500'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {tab.icon}
                    <span className="ml-2">{tab.label}</span>
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4 md:p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                  key={activeTab}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-6"
                >
                  <motion.h3 
                    className="text-2xl font-bold restaurant-gradient-text-strong"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {currentScreen.title}
                  </motion.h3>
                  <motion.p 
                    className="text-gray-600"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {currentScreen.description}
                  </motion.p>
                  
                  <motion.ul className="space-y-3">
                    {currentScreen.features.map((feature, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-start"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + (index * 0.05) }}
                      >
                        <svg className="h-5 w-5 text-bronze-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              </AnimatePresence>

              <div className="w-full">
                <AnimatePresence mode="wait" custom={direction}>
                  {currentScreen.type === 'mobile' ? (
                    <motion.div 
                      key={`mobile-${activeTab}`}
                      custom={direction}
                      initial={{ opacity: 0, scale: 0.9, x: direction > 0 ? 100 : -100 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9, x: direction < 0 ? 100 : -100 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="relative mx-auto max-w-xs"
                    >
                      {/* Phone frame */}
                      <div className="relative mx-auto border-8 border-gray-800 rounded-[2.5rem] h-[600px] w-[300px] bg-gray-800 shadow-xl overflow-hidden">
                        {/* Phone notch */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/5 h-6 bg-gray-800 rounded-b-2xl z-10"></div>
                        {/* Screen content */}
                        <div className="relative h-full w-full overflow-hidden bg-white">
                          <Image
                            src={currentScreen.image}
                            alt={currentScreen.title}
                            width={300}
                            height={600}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/placeholder-screen.png";
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key={`desktop-${activeTab}`}
                      custom={direction}
                      initial={{ opacity: 0, scale: 0.9, x: direction > 0 ? 100 : -100 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9, x: direction < 0 ? 100 : -100 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="w-full"
                    >
                      <div className="relative rounded-lg overflow-hidden shadow-xl border-8 border-white bg-white">
                        {/* Browser frame */}
                        <div className="bg-gray-100 p-2 flex items-center">
                          <div className="flex space-x-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-6 mx-4 text-xs flex items-center px-3 text-gray-500 truncate">
                            {currentScreen.title.toLowerCase().replace(/\s+/g, '-')}.qruzine.com
                          </div>
                        </div>
                        {/* Screen content */}
                        <div className="relative h-[500px] w-full bg-gray-50">
                          <Image
                            src={currentScreen.image}
                            alt={currentScreen.title}
                            fill
                            className="object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/placeholder-screen.png";
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {currentScreen.type !== 'mobile' && (
                <div className="w-full">
                  <motion.div
                    className="relative rounded-lg overflow-hidden shadow-xl border-8 border-white bg-white"
                    initial={{ opacity: 0, scale: 0.9, x: direction > 0 ? 100 : -100 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: direction < 0 ? 100 : -100 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    {/* Browser frame */}
                    <div className="bg-gray-100 p-2 flex items-center">
                      <div className="flex space-x-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-6 mx-4 text-xs flex items-center px-3 text-gray-500 truncate">
                        {currentScreen.title.toLowerCase().replace(/\s+/g, '-')}.qruzine.com
                      </div>
                    </div>
                    {/* Screen content */}
                    <div className={`relative ${currentScreen.type === 'mobile' ? 'h-[600px]' : 'h-[500px]'} w-full bg-gray-50`}>
                      <Image
                        src={currentScreen.image}
                        alt={currentScreen.title}
                        fill
                        className="object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder-screen.png";
                        }}
                      />
                      {currentScreen.type === 'desktop' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center p-4 bg-white bg-opacity-80 rounded-lg">
                            <div className="text-lg font-medium">{currentScreen.title}</div>
                            <div className="text-sm text-gray-600">Desktop View</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}