"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  TrendingUp, 
  ShoppingBag, 
  ChefHat, 
  QrCode, 
  Bell,
  Settings,
  Menu,
  X
} from 'lucide-react';
import OverviewComponent from '../../../components/dashboard/OverviewComponent';
import OrdersComponent from '../../../components/dashboard/OrdersComponent';
import MenuComponent from '../../../components/dashboard/MenuComponent';
import QRCodesComponent from '../../../components/dashboard/QRCodesComponent';
import apiService from '../../../lib/api';

const RestaurantDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [resID, setResID] = useState('RES001'); // This should come from auth/session
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Set up authentication token if available
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   apiService.setToken(token);
    // }

    // For demo purposes, we'll use a hardcoded resID
    // In production, this should come from authentication context
    fetchRestaurantInfo();
    fetchPendingOrders();
  }, []);

  const fetchRestaurantInfo = async () => {
    try {
      // This would typically come from auth context
      setRestaurantInfo({
        name: 'Demo Restaurant',
        resID: resID
      });
    } catch (err) {
      console.error('Error fetching restaurant info:', err);
    }
  };

  const fetchPendingOrders = async () => {
    try {
      const response = await apiService.getDashboardStats(resID);
      setPendingOrdersCount(response.data.orders.active || 0);
    } catch (err) {
      console.error('Error fetching pending orders:', err);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewComponent resID={resID} />;
      case 'orders':
        return <OrdersComponent resID={resID} />;
      case 'menu':
        return <MenuComponent resID={resID} />;
      case 'qr':
        return <QRCodesComponent resID={resID} />;
      default:
        return <OverviewComponent resID={resID} />;
    }
  };

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'menu', label: 'Menu', icon: ChefHat },
    { id: 'qr', label: 'QR Codes', icon: QrCode }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false); // Close mobile menu when tab is selected
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Logo in top-left corner - responsive positioning */}
      <div className="fixed top-4 left-4 md:top-6 md:left-6 z-50">
        <div className="w-10 h-10 md:w-14 md:h-14 relative">
          <Image
            src="/images/logo.png"
            alt="Logo"
            fill
            className="object-contain filter drop-shadow-lg"
            priority
          />
        </div>
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Mobile: Show hamburger menu, Desktop: Show title */}
            <div className="flex items-center">
              <div className="md:hidden mr-4">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
              <h1 className="text-lg md:text-2xl font-bold text-gray-900">
                <span className="hidden sm:inline">Restaurant Dashboard</span>
                <span className="sm:hidden">Dashboard</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
              <div className="relative">
                <Bell className="h-5 w-5 md:h-6 md:w-6 text-gray-600" />
                {pendingOrdersCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
                    {pendingOrdersCount}
                  </span>
                )}
              </div>
              <div className="text-xs md:text-sm text-gray-600 hidden sm:block">
                Welcome, {restaurantInfo?.name || 'Restaurant Admin'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-xl z-50">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
            </div>
            <nav className="p-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg mb-1 ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Navigation Tabs */}
      <div className="bg-white border-b hidden md:block">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {navigationItems.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Tab Indicator */}
      <div className="bg-white border-b md:hidden">
        <div className="px-4 py-2">
          <div className="flex items-center gap-2">
            {navigationItems.find(item => item.id === activeTab) && (
              <>
                {React.createElement(navigationItems.find(item => item.id === activeTab).icon, { 
                  className: "h-4 w-4 text-blue-600" 
                })}
                <span className="text-sm font-medium text-blue-600">
                  {navigationItems.find(item => item.id === activeTab).label}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default RestaurantDashboard;