"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Eye, EyeOff, Shield, Store, AlertCircle, CheckCircle } from "lucide-react";

const Login = () => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    adminId: "",
    password: "",
  });
  
  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  // Theme colors based on admin type
  const theme = isAdmin ? {
    // Super Admin - Professional Purple/Violet (enterprise-grade)
    gradient: "from-slate-900 via-violet-950 to-slate-950",
    bgGlow1: "from-violet-500 to-purple-600",
    bgGlow2: "from-purple-600 to-violet-700",
    bgGlow3: "from-violet-500 to-purple-500",
    cardGradient: "from-slate-900/95 to-violet-950/95",
    cardGlow: "from-violet-500/5 via-purple-500/5 to-violet-600/5",
    titleGradient: "from-violet-400 to-purple-500",
    iconBg: "from-violet-600 to-purple-700",
    accentColor: "violet-400",
    accentHover: "violet-300",
    inputBorder: "violet-800",
    inputFocus: "violet-500",
    buttonGradient: "from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500",
    buttonShadow: "violet-500/25",
    particles: "violet-400",
    decorLine: "violet-500",
    switchButton: "violet-400",
    switchButtonBorder: "violet-400/30",
    switchButtonBg: "violet-400/10",
  } : {
    // Restaurant Admin - Blue (original)
    gradient: "from-slate-900 via-gray-900 to-black",
    bgGlow1: "from-blue-400 to-indigo-600",
    bgGlow2: "from-purple-500 to-blue-600",
    bgGlow3: "from-indigo-400 to-purple-500",
    cardGradient: "from-gray-900/95 to-black/95",
    cardGlow: "from-blue-400/5 via-indigo-500/5 to-purple-600/5",
    titleGradient: "from-blue-400 to-indigo-500",
    iconBg: "from-blue-500 to-indigo-600",
    accentColor: "blue-400",
    accentHover: "blue-300",
    inputBorder: "gray-700",
    inputFocus: "blue-400",
    buttonGradient: "from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500",
    buttonShadow: "blue-400/25",
    particles: "blue-400",
    decorLine: "blue-500",
    switchButton: "blue-400",
    switchButtonBorder: "blue-400/30",
    switchButtonBg: "blue-400/10",
  };
  
  const setAuthCookies = (token, userType, resId = '') => {
    const cookieOptions = {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
    };
    
    document.cookie = `token=${token}; ${Object.entries(cookieOptions).map(([key, value]) => 
      `${key}=${value}`
    ).join('; ')}`;
    
    document.cookie = `userType=${userType}; ${Object.entries(cookieOptions).map(([key, value]) => 
      `${key}=${value}`
    ).join('; ')}`;
    
    if (resId) {
      document.cookie = `resId=${resId}; ${Object.entries(cookieOptions).map(([key, value]) => 
        `${key}=${value}`
      ).join('; ')}`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    
    if (!formData.adminId.trim()) {
      setError("Admin ID is required");
      setIsLoading(false);
      return;
    }
    
    if (!formData.password.trim()) {
      setError("Password is required");
      setIsLoading(false);
      return;
    }
    
    const apiEndpoint = isAdmin 
      ? `${base_url}/auth/superadmin/login`
      : `${base_url}/auth/subadmin/login`;
    
    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminId: formData.adminId.trim(),
          password: formData.password
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setSuccess(data.message || "Login successful!");
        
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userType", isAdmin ? "admin" : "restaurant");
        
        const userType = isAdmin ? "admin" : "restaurant";
        const resId = !isAdmin ? (data.user?.resID || 'default') : '';
        setAuthCookies(data.token, userType, resId);
        
        setTimeout(() => {
          if (isAdmin) {
            window.location.href = '/admin';
          } else {
            window.location.href = `/restaurant/${resId}`;
          }
        }, 1000);
        
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError("");
  };

  const toggleUserType = () => {
    setIsAdmin(!isAdmin);
    setError("");
    setSuccess("");
    setFormData({ adminId: "", password: "" });
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.gradient} flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden transition-all duration-700`}>
      {/* Logo */}
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50">
        <div className="w-12 h-12 sm:w-14 sm:h-14 relative">
          <Image
            src="/images/logo.png"
            alt="Logo"
            fill
            className="object-contain filter drop-shadow-lg"
            priority
          />
        </div>
      </div>

      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className={`absolute top-10 sm:top-20 left-10 sm:left-20 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-r ${theme.bgGlow1} rounded-full blur-3xl animate-pulse`}
          style={{ animationDelay: '0s', animationDuration: '4s' }}
        ></div>
        <div 
          className={`absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-l ${theme.bgGlow2} rounded-full blur-3xl animate-pulse`}
          style={{ animationDelay: '1s', animationDuration: '6s' }}
        ></div>
        <div 
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-r ${theme.bgGlow3} rounded-full blur-3xl animate-pulse`}
          style={{ animationDelay: '2s', animationDuration: '5s' }}
        ></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 ${isAdmin ? 'bg-violet-400' : 'bg-blue-400'} rounded-full opacity-30 animate-ping`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="w-full max-w-md space-y-6 sm:space-y-8 relative z-10 px-4 sm:px-0">
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="transform transition-all duration-700 hover:scale-105"></div>
          <p className="text-gray-300 text-base sm:text-lg font-light px-4">
            {isAdmin ? "Access your admin dashboard" : "Manage your restaurant"}
          </p>
          
          <div className={`w-20 sm:w-24 h-0.5 bg-gradient-to-r from-transparent ${isAdmin ? 'via-violet-500' : 'via-blue-500'} to-transparent mx-auto transition-all duration-700`}></div>
        </div>

        {/* Login Card */}
        <div className="transform transition-all duration-500 hover:scale-[1.02]">
          <Card className={`shadow-2xl border border-gray-800/50 bg-gradient-to-b ${theme.cardGradient} backdrop-blur-xl relative overflow-hidden`}>
            <div className={`absolute inset-0 bg-gradient-to-r ${theme.cardGlow} rounded-lg`}></div>
            
            <CardHeader className="space-y-4 sm:space-y-6 pb-6 sm:pb-8 relative z-10 px-4 sm:px-6">
              <div className="text-center">
                <CardTitle className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${theme.titleGradient} bg-clip-text text-transparent transition-all duration-700`}>
                  {isAdmin ? "Super Admin Portal" : "Restaurant Admin Portal"}
                </CardTitle>
                
                <div className={`mt-3 sm:mt-4 w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-gradient-to-r ${theme.iconBg} rounded-full flex items-center justify-center shadow-lg transition-all duration-700`}>
                  {isAdmin ? (
                    <Shield className="text-white w-7 h-7 sm:w-8 sm:h-8" />
                  ) : (
                    <Store className="text-white w-7 h-7 sm:w-8 sm:h-8" />
                  )}
                </div>
              </div>
              
              <div className="flex justify-center">
                {isAdmin ? (
                  // Super Admin - Professional highlighted button
                  <div className="relative">
                    {/* Subtle professional glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full blur-lg opacity-40 animate-pulse"></div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleUserType}
                      disabled={isLoading}
                      className="relative bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold hover:from-violet-500 hover:to-purple-500 transition-all duration-300 border border-violet-500/50 rounded-full px-4 sm:px-6 py-2 transform hover:scale-110 text-sm shadow-lg shadow-violet-600/30 animate-pulse"
                    >
                      <span className="flex items-center gap-2">
                        <Store className="w-4 h-4" />
                        Switch to Restaurant Admin
                      </span>
                    </Button>
                  </div>
                ) : (
                  // Restaurant Admin - Normal subtle button
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleUserType}
                    disabled={isLoading}
                    className="text-gray-400 hover:text-blue-400 hover:border-blue-400/30 hover:bg-blue-400/10 transition-all duration-300 border border-transparent rounded-full px-4 sm:px-6 py-2 transform hover:scale-105 text-sm"
                  >
                    Switch to Super Admin
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="pb-6 sm:pb-8 relative z-10 px-4 sm:px-6">
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {error && (
                  <Alert className="border-red-500/50 bg-red-500/10">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-400 text-sm">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-500/50 bg-green-500/10">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-400 text-sm">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4 sm:space-y-5">
                  <div className="space-y-2 group">
                    <Label htmlFor="adminId" className={`${isAdmin ? 'text-violet-400' : 'text-blue-400'} font-medium text-sm flex items-center gap-2 transition-colors duration-700`}>
                      <div className={`w-2 h-2 ${isAdmin ? 'bg-violet-400' : 'bg-blue-400'} rounded-full transition-colors duration-700`}></div>
                      Admin ID
                    </Label>
                    <Input
                      id="adminId"
                      name="adminId"
                      type="text"
                      placeholder="Enter your admin ID"
                      value={formData.adminId}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      className={`h-12 sm:h-14 px-4 bg-gray-800/50 ${isAdmin ? 'border-violet-800 focus:border-violet-500 focus:ring-violet-500/20 group-hover:border-violet-500/50' : 'border-gray-700 focus:border-blue-400 focus:ring-blue-400/20 group-hover:border-blue-400/50'} text-white placeholder-gray-500 focus:ring-2 transition-all duration-300 rounded-lg hover:bg-gray-800/70 disabled:opacity-50 disabled:cursor-not-allowed text-base`}
                    />
                  </div>

                  <div className="space-y-2 group">
                    <Label htmlFor="password" className={`${isAdmin ? 'text-violet-400' : 'text-blue-400'} font-medium text-sm flex items-center gap-2 transition-colors duration-700`}>
                      <div className={`w-2 h-2 ${isAdmin ? 'bg-violet-400' : 'bg-blue-400'} rounded-full transition-colors duration-700`}></div>
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                        className={`h-12 sm:h-14 px-4 pr-12 bg-gray-800/50 ${isAdmin ? 'border-violet-800 focus:border-violet-500 focus:ring-violet-500/20 group-hover:border-violet-500/50' : 'border-gray-700 focus:border-blue-400 focus:ring-blue-400/20 group-hover:border-blue-400/50'} text-white placeholder-gray-500 focus:ring-2 transition-all duration-300 rounded-lg hover:bg-gray-800/70 disabled:opacity-50 disabled:cursor-not-allowed text-base`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isLoading}
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 ${isAdmin ? 'hover:text-violet-400' : 'hover:text-blue-400'} h-10 w-10 p-0 transition-colors duration-300`}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    disabled={isLoading || !formData.adminId || !formData.password}
                    className={`w-full h-12 sm:h-14 bg-gradient-to-r ${theme.buttonGradient} text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed rounded-lg shadow-lg ${isAdmin ? 'hover:shadow-violet-500/25' : 'hover:shadow-blue-400/25'} relative overflow-hidden text-base`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700"></div>
                    
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isAdmin ? <Shield className="w-5 h-5" /> : <Store className="w-5 h-5" />}
                        Sign In
                      </span>
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-6 sm:mt-8 text-center space-y-3">
                <a 
                  href="#" 
                  className={`${isAdmin ? 'text-gray-400 hover:text-violet-300' : 'text-gray-400 hover:text-blue-400'} transition-all duration-300 text-sm relative inline-block group`}
                >
                  Forgot your password?
                  <div className={`absolute bottom-0 left-0 w-0 h-0.5 ${isAdmin ? 'bg-violet-400' : 'bg-blue-400'} group-hover:w-full transition-all duration-300`}></div>
                </a>
                
                <div className="text-xs text-gray-500">
                  Need help? Contact your system administrator
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-xs sm:text-sm text-gray-500 px-4">
          <p>
            By signing in, you agree to our{" "}
            <a href="#" className={`${isAdmin ? 'text-violet-400 hover:text-violet-300' : 'text-blue-400 hover:text-blue-300'} transition-colors duration-300 hover:underline`}>
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className={`${isAdmin ? 'text-violet-400 hover:text-violet-300' : 'text-blue-400 hover:text-blue-300'} transition-colors duration-300 hover:underline`}>
              Privacy Policy
            </a>
          </p>
        </div>

        {/* Decorative Elements */}
        <div className={`absolute -top-20 -left-20 w-32 sm:w-40 h-32 sm:h-40 bg-gradient-to-r ${theme.bgGlow1}/20 rounded-full blur-2xl animate-pulse transition-all duration-700`}></div>
        <div className={`absolute -bottom-20 -right-20 w-28 sm:w-32 h-28 sm:h-32 bg-gradient-to-l ${theme.bgGlow3}/20 rounded-full blur-2xl animate-pulse transition-all duration-700`} style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-5" 
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      ></div>
    </div>
  );
};

export default Login;