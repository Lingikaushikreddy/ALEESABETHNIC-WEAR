import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🗑️  Deleting all products...')

    // Delete in order due to foreign key constraints
    await prisma.review.deleteMany({})
    console.log('✅ Deleted all reviews')

    await prisma.orderItem.deleteMany({})
    console.log('✅ Deleted all order items')

    await prisma.variantSize.deleteMany({})
    console.log('✅ Deleted all sizes')

    await prisma.productVariant.deleteMany({})
    console.log('✅ Deleted all variants')

    await prisma.product.deleteMany({})
    console.log('✅ Deleted all products')

    console.log('\n🎉 All inventory cleared successfully!')
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
