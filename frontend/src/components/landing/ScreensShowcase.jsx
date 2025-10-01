"use client";
import React, { useState } from "react";
import Image from "next/image";
import { LayoutDashboard, ShoppingCart, QrCode, Utensils, CheckCircle, ListChecks, List } from "lucide-react";

export default function ScreensShowcase() {
  const [activeTab, setActiveTab] = useState('overview');

  const screens = {
    restaurantMenu: {
      title: "Restaurant Menu",
      description: "Beautiful digital menu for your customers to browse and order from their devices.",
      image: "/images/menu.jpg",
      type: 'mobile',
      features: [
        "Category-based menu organization",
        "High-quality food images",
        "Item details and customization",
        "Add to cart with one tap"
      ]
    },
    checkout: {
      title: "Checkout Process",
      description: "Streamlined checkout experience for your customers with multiple payment options.",
      image: "/images/checkout.jpg",
      type: 'mobile',
      features: [
        "Secure payment processing",
        "Split bills functionality",
        "Order summary and modifications",
        "Multiple payment methods"
      ]
    },
    orderComplete: {
      title: "Order Confirmation",
      description: "Clear and informative order confirmation with next steps for your customers.",
      image: "/images/Completion.jpg",
      type: 'mobile',
      features: [
        "Order confirmation details",
        "Estimated preparation time",
        "Order tracking information",
        "Customer feedback options"
      ]
    },
    overview: {
      title: "Dashboard Overview",
      description: "Get a comprehensive view of your restaurant's performance at a glance with real-time metrics and key insights.",
      image: "/images/overview2.png",
      type: 'mobile',
      features: [
        "Real-time sales and revenue tracking",
        "Popular items and categories",
        "Daily, weekly, and monthly performance metrics",
        "Quick access to important functions"
      ]
    },
    orders: {
      title: "Orders Management",
      description: "Efficiently manage all your restaurant orders in one place with our intuitive order management system.",
      image: "/images/order2.png",
      type: 'mobile',
      features: [
        "Real-time order tracking",
        "Table status and management",
        "Order history and receipts",
        "Kitchen display system (KOT) integration"
      ]
    },
    qr: {
      title: "QR Management",
      description: "Create and manage QR codes for your tables and digital menu access with our powerful QR management system.",
      image: "/images/qr2.png",
      type: 'mobile',
      features: [
        "Generate unlimited QR codes",
        "Table-specific QR codes",
        "Track QR code scans",
        "Dynamic menu linking"
      ]
    },
    menu: {
      title: "Menu Management",
      description: "Easily manage your restaurant's menu with our comprehensive menu management system.",
      image: "/images/menu 2.png",
      type: 'mobile',
      features: [
        "Create and organize menu categories",
        "Add/Edit/Remove items with images",
        "Set availability and timings",
        "Manage pricing and variations"
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
  ];

  const currentScreen = screens[activeTab];

  return (
    <section id="showcase" className="py-16 md:py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
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
          <div className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">{currentScreen.title}</h3>
                <p className="text-gray-600">{currentScreen.description}</p>
                
                <ul className="space-y-3">
                  {currentScreen.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-bronze-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className={`relative ${currentScreen.type === 'mobile' ? 'max-w-xs mx-auto' : 'w-full'}`}>
                {currentScreen.type === 'mobile' ? (
                  <div className="relative mx-auto">
                    {/* Phone frame */}
                    <div className="relative mx-auto border-8 border-gray-800 rounded-[2.5rem] h-[600px] w-[300px] bg-gray-800 shadow-xl overflow-hidden">
                      {/* Phone notch */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/5 h-6 bg-gray-800 rounded-b-2xl z-10"></div>
                      {/* Screen content */}
                      <div className="relative h-full w-full overflow-hidden">
                        <Image
                          src={currentScreen.image}
                          alt={currentScreen.title}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder-screen.png";
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                          <div className="font-medium text-sm">{currentScreen.title}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
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
                    <div className="relative aspect-video bg-gray-50">
                      <Image
                        src={currentScreen.image}
                        alt={currentScreen.title}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder-screen.png";
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
