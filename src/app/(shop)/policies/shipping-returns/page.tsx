export default function ShippingReturnsPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
            <h1 className="text-3xl font-serif mb-8 text-gray-900">Shipping & Returns</h1>

            <div className="prose prose-pink max-w-none text-gray-600 space-y-8">
                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">Shipping Policy</h2>
                    <p className="mb-4">
                        At Aleesa Ethnic Wear, we strive to deliver your orders as quickly as possible. We currently ship to all major cities and towns across India.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Processing Time:</strong> Orders are processed within 24-48 hours of confirmation.</li>
                        <li><strong>Delivery Time:</strong> Standard delivery takes 3-7 business days depending on your location.</li>
                        <li><strong>Shipping Charges:</strong> Free shipping on all prepaid orders. A nominal fee of ₹99 applies to Cash on Delivery (COD) orders below ₹4999.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">Return & Exchange Policy</h2>
                    <p className="mb-4">
                        We want you to love your purchase! If you are not completely satisfied, we offer an easy return and exchange policy.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Eligibility:</strong> Items must be unused, unwashed, and with original tags intact. Returns must be initiated within 7 days of delivery.</li>
                        <li><strong>Process:</strong> Go to your Order History, select the item, and click "Return / Exchange" to start the process via WhatsApp.</li>
                        <li><strong>Refunds:</strong> Refunds are processed to the original payment method within 5-7 business days after we receive the returned item.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">Damaged or Defective Items</h2>
                    <p>
                        In the rare case that you receive a damaged or incorrect item, please notify us immediately within 24 hours of delivery. We will arrange for a free replacement or a full refund.
                    </p>
                </section>
            </div>
        </div>
    )
}
