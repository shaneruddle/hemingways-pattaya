/**
 * import-drinks.js
 *
 * One-time migration: moves the Hemingways Pattaya drinks menu (Beers & Ciders,
 * House Wine, Spirits, Coffee & Tea, Soft Drinks & Shakes, Cocktails & Alcopops)
 * out of the `menu` collection (where they were rendering as photo-less food
 * cards) and into the dedicated `drinks` collection, which the live site
 * renders as a simple text list (see DigitalMenuDisplay.tsx's DRINKS_TAB).
 *
 * House Wine items are folded into the "Beers & Ciders" category with
 * drinkType "Wine", matching the Drinks Dashboard's fixed category list.
 *
 * Run from Cloud Shell:
 *   npm install firebase-admin
 *   node import-drinks.js
 *
 * Uses Application Default Credentials — Cloud Shell is already
 * authenticated as info@hemingwayspattaya.com so no service account needed.
 */

import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

if (!getApps().length) {
  initializeApp({ projectId: 'hemingways-pattaya-9a576' });
}

const db = getFirestore();

const DRINKS_CATEGORIES = [
  'Beers & Ciders',
  'House Wine',
  'Spirits',
  'Coffee & Tea',
  'Soft Drinks & Shakes',
  'Cocktails & Alcopops',
];

