import { seedDefaultPages } from '../lib/cms-seed';

async function main() {
  try {
    console.log('Seeding default pages...');
    const pages = await seedDefaultPages();
    console.log('✅ Successfully seeded pages:', pages);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding pages:', error);
    process.exit(1);
  }
}

main();

