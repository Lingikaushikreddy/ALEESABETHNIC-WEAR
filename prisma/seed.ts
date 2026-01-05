
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // 1. Create Admin User
    const adminEmail = 'admin@aleesa.com'
    // In a real app, hash this password! For this demo/non-tech user we might store it directly or hash it simple.
    // We'll use a simple indicator or placeholder hash. 
    // NOTE: In production, use bcrypt/argon2. For this speed-run, we will implement auth check later.
    const adminPassword = 'admin123'

    // Check if admin exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail }
    })

    if (!existingAdmin) {
        await prisma.user.create({
            data: {
                email: adminEmail,
                password: adminPassword, // Will implement hashing in auth route
                firstName: 'Admin',
                lastName: 'User',
                role: 'ADMIN'
            }
        })
        console.log('✅ Created Admin User: admin@aleesa.com / admin123')
    } else {
        console.log('ℹ️ Admin User already exists')
    }

    // 2. Clear & Seed Categories (actually we don't have a Category model in new schema, we use string field)
    // But we can create some sample products to act as catalogue.

    const sampleProducts = [
        {
            name: "Purple Cotton Floral Printed Three Piece Set",
            slug: "purple-cotton-floral-set",
            price: 4999,
            category: "Suits",
            images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop"],
            fabric: "Cotton"
        },
        {
            name: "Golden Banarasi Silk Saree",
            slug: "golden-banarasi-saree",
            price: 12999,
            category: "Sarees",
            images: ["https://images.unsplash.com/photo-1610030469985-3750e0ff4e8b?w=600&h=800&fit=crop"],
            fabric: "Silk"
        },
        {
            name: "Maroon Velvet Lehenga Set",
            slug: "maroon-velvet-lehenga",
            price: 18999,
            category: "Lehenga Sets",
            images: ["https://images.unsplash.com/photo-1594897030264-ab7d87efc473?w=600&h=800&fit=crop"],
            fabric: "Velvet",
            isFeatured: true
        }
    ]

    for (const p of sampleProducts) {
        const existing = await prisma.product.findUnique({ where: { slug: p.slug } })
        if (!existing) {
            await prisma.product.create({
                data: {
                    ...p,
                    variants: {
                        create: [
                            {
                                color: "Standard",
                                images: p.images,
                                sizes: {
                                    create: [
                                        { size: "S", stock: 10 },
                                        { size: "M", stock: 15 },
                                        { size: "L", stock: 12 },
                                        { size: "XL", stock: 8 }
                                    ]
                                }
                            }
                        ]
                    }
                }
            })
            console.log(`✅ Created Product: ${p.name}`)
        }
    }
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