const drinks = [
  { name: 'ASAHI', category: 'Beers & Ciders', drinkType: 'Tap', description: 'Full Pint 140/ Half Pint 75', price: '140', order: 1, published: true },
  { name: 'HEINEKEN', category: 'Beers & Ciders', drinkType: 'Tap', description: 'Full Pint 140/ Half Pint 75', price: '140', order: 2, published: true },
  { name: 'BUDWEISER', category: 'Beers & Ciders', drinkType: 'Tap', description: 'Budweiser 0.5cl 130b .25cl 65', price: '130', order: 3, published: true },
  { name: 'TIGER', category: 'Beers & Ciders', drinkType: 'Tap', description: 'Pint 120/ Half Pint 65', price: '120', order: 4, published: true },
  { name: 'GUINNESS', category: 'Beers & Ciders', drinkType: 'Tap', description: 'Pint 260/ Half Pint 140', price: '260', order: 5, published: true },
  { name: 'HENRY WESTONS VINTAGE', category: 'Beers & Ciders', drinkType: 'Tap', description: 'Pint 220/ Half Pint 115', price: '220', order: 6, published: true },
  { name: 'STELLA ARTOIS', category: 'Beers & Ciders', drinkType: 'Tap', description: 'Pint 219/Half Pint 120', price: '219', order: 7, published: true },
  { name: 'BLACK & TAN', category: 'Beers & Ciders', drinkType: 'Tap', description: 'Pint 260/ Half Pint 140', price: '260', order: 8, published: true },
  { name: 'BLACK VELVET', category: 'Beers & Ciders', drinkType: 'Tap', description: 'Pint 260/ Half Pint 140', price: '260', order: 9, published: true },
  { name: 'SNAKEBITE', category: 'Beers & Ciders', drinkType: 'Tap', description: 'Pint 190/ Half Pint 100', price: '190', order: 10, published: true },
  { name: 'HEINEKEN (Bottle/Can)', category: 'Beers & Ciders', drinkType: 'Bottled', description: '', price: '99', order: 11, published: true },
  { name: 'HEINEKEN ZERO ALC', category: 'Beers & Ciders', drinkType: 'Bottled', description: '', price: '95', order: 12, published: true },
  { name: 'SAN MIGUEL LIGHT', category: 'Beers & Ciders', drinkType: 'Bottled', description: '', price: '99', order: 13, published: true },
  { name: 'SAN MIGUEL ZERO SUGAR', category: 'Beers & Ciders', drinkType: 'Bottled', description: '', price: '95', order: 14, published: true },
  { name: 'TIGER (Bottle/Can)', category: 'Beers & Ciders', drinkType: 'Bottled', description: '', price: '95', order: 15, published: true },
  { name: 'CHANG', category: 'Beers & Ciders', drinkType: 'Bottled', description: '', price: '90', order: 16, published: true },
  { name: 'SINGHA', category: 'Beers & Ciders', drinkType: 'Bottled', description: '', price: '90', order: 17, published: true },
  { name: 'MY BEER', category: 'Beers & Ciders', drinkType: 'Bottled', description: '', price: '90', order: 18, published: true },
  { name: 'LEO', category: 'Beers & Ciders', drinkType: 'Bottled', description: '', price: '90', order: 19, published: true },
  { name: 'BUDWEISER (Bottle/Can)', category: 'Beers & Ciders', drinkType: 'Bottled', description: '', price: '99', order: 20, published: true },
  { name: 'STOWFORD PRESS DARK BERRY', category: 'Beers & Ciders', drinkType: 'Bottled', description: 'A refreshing sparkling cider that is bursting with blackcurrant and blackberry richness', price: '170', order: 21, published: true },
  { name: 'KOPPARBERG STRAWBERRY & LIME', category: 'Beers & Ciders', drinkType: 'Bottled', description: 'Bottled Cider with a taste of fresh Strawberry and a hint of Lime', price: '280', order: 22, published: true },
  { name: 'STRONGBOW CIDER', category: 'Beers & Ciders', drinkType: 'Bottled', description: 'Dry Cider 440ml Can', price: '220', order: 23, published: true },
  { name: 'MAGNERS IRISH CIDER', category: 'Beers & Ciders', drinkType: 'Bottled', description: '500ml Can', price: '220', order: 24, published: true },
  { name: 'HOUSE RED', category: 'Beers & Ciders', drinkType: 'Wine', description: 'Glass 170 / Corkage 400', price: '170', order: 25, published: true },
  { name: 'HOUSE WHITE', category: 'Beers & Ciders', drinkType: 'Wine', description: 'Glass 170 / Corkage 400', price: '170', order: 26, published: true },
  { name: 'House Brandy', category: 'Spirits', drinkType: 'Brandy', description: '', price: '85', order: 1, published: true },
  { name: 'Hennessey VS', category: 'Spirits', drinkType: 'Brandy', description: '', price: '160', order: 2, published: true },
  { name: 'House Gin (Two Trees)', category: 'Spirits', drinkType: 'Gin', description: '160 Double', price: '85', order: 10, published: true },
  { name: 'Gordons', category: 'Spirits', drinkType: 'Gin', description: '', price: '120', order: 11, published: true },
  { name: 'Beefeater', category: 'Spirits', drinkType: 'Gin', description: '', price: '120', order: 12, published: true },
  { name: 'Beefeater 24', category: 'Spirits', drinkType: 'Gin', description: '', price: '120', order: 13, published: true },
  { name: 'Bombay Sapphire', category: 'Spirits', drinkType: 'Gin', description: '', price: '130', order: 14, published: true },
  { name: 'Sangsom', category: 'Spirits', drinkType: 'Rum', description: '80/150Dbl', price: '80', order: 20, published: true },
  { name: 'Bacardi', category: 'Spirits', drinkType: 'Rum', description: '', price: '120', order: 21, published: true },
  { name: 'Malibu', category: 'Spirits', drinkType: 'Rum', description: '', price: '120', order: 22, published: true },
  { name: 'Captain Morgan', category: 'Spirits', drinkType: 'Rum', description: '', price: '130', order: 23, published: true },
  { name: 'Bundaberg', category: 'Spirits', drinkType: 'Rum', description: 'All inc mixer (Exc Red Bull)', price: '150', order: 24, published: true },
  { name: 'House Vodka (Two Trees)', category: 'Spirits', drinkType: 'Vodka', description: '160 Double', price: '85', order: 30, published: true },
  { name: 'Absolut', category: 'Spirits', drinkType: 'Vodka', description: '', price: '130', order: 31, published: true },
  { name: 'Smirnoff', category: 'Spirits', drinkType: 'Vodka', description: '', price: '120', order: 32, published: true },
  { name: 'Stolichnaya', category: 'Spirits', drinkType: 'Vodka', description: '', price: '120', order: 33, published: true },
  { name: 'Grey Goose', category: 'Spirits', drinkType: 'Vodka', description: '', price: '150', order: 34, published: true },
  { name: 'Vodka Redbull', category: 'Spirits', drinkType: 'Vodka', description: '', price: '170', order: 35, published: true },
  { name: 'House Whiskey', category: 'Spirits', drinkType: 'Whisky & Whiskey', description: '120 Double', price: '70', order: 40, published: true },
  { name: 'JW Red Label', category: 'Spirits', drinkType: 'Whisky & Whiskey', description: '', price: '130', order: 41, published: true },
  { name: 'JW Black Label', category: 'Spirits', drinkType: 'Whisky & Whiskey', description: '', price: '160', order: 42, published: true },
  { name: 'Chivas Regal', category: 'Spirits', drinkType: 'Whisky & Whiskey', description: '', price: '150', order: 43, published: true },
  { name: 'Famous Grouse', category: 'Spirits', drinkType: 'Whisky & Whiskey', description: '', price: '150', order: 44, published: true },
  { name: 'Glenfiddich Single Malt', category: 'Spirits', drinkType: 'Whisky & Whiskey', description: '', price: '225', order: 45, published: true },
  { name: 'Grants', category: 'Spirits', drinkType: 'Whisky & Whiskey', description: '', price: '250', order: 46, published: true },
  { name: 'Jamesons', category: 'Spirits', drinkType: 'Whisky & Whiskey', description: '', price: '150', order: 47, published: true },
  { name: 'Canadian Club', category: 'Spirits', drinkType: 'Whisky & Whiskey', description: '', price: '140', order: 48, published: true },
  { name: 'Jim Beam', category: 'Spirits', drinkType: 'Whisky & Whiskey', description: '', price: '130', order: 49, published: true },
  { name: 'Jack Daniels', category: 'Spirits', drinkType: 'Whisky & Whiskey', description: '', price: '150', order: 50, published: true },
  { name: 'Southern Comfort', category: 'Spirits', drinkType: 'Whisky & Whiskey', description: '', price: '130', order: 51, published: true },
  { name: 'Wild Turkey', category: 'Spirits', drinkType: 'Whisky & Whiskey', description: '', price: '150', order: 52, published: true },
  { name: 'Sierra Silver Tequila', category: 'Spirits', drinkType: 'Tequila', description: '', price: '120', order: 60, published: true },
  { name: 'El Toro Tequila', category: 'Spirits', drinkType: 'Tequila', description: '', price: '60', order: 61, published: true },
  { name: 'Sambuca Shot', category: 'Spirits', drinkType: 'Liqueurs', description: '', price: '80', order: 70, published: true },
  { name: 'Black Sambuca', category: 'Spirits', drinkType: 'Liqueurs', description: '', price: '80', order: 71, published: true },
  { name: 'English Breakfast Tea', category: 'Coffee & Tea', drinkType: 'Tea', description: '', price: '65', order: 1, published: true },
  { name: 'Ceylon Tea', category: 'Coffee & Tea', drinkType: 'Tea', description: '', price: '65', order: 2, published: true },
  { name: 'Darjeeling Tea', category: 'Coffee & Tea', drinkType: 'Tea', description: '', price: '65', order: 3, published: true },
  { name: 'Earl Grey Tea', category: 'Coffee & Tea', drinkType: 'Tea', description: '', price: '65', order: 4, published: true },
  { name: 'Peach Tea', category: 'Coffee & Tea', drinkType: 'Tea', description: '', price: '65', order: 5, published: true },
  { name: 'Wild Berry Tea', category: 'Coffee & Tea', drinkType: 'Tea', description: '', price: '65', order: 6, published: true },
  { name: 'Peppermint Tea', category: 'Coffee & Tea', drinkType: 'Tea', description: '', price: '65', order: 7, published: true },
  { name: 'Chamomile Tea', category: 'Coffee & Tea', drinkType: 'Tea', description: '', price: '65', order: 8, published: true },
  { name: 'Cup of Hot Tea', category: 'Coffee & Tea', drinkType: 'Tea', description: '', price: '50', order: 9, published: true },
  { name: 'Iced Tea', category: 'Coffee & Tea', drinkType: 'Tea', description: '', price: '85', order: 10, published: true },
  { name: 'Extra Honey', category: 'Coffee & Tea', drinkType: 'Tea', description: '', price: '15', order: 11, published: true },
  { name: 'Regular Coffee', category: 'Coffee & Tea', drinkType: 'Coffee', description: '', price: '80', order: 20, published: true },
  { name: 'Espresso', category: 'Coffee & Tea', drinkType: 'Coffee', description: '', price: '60', order: 21, published: true },
  { name: 'Americano', category: 'Coffee & Tea', drinkType: 'Coffee', description: '', price: '80', order: 22, published: true },
  { name: 'Cappuccino', category: 'Coffee & Tea', drinkType: 'Coffee', description: '', price: '80', order: 23, published: true },
  { name: 'Mocha', category: 'Coffee & Tea', drinkType: 'Coffee', description: '', price: '80', order: 24, published: true },
  { name: 'Cafe Latte', category: 'Coffee & Tea', drinkType: 'Coffee', description: '', price: '80', order: 25, published: true },
  { name: 'Latte Macchiato', category: 'Coffee & Tea', drinkType: 'Coffee', description: 'Tall Espresso & Steamed Milk', price: '80', order: 26, published: true },
  { name: 'Macchiato', category: 'Coffee & Tea', drinkType: 'Coffee', description: 'Espresso with Dash of Steamed Milk', price: '70', order: 27, published: true },
  { name: 'Coffee Crema', category: 'Coffee & Tea', drinkType: 'Coffee', description: 'Coffee with Foam', price: '80', order: 28, published: true },
  { name: 'Flat White', category: 'Coffee & Tea', drinkType: 'Coffee', description: 'Micro-Foamed Milk Poured over Espresso', price: '80', order: 29, published: true },
  { name: 'Lungo', category: 'Coffee & Tea', drinkType: 'Coffee', description: 'Espresso Made with more Water', price: '80', order: 30, published: true },
  { name: 'Ristretto', category: 'Coffee & Tea', drinkType: 'Coffee', description: 'Espresso made with less Water - Extra Kick!', price: '80', order: 31, published: true },
  { name: 'Iced Coffee', category: 'Coffee & Tea', drinkType: 'Coffee', description: '', price: '95', order: 32, published: true },
  { name: 'Iced Latte', category: 'Coffee & Tea', drinkType: 'Coffee', description: '', price: '95', order: 33, published: true },
  { name: 'Iced Cappuccino', category: 'Coffee & Tea', drinkType: 'Coffee', description: '', price: '95', order: 34, published: true },
  { name: 'Van Houten Hot Chocolate', category: 'Coffee & Tea', drinkType: 'Coffee', description: '', price: '75', order: 35, published: true },
  { name: 'Glass of Milk', category: 'Coffee & Tea', drinkType: 'Coffee', description: '', price: '70', order: 36, published: true },
  { name: 'Soda / Tonic Water', category: 'Soft Drinks & Shakes', drinkType: 'Water', description: '', price: '50', order: 1, published: true },
  { name: 'Bottled Water', category: 'Soft Drinks & Shakes', drinkType: 'Water', description: '', price: '50', order: 2, published: true },
  { name: 'Banana Shake', category: 'Soft Drinks & Shakes', drinkType: 'Shake', description: '', price: '120', order: 10, published: true },
  { name: 'Lemon Shake', category: 'Soft Drinks & Shakes', drinkType: 'Shake', description: '', price: '120', order: 11, published: true },
  { name: 'Watermelon Shake', category: 'Soft Drinks & Shakes', drinkType: 'Shake', description: '', price: '120', order: 12, published: true },
  { name: 'Pineapple Shake', category: 'Soft Drinks & Shakes', drinkType: 'Shake', description: '', price: '120', order: 13, published: true },
  { name: 'Mixed Shake', category: 'Soft Drinks & Shakes', drinkType: 'Shake', description: 'Mix of 2-3 Shakes', price: '140', order: 14, published: true },
  { name: 'Sprite', category: 'Soft Drinks & Shakes', drinkType: 'Soft Drink', description: '', price: '60', order: 20, published: true },
  { name: 'Fanta', category: 'Soft Drinks & Shakes', drinkType: 'Soft Drink', description: '', price: '60', order: 21, published: true },
  { name: 'Coke', category: 'Soft Drinks & Shakes', drinkType: 'Soft Drink', description: '', price: '60', order: 22, published: true },
  { name: 'Diet Coke/Coke Zero', category: 'Soft Drinks & Shakes', drinkType: 'Soft Drink', description: '', price: '60', order: 23, published: true },
  { name: 'Schweppes Lime', category: 'Soft Drinks & Shakes', drinkType: 'Soft Drink', description: '', price: '60', order: 24, published: true },
  { name: 'Syrup & Soda', category: 'Soft Drinks & Shakes', drinkType: 'Soft Drink', description: '', price: '60', order: 25, published: true },
  { name: 'Lipo / Red Bull', category: 'Soft Drinks & Shakes', drinkType: 'Soft Drink', description: '', price: '50', order: 26, published: true },
  { name: 'Lipton Ice Tea', category: 'Soft Drinks & Shakes', drinkType: 'Soft Drink', description: '', price: '50', order: 27, published: true },
  { name: 'Apple Juice', category: 'Soft Drinks & Shakes', drinkType: 'Soft Drink', description: '', price: '70', order: 28, published: true },
  { name: 'Orange Juice', category: 'Soft Drinks & Shakes', drinkType: 'Soft Drink', description: '', price: '70', order: 29, published: true },
  { name: 'Lemon Juice', category: 'Soft Drinks & Shakes', drinkType: 'Soft Drink', description: '', price: '70', order: 30, published: true },
  { name: 'Pineapple Juice', category: 'Soft Drinks & Shakes', drinkType: 'Soft Drink', description: '', price: '70', order: 31, published: true },
  { name: 'Tomato Juice', category: 'Soft Drinks & Shakes', drinkType: 'Soft Drink', description: '', price: '70', order: 32, published: true },
  { name: 'Cranberry Juice', category: 'Soft Drinks & Shakes', drinkType: 'Soft Drink', description: '', price: '85', order: 33, published: true },
  { name: 'Sex on the Beach', category: 'Cocktails & Alcopops', drinkType: 'Cocktail', description: '', price: '185', order: 1, published: true },
  { name: 'Long Island', category: 'Cocktails & Alcopops', drinkType: 'Cocktail', description: '', price: '195', order: 2, published: true },
  { name: 'White Russian', category: 'Cocktails & Alcopops', drinkType: 'Cocktail', description: '', price: '195', order: 3, published: true },
  { name: 'Margarita', category: 'Cocktails & Alcopops', drinkType: 'Cocktail', description: '', price: '185', order: 4, published: true },
  { name: 'Pina Colada', category: 'Cocktails & Alcopops', drinkType: 'Cocktail', description: '', price: '185', order: 5, published: true },
  { name: 'Bloody Mary', category: 'Cocktails & Alcopops', drinkType: 'Cocktail', description: '', price: '135', order: 6, published: true },
  { name: 'B52', category: 'Cocktails & Alcopops', drinkType: 'Cocktail', description: '', price: '135', order: 7, published: true },
  { name: 'Mojito', category: 'Cocktails & Alcopops', drinkType: 'Cocktail', description: '', price: '185', order: 8, published: true },
  { name: 'Mai Tai', category: 'Cocktails & Alcopops', drinkType: 'Cocktail', description: '', price: '185', order: 9, published: true },
  { name: 'Purple Haze', category: 'Cocktails & Alcopops', drinkType: 'Cocktail', description: '', price: '185', order: 10, published: true },
  { name: 'Black Russian', category: 'Cocktails & Alcopops', drinkType: 'Cocktail', description: '', price: '195', order: 11, published: true },
  { name: 'Blowjob', category: 'Cocktails & Alcopops', drinkType: 'Cocktail', description: '', price: '135', order: 12, published: true },
  { name: 'Blue Margarita', category: 'Cocktails & Alcopops', drinkType: 'Cocktail', description: '', price: '185', order: 13, published: true },
  { name: 'Blue Hawaii', category: 'Cocktails & Alcopops', drinkType: 'Cocktail', description: '', price: '185', order: 14, published: true },
  { name: 'Expresso Martini', category: 'Cocktails & Alcopops', drinkType: 'Cocktail', description: '', price: '185', order: 15, published: true },
  { name: 'Gin Fizz', category: 'Cocktails & Alcopops', drinkType: 'Cocktail', description: '', price: '185', order: 16, published: true },
  { name: 'Jager Bomb', category: 'Cocktails & Alcopops', drinkType: 'Cocktail', description: '', price: '185', order: 17, published: true },
  { name: 'Martini Dry', category: 'Cocktails & Alcopops', drinkType: 'Cocktail', description: '', price: '175', order: 18, published: true },
  { name: 'Slippery Nipple', category: 'Cocktails & Alcopops', drinkType: 'Cocktail', description: '', price: '185', order: 19, published: true },
  { name: 'Dry Martini Cocktail', category: 'Cocktails & Alcopops', drinkType: 'Cocktail', description: '', price: '185', order: 20, published: true },
  { name: 'Tequila Sunrise', category: 'Cocktails & Alcopops', drinkType: 'Cocktail', description: '', price: '185', order: 21, published: true },
  { name: 'SMIRNOFF Ice Original', category: 'Cocktails & Alcopops', drinkType: 'Alcopop', description: 'Crisp, Taste, Bubbly Finish, A Natural Lemon Line Flavour', price: '130', order: 30, published: true },
  { name: 'SPY Classic', category: 'Cocktails & Alcopops', drinkType: 'Alcopop', description: 'Wine Cooler with a fresh and fruity taste', price: '90', order: 31, published: true },
  { name: 'SPY Red', category: 'Cocktails & Alcopops', drinkType: 'Alcopop', description: 'Wine Cooler with a fresh and fruity taste', price: '90', order: 32, published: true },
];

