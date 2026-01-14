export default function PrivacyPolicyPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
            <h1 className="text-3xl font-serif mb-8 text-gray-900">Privacy Policy</h1>

            <div className="prose prose-pink max-w-none text-gray-600 space-y-8">
                <p className="text-sm text-gray-500">Last Updated: January 2026</p>

                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
                    <p>
                        We collect information you provide directly to us when you create an account, place an order, or contact customer support. This includes your name, email address, phone number, shipping address, and payment information.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
                    <p>We use the information we collect to:</p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li>Process your orders and payments.</li>
                        <li>Send you order confirmations and shipping updates.</li>
                        <li>Improve our website and customer service.</li>
                        <li>Send you marketing communications (if you have opted in).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">3. Information Sharing</h2>
                    <p>
                        We do not sell your personal information. We may share your information with trusted third-party service providers who assist us in operating our website, conducting our business, or serving our users (e.g., payment processors, shipping partners), so long as those parties agree to keep this information confidential.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">4. Security</h2>
                    <p>
                        We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">5. Contact Us</h2>
                    <p>
                        If there are any questions regarding this privacy policy, you may contact us at support@aleesa.com.
                    </p>
                </section>
            </div>
        </div>
    )
}
