import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileNav from '@/components/MobileNav'
import BackToTop from '@/components/BackToTop'
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
                    <main className="flex-1 pb-16 md:pb-0">
                        {children}
                    </main>
                    <MobileNav />
                    <BackToTop />
                </CartProvider>
            </WishlistProvider>
            <Footer />
        </div>
    )
}
