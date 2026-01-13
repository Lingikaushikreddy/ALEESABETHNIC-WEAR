import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('📦 Adding White Cotton Dress...')

    const product = await prisma.product.create({
        data: {
            name: "Cream White Cotton Dress with Lace Embroidery",
            slug: "cream-white-cotton-dress-lace-embroidery",
            price: 5999,
            category: "Dresses",
            description: "Elegant cream white cotton dress featuring delicate lace and embroidery work. Comes with Kota doria dupatta and cotton lining. Perfect for festive occasions and celebrations.",
            fabric: "Cotton with Laces and Embroidery",
            images: [
                "/products/white-cotton-dress-1.jpg",
                "/products/white-cotton-dress-2.jpg",
                "/products/white-cotton-dress-3.jpg"
            ],
            isFeatured: true,
            variants: {
                create: [
                    {
                        color: "Cream White",
                        images: [
                            "/products/white-cotton-dress-1.jpg",
                            "/products/white-cotton-dress-2.jpg",
                            "/products/white-cotton-dress-3.jpg"
                        ],
                        sizes: {
                            create: [
                                { size: "38", stock: 5 },
                                { size: "40", stock: 5 },
                                { size: "42", stock: 5 },
                                { size: "44", stock: 5 }
                            ]
                        }
                    }
                ]
            }
        }
    })

    console.log('✅ Product added successfully!')
    console.log(`   Name: ${product.name}`)
    console.log(`   Category: ${product.category}`)
    console.log(`   Price: ₹${product.price}`)
    console.log(`   Sizes: 38, 40, 42, 44`)
    console.log(`   Color: Cream White`)
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
