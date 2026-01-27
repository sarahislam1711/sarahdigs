import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";

const CONSENT_KEY = "sarahdigs-cookie-consent";

type ConsentStatus = "pending" | "accepted" | "declined";

export default function CookieConsent() {
  const [status, setStatus] = useState<ConsentStatus>("pending");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const savedConsent = localStorage.getItem(CONSENT_KEY);
    
    if (savedConsent === "accepted") {
      setStatus("accepted");
      enableAnalytics();
    } else if (savedConsent === "declined") {
      setStatus("declined");
    } else {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const enableAnalytics = () => {
    // Initialize Google Analytics
    if (typeof window !== "undefined" && !window.gtag) {
      const script = document.createElement("script");
      script.src = "https://www.googletagmanager.com/gtag/js?id=G-TQ22734W55";
      script.async = true;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      window.gtag = gtag;
      gtag("js", new Date());
      gtag("config", "G-TQ22734W55");
    }
  };

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setStatus("accepted");
    setIsVisible(false);
    enableAnalytics();
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setStatus("declined");
    setIsVisible(false);
  };

  // Don't render if user has already made a choice
  if (status !== "pending") return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#1B1B1B] border border-gray-800 rounded-2xl p-6 shadow-2xl shadow-black/50">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-[#4D00FF]/10 rounded-full flex items-center justify-center">
                    <Cookie className="w-6 h-6 text-[#4D00FF]" />
                  </div>
                </div>

                {/* Text */}
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-1">
                    Cookie Preferences
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    We use cookies to analyze site traffic and optimize your experience. 
                    By clicking "Accept", you consent to our use of analytics cookies.{" "}
                    <a 
                      href="/privacy" 
                      className="text-[#4D00FF] hover:underline"
                    >
                      Learn more
                    </a>
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={handleDecline}
                    className="flex-1 md:flex-none px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600 rounded-lg transition-colors"
                  >
                    Decline
                  </button>
                  <button
                    onClick={handleAccept}
                    className="flex-1 md:flex-none px-5 py-2.5 text-sm font-medium text-white bg-[#4D00FF] hover:bg-[#3D00CC] rounded-lg transition-colors"
                  >
                    Accept
                  </button>
                </div>

                {/* Close button */}
                <button
                  onClick={handleDecline}
                  className="absolute top-4 right-4 md:static p-1 text-gray-500 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Add type declarations for window
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}