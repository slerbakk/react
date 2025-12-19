import { useState } from "react";
import { useToast } from "../context/ToastContext";
import { ContactFormData, FormErrors } from "../types";

/**
 * Contact form page with validation and submission handling.
 * Validates name (min 3 chars), email, subject (min 3 chars), and message (min 10 chars).
 */

function ContactPage() {
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    subject: "",
    email: "",
    message: "",
  });

  // Validation errors state
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /**
   * Validates all form fields and returns validation status.
   * @returns {boolean} True if form is valid, false otherwise
   */

  const validateForm = () => {
    const newErrors = {};

    // Full Name validation (minimum 3 characters)
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters";
    }

    // Subject validation (minimum 3 characters)
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = "Subject must be at least 3 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Message validation (minimum 10 characters)
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      showError("Please fix the errors below and try again");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call (replace with real API in production)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success - clear form and show success message
      setFormData({
        fullName: "",
        subject: "",
        email: "",
        message: "",
      });
      setErrors({});

      showSuccess("Thank you for your message! We'll get back to you soon.");
    } catch (error) {
      showError("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({
      fullName: "",
      subject: "",
      email: "",
      message: "",
    });
    setErrors({});
  };

  return (
    <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">Contact Us</h1>
          <p className="text-lg text-gray-600">
            Have a question or need help? We'd love to hear from you.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          <div className="p-6 text-center bg-white border rounded-lg shadow-sm">
            <div className="mb-2 text-2xl">📧</div>
            <h3 className="mb-1 font-semibold text-gray-900">Email</h3>
            <p className="text-sm text-gray-600">support@reactshop.com</p>
          </div>
          <div className="p-6 text-center bg-white border rounded-lg shadow-sm">
            <div className="mb-2 text-2xl">📞</div>
            <h3 className="mb-1 font-semibold text-gray-900">Phone</h3>
            <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
          </div>
          <div className="p-6 text-center bg-white border rounded-lg shadow-sm">
            <div className="mb-2 text-2xl">🕒</div>
            <h3 className="mb-1 font-semibold text-gray-900">Hours</h3>
            <p className="text-sm text-gray-600">Mon-Fri: 9AM-6PM</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="p-8 bg-white border rounded-lg shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">
            Send us a message
          </h2>

          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-6">
              {/* Full Name Field */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.fullName
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="flex items-center mt-1 text-sm text-red-600">
                    <span className="mr-1">⚠️</span>
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Subject Field */}
              <div>
                <label
                  htmlFor="subject"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.subject
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="What's this about?"
                />
                {errors.subject && (
                  <p className="flex items-center mt-1 text-sm text-red-600">
                    <span className="mr-1">⚠️</span>
                    {errors.subject}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.email
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="flex items-center mt-1 text-sm text-red-600">
                    <span className="mr-1">⚠️</span>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-vertical ${
                    errors.message
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Tell us how we can help you..."
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.message ? (
                    <p className="flex items-center text-sm text-red-600">
                      <span className="mr-1">⚠️</span>
                      {errors.message}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      {formData.message.length}/500 characters
                    </p>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                      Sending...
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isSubmitting}
                  className="px-6 py-3 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-sm text-center text-gray-600">
          <p>We typically respond within 24 hours during business days.</p>
          <p className="mt-1">
            For urgent matters, please call us at{" "}
            <a
              href="tel:+15551234567"
              className="text-blue-600 hover:text-blue-800"
            >
              +1 (555) 123-4567
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

export default ContactPage;
