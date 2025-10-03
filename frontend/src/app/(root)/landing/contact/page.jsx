import React from 'react';
import { Layout } from '../../../../components/layout/Layout';
import { Button } from '../../../../components/ui/button';
import { Mail, Phone, MapPin, Instagram } from 'lucide-react';

export default function ContactPage() {
  return (
    <Layout>
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Get in Touch
              </h1>
              <p className="text-lg text-gray-600">
                Have questions? We're here to help. Reach out to us through any of these channels.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-50 p-8 rounded-2xl">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600 mr-4">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Email Us</h3>
                      <a href="mailto:info@vigyapanwala.com" className="text-blue-600 hover:underline">
                        info@vigyapanwala.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-green-100 p-3 rounded-full text-green-600 mr-4">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Call Us</h3>
                      <a href="tel:+918210334312" className="text-gray-600 hover:text-gray-900">
                        +91 8210334312
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-purple-100 p-3 rounded-full text-purple-600 mr-4">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Location</h3>
                      <p className="text-gray-600">Vigyapanwala, India</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-pink-100 p-3 rounded-full text-pink-600 mr-4">
                      <Instagram className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Follow Us</h3>
                      <a 
                        href="https://instagram.com/vigyapanwalaa" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        @vigyapanwalaa
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-8 rounded-2xl">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Type your message here..."
                    ></textarea>
                  </div>
                  <div className="pt-2">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
                      Send Message
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {[
                  {
                    question: "What are your business hours?",
                    answer: "Our support team is available Monday to Friday, 9:00 AM to 6:00 PM IST."
                  },
                  {
                    question: "How can I request a demo?",
                    answer: "You can request a demo by filling out the contact form or calling us directly at +91 8210334312."
                  },
                  {
                    question: "Do you offer support for existing customers?",
                    answer: "Yes, we provide dedicated support for all our customers. You can reach our support team via email or phone."
                  }
                ].map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4">
                    <h3 className="font-medium text-gray-900">{faq.question}</h3>
                    <p className="text-gray-600 mt-1">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
