import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <WishlistProvider>
                <CartProvider>
                    <Header />
                    <main className="flex-1">
                        {children}
                    </main>
                </CartProvider>
            </WishlistProvider>
            <Footer />
        </div>
    )
}
