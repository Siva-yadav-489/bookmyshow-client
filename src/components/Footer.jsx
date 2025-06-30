import { Link } from 'react-router-dom';
import {
  FaCcVisa, FaCcMastercard, FaCcAmex, FaCcPaypal, FaGooglePay, FaAppStoreIos,
  FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube,
  FaPhoneAlt, FaQuestionCircle, FaMoneyBillWave, FaTheaterMasks, FaBuilding, FaTicketAlt, FaGift
} from 'react-icons/fa';
import { SiPhonepe, SiGoogleplay } from 'react-icons/si';

const Footer = () => {
  const paymentMethods = [
    { name: 'Visa', icon: <FaCcVisa className="text-3xl text-blue-700" /> },
    { name: 'MasterCard', icon: <FaCcMastercard className="text-3xl text-red-600" /> },
    { name: 'Amex', icon: <FaCcAmex className="text-3xl text-blue-500" /> },
    { name: 'PayPal', icon: <FaCcPaypal className="text-3xl text-blue-800" /> },
    { name: 'GPay', icon: <FaGooglePay className="text-3xl text-gray-500" /> },
    { name: 'PhonePe', icon: <SiPhonepe className="text-3xl text-purple-600" /> },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div>
            <h3 className="text-[#1E1E1E] font-medium mb-4">About BookMyShow</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-[#F84464] transition-colors flex items-center space-x-2">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-[#F84464] transition-colors flex items-center space-x-2">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-[#F84464] transition-colors flex items-center space-x-2">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-[#F84464] transition-colors flex items-center space-x-2">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Help */}
          <div>
            <h3 className="text-[#1E1E1E] font-medium mb-4">Help</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/support" className="text-sm text-gray-600 hover:text-[#F84464] transition-colors flex items-center space-x-2">
                  <FaPhoneAlt className="inline-block w-5 text-gray-400" />
                  <span>Customer Support</span>
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-gray-600 hover:text-[#F84464] transition-colors flex items-center space-x-2">
                  <FaQuestionCircle className="inline-block w-5 text-gray-400" />
                  <span>FAQs</span>
                </Link>
              </li>
              <li>
                <Link to="/refund" className="text-sm text-gray-600 hover:text-[#F84464] transition-colors flex items-center space-x-2">
                  <FaMoneyBillWave className="inline-block w-5 text-gray-400" />
                  <span>Refund Policy</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Business */}
          <div>
            <h3 className="text-[#1E1E1E] font-medium mb-4">Business</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/list-your-show" className="text-sm text-gray-600 hover:text-[#F84464] transition-colors flex items-center space-x-2">
                  <FaTheaterMasks className="inline-block w-5 text-gray-400" />
                  <span>List Your Show</span>
                </Link>
              </li>
              <li>
                <Link to="/corporate-booking" className="text-sm text-gray-600 hover:text-[#F84464] transition-colors flex items-center space-x-2">
                  <FaBuilding className="inline-block w-5 text-gray-400" />
                  <span>Corporate Booking</span>
                </Link>
              </li>
              <li>
                <Link to="/offers" className="text-sm text-gray-600 hover:text-[#F84464] transition-colors flex items-center space-x-2">
                  <FaTicketAlt className="inline-block w-5 text-gray-400" />
                  <span>Offers</span>
                </Link>
              </li>
              <li>
                <Link to="/gift-cards" className="text-sm text-gray-600 hover:text-[#F84464] transition-colors flex items-center space-x-2">
                  <FaGift className="inline-block w-5 text-gray-400" />
                  <span>Gift Cards</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div>
            <h3 className="text-[#1E1E1E] font-medium mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="text-gray-600 hover:text-[#F84464] transition-colors">
                <FaFacebookF className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-[#F84464] transition-colors">
                <FaTwitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-[#F84464] transition-colors">
                <FaInstagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-[#F84464] transition-colors">
                <FaLinkedinIn className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-[#F84464] transition-colors">
                <FaYoutube className="w-6 h-6" />
              </a>
            </div>
            <div className="text-sm text-gray-600">
              <p className="mb-2">Download our apps</p>
              <div className="flex space-x-4">
                <a href="#" className="hover:opacity-80 transition-opacity flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded-lg bg-white">
                  <SiGoogleplay className="text-2xl text-green-600" />
                  <span className="font-medium">Google Play</span>
                </a>
                <a href="#" className="hover:opacity-80 transition-opacity flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded-lg bg-white">
                  <FaAppStoreIos className="text-2xl text-gray-800" />
                  <span className="font-medium">App Store</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 text-center md:text-left">
              © 2025 BookMyShow. All Rights Reserved.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4 md:mt-0">
              {paymentMethods.map((method) => (
                <div key={method.name} className="flex items-center justify-center w-12 h-8 bg-white rounded border border-gray-200">
                  {method.icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;