
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getSession()

    if (!session || session.role !== 'ADMIN') {
        redirect('/admin/login')
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r hidden md:block">
                <div className="p-6">
                    <h1 className="text-xl font-bold text-pink-600">Aleesa Admin</h1>
                </div>
                <nav className="px-4 space-y-2">
                    <Link href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-md font-medium">
                        Inventory
                    </Link>
                    <Link href="/admin/orders" className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-md font-medium">
                        Orders
                    </Link>
                    <form action="/api/auth/logout" method="POST">
                        {/* Simple logout trigger for now, effectively we just clear cookie */}
                        <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-md font-medium">
                            Logout
                        </button>
                    </form>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
                <header className="bg-white border-b h-16 flex items-center px-8 justify-between">
                    <h2 className="font-semibold text-gray-800">Dashboard</h2>
                    <div className="text-sm text-gray-500">
                        Logged in as {session.email as string}
                    </div>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