async function deleteOldMenuDrinks() {
  console.log('\nDeleting old drinks-category items from the `menu` collection...\n');
  let deleted = 0;
  for (const cat of DRINKS_CATEGORIES) {
    const snap = await db.collection('menu').where('category', '==', cat).get();
    if (snap.empty) continue;
    const batch = db.batch();
    snap.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
    deleted += snap.size;
    console.log(`  ✓  Deleted ${snap.size} "${cat}" items from menu`);
  }
  console.log(`\n  Total deleted from menu: ${deleted}\n`);
}

async function importDrinks() {
  const existing = await db.collection('drinks').limit(1).get();
  if (!existing.empty) {
    console.log('⚠️  The drinks collection already has documents.');
    console.log('    To avoid duplicates, exiting without importing.');
    console.log('    Delete the collection first if you want a fresh import.\n');
    process.exit(0);
  }

  console.log(`Importing ${drinks.length} drinks into 'drinks' collection...\n`);

  const BATCH_SIZE = 400;
  let imported = 0;

  for (let i = 0; i < drinks.length; i += BATCH_SIZE) {
    const chunk = drinks.slice(i, i + BATCH_SIZE);
    const batch = db.batch();
    chunk.forEach(drink => {
      const ref = db.collection('drinks').doc();
      batch.set(ref, {
        ...drink,
        createdAt: FieldValue.serverTimestamp(),
      });
    });
    await batch.commit();
    imported += chunk.length;
    console.log(`  ✓  Imported ${imported}/${drinks.length}`);
  }

  console.log(`\n✅  Done! ${drinks.length} drinks imported.`);
  console.log(`    Check the admin at /dashboard/drinks to review.\n`);
}

async function run() {
  await deleteOldMenuDrinks();
  await importDrinks();
}

run().catch(err => {
  console.error('❌  Migration failed:', err.message);
  process.exit(1);
});
