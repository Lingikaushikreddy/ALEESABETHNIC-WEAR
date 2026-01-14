import { ChevronDown } from 'lucide-react'

export default function FAQPage() {
    const faqs = [
        {
            question: "How do I find my size?",
            answer: "We have a detailed size guide on every product page. Click on the 'Size Guide' button next to the size selector to see measurements. If you're in between sizes, we recommend going for the larger size for a comfortable fit."
        },
        {
            question: "Do you ship internationally?",
            answer: "Currently, we only ship within India. We are working on enabling international shipping soon!"
        },
        {
            question: "Can I cancel my order?",
            answer: "Yes, you can cancel your order before it has been shipped. Please go to your Order History or contact our support team immediately. Once shipped, orders cannot be cancelled."
        },
        {
            question: "How do I track my order?",
            answer: "Once your order is shipped, you will receive an email and SMS with the tracking link. You can also view the status in the 'My Orders' section of your account."
        },
        {
            question: "What fabrics do you use?",
            answer: "We use premium quality fabrics such as Cotton, Silk, Chanderi, Georgette, and Velvet. Each product page lists the specific fabric content for that item."
        }
    ]

    return (
        <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
            <h1 className="text-3xl font-serif mb-2 text-center text-gray-900">Frequently Asked Questions</h1>
            <p className="text-gray-500 text-center mb-12">Find answers to common questions about your shopping experience.</p>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
                        <h3 className="font-bold text-gray-900 text-lg mb-2 flex items-start gap-3">
                            <span className="text-pink-600 block mt-1">Q.</span>
                            {faq.question}
                        </h3>
                        <p className="text-gray-600 ml-8 leading-relaxed">
                            {faq.answer}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center bg-gray-50 rounded-xl p-8">
                <h3 className="font-bold text-lg mb-2">Still have questions?</h3>
                <p className="text-gray-600 mb-4">We're here to help! Chat with us on WhatsApp or send us an email.</p>
                <a
                    href="https://wa.me/918143906891"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-colors"
                >
                    Chat on WhatsApp
                </a>
            </div>
        </div>
    )
}
