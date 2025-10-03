import React from 'react';
import { Layout } from '../../../../components/layout/Layout';

export default function TermsPage() {
  return (
    <Layout>
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Terms of Service
              </h1>
              <p className="text-lg text-gray-600">
                Last updated: October 1, 2024
              </p>
            </div>

            <div className="prose prose-lg max-w-none text-gray-600">
              <div className="bg-gray-50 p-6 md:p-8 rounded-2xl mb-8">
                <p className="text-gray-600 mb-0">
                  Please read these Terms of Service ("Terms") carefully before using the Qruzine platform 
                  ("Service") operated by Vigyapanwala ("us", "we", or "our").
                </p>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                  <p>
                    By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, 
                    you may not access the Service.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
                  <p>
                    Qruzine provides a digital platform that enables restaurants to manage their operations, 
                    including but not limited to point of sale, menu management, and customer relationship management.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
                  <p>
                    When you create an account with us, you must provide accurate and complete information. 
                    You are responsible for maintaining the confidentiality of your account and password.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Payments and Billing</h2>
                  <p>
                    Certain features of the Service may require payment of fees. You agree to pay all fees 
                    specified in the applicable pricing plan. All fees are non-refundable except as required by law.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Privacy Policy</h2>
                  <p>
                    Your use of the Service is also governed by our Privacy Policy. Please review our Privacy Policy, 
                    which is incorporated into these Terms by this reference.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
                  <p>
                    The Service and its original content, features, and functionality are and will remain the 
                    exclusive property of Vigyapanwala and its licensors.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Termination</h2>
                  <p>
                    We may terminate or suspend your account immediately, without prior notice or liability, 
                    for any reason whatsoever, including without limitation if you breach the Terms.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
                  <p>
                    In no event shall Vigyapanwala, nor its directors, employees, partners, agents, suppliers, 
                    or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Governing Law</h2>
                  <p>
                    These Terms shall be governed and construed in accordance with the laws of India, without 
                    regard to its conflict of law provisions.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
                  <p>
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                    We will provide notice of any changes by posting the new Terms on this page.
                  </p>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl mt-10">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Us</h3>
                  <p className="text-gray-600 mb-4">
                    If you have any questions about these Terms, please contact us at:
                  </p>
                  <p className="text-gray-800">
                    <strong>Email:</strong> info@vigyapanwala.com<br />
                    <strong>Phone:</strong> +91 8210334312<br />
                    <strong>Website:</strong> www.vigyapanwala.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
