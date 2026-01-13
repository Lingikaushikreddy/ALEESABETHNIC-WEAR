import { getSession } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import AddressManager from '@/components/AddressManager'

export default async function AddressesPage() {
    const session = await getSession()

    if (!session) {
        redirect('/login?redirect=/account/addresses')
    }

    const addresses = await prisma.address.findMany({
        where: { userId: session.userId as string },
        orderBy: { isDefault: 'desc' } // Default logic: default first or created desc
    })

    return (
        <div className="min-h-screen bg-white py-12 md:py-20">
            <div className="max-w-3xl mx-auto px-4">
                <div className="mb-8">
                    <Link href="/account" className="text-sm text-gray-500 hover:text-primary flex items-center gap-1 mb-4">
                        <ArrowLeft size={14} /> Back to Account
                    </Link>
                    <h1 className="text-3xl font-heading font-bold">Manage Addresses</h1>
                </div>

                <AddressManager initialAddresses={addresses} />
            </div>
        </div>
    )
}
