// seeders/seed.js
const bcrypt = require('bcryptjs');
const {sequelize} = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

// Seed data
const seedData = async () => {
  try {
    await db.sync({ force: true }); // This will recreate all tables! Use with caution.
    console.log('Database synced and all tables recreated');

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    await User.create({
      name: 'Admin User',
      email: 'admin@soleil.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    // Create categories
    const categories = await Category.bulkCreate([
      {
        name: 'Necklaces',
        description: 'Beautiful necklaces for every occasion',
        imageUrl: '/images/categories/necklaces.jpg'
      },
      {
        name: 'Rings',
        description: 'Elegant rings to accessorize your outfit',
        imageUrl: '/images/categories/rings.jpg'
      },
      {
        name: 'Earrings',
        description: 'Statement earrings that elevate your look',
        imageUrl: '/images/categories/earrings.jpg'
      },
      {
        name: 'Bracelets',
        description: 'Stylish bracelets for any wrist',
        imageUrl: '/images/categories/bracelets.jpg'
      }
    ]);
    
    // Create products
    const necklaceCategory = categories[0];
    const ringCategory = categories[1];
    const earringCategory = categories[2];
    const braceletCategory = categories[3];
    
    await Product.bulkCreate([
      {
        name: 'Gold Chain Necklace',
        description: 'An elegant gold chain necklace that goes with any outfit',
        price: 129.99,
        image: '/images/products/gold-chain.jpg',
        stockQuantity: 25,
        featured: true,
        categoryId: necklaceCategory.id
      },
      {
        name: 'Silver Pendant',
        description: 'A beautiful silver pendant with crystal accents',
        price: 89.99,
        image: '/images/products/silver-pendant.jpg',
        stockQuantity: 15,
        featured: true,
        categoryId: necklaceCategory.id
      },
      {
        name: 'Diamond Ring',
        description: 'A stunning diamond ring for special occasions',
        price: 999.99,
        image: '/images/products/diamond-ring.jpg',
        stockQuantity: 5,
        featured: true,
        categoryId: ringCategory.id
      },
      {
        name: 'Gold Band',
        description: 'A classic gold band for everyday wear',
        price: 199.99,
        image: '/images/products/gold-band.jpg',
        stockQuantity: 30,
        featured: false,
        categoryId: ringCategory.id
      },
      {
        name: 'Crystal Earrings',
        description: 'Sparkling crystal earrings for a night out',
        price: 149.99,
        image: '/images/products/crystal-earrings.jpg',
        stockQuantity: 20,
        featured: true,
        categoryId: earringCategory.id
      },
      {
        name: 'Pearl Studs',
        description: 'Classic pearl stud earrings for any occasion',
        price: 79.99,
        image: '/images/products/pearl-studs.jpg',
        stockQuantity: 40,
        featured: false,
        categoryId: earringCategory.id
      },
      {
        name: 'Gold Bangle',
        description: 'A stylish gold bangle to complement your outfit',
        price: 179.99,
        image: '/images/products/gold-bangle.jpg',
        stockQuantity: 15,
        featured: true,
        categoryId: braceletCategory.id
      },
      {
        name: 'Charm Bracelet',
        description: 'A customizable charm bracelet with initial charms',
        price: 119.99,
        image: '/images/products/charm-bracelet.jpg',
        stockQuantity: 25,
        featured: false,
        categoryId: braceletCategory.id
      }
    ]);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedData();