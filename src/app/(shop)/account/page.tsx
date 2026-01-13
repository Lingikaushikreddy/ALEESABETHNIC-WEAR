import prisma from '@/lib/prisma'

export default async function AccountPage() {
    const session = await getSession()

    if (!session) {
        redirect('/login?redirect=/account')
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId }
    })

    const displayName = user?.firstName || user?.email?.split('@')[0] || 'User'
    const initial = displayName.charAt(0).toUpperCase()

    return (
        <div className="min-h-screen bg-gray-50 py-12 md:py-20">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
                    <div className="p-8 border-b border-gray-100 flex items-center gap-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-2xl">
                            {/* Initials */}
                            {initial}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Welcome, {displayName}</h1>
                            <p className="text-gray-500">{user?.email}</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        <Link href="/orders" className="p-6 hover:bg-gray-50 transition-colors group">
                            <div className="flex items-center justify-between mb-4">
                                <Package className="w-8 h-8 text-blue-500" />
                                <ChevronRight className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                            </div>
                            <h3 className="font-bold text-lg mb-1">Orders</h3>
                            <p className="text-sm text-gray-500">Track, return, or buy things again</p>
                        </Link>

                        <Link href="/account/addresses" className="p-6 hover:bg-gray-50 transition-colors group">
                            <div className="flex items-center justify-between mb-4">
                                <MapPin className="w-8 h-8 text-green-500" />
                                <ChevronRight className="text-gray-300 group-hover:text-green-500 transition-colors" />
                            </div>
                            <h3 className="font-bold text-lg mb-1">Addresses</h3>
                            <p className="text-sm text-gray-500">Manage shipping addresses</p>
                        </Link>

                        {/* Admin Link - Only visible to Admins */}
                        {user?.role === 'ADMIN' && (
                            <Link href="/admin" className="p-6 hover:bg-gray-50 transition-colors group bg-gray-50/50">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-8 h-8 bg-black text-white rounded flex items-center justify-center font-bold text-xs">A</div>
                                    <ChevronRight className="text-gray-300 group-hover:text-black transition-colors" />
                                </div>
                                <h3 className="font-bold text-lg mb-1">Admin Panel</h3>
                                <p className="text-sm text-gray-500">Manage orders & inventory</p>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="text-center">
                    <form action="/auth/logout" method="POST">
                        <button className="text-red-500 font-bold hover:underline flex items-center justify-center gap-2 mx-auto">
                            <LogOut size={16} /> Sign Out
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
