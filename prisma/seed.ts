
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // 1. Create Admin User
    const adminEmail = 'admin@aleesa.com'
    const adminPassword = 'admin123'

    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail }
    })

    if (!existingAdmin) {
        await prisma.user.create({
            data: {
                email: adminEmail,
                password: adminPassword,
                firstName: 'Admin',
                lastName: 'User',
                role: 'ADMIN'
            }
        })
        console.log('✅ Created Admin User: admin@aleesa.com / admin123')
    } else {
        console.log('ℹ️ Admin User already exists')
    }

    // 2. Seed Products with Real Aleesa Categories
    const sampleProducts = [
        // SUITS
        {
            name: "Purple Cotton Floral Printed Three Piece Suit",
            slug: "purple-cotton-floral-suit",
            price: 4999,
            category: "Suits",
            description: "Elegant purple cotton suit with floral prints, perfect for festive occasions",
            images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop"],
            fabric: "Cotton",
            isFeatured: true
        },
        {
            name: "Emerald Green Chanderi Suit Set",
            slug: "emerald-green-chanderi-suit",
            price: 6499,
            category: "Suits",
            description: "Luxurious chanderi fabric suit with intricate embroidery",
            images: ["https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop"],
            fabric: "Chanderi"
        },

        // SAREES
        {
            name: "Golden Banarasi Silk Saree",
            slug: "golden-banarasi-saree",
            price: 12999,
            category: "Sarees",
            description: "Traditional Banarasi silk saree with golden zari work",
            images: ["https://images.unsplash.com/photo-1610030469985-3750e0ff4e8b?w=600&h=800&fit=crop"],
            fabric: "Silk",
            isFeatured: true
        },
        {
            name: "Royal Blue Kanjivaram Saree",
            slug: "royal-blue-kanjivaram-saree",
            price: 15999,
            category: "Sarees",
            description: "Premium Kanjivaram silk saree with temple border",
            images: ["https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&h=800&fit=crop"],
            fabric: "Silk"
        },

        // LEHENGA SETS
        {
            name: "Maroon Velvet Bridal Lehenga Set",
            slug: "maroon-velvet-lehenga",
            price: 18999,
            category: "Lehenga Sets",
            description: "Stunning velvet lehenga with heavy embellishments",
            images: ["https://images.unsplash.com/photo-1594897030264-ab7d87efc473?w=600&h=800&fit=crop"],
            fabric: "Velvet",
            isFeatured: true
        },
        {
            name: "Pink Georgette Lehenga Choli",
            slug: "pink-georgette-lehenga",
            price: 14999,
            category: "Lehenga Sets",
            description: "Elegant georgette lehenga with sequin work",
            images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop"],
            fabric: "Georgette"
        },

        // DRESSES
        {
            name: "Peach Anarkali Gown",
            slug: "peach-anarkali-gown",
            price: 7999,
            category: "Dresses",
            description: "Floor-length Anarkali with mirror work",
            images: ["https://images.unsplash.com/photo-1583391733981-4313f2e05e8e?w=600&h=800&fit=crop"],
            fabric: "Georgette"
        },

        // BRIDALS
        {
            name: "Red Bridal Lehenga with Dupatta",
            slug: "red-bridal-lehenga",
            price: 45999,
            category: "Bridals",
            description: "Exquisite bridal lehenga with heavy zardozi work",
            images: ["https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&h=800&fit=crop"],
            fabric: "Silk",
            isFeatured: true
        },

        // WEDDING EDIT
        {
            name: "Ivory Sharara Set",
            slug: "ivory-sharara-set",
            price: 16999,
            category: "Wedding Edit",
            description: "Elegant sharara set perfect for wedding functions",
            images: ["https://images.unsplash.com/photo-1598439210625-5067c578f3f6?w=600&h=800&fit=crop"],
            fabric: "Silk"
        },

        // FORMALS
        {
            name: "Navy Blue Formal Kurta Set",
            slug: "navy-formal-kurta",
            price: 5499,
            category: "Formals",
            description: "Sophisticated kurta set for formal occasions",
            images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop"],
            fabric: "Cotton Silk"
        },

        // LUXURY PRET
        {
            name: "Designer Embroidered Jacket Set",
            slug: "designer-jacket-set",
            price: 22999,
            category: "Luxury Pret",
            description: "Contemporary designer wear with fusion styling",
            images: ["https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&h=800&fit=crop"],
            fabric: "Silk Blend",
            isFeatured: true
        },

        // NEW ARRIVALS
        {
            name: "Mint Green Palazzo Suit",
            slug: "mint-palazzo-suit",
            price: 5999,
            category: "New Arrivals",
            description: "Fresh arrival - trendy palazzo suit set",
            images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop"],
            fabric: "Rayon"
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

    console.log('\n🎉 Database seeded successfully!')
    console.log('📦 Total Products: 12')
    console.log('🏷️  Categories: Suits, Sarees, Lehenga Sets, Dresses, Bridals, Wedding Edit, Formals, Luxury Pret, New Arrivals')
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
