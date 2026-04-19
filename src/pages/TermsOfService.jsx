import { FiFileText } from 'react-icons/fi'

const sections = [
  {
    title: 'Acceptance of Terms',
    content: `By accessing or using SparrowCart, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.`
  },
  {
    title: 'Account Registration',
    content: `To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information during registration and keep it updated.`
  },
  {
    title: 'Product Information & Pricing',
    content: `We strive to display accurate product descriptions, images, and pricing. However, we do not warrant that product descriptions or prices are error-free. We reserve the right to correct any errors and to cancel orders placed at incorrect prices. Prices are subject to change without notice.`
  },
  {
    title: 'Orders & Payments',
    content: `By placing an order, you make an offer to purchase the product. We reserve the right to accept or decline your order. Payment must be made in full at the time of purchase. We accept major credit/debit cards, UPI, and net banking. All transactions are secured with SSL encryption.`
  },
  {
    title: 'Shipping & Delivery',
    content: `We aim to deliver orders within the estimated timeframe shown at checkout. Delivery times may vary based on location and product availability. SparrowCart is not responsible for delays caused by courier partners, natural disasters, or other circumstances beyond our control.`
  },
  {
    title: 'Intellectual Property',
    content: `All content on SparrowCart, including logos, images, text, and software, is the property of SparrowCart and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.`
  },
  {
    title: 'Limitation of Liability',
    content: `SparrowCart shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our platform or products purchased through it. Our total liability shall not exceed the amount paid for the specific product giving rise to the claim.`
  },
  {
    title: 'Governing Law',
    content: `These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in Mumbai, Maharashtra.`
  },
]

export default function TermsOfService() {
  return (
    <div className="bg-neutral min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-teal rounded-xl flex items-center justify-center">
            <FiFileText className="text-white" size={20} />
          </div>
          <h1 className="text-3xl font-extrabold text-dark">Terms of Service</h1>
        </div>
        <p className="text-muted text-sm mb-8">Last updated: June 1, 2025</p>

        <div className="bg-white rounded-2xl border border-border p-6 mb-6 text-sm text-dark leading-relaxed">
          Please read these Terms of Service carefully before using SparrowCart. These terms govern your use of our website and services.
        </div>

        <div className="space-y-4">
          {sections.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-bold text-dark mb-2">{i + 1}. {s.title}</h2>
              <p className="text-sm text-muted leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted mt-8">
          Questions? Contact us at <a href="mailto:support@sparrowcart.com" className="text-teal hover:underline">support@sparrowcart.com</a>
        </p>
      </div>
    </div>
  )
}
