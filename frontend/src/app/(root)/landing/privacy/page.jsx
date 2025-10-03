import React from 'react';
import { Layout } from '../../../../components/layout/Layout';

export default function PrivacyPage() {
  return (
    <Layout>
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Qruzine Privacy Policy
              </h1>
              <p className="text-lg text-gray-600">
                Last updated: October 1, 2024
              </p>
            </div>

            <div className="prose prose-lg max-w-none text-gray-600">
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Our Commitment to Privacy</h2>
                  <p>
                    Welcome to Qruzine, a service provided by Vigyapanwala. Our mission is to provide a seamless dining experience through our Point of Sale (POS), live menu, and customer connection tools ("Services").
                  </p>
                  <p className="mt-2">
                    This policy is designed to help you understand what information we collect, why we collect it, and how you can manage it. We've written it to be as clear and accessible as possible. Your privacy is a responsibility we take seriously.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
                  <p className="mb-4">
                    We collect information to operate effectively and provide you with the best experience. The type of information we collect depends on how you interact with our Services, whether you are a Restaurant Client or a Diner using our platform.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">A. Information You Provide to Us</h3>
                  
                  <h4 className="font-semibold text-gray-900 mb-2">For Restaurant Clients:</h4>
                  <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>
                      <strong>Account and Business Information:</strong> When you sign up for Qruzine, we collect your business name, address, tax information, and contact details for your designated representatives (such as name, email address, and phone number).
                    </li>
                    <li>
                      <strong>Billing Information:</strong> To process payments for our Services, we collect payment details, which may include credit card numbers or bank account information. This is processed securely by our payment partners.
                    </li>
                    <li>
                      <strong>Menu and Operational Data:</strong> You provide us with your menu details, pricing, and other operational information necessary to configure the Service.
                    </li>
                  </ul>
                  
                  <h4 className="font-semibold text-gray-900 mb-2">For Diners:</h4>
                  <ul className="list-disc pl-6 space-y-2 mb-6">
                    <li>
                      <strong>Order Information:</strong> When placing an order through a Qruzine-powered menu, we collect information necessary to fulfill that order, such as your table number, selected items, and any special instructions.
                    </li>
                    <li>
                      <strong>Contact Information (Optional):</strong> You may choose to provide a name or phone number so the restaurant can identify or contact you regarding your order.
                    </li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">B. Information We Collect Automatically</h3>
                  <p className="mb-4">
                    When you use our Services, we automatically collect certain information to ensure functionality, security, and to improve our platform.
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Device and Connection Information:</strong> We collect information about the device and browser you are using, including IP address, operating system, device identifiers, and browser type. This helps us format our services correctly for your device and diagnose problems.
                    </li>
                    <li>
                      <strong>Usage Information:</strong> We log how you interact with our Services, such as the features you use, the menu items you view, timestamps of your activity, and performance data. This helps us understand what's useful and where we can improve.
                    </li>
                    <li>
                      <strong>Cookies and Similar Technologies:</strong> We use cookies (small text files stored on your device) to operate and provide our Services. For example, we use them to remember your session, understand how our Services are being used, and for analytics.
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Why We Use Your Information</h2>
                  <p className="mb-4">
                    We use the information we collect for the following key purposes:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>To Provide, Maintain, and Improve our Services:</strong> We use your information to deliver our core services, such as processing orders, managing payments, and providing our clients with sales analytics. We also use it to develop new features and enhance performance.
                    </li>
                    <li>
                      <strong>To Ensure Safety and Security:</strong> We work to protect our users and our platform from fraud, abuse, and security threats. We may use information to verify accounts, detect suspicious activity, and enforce our terms of service.
                    </li>
                    <li>
                      <strong>To Communicate with You:</strong> We use your contact information to send service-related announcements, respond to your support inquiries, and provide you with important updates about your account or our services.
                    </li>
                    <li>
                      <strong>To Fulfill Legal and Regulatory Obligations:</strong> We may be required to use and retain information for legal reasons, such as preventing financial crime, responding to a valid legal request from law enforcement, or complying with tax laws.
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. How We Share Your Information</h2>
                  <p className="mb-4">
                    We do not sell your personal information or share it with third parties for their own marketing purposes. Our philosophy is to share data only when it is necessary to provide our Services or to comply with the law.
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>With Service Providers:</strong> We work with trusted third-party companies to help us operate, provide, improve, and secure our Services (e.g., cloud hosting, payment processing, and data analytics). These providers are bound by strict data protection obligations and are only permitted to use the information to perform the services we've requested.
                    </li>
                    <li>
                      <strong>For Legal Reasons:</strong> We will share personal information outside of Qruzine if we have a good-faith belief that access, use, preservation, or disclosure of the information is reasonably necessary to:
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Meet any applicable law, regulation, legal process, or enforceable governmental request.</li>
                        <li>Enforce our Terms of Service, including investigation of potential violations.</li>
                        <li>Detect, prevent, or otherwise address fraud, security, or technical issues.</li>
                      </ul>
                    </li>
                    <li>
                      <strong>In Case of a Business Transfer:</strong> If Vigyapanwala or Qruzine is involved in a merger, acquisition, or sale of assets, we will continue to ensure the confidentiality of your personal information and give affected users notice before information is transferred or becomes subject to a different privacy policy.
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Managing and Controlling Your Information</h2>
                  <p className="mb-4">
                    We believe you should have control over your information. We provide you with the following rights:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Accessing and Rectifying Your Information:</strong> Our Restaurant Clients can review and update their account information directly through their Qruzine dashboard.</li>
                    <li><strong>Data Portability:</strong> You can request a copy of the personal information you have provided to us.</li>
                    <li><strong>Deleting Your Information:</strong> Restaurant Clients can request the deletion of their account. Diners can request that the restaurant they visited delete their order information. We will delete this information unless we have a legitimate reason or legal obligation to retain it.</li>
                  </ul>
                  <p className="mt-4">
                    To exercise any of these rights, please contact us using the details below.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention and Deletion</h2>
                  <p>
                    We retain information for as long as it is needed to provide our Services and to fulfill the purposes described in this policy. When we no longer need the information, we take steps to securely delete or anonymize it. We may retain certain data for longer periods if required by law for purposes like bookkeeping or security.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Changes to This Policy</h2>
                  <p>
                    We may update this Privacy Policy from time to time. We will post any changes on this page and, if the changes are significant, we will provide a more prominent notice. We encourage you to review our Privacy Policy whenever you use our Services to stay informed about our information practices.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Us</h2>
                  <p className="mb-2">If you have questions about this policy or our privacy practices, please contact us:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Product:</strong> Qruzine</li>
                    <li><strong>Parent Company:</strong> Vigyapanwala</li>
                    <li><strong>Phone:</strong> 8210334312</li>
                    <li><strong>Website:</strong> www.vigyapanwala.com</li>
                    <li><strong>Instagram:</strong> @vigyapanwalaa</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl mt-8">
                  <p className="text-sm text-gray-500 italic">
                    <strong>Disclaimer:</strong> This policy is for informational purposes. It is recommended to consult with a legal professional to ensure full compliance with all applicable laws and regulations for your specific business operations.
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
