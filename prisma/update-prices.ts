import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('💰 Updating prices for all dresses to ₹2,995...')

    const result = await prisma.product.updateMany({
        where: {
            category: "Dresses"
        },
        data: {
            price: 2995
        }
    })

    console.log(`✅ Updated ${result.count} products`)
    console.log('   New Price: ₹2,995')

    // Show updated products
    const products = await prisma.product.findMany({
        where: { category: "Dresses" },
        select: { name: true, price: true }
    })

    console.log('\n📦 Updated Products:')
    products.forEach(p => {
        console.log(`   - ${p.name}: ₹${p.price}`)
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
