const fs = require('fs');
const path = require('path');

async function seed() {
  console.log('🚀 Starting Elessa Strapi Database Seeder...');
  const seedDataPath = path.join(__dirname, '../data/seed-data.json');
  if (!fs.existsSync(seedDataPath)) {
    console.error('❌ seed-data.json not found!');
    process.exit(1);
  }

  const raw = fs.readFileSync(seedDataPath, 'utf8');
  const data = JSON.parse(raw);

  console.log(`📦 Found ${data.categories.length} categories, ${data.products.length} products.`);

  try {
    // If running within Strapi context (strapi.entityService exists)
    if (typeof strapi !== 'undefined') {
      for (const cat of data.categories) {
        const existing = await strapi.entityService.findMany('api::category.category', {
          filters: { slug: cat.slug },
        });
        if (!existing || existing.length === 0) {
          await strapi.entityService.create('api::category.category', { data: cat });
          console.log(` Created category: ${cat.name}`);
        }
      }

      for (const prod of data.products) {
        const existing = await strapi.entityService.findMany('api::product.product', {
          filters: { slug: prod.slug },
        });
        if (!existing || existing.length === 0) {
          await strapi.entityService.create('api::product.product', { data: prod });
          console.log(` Created product: ${prod.name}`);
        }
      }

      // Configure Public Role permissions for read & inquiry write
      const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' },
      });

      if (publicRole) {
        console.log('🔓 Setting public API permissions for frontend access...');
        const permissionsToEnable = [
          'api::category.category.find',
          'api::category.category.findOne',
          'api::product.product.find',
          'api::product.product.findOne',
          'api::project.project.find',
          'api::project.project.findOne',
          'api::article.article.find',
          'api::article.article.findOne',
          'api::service.service.find',
          'api::service.service.findOne',
          'api::faq.faq.find',
          'api::faq.faq.findOne',
          'api::global-setting.global-setting.find',
          'api::inquiry.inquiry.create',
        ];

        for (const action of permissionsToEnable) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action,
              role: publicRole.id,
            },
          }).catch(() => {});
        }
      }

      console.log('✅ Seeding completed successfully!');
    } else {
      console.log('💡 Note: To run within Strapi bootstrap, execute: npm run strapi console, or use strapi bootstrap.');
      console.log('✅ Seed data is validated and ready in strapi-backend/data/seed-data.json');
    }
  } catch (err) {
    console.error('Seeding error:', err);
  }
}

seed();
