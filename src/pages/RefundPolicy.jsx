import { FiRefreshCw } from 'react-icons/fi'

const sections = [
  {
    title: 'Return Eligibility',
    content: `Items can be returned within 30 days of delivery. To be eligible, the product must be unused, in its original packaging, and in the same condition as received. Certain items such as perishables, intimate apparel, and digital downloads are not eligible for return.`
  },
  {
    title: 'How to Initiate a Return',
    content: `To initiate a return, log in to your SparrowCart account, go to "My Orders", select the item you wish to return, and click "Request Return". Our team will review your request within 24–48 hours and provide a return pickup or drop-off instructions.`
  },
  {
    title: 'Refund Process',
    content: `Once we receive and inspect the returned item, we will notify you of the approval or rejection of your refund. Approved refunds are processed within 5–7 business days. The amount will be credited to your original payment method. For COD orders, refunds are issued via bank transfer.`
  },
  {
    title: 'Damaged or Defective Items',
    content: `If you receive a damaged or defective product, please contact us within 48 hours of delivery with photos of the item and packaging. We will arrange a replacement or full refund at no additional cost to you.`
  },
  {
    title: 'Exchange Policy',
    content: `We offer exchanges for size or color variants of the same product, subject to availability. To request an exchange, follow the same process as a return and select "Exchange" as the reason. Exchanges are processed within 7–10 business days.`
  },
  {
    title: 'Non-Refundable Items',
    content: `The following items are not eligible for refund or return: gift cards, downloadable software, perishable goods, items marked as "Final Sale", and products that have been used, altered, or damaged by the customer.`
  },
  {
    title: 'Shipping Costs',
    content: `Return shipping is free for defective or incorrect items. For other returns, a shipping fee of ₹99 may be deducted from your refund. Original shipping charges are non-refundable unless the return is due to our error.`
  },
]

export default function RefundPolicy() {
  return (
    <div className="bg-neutral min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-teal rounded-xl flex items-center justify-center">
            <FiRefreshCw className="text-white" size={20} />
          </div>
          <h1 className="text-3xl font-extrabold text-dark">Refund Policy</h1>
        </div>
        <p className="text-muted text-sm mb-8">Last updated: June 1, 2025</p>

        <div className="bg-white rounded-2xl border border-border p-6 mb-6 text-sm text-dark leading-relaxed">
          We want you to be completely satisfied with your purchase. If you're not happy, we're here to help. Please read our refund and return policy below.
        </div>

        <div className="space-y-4">
          {sections.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-bold text-dark mb-2">{i + 1}. {s.title}</h2>
              <p className="text-sm text-muted leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>

        <div className="bg-teal/10 border border-teal/20 rounded-2xl p-5 mt-6 text-sm text-dark">
          <p className="font-bold mb-1">Need help with a return?</p>
          <p className="text-muted">Contact our support team at <a href="mailto:support@sparrowcart.com" className="text-teal hover:underline">support@sparrowcart.com</a> or call <span className="font-medium">+91 98765 43210</span> (Mon–Sat, 9AM–6PM).</p>
        </div>
      </div>
    </div>
  )
}
