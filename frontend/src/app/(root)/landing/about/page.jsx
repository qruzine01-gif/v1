import React from 'react';
import { Layout } from '../../../../components/layout/Layout';
import { Button } from '../../../../components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <Layout>
      <section className="py-12 md:py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              About Qruzine
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Revolutionizing the restaurant industry with innovative technology solutions
            </p>
            
            <div className="bg-gray-50 rounded-2xl p-6 md:p-8 lg:p-10 text-left space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
                <p className="text-gray-600 mb-4">
                  Qruzine was born from a simple idea: to bridge the gap between restaurants and their customers through technology. 
                  Founded by Vigyapanwala, we've grown from a small startup to a trusted partner for restaurants of all sizes.
                </p>
                <p className="text-gray-600">
                  Our mission is to empower restaurants with tools that make operations smoother, service better, and customer 
                  experiences more memorable.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Values</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      title: 'Innovation',
                      description: 'Constantly pushing boundaries to bring cutting-edge solutions to the restaurant industry.'
                    },
                    {
                      title: 'Reliability',
                      description: 'Providing stable and dependable services that restaurants can count on every day.'
                    },
                    {
                      title: 'Customer Focus',
                      description: 'Putting the needs of both restaurants and diners at the heart of everything we do.'
                    },
                    {
                      title: 'Integrity',
                      description: 'Maintaining transparency and honesty in all our business practices.'
                    }
                  ].map((item, index) => (
                    <div key={index} className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center mt-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ready to transform your restaurant?</h2>
                <p className="text-gray-600 mb-6">Join hundreds of restaurants already using Qruzine to enhance their operations.</p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
