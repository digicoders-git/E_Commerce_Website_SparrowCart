import { FiShield } from 'react-icons/fi'

const sections = [
  {
    title: 'Information We Collect',
    content: `We collect information you provide directly to us, such as your name, email address, phone number, shipping address, and payment details when you create an account or place an order. We also automatically collect certain information when you use our platform, including IP address, browser type, device information, and browsing behavior on our site.`
  },
  {
    title: 'How We Use Your Information',
    content: `We use the information we collect to process your orders and payments, send order confirmations and shipping updates, provide customer support, personalize your shopping experience, send promotional offers (only with your consent), improve our website and services, and comply with legal obligations.`
  },
  {
    title: 'Sharing of Information',
    content: `We do not sell or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and conducting our business (such as payment processors and delivery partners), subject to confidentiality agreements. We may also disclose information when required by law.`
  },
  {
    title: 'Data Security',
    content: `We implement industry-standard security measures including SSL encryption, secure servers, and regular security audits to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`
  },
  {
    title: 'Cookies',
    content: `We use cookies and similar tracking technologies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can control cookie settings through your browser. Disabling cookies may affect some features of our website.`
  },
  {
    title: 'Your Rights',
    content: `You have the right to access, update, or delete your personal information at any time through your account settings. You may also opt out of marketing communications by clicking "unsubscribe" in any email or contacting us directly. For any privacy-related requests, reach us at privacy@sparrowcart.com.`
  },
  {
    title: 'Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated date. We encourage you to review this policy periodically.`
  },
]

export default function PrivacyPolicy() {
  return (
    <div className="bg-neutral min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-teal rounded-xl flex items-center justify-center">
            <FiShield className="text-white" size={20} />
          </div>
          <h1 className="text-3xl font-extrabold text-dark">Privacy Policy</h1>
        </div>
        <p className="text-muted text-sm mb-8">Last updated: June 1, 2025</p>

        <div className="bg-white rounded-2xl border border-border p-6 mb-6 text-sm text-dark leading-relaxed">
          At SparrowCart, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our platform.
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
