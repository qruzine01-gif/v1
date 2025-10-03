"use client";
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  ChefHat, 
  QrCode, 
  Bell,
  Menu as MenuIcon,
  X as CloseIcon,
  Home,
  LogOut
} from 'lucide-react';
import { useMediaQuery } from 'react-responsive';
import OverviewComponent from '../../../../components/dashboard/OverviewComponent';
import OrdersComponent from '../../../../components/dashboard/OrdersComponent';
import MenuComponent from '../../../../components/dashboard/MenuComponent';
import QRCodesComponent from '../../../../components/dashboard/QRCodesComponent';
import apiService from '../../../../lib/api';

const RestaurantDashboard = ({ params }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [resID, setResID] = useState(null);
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const isMobile = useMediaQuery({ maxWidth: 768 });
  
  // Close mobile menu when resizing to desktop
  useEffect(() => {
    if (!isMobile) {
      setMobileMenuOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    // Extract resID from URL params
    if (params?.id) {
      setResID(params.id);
    }
  }, [params]);

  useEffect(() => {
    if (resID) {
      // Set up authentication token from localStorage
      const token = localStorage.getItem('authToken');
      if (token) {
        apiService.setToken(token);
      } else {
        // Redirect to login if no token found
        window.location.href = '/login';
        return;
      }

      fetchRestaurantInfo();
      fetchPendingOrders();
    }
  }, [resID]);

  const fetchRestaurantInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch actual restaurant info from backend
      const response = await apiService.getDashboardStats(resID);
      setRestaurantInfo({
        name: response.data.restaurant?.name || `Restaurant ${resID}`,
        resID: resID
      });
    } catch (err) {
      console.error('Error fetching restaurant info:', err);
      if (err.message === 'Authentication required') {
        // Already handled by API service - user will be redirected
        return;
      }
      setError('Failed to load restaurant information');
      // Fallback for demo
      setRestaurantInfo({
        name: `Restaurant ${resID}`,
        resID: resID
      });
    } finally {
      setLoading(false);
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
    if (!resID) return <div>Loading...</div>;
    
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading restaurant dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Navigation tabs data
  const navigationTabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'menu', label: 'Menu', icon: ChefHat },
    { id: 'qr', label: 'QR Codes', icon: QrCode }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <CloseIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
            <h1 className="ml-2 text-lg font-semibold text-gray-900">Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-600 hover:text-gray-900 relative"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {pendingOrdersCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center">
                    {pendingOrdersCount}
                  </span>
                )}
              </button>
              
              {/* Mobile Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                  <div className="p-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-700">Notifications</p>
                    </div>
                    {pendingOrdersCount > 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-700">
                        You have {pendingOrdersCount} pending {pendingOrdersCount === 1 ? 'order' : 'orders'}
                      </div>
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500">No new notifications</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
              {restaurantInfo?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Restaurant Dashboard</h1>
              <p className="text-sm text-gray-600">ID: {resID}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-600 hover:text-gray-900 relative"
                >
                  <Bell className="h-6 w-6" />
                  {pendingOrdersCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                      {pendingOrdersCount}
                    </span>
                  )}
                </button>
                
                {/* Desktop Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                    <div className="p-2">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-700">Notifications</p>
                      </div>
                      {pendingOrdersCount > 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-700">
                          You have {pendingOrdersCount} pending {pendingOrdersCount === 1 ? 'order' : 'orders'} that require your attention.
                        </div>
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500">No new notifications</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-lg">
                  {restaurantInfo?.name?.charAt(0) || 'A'}
                </div>
                <div className="text-sm text-gray-700">
                  <p className="font-medium">{restaurantInfo?.name || 'Restaurant Admin'}</p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  // Handle logout
                  localStorage.removeItem('authToken');
                  window.location.href = '/login';
                }}
                className="p-2 text-gray-600 hover:text-red-600"
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar */}
        <div 
          className={`fixed inset-y-0 left-0 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden z-30 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out`}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
              {navigationTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-3" />
                  {tab.label}
                </button>
              ))}
              
              <div className="border-t border-gray-200 mt-4 pt-4">
                <button
                  onClick={() => {
                    localStorage.removeItem('authToken');
                    window.location.href = '/';
                  }}
                  className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign out
                </button>
              </div>
            </nav>
            
            <div className="p-4 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                <p>Restaurant ID: {resID}</p>
                <p className="mt-1">v1.0.0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
            <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="flex-1 px-2 space-y-1">
                {navigationTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="h-5 w-5 mr-3" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                <p>Restaurant ID: {resID}</p>
                <p className="mt-1">v1.0.0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto focus:outline-none">
          {/* Mobile tab indicator */}
          <div className="md:hidden bg-white border-b sticky top-14 z-10">
            <div className="px-4 py-2 flex items-center overflow-x-auto scrollbar-hide">
              <button
                onClick={() => {
                  const currentIndex = navigationTabs.findIndex(tab => tab.id === activeTab);
                  const prevTab = navigationTabs[currentIndex - 1] || navigationTabs[navigationTabs.length - 1];
                  setActiveTab(prevTab.id);
                }}
                className="p-1 text-gray-500 hover:text-gray-700"
                aria-label="Previous tab"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              <div className="flex-1 px-2 flex justify-center">
                <span className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                  {navigationTabs.find(tab => tab.id === activeTab)?.label}
                </span>
              </div>
              
              <button
                onClick={() => {
                  const currentIndex = navigationTabs.findIndex(tab => tab.id === activeTab);
                  const nextTab = navigationTabs[currentIndex + 1] || navigationTabs[0];
                  setActiveTab(nextTab.id);
                }}
                className="p-1 text-gray-500 hover:text-gray-700"
                aria-label="Next tab"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
            {renderTabContent()}
          </div>
        </div>
      </div>
      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Click outside to close notifications */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-10"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
};

export default RestaurantDashboard;
