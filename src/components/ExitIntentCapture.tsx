import React, { useState, useEffect } from 'react';

const ExitIntentCapture: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: '',
    currentWebsite: '',
    message: ''
  });

  useEffect(() => {
    let exitTimer: number;
    
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !localStorage.getItem('exitIntentShown')) {
        setShowPopup(true);
      }
    };

    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 70 && !localStorage.getItem('exitIntentShown')) {
        exitTimer = window.setTimeout(() => {
          setShowPopup(true);
        }, 5000);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      if (exitTimer) window.clearTimeout(exitTimer);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send to email
      const emailResponse = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'connect@ofemo.uk',
          subject: 'Free Portfolio Request',
          html: `
            <h2>New Free Portfolio Request</h2>
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Phone:</strong> ${formData.phone}</p>
            <p><strong>Business Type:</strong> ${formData.businessType}</p>
            <p><strong>Current Website:</strong> ${formData.currentWebsite || 'None'}</p>
            <p><strong>Message:</strong> ${formData.message}</p>
          `
        })
      });

      // Send to WhatsApp
      const whatsappMessage = `New Free Portfolio Request:
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Business: ${formData.businessType}
Current Website: ${formData.currentWebsite || 'None'}
Message: ${formData.message}`;

      const whatsappUrl = `https://wa.me/447756183484?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');

      setIsSubmitted(true);
      localStorage.setItem('exitIntentShown', 'true');
      
      window.setTimeout(() => {
        setShowPopup(false);
      }, 3000);

    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowPopup(false);
    localStorage.setItem('exitIntentShown', 'true');
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-dark-800 rounded-2xl p-8 max-w-md w-full border border-dark-700 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <i className="bi bi-x-lg text-xl"></i>
        </button>

        {!isSubmitted ? (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-lime-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-gift text-2xl text-lime-400"></i>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Let Me Build Your Portfolio <span className="text-lime-400">Free</span>
              </h3>
              <p className="text-gray-400">
                Get a professional portfolio website at no cost. Limited time offer!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Full Name *"
                  required
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-lime-400 transition-colors"
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your Email Address *"
                  required
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-lime-400 transition-colors"
                />
              </div>

              <div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Your Phone Number *"
                  required
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-lime-400 transition-colors"
                />
              </div>

              <div>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-lime-400 transition-colors"
                >
                  <option value="">Select Your Business Type *</option>
                  <option value="freelancer">Freelancer</option>
                  <option value="small-business">Small Business</option>
                  <option value="startup">Startup</option>
                  <option value="personal">Personal Brand</option>
                  <option value="agency">Agency</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <input
                  type="url"
                  name="currentWebsite"
                  value={formData.currentWebsite}
                  onChange={handleInputChange}
                  placeholder="Current Website (if any)"
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-lime-400 transition-colors"
                />
              </div>

              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell me about your vision..."
                  rows={3}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-lime-400 transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-lime-500 text-dark-900 font-semibold rounded-lg hover:bg-lime-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <i className="bi bi-arrow-clockwise animate-spin mr-2"></i>
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-gift mr-2"></i>
                    Claim My Free Portfolio
                  </>
                )}
              </button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-4">
              * This offer is limited and subject to availability
            </p>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="bi bi-check-circle text-2xl text-green-400"></i>
            </div>
            <h4 className="text-xl font-semibold text-white mb-2">Request Submitted!</h4>
            <p className="text-gray-400 mb-4">
              Thank you! I'll review your request and get back to you within 24 hours.
            </p>
            <p className="text-sm text-lime-400">
              Check your WhatsApp for immediate confirmation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExitIntentCapture;
