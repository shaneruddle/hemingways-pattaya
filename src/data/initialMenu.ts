import { MenuItem } from '../types';

// Real Hemingways Pattaya menu, scraped from the live site (hemingwayspattaya.com/menu)
// on 2026-07-22. Covers all food categories, the wine list, Twining's Tea, and the full
// separate Drinks Menu (beers/ciders, spirits, coffee & tea, soft drinks & shakes,
// cocktails & alcopops). Prices are in Thai Baht as shown on the live site.
export const INITIAL_MENU_DATA: Partial<MenuItem>[] = [
  {
    name: 'Fresh Fruit Salad With Yoghurt & Honey',
    description: 'Seasonal fresh fruit with yoghurt & honey',
    category: 'Breakfast',
    price: '179',
    published: true,
    order: 1
  },
  {
    name: 'Fruit & Nut Muesli With Milk And Honey',
    description: '',
    category: 'Breakfast',
    price: '139',
    published: true,
    order: 2
  },
  {
    name: 'Small Breakfast Set',
    description: '1 egg, 1 bacon, 1 fatboy breakfast sausage, baked beans, fried potatoes, 1 piece of toast, butter marmalade, your choice of tea or coffee, small orange juice. replace white with brown bread 10b available until 2pm',
    category: 'Breakfast',
    price: '199',
    published: true,
    order: 3
  },
  {
    name: 'Breakfast Pizza Special',
    description: 'Oval pizza , smaller than our regular pizzas so just right for breakfast, with breakfast sausage, bacon, egg, tomato, spring onion, mozzarella, with tea or coffee',
    category: 'Breakfast',
    price: '209',
    published: true,
    order: 4
  },
  {
    name: 'Large Breakfast Set',
    description: '2 eggs, (any style), 2 bacon, 1 fatboy breakfast sausage, baked beans, grilled tomato, fried potatoes, 2 pieces of toasted bloomer, butter, marmalade, your choice of tea or coffee, or orange juice. replace white with brown bread 20b available until 2pm',
    category: 'Breakfast',
    price: '259',
    published: true,
    order: 5
  },
  {
    name: 'Blueberry Pancakes',
    description: '4 freshly made pancakes with maple syrup and an exquisite blueberry topping',
    category: 'Breakfast',
    price: '149',
    published: true,
    order: 6
  },
  {
    name: 'Breakfast Steak & Eggs',
    description: '6oz australian rib eye steak with eggs and a slice of brown bread. includes coffee or tea',
    category: 'Breakfast',
    price: '399',
    published: true,
    order: 7
  },
  {
    name: 'Chocolate Croissant & Coffee',
    description: 'Chocolate croissant & choice of coffee or hot tea',
    category: 'Breakfast',
    price: '119',
    published: true,
    order: 8
  },
  {
    name: 'All In Breakfast',
    description: '1 egg, 1 bacon, 1 fatboy breakfast sausage, baked beans, fried potatoes, black pudding, fried mushrooms, fried bread, toast, butter marmalade, your choice of tea or coffee, small orange juice. replace white with brown bread 10b available until 2pm',
    category: 'Breakfast',
    price: '299',
    published: true,
    order: 9
  },
  {
    name: 'Breakfast Salmon Platter',
    description: 'Smoked salmon with scrambled egg, toasted garlic bread, and side salad',
    category: 'Breakfast',
    price: '229',
    published: true,
    order: 10
  },
  {
    name: 'Sausage & Egg Muffin',
    description: 'Delicious toasted english muffin with sausage & egg',
    category: 'Breakfast',
    price: '99',
    published: true,
    order: 11
  },
  {
    name: 'Double Sausage & Egg Muffin',
    description: 'Delicious toasted english muffin with two sausage patties & egg',
    category: 'Breakfast',
    price: '149',
    published: true,
    order: 12
  },
  {
    name: 'Pancake Breakfast Set',
    description: '3 pancakes, maple syrup or honey, butter, 1 egg (any style), 1 fatboy breakfast sausage, 1 bacon, your choice of coffee or tea available until 2pm',
    category: 'Breakfast',
    price: '239',
    published: true,
    order: 13
  },
  {
    name: 'Egg Muffin',
    description: 'Delicious toasted english muffin with egg',
    category: 'Breakfast',
    price: '69',
    published: true,
    order: 14
  },
  {
    name: 'Salmon Croissant',
    description: 'Fresh croissant with salmon, red onion, scrambled egg & capers',
    category: 'Breakfast',
    price: '169',
    published: true,
    order: 15
  },
  {
    name: 'Bacon & Egg Croisant',
    description: 'Fresh croissant with crispy bacon & scrambled egg',
    category: 'Breakfast',
    price: '139',
    published: true,
    order: 16
  },
  {
    name: 'Ham & Cheese Croissant',
    description: 'Fresh croissant with ham and cheddar cheese',
    category: 'Breakfast',
    price: '139',
    published: true,
    order: 17
  },
  {
    name: 'Breakfast Omelette',
    description: '3 eggs omelette filled with mixed vegetables & ham glazed with cheddar cheese served with fried potatoes',
    category: 'Breakfast',
    price: '169',
    published: true,
    order: 18
  },
  {
    name: 'Eggs Benedict',
    description: 'With guacamole. served on brown bread',
    category: 'Breakfast',
    price: '209',
    published: true,
    order: 19
  },
  {
    name: 'Breakfast Burrito\'s',
    description: 'Two burrito\'s filled with bacon and eggs, bell pepper, onion, paprika, tomato & lettuce.',
    category: 'Breakfast',
    price: '199',
    published: true,
    order: 20
  },
  {
    name: 'Sausage Sandwich',
    description: '2 grilled premium pork sausage served in home made bloomer bread. replace white with brown bread 20b',
    category: 'Breakfast',
    price: '179',
    published: true,
    order: 21
  },
  {
    name: 'Bacon Sandwich',
    description: 'Bacon sandwich served in home made bloomer bread replace white with brown bread 20b',
    category: 'Breakfast',
    price: '169',
    published: true,
    order: 22
  },
  {
    name: '2 Eggs On Toast (Any Style)',
    description: '2 eggs on toast (any style) replace white with brown bread 20b',
    category: 'Breakfast',
    price: '109',
    published: true,
    order: 23
  },
  {
    name: 'Mini Pancake Breakfast',
    description: '3 pancakes with maple syrup or honey',
    category: 'Breakfast',
    price: '129',
    published: true,
    order: 24
  },
  {
    name: 'Welsh Rarebit',
    description: 'Beans on toast with melted cheese on top',
    category: 'Breakfast',
    price: '139',
    published: true,
    order: 25
  },
  {
    name: 'Baked Beans On Toast',
    description: 'Baked beans on toast',
    category: 'Breakfast',
    price: '109',
    published: true,
    order: 26
  },
  {
    name: 'Mega Breakfast Roll 249b & Breakfast Roll 189b',
    description: 'Mega 229b- 2 x egg, 2 x bacon, & 2 x sausage. breakfast roll 169b- 2 x egg, 1 x bacon, & 1 x sausage. both in a freshly baked delicious bread roll',
    category: 'Breakfast',
    price: '249',
    published: true,
    order: 27
  },
  {
    name: 'Prawn Coctail',
    description: 'King prawns with salad and thousand island dressing',
    category: 'Snacks & Soups',
    price: '189',
    published: true,
    order: 1
  },
  {
    name: 'Garlic Bread',
    description: 'Garlic bread',
    category: 'Snacks & Soups',
    price: '99',
    published: true,
    order: 2
  },
  {
    name: 'Piri Piri Pocket',
    description: 'Succulent chicken breast in a piri piri sauce with salad in a crusty bread pocket. served with pirinaise and chopped peppers and onions',
    category: 'Snacks & Soups',
    price: '249',
    published: true,
    order: 3
  },
  {
    name: 'Garlic Bread Cheese',
    description: 'Garlic bread cheese',
    category: 'Snacks & Soups',
    price: '139',
    published: true,
    order: 4
  },
  {
    name: 'Classic Cream Of Tomato',
    description: 'Classic cream of tomato',
    category: 'Snacks & Soups',
    price: '149',
    published: true,
    order: 5
  },
  {
    name: 'French Onion Soup',
    description: 'French onion soup',
    category: 'Snacks & Soups',
    price: '169',
    published: true,
    order: 6
  },
  {
    name: 'Creamy Potato Soup',
    description: 'With bacon garnish',
    category: 'Snacks & Soups',
    price: '149',
    published: true,
    order: 7
  },
  {
    name: 'Loaded Nachos',
    description: 'Topped with chili con carne, jalapenos, green peppers, salsa, guacamole, sour cream and melted cheese',
    category: 'Snacks & Soups',
    price: '309',
    published: true,
    order: 8
  },
  {
    name: 'Quesadilla',
    description: 'Tortillas filled with meat, spices and cheese. great with a beer. beef, chicken or pork- choose any 2',
    category: 'Snacks & Soups',
    price: '199',
    published: true,
    order: 9
  },
  {
    name: 'Chilli Beef Cheese Fries',
    description: 'Steak cut fries topped with our house made chilli con carne and melted cheddar cheese',
    category: 'Snacks & Soups',
    price: '239',
    published: true,
    order: 10
  },
  {
    name: 'Chicken Burrito',
    description: '2 x chicken burritos served with mayo, salsa and guacamole.',
    category: 'Snacks & Soups',
    price: '295',
    published: true,
    order: 11
  },
  {
    name: 'Buffalo Drumsticks + Pint Or Bottle',
    description: '4 buffalo drumsticks with a pint of tiger/bottle of beer* *chang/singha/heineken/tiger/san mig light/my beer/leo',
    category: 'Snacks & Soups',
    price: '199',
    published: true,
    order: 12
  },
  {
    name: 'Mixed Olives',
    description: 'Roasted cherry tomatoes, feta cheese grilled herb bread',
    category: 'Snacks & Soups',
    price: '189',
    published: true,
    order: 13
  },
  {
    name: 'Warm Salted Cashew Nuts',
    description: 'Warm salted cashew nuts',
    category: 'Snacks & Soups',
    price: '129',
    published: true,
    order: 14
  },
  {
    name: 'Spaghetti Bolognese',
    description: 'New recipe- traditional bolognese made with 100% beef, tomatoes, oregano, etc served on a bed of pasta',
    category: 'Pasta',
    price: '319',
    published: true,
    order: 1
  },
  {
    name: 'Creamy Spaghetti Salmon',
    description: 'Salmon in a creamy sauce',
    category: 'Pasta',
    price: '319',
    published: true,
    order: 2
  },
  {
    name: 'Tuna Mayo Pasta',
    description: 'The old favourite- tuna, mayonnaise, sweetcorn and peppers on a pasta bed',
    category: 'Pasta',
    price: '299',
    published: true,
    order: 3
  },
  {
    name: 'Spaghetti Pad Ki Mao',
    description: 'Strir fried seafood, with spaghetti, green pepper, garlic, oyster sauce, and hot basil',
    category: 'Pasta',
    price: '299',
    published: true,
    order: 4
  },
  {
    name: 'Spaghetti Meatballs',
    description: 'Homemade pork & beef meatballs in a rich tomato sauce',
    category: 'Pasta',
    price: '319',
    published: true,
    order: 5
  },
  {
    name: 'Pasta Amatriciana With Garlic Bread',
    description: 'Crispy bacon, tomatoes, basil, chilli, oregano, garlic and onion',
    category: 'Pasta',
    price: '299',
    published: true,
    order: 6
  },
  {
    name: 'Pasta Carbonara',
    description: 'A delicious concoction of cream, eggs, bacon, gammon ham, parmesan cheese and mixed with fettucine egg pasta.',
    category: 'Pasta',
    price: '319',
    published: true,
    order: 7
  },
  {
    name: 'Penne Aglio E Olio Chicken',
    description: 'Penne pasta with chicken, olive oil, fried garlic, cherry tomatoes, and white wine- chilli pepper, a squeeze of lemon, a pinch of salt and a bit of chopped parsley are added to make the pasta pop with a spicy kick.',
    category: 'Pasta',
    price: '299',
    published: true,
    order: 8
  },
  {
    name: 'Australian Wagyu Beef Hamburger',
    description: '1/3 pound juicy australian wagyu beef in a delicious, soft german bun, with tomato, red onion and lettuce. served with fries and coleslaw or baked beans.',
    category: 'Sandwich & Burgers',
    price: '269',
    published: true,
    order: 1
  },
  {
    name: 'Siam CheeseSteak',
    description: 'A twist on the famous philly cheesesteak but with a thai twist! strips of aussie wagyu beef marinated in oyster sauce, with jalapeño chilli\'s, fried peppers, fried onions, fried mushrooms, smothered with melted cheese in a 6 inch sub',
    category: 'Sandwich & Burgers',
    price: '249',
    published: true,
    order: 2
  },
  {
    name: 'Piri Piri Pocket',
    description: 'Succulent chicken breast in a piri piri sauce with salad in a crusty pitta bread pocket. served with pirinaise and chopped peppers and onions',
    category: 'Sandwich & Burgers',
    price: '229',
    published: true,
    order: 3
  },
  {
    name: 'Australian Wagyu Beef Cheeseburger',
    description: '1/3 pound juicy australian wagyu beef in a delicious, soft german bun, with cheese, tomato, red onion and lettuce. served with fries and coleslaw',
    category: 'Sandwich & Burgers',
    price: '289',
    published: true,
    order: 4
  },
  {
    name: 'Australian Wagyu Beef BBQ Hamburger',
    description: '1/3 pound juicy australian wagyu beef in a delicious, soft german bun, with a mild bbq sauce, spring onions, cheese, tomato. served with fries and coleslaw or baked beans',
    category: 'Sandwich & Burgers',
    price: '299',
    published: true,
    order: 5
  },
  {
    name: 'Australian Wagyu Beef Bacon Cheeseburger',
    description: '1/3 pound juicy australian wagyu beef in a delicious, soft german bun, with back bacon, cheese, tomato. served with fries and coleslaw or baked beans',
    category: 'Sandwich & Burgers',
    price: '309',
    published: true,
    order: 6
  },
  {
    name: 'Australian Wagyu Beef Breakfast Hamburger',
    description: '1/3 pound juicy australian wagyu beef in a delicious, soft german bun, wth back bacon, fried egg, tomato. served with fries and coleslaw or baked beans',
    category: 'Sandwich & Burgers',
    price: '319',
    published: true,
    order: 7
  },
  {
    name: '100% Cod Burger',
    description: '100% cod burger with lettuce, tomato & tartar sauce served with french fries.',
    category: 'Sandwich & Burgers',
    price: '219',
    published: true,
    order: 8
  },
  {
    name: 'Tuna Cheddar Melt',
    description: 'Tuna mayo on a toasted roll with bell peppers and onion smothered with melted cheddar cheese',
    category: 'Sandwich & Burgers',
    price: '189',
    published: true,
    order: 9
  },
  {
    name: 'Chicken Bacon Club',
    description: 'Toasted farmhouse stacked with chicken, bacon, lettuce, tomato chutney mayo replace white with brown bread 20b',
    category: 'Sandwich & Burgers',
    price: '189',
    published: true,
    order: 10
  },
  {
    name: 'Meatball Sub',
    description: 'Delicious homemade meatballs in a marinara sauce topped with melted cheddar cheese',
    category: 'Sandwich & Burgers',
    price: '189',
    published: true,
    order: 11
  },
  {
    name: 'Whole Wheat Cheese Ham',
    description: 'Fresh whole wheat bread loaded with cheddar cheese, ham.',
    category: 'Sandwich & Burgers',
    price: '169',
    published: true,
    order: 12
  },
  {
    name: 'Roast Pork Baguette',
    description: 'Delicious roast pork in a fresh baguette and served with gravy and stuffing. only available sunday\'s',
    category: 'Sandwich & Burgers',
    price: '189',
    published: true,
    order: 13
  },
  {
    name: 'Roast Beef Baguette',
    description: 'Delicious roast beef in a fresh baguette and served with gravy and stuffing. only available sunday\'s',
    category: 'Sandwich & Burgers',
    price: '199',
    published: true,
    order: 14
  },
  {
    name: 'Whole Wheat Tuna, Mayonnaise & Sweetcorn Sandwich',
    description: 'Fresh whole wheat bread filled with tuna, mayonnaise & sweetcorn with a touch of black pepper with crisps and side salad',
    category: 'Sandwich & Burgers',
    price: '159',
    published: true,
    order: 15
  },
  {
    name: 'B.L.T.',
    description: 'Bacon, lettuce & tomato sandwich in fresh farmhouse white bread replace white with brown bread 20b',
    category: 'Sandwich & Burgers',
    price: '139',
    published: true,
    order: 16
  },
  {
    name: 'Chicken In A Mushroom & Creamy Peppercorn Sauce',
    description: 'Butterfly chicken in a mushroom & creamy peppercorn sauce served on a bed of mashed potatoes with green beans',
    category: 'Main Meals',
    price: '319',
    published: true,
    order: 1
  },
  {
    name: 'Japanese Chicken Teriyaki',
    description: 'Japanese chicken teriyaki- succulent chicken pieces in a delicious thick, sweet, and savoury sauce served with rice and soup',
    category: 'Main Meals',
    price: '319',
    published: true,
    order: 2
  },
  {
    name: 'Creamy Chorizo Pasta',
    description: 'Chorizo sausage in a creamy sauce with parmesan cheese (extra king prawn 35b each)',
    category: 'Main Meals',
    price: '319',
    published: true,
    order: 3
  },
  {
    name: 'Asian Surf & Turf Stir Fry',
    description: 'Prawns and cuts of tenderloin steak stir fried with ginger, soy sauce, garlic, pepper, touch of chilli on a bed of pasta. (prawns 35b each)',
    category: 'Main Meals',
    price: '379',
    published: true,
    order: 4
  },
  {
    name: 'Spaghetti Bolognese',
    description: 'New recipe- traditional bolognese made with 100% beef, tomatoes, oregano, etc served on a bed of pasta',
    category: 'Main Meals',
    price: '319',
    published: true,
    order: 5
  },
  {
    name: 'Yellow Indian Chicken Curry',
    description: 'A mild curry with a delayed kick! very moreish. chicken, onion, peas, whipping cream, thai curry paste, curry powder, turmeric powder. served with steamed rice.',
    category: 'Main Meals',
    price: '339',
    published: true,
    order: 6
  },
  {
    name: 'Beer Battered Cod And Chips',
    description: 'With beans, peas or mushy peas, tartare sauce, home made white bloomer bread and a wedge of lemon',
    category: 'Main Meals',
    price: '399',
    published: true,
    order: 7
  },
  {
    name: 'Beer Battered Haddock And Chips',
    description: 'With beans, peas or mushy peas, tartare sauce, home made white bloomer bread and a wedge of lemon',
    category: 'Main Meals',
    price: '389',
    published: true,
    order: 8
  },
  {
    name: 'Grilled Haddock',
    description: 'Grilled haddock with mixed vegetables, boiled potato\'s, and 2 of 3 sauces - curry, tartare , & special sauce',
    category: 'Main Meals',
    price: '369',
    published: true,
    order: 9
  },
  {
    name: 'Chilli Con Carne',
    description: 'Slow cooked minced beef with mexican spices and kidney beans, served with steamed rice.',
    category: 'Main Meals',
    price: '329',
    published: true,
    order: 10
  },
  {
    name: 'Cajun Rubbed Pork Chop',
    description: 'Served with pan roasted vegetables, saute potatoes and a jug of gravy',
    category: 'Main Meals',
    price: '389',
    published: true,
    order: 11
  },
  {
    name: 'Wagyu Beef Stew & Dumplings',
    description: 'Chunks of soft and tender wagyu beef with carrots, potato & garden peas in a rich gravy stew with traditional parsley dumplings',
    category: 'Main Meals',
    price: '389',
    published: true,
    order: 12
  },
  {
    name: 'Chicken Parmigiana',
    description: 'Breadcrumbed chicken breast topped with marinara sauce and melted mozzarella cheese, served with side salad and tagliatelle napolitana/french fries',
    category: 'Main Meals',
    price: '339',
    published: true,
    order: 13
  },
  {
    name: 'Pork Schnitzel',
    description: 'A thin, tender pork cutlet, breaded and sautéed. with honey mustard sauce, french fries and side salad',
    category: 'Main Meals',
    price: '349',
    published: true,
    order: 14
  },
  {
    name: 'Battered Sausages & Chips',
    description: 'Two battered cumberland sausages with chips and peas/mushy peas/baked beans',
    category: 'Main Meals',
    price: '349',
    published: true,
    order: 15
  },
  {
    name: 'Bangers Mash',
    description: '2 fatboy lincolnshire sausages on creamy mashed potato served with garden peas and onion gravy',
    category: 'Main Meals',
    price: '349',
    published: true,
    order: 16
  },
  {
    name: 'Chicken Cordon Bleu',
    description: 'Breaded chicken breast stuffed with ham and cheese, served with fries and salad',
    category: 'Main Meals',
    price: '359',
    published: true,
    order: 17
  },
  {
    name: 'Lemon Garlic Chicken',
    description: 'Served with steak fries and salad.',
    category: 'Main Meals',
    price: '339',
    published: true,
    order: 18
  },
  {
    name: 'Ploughmans Lunch',
    description: 'Two cheeses, salami, ham, dill pickle, tomatoes, toasted flat baguette, branston pickle, celery, silverskin onions, 1/2 scotch eggs, pate, red onion, apple.',
    category: 'Main Meals',
    price: '429',
    published: true,
    order: 19
  },
  {
    name: 'Rack Of Barbeque Pork Ribs',
    description: 'Served with beer battered onion rings, baked potato and sour cream, smoky baked beans and a side of coleslaw....with a bit of a kick!',
    category: 'Main Meals',
    price: '419',
    published: true,
    order: 20
  },
  {
    name: 'Home Cooked Ham With Eggs And Chips',
    description: 'Freshly sliced home cooked ham, 2 fried eggs and steak chips.',
    category: 'Main Meals',
    price: '259',
    published: true,
    order: 21
  },
  {
    name: 'Gammon Steak',
    description: '300g gammon steak, served with steak fries, garden peas, fried egg, pineapple ring and gravy',
    category: 'Main Meals',
    price: '349',
    published: true,
    order: 22
  },
  {
    name: 'Grilled Calves Liver',
    description: 'Served with creamy mashed potato, crispy bacon, onion gravy and garden peas',
    category: 'Main Meals',
    price: '339',
    published: true,
    order: 23
  },
  {
    name: 'Baked Stuffed Chicken',
    description: 'Chicken breast stuffed with peppers and onions. served with roast potatoes, vegetables, and mushroom sauce',
    category: 'Main Meals',
    price: '299',
    published: true,
    order: 24
  },
  {
    name: 'Pizza Margherita No. 1',
    description: 'A stone baked homemade neapolitan pizza with tomatoes, mozzarella cheese, fresh basil & salt.all our pizza\'s are 100% home made and stone baked',
    category: 'Pizza',
    price: '239',
    published: true,
    order: 1
  },
  {
    name: 'Pizza Vegetarian No.2',
    description: 'Tomatoes, mozzarella cheese, fresh basil & salt. yellow, pepper, red pepper, olives, onion all our pizza\'s are 100% home made and stone baked',
    category: 'Pizza',
    price: '249',
    published: true,
    order: 2
  },
  {
    name: 'Pizza Hawaiian No. 3',
    description: 'Tomatoes, mozzarella cheese, fresh basil, salt, cooked ham and pineapple all our pizza\'s are 100% home made and stone baked',
    category: 'Pizza',
    price: '279',
    published: true,
    order: 3
  },
  {
    name: 'Pizza Bolognese No.5',
    description: 'Tomatoes, mozzarella cheese, bolognese sauce with prime minced beef all our pizza\'s are 100% home made and stone baked',
    category: 'Pizza',
    price: '299',
    published: true,
    order: 4
  },
  {
    name: 'Meat Feast No. 8',
    description: 'Mozzarella, salami, spicy salami, prosciutto crudo',
    category: 'Pizza',
    price: '329',
    published: true,
    order: 5
  },
  {
    name: 'Pizza Ham & Tomato No. 12',
    description: 'Thin slices of cooked ham with mozzarella, oregano & basil',
    category: 'Pizza',
    price: '279',
    published: true,
    order: 6
  },
  {
    name: 'Ham & Mushroom Pizza No.14',
    description: 'Tomato sauce, cooked ham & mushrooms',
    category: 'Pizza',
    price: '299',
    published: true,
    order: 7
  },
  {
    name: 'Breakfast Pizza No 16',
    description: 'Breakfast sausage, bacon, egg, mushroom, cherry tomatoes, spring onion, mozerrella',
    category: 'Pizza',
    price: '289',
    published: true,
    order: 8
  },
  {
    name: 'Sausage Pizza No. 14',
    description: 'Spicy pork sausage pizza',
    category: 'Pizza',
    price: '299',
    published: true,
    order: 9
  },
  {
    name: 'Anchovy & Olive Pizza No 15',
    description: 'Anchovies, capers, olives, cheese, and tomato.',
    category: 'Pizza',
    price: '349',
    published: true,
    order: 10
  },
  {
    name: 'Pizza Al Tuna No. 17',
    description: 'Tomato sauce, tuna, mozzarella',
    category: 'Pizza',
    price: '279',
    published: true,
    order: 11
  },
  {
    name: 'Pizza Tuna & Red Onion No. 20',
    description: 'Tomato sauce, mozzarella,tuna, red onion, oregano',
    category: 'Pizza',
    price: '289',
    published: true,
    order: 12
  },
  {
    name: 'Homemade Chicken & Mushroom Pot Pie',
    description: 'Chunks of chicken and mushrooms cooked in a rich creamy sauce and topped off with a puff pastry top. served with mashed potato and gravy',
    category: 'Pies',
    price: '295',
    published: true,
    order: 1
  },
  {
    name: 'Homemade Chicken & Ham Pot Pie',
    description: 'Delicious homemade chicken and ham with a puff pastry top and mashed potato and gravy',
    category: 'Pies',
    price: '309',
    published: true,
    order: 2
  },
  {
    name: 'Tuna Salad',
    description: 'Served with tasty vinaigrette',
    category: 'Salad & Jackets',
    price: '289',
    published: true,
    order: 1
  },
  {
    name: 'Tuna Mayonnaise Salad',
    description: 'Served with mayonnaise.',
    category: 'Salad & Jackets',
    price: '289',
    published: true,
    order: 2
  },
  {
    name: 'Greek Salad',
    description: 'Sliced onions, whole black olives, sliced cherry tomatoes, feta cheese, green and yellow bell peppers, on a bed of iceberg lettuce, tossed through light balsamic vinegar.',
    category: 'Salad & Jackets',
    price: '299',
    published: true,
    order: 3
  },
  {
    name: 'Hemingway\'s Caesar Salad',
    description: 'Topped with grilled chicken or garlic prawns',
    category: 'Salad & Jackets',
    price: '299',
    published: true,
    order: 4
  },
  {
    name: 'Mixed Salad',
    description: 'Lettuce, onion, cherry tomato, red pepper, green pepper,',
    category: 'Salad & Jackets',
    price: '229',
    published: true,
    order: 5
  },
  {
    name: 'French Dressing & Italian Dressing',
    description: '30b each',
    category: 'Salad & Jackets',
    price: '30',
    published: true,
    order: 6
  },
  {
    name: 'Steak Shavings With Blue Cheese Jack Potato',
    description: 'Steak shavings, vinegar, blue cheese crumbles',
    category: 'Salad & Jackets',
    price: '229',
    published: true,
    order: 7
  },
  {
    name: 'Tuna Sweet Corn Mayo Jack Potato',
    description: 'Tuna sweet corn mayo',
    category: 'Salad & Jackets',
    price: '199',
    published: true,
    order: 8
  },
  {
    name: 'Baked Beans Cheddar Cheese Jack Potato',
    description: 'Baked beans cheddar cheese',
    category: 'Salad & Jackets',
    price: '199',
    published: true,
    order: 9
  },
  {
    name: '5 Hour Braised Lamb Shank',
    description: 'Prime australian lamb shank braised for 5 hours with shallots, mushrooms, carrots and potatoes',
    category: 'Premium & Steaks',
    price: '599',
    published: true,
    order: 1
  },
  {
    name: 'Gambas Pil Pil',
    description: 'King prawns in a sizzling sauce of garlic, various herbs & spices, chilli, served with a garlic and parsley pasta with parmasan. has a beautiful "zing"',
    category: 'Premium & Steaks',
    price: '449',
    published: true,
    order: 2
  },
  {
    name: 'Australian Grass Fed Tenderloin Steak',
    description: 'Australian grass fed tenderloin steak (200gm/7oz) served with grilled peppers & mushrooms, and steak chips or mashed potato with chives and garlic',
    category: 'Premium & Steaks',
    price: '649',
    published: true,
    order: 3
  },
  {
    name: 'Australian Angus Ribeye',
    description: 'Australian angus grain fed ribeye 250gm (9oz)',
    category: 'Premium & Steaks',
    price: '949',
    published: true,
    order: 4
  },
  {
    name: 'New Zealand Sirloin Steak',
    description: 'New zealand grass fed sirloin 300gm (10.5oz)',
    category: 'Premium & Steaks',
    price: '599',
    published: true,
    order: 5
  },
  {
    name: 'Argentinian Filet Mignon',
    description: 'Argentinian grass fed filet mignon 200gm (7oz)',
    category: 'Premium & Steaks',
    price: '799',
    published: true,
    order: 6
  },
  {
    name: 'Fried Rice With Chicken/Pork/Prawns/Seafood',
    description: 'Fried rice with chicken pork (extra 10b) beef (extra50b) prawns/seafood/squid (extra 80b)',
    category: 'Thai Food',
    price: '199',
    published: true,
    order: 1
  },
  {
    name: 'Fried Rice With Egg',
    description: 'Fried rice with egg',
    category: 'Thai Food',
    price: '99',
    published: true,
    order: 2
  },
  {
    name: 'Steamed Rice',
    description: 'Steamed rice',
    category: 'Thai Food',
    price: '40',
    published: true,
    order: 3
  },
  {
    name: 'Thai Green Curry',
    description: 'With chicken, eggplant,sweet basil, coconut milk pork (extra 10b) beef (extra 50b) prawns/seafood/squid (extra 80b)',
    category: 'Thai Food',
    price: '199',
    published: true,
    order: 4
  },
  {
    name: 'Lab Moo',
    description: 'Pork, red onion, mint, coriander, lemon juice, fish sauce, and chilli',
    category: 'Thai Food',
    price: '199',
    published: true,
    order: 5
  },
  {
    name: 'Lab Moo Tod Spicy Meatballs',
    description: 'Fried pork, red onion, coriander, lemon juice, fish sauce, and chilli',
    category: 'Thai Food',
    price: '209',
    published: true,
    order: 6
  },
  {
    name: 'Tom Kha Kai',
    description: 'Thai chicken coconut soup. galangal, lime, lemongrass, chilli, coriander',
    category: 'Thai Food',
    price: '199',
    published: true,
    order: 7
  },
  {
    name: 'Pad Ki Mao Spaghetti',
    description: 'Stir fried seafood, with spaghetti, green pepper, garlic, oyster sauce, hot basil',
    category: 'Thai Food',
    price: '279',
    published: true,
    order: 8
  },
  {
    name: 'Prawn Vegetable Tempura',
    description: 'With soy sauce mild chili dips',
    category: 'Thai Food',
    price: '289',
    published: true,
    order: 9
  },
  {
    name: 'Boiled Pork With Lime, Garlic And Chili Sauce',
    description: 'Boiled pork with lime, garlic and chili sauce',
    category: 'Thai Food',
    price: '209',
    published: true,
    order: 10
  },
  {
    name: 'Warm Thai Noodle Salad',
    description: 'Choice of chicken, pork, prawns 80b, seafood 80b, beef 50b',
    category: 'Thai Food',
    price: '219',
    published: true,
    order: 11
  },
  {
    name: 'Penang Curry',
    description: 'Cooked with coconut chili paste pork (extra 10b) beef (extra50b)prawns/seafood/squid (extra 80b)',
    category: 'Thai Food',
    price: '199',
    published: true,
    order: 12
  },
  {
    name: 'Marinated Wagyu Beef In Oyster Sauce',
    description: 'Marinated & deep fried wagyu beef, with oyster sauce, lemon grass, & chilli',
    category: 'Thai Food',
    price: '239',
    published: true,
    order: 13
  },
  {
    name: 'Stir Fried & Cashew Nuts',
    description: 'Chicken,pork,fish fillet cashew nuts pork (extra 10b) beef (extra50)prawns/seafood/squid extra 80b)',
    category: 'Thai Food',
    price: '249',
    published: true,
    order: 14
  },
  {
    name: 'Stir Fried Ginger',
    description: 'Stir fried chicken, pork, or fish fillet, ginger pork (extra 10b) beef (extra50b)prawns/seafood/squid extra 80b)',
    category: 'Thai Food',
    price: '199',
    published: true,
    order: 15
  },
  {
    name: 'Tom Yum',
    description: 'Classic thai spicy soup with chicken, pork or seafood with or without coconut milk pork (extra 10b) beef (extra50b)prawns/seafood/squid (extra 80b)',
    category: 'Thai Food',
    price: '209',
    published: true,
    order: 16
  },
  {
    name: 'Red Curry With Roasted Duck',
    description: 'Roasted duck breast with red curry paste, red grapes, sita tomatoes, red chili, basil leaves, kaffir lime leaves, pineapple, & eggplant',
    category: 'Thai Food',
    price: '239',
    published: true,
    order: 17
  },
  {
    name: 'Sour Soup With Tamarind',
    description: 'With carrots, baby corn, cabbage flowers, yard long beans. prawns 80b',
    category: 'Thai Food',
    price: '199',
    published: true,
    order: 18
  },
  {
    name: 'Stir Fried Vegetables In Oyster Sauce',
    description: 'Stir fried vegetables in oyster sauce',
    category: 'Thai Food',
    price: '189',
    published: true,
    order: 19
  },
  {
    name: 'Deep Fried Fish Fillets',
    description: 'With green peppercorns, chili, garlic, oyster sauce hot basil',
    category: 'Thai Food',
    price: '199',
    published: true,
    order: 20
  },
  {
    name: 'Chicken Massaman',
    description: 'Mild curry made with potatoes, onions, peanuts mild spices',
    category: 'Thai Food',
    price: '199',
    published: true,
    order: 21
  },
  {
    name: 'Clear Soup With Minced Pork',
    description: 'Noodles, tofu thai vegetables',
    category: 'Thai Food',
    price: '199',
    published: true,
    order: 22
  },
  {
    name: 'Spicy Jungle Curry',
    description: 'Chicken, eggplant, long bean, hot basil, curry paste, fish sauce. pork (extra 10b) beef (extra 50b) prawns/seafood/squid (extra 80b)',
    category: 'Thai Food',
    price: '199',
    published: true,
    order: 23
  },
  {
    name: 'Fried Squid With Garlic Black Pepper',
    description: 'Fried squid with garlic black pepper',
    category: 'Thai Food',
    price: '219',
    published: true,
    order: 24
  },
  {
    name: 'Pad Thai',
    description: 'Small noodles stir fried with chicken, bean sprouts sweet chili sauce. prawn +80b',
    category: 'Thai Food',
    price: '199',
    published: true,
    order: 25
  },
  {
    name: 'Rad Na',
    description: 'Big noodles stir fried with vegetables, soy oyster sauce pork (extra 10b) prawns/seafood/squid (extra 80b)',
    category: 'Thai Food',
    price: '209',
    published: true,
    order: 26
  },
  {
    name: 'Red Curry With Chicken',
    description: 'Served in a fresh coconut shell',
    category: 'Thai Food',
    price: '209',
    published: true,
    order: 27
  },
  {
    name: 'Stir Fried Beef And Peppers',
    description: 'Beef and peppers stir fried in oyster sauce',
    category: 'Thai Food',
    price: '219',
    published: true,
    order: 28
  },
  {
    name: 'Sweet And Sour',
    description: 'Sweet and sour pork (extra 10b) beef (extra50b)prawns/seafood/squid (extra 80b',
    category: 'Thai Food',
    price: '189',
    published: true,
    order: 29
  },
  {
    name: 'Stir Fried Noodles',
    description: 'Chicken,pork or seafood served with vegetables egg, black bean soy sauce pork (extra 10b) beef (extra50b)prawns/seafood/squid (extra 80b',
    category: 'Thai Food',
    price: '189',
    published: true,
    order: 30
  },
  {
    name: 'Thai Squid Salad Mixed',
    description: 'With onions, mint, coriander, lemon juice fish sauce',
    category: 'Thai Food',
    price: '219',
    published: true,
    order: 31
  },
  {
    name: 'Fresh Raw Prawns',
    description: 'On thai shredded cabbage hot chili sauce',
    category: 'Thai Food',
    price: '279',
    published: true,
    order: 32
  },
  {
    name: 'Grilled Pork Neck Salad',
    description: 'With thai vegetables flavoured with lime juice, fish sauce chili',
    category: 'Thai Food',
    price: '199',
    published: true,
    order: 33
  },
  {
    name: 'Pad Kapow',
    description: 'Chicken, pork, beef or seafood stir fried with chili thai basil pork (extra 10b) beef (extra50b)prawns/seafood/squid (extra 80b)',
    category: 'Thai Food',
    price: '199',
    published: true,
    order: 34
  },
  {
    name: 'Prawn Salad',
    description: 'With lemongrass, red onion, mint chili paste',
    category: 'Thai Food',
    price: '259',
    published: true,
    order: 35
  },
  {
    name: 'Chicken Nuggets Chips',
    description: 'Chicken nuggets chips',
    category: 'Kids Meals',
    price: '129',
    published: true,
    order: 1
  },
  {
    name: 'Fish Fingers Chips Beans',
    description: 'Fish fingers chips beans',
    category: 'Kids Meals',
    price: '169',
    published: true,
    order: 2
  },
  {
    name: 'Sausage Chips Beans',
    description: 'Sausage chips beans',
    category: 'Kids Meals',
    price: '139',
    published: true,
    order: 3
  },
  {
    name: 'Italian Lemon Cheesecake',
    description: 'Homemade italian lemon cheesecake- ligh, tangy, and scrumptious',
    category: 'Desserts',
    price: '149',
    published: true,
    order: 1
  },
  {
    name: 'Blueberry Cheesecake',
    description: 'Totally homemade by our own chef\'s with a buttery biscuit crust, a creamy cheesecake centre, and topped with juicy blueberries and a luscious blueberry sauce',
    category: 'Desserts',
    price: '149',
    published: true,
    order: 2
  },
  {
    name: 'Chocolate Mousse',
    description: 'Made from real chocolate',
    category: 'Desserts',
    price: '129',
    published: true,
    order: 3
  },
  {
    name: 'Banana Split',
    description: 'The classic!',
    category: 'Desserts',
    price: '169',
    published: true,
    order: 4
  },
  {
    name: 'Apple Crumble',
    description: 'With ice cream',
    category: 'Desserts',
    price: '139',
    published: true,
    order: 5
  },
  {
    name: 'Mixed Vegetables',
    description: 'Steamed mixed vegetables',
    category: 'Sides',
    price: '79',
    published: true,
    order: 1
  },
  {
    name: 'Fried Onions',
    description: '',
    category: 'Sides',
    price: '39',
    published: true,
    order: 2
  },
  {
    name: 'Mashed Potato',
    description: 'Creamy mashed potatoes',
    category: 'Sides',
    price: '79',
    published: true,
    order: 3
  },
  {
    name: 'Large French Fries/Chips',
    description: '',
    category: 'Sides',
    price: '129',
    published: true,
    order: 4
  },
  {
    name: 'Roast Chicken Breast',
    description: 'Roast chicken breast with yorkshire pudding, pigs in blankets, cauliflower cheese, sage & onion stuffing, glazed carrots, runner beans, roasted potatoes, red cabbage & thick onion gravy',
    category: 'Sunday Roasts',
    price: '349',
    published: true,
    order: 1
  },
  {
    name: 'Roast Pork Loin',
    description: 'Roast pork loin with yorkshire pudding, pigs in blankets, cauliflower cheese, stuffing, glazed carrots, runner beans, roasted potatoes, red cabbage & thick onion gravy',
    category: 'Sunday Roasts',
    price: '379',
    published: true,
    order: 2
  },
  {
    name: 'Roast Beef',
    description: 'Roast australian angus beef with yorkshire pudding, pigs in blankets, cauliflower cheese, stuffing, glazed carrots, runner beans, roasted potatoes, red cabbage & thick onion gravy',
    category: 'Sunday Roasts',
    price: '449',
    published: true,
    order: 3
  },
  {
    name: 'Roast Lamb',
    description: 'Roast lamb with yorkshire pudding, pigs in blankets, cauliflower cheese, stuffing, glazed carrots, runner beans, roasted potatoes, red cabbage & thick onion gravy',
    category: 'Sunday Roasts',
    price: '439',
    published: true,
    order: 4
  },
  {
    name: 'CRANSWICK Lakefield Chardonnay',
    description: 'Appearance: white with a ripe lemon hue colour. nose: it displays white peach and tropical fruit notes together with fresh green apple and lemon rind aromas. palate: ripe peach and melon flavours with some soft oak notes which produces a richly textured creaminess and a fresh, acid finish. pairing: delicious served with creamy pasta dishes or cold salmon. south eastern australia, australia. alcohol 12%',
    category: 'Wine',
    price: '849',
    published: true,
    order: 1
  },
  {
    name: 'CRANSWICK Lakefield Moscato (Sweet)',
    description: 'Appearance: pale yellow with green hues. nose: the nose has floral hints combined with zesty lime and citrus notes. palate: vibrant clean and fresh on the palate, well balanced with hints of sherbet and a crisp finish. pairing: an ideal accompaniment to chicken, thai dishes or dessert. south eastern australia, australia. alcohol 5%',
    category: 'Wine',
    price: '749',
    published: true,
    order: 2
  },
  {
    name: 'CASAS DEL BOSQUE La Cantera Sauvignon Blanc',
    description: 'Appearance: pale straw color with green reflections. nose: aromatic layers of grapefruit, boxwood and passion fruit. palate: on the palate the wine is dry and lively, with citrus and herbaceous notes and a very refreshing acidity. pairing: ideally between 6 and 8C, with shellfish such as oysters or grilled fish, herbs, green olives, chutney and goat cheeses. casablanca valley, central valley, chile. alcohol 13.5%',
    category: 'Wine',
    price: '1099',
    published: true,
    order: 3
  },
  {
    name: 'COLLE CORVIANO Pinot Grigio Colline Pescaresi IGP',
    description: 'Appearance: pale straw with light green hues. nose: bouquet of white fruits, ripe golden apples and pears. palate: refreshing ripe apple and peach notes end with a gentle acidity, a round, lightly floral wine. pairing: superb with light salads and marinated white meats. abruzzo, italy. alcohol 12%',
    category: 'Wine',
    price: '949',
    published: true,
    order: 4
  },
  {
    name: 'CLEARWATER COVE Sauvignon Blanc',
    description: 'Appearance: bright straw colour with slight green hues. nose: lifted and fresh with notes of passion fruit and grapefruit. palate: sweet fruit characters and fresh acidity combine to create a wine brimming with varietal character. pairing: enjoy slightly chilled with fresh fish, oyster, salt and pepper squid, chicken pasta or soft cheeses. marlborough, south island, new zealand. alcohol 12.5%',
    category: 'Wine',
    price: '999',
    published: true,
    order: 5
  },
  {
    name: 'LISTEL Grain De Gris Rose Terres Du Midi IGP',
    description: 'Appearance: shiny salmon pink. nose: a seductive scent of red berries and a floral nose with pleasant and inviting aromas. palate: fresh, fruity and juicy with a persistent flavourful texture. pairing: serve well chilled as aperitif or with white meat, poultry, sea fish or soft cheese. saintes-maries-de-la-mer, provence, france. alcohol 11.5%',
    category: 'Wine',
    price: '949',
    published: true,
    order: 6
  },
  {
    name: 'LOUIS PERDRIER Brut Rose NV',
    description: 'Appearance: nice rose colour and a persistent mousse followed by numerous and fine bubbles. nose: forward red fruits scents combined with citrus aromas. palate: well-balanced, with pronounced ripe raspberry candy flavors, a soft and lightly sweet gentle sparkling wine. pairing: ideal for parties and receptions. burgundy, france. alcohol 11%',
    category: 'Wine',
    price: '849',
    published: true,
    order: 7
  },
  {
    name: 'VAL D\'OCA Prosecco Blu Millesimato Extra Dry',
    description: 'Appearance: lively perlage, limpid and transparent. nose: pleasant floral and fruity notes of wisteria and rose, golden apple, pear, melon and hazelnut. palate: intense, fresh and soft, with a nice flavor and effervescence. pairing: excellent served chilled as a toast at the beginning of a meal. prosecco, veneto, italy. alcohol 11%',
    category: 'Wine',
    price: '999',
    published: true,
    order: 8
  },
  {
    name: 'CRANSWICK Lakefield Shiraz',
    description: 'Appearance: deep plum colour with purple hues. nose: intense black cherries supported by hints of vanilla, chocolate and earthy aromas. palate: sweet cherry fruit flavours with silky cocoa, chocolate tannins. pairing: an ideal accompaniment to red meat dishes. south eastern australia, australia. alcohol 13%',
    category: 'Wine',
    price: '849',
    published: true,
    order: 9
  },
  {
    name: 'CASAS DEL BOSQUE Gran Reserva Cabernet Sauvignon',
    description: 'Appearance: deep and intense purple. nose: aromas of cassis and mint and notes of dried figs and raspberries, barrel ageing adds notes of vanilla and spices. palate: ripe and well integrated tannins, resulting in a dense and concentrated wine of good length. pairing: excellent with grilled lamb or any roasted red meats and cheeses. maipo valley, central valley, chile. alcohol 14.5%',
    category: 'Wine',
    price: '1099',
    published: true,
    order: 10
  },
  {
    name: 'CANTINA TOLLO Gufo Merlot',
    description: 'Appearance: intense ruby red with violet hues. nose: sweeping fruity notes of ripe plums, morello cherries, blackberries and other berry fruits. palate: extremely fresh and very well structured, tannins are reserved but give the wine a good texture. pairing: pasta and roasted meat, pizza and medium aged cheeses. abruzzo, italy. alcohol 13%',
    category: 'Wine',
    price: '849',
    published: true,
    order: 11
  },
  {
    name: 'CANTINE PIROVANO Collezione Primitivo Puglia IGT',
    description: 'Appearance: very intense red. nose: aromas of violet and red fruits, with ripe plum, cocoa and leather. palate: great structure and concentration, silky with spicy undertones, pleasant tannins and long finish. pairing: very good with rich dishes, grilled meat, beef stew, and hard cheeses. puglia, italy. alcohol 14%',
    category: 'Wine',
    price: '999',
    published: true,
    order: 12
  },
  {
    name: 'Twinings Green Jasmine Pot Of Tea',
    description: 'Green tea with a light scent of jasmine flowers, providing a refreshing aroma that is tempting every time you drink it.',
    category: 'Twining\'s Tea',
    price: '60',
    published: true,
    order: 1
  },
  {
    name: 'Twinings English Breakfast Pot Of Tea',
    description: 'Start every day with a cup of twinings english breakfast. the heavenly combination of rich assam, ceylon, and kenyan teas is what makes it the perfect morning brew.',
    category: 'Twining\'s Tea',
    price: '60',
    published: true,
    order: 2
  },
  {
    name: 'Twinings Ceylon Pot Of Tea',
    description: 'Crisp, rounded & refreshing. sri lanka, previously known as ceylon, is often described as the pearl of the indian ocean. the high altitude gives the tea a deliciously refreshing quality.',
    category: 'Twining\'s Tea',
    price: '60',
    published: true,
    order: 3
  },
  {
    name: 'Twinings Darjeeling Pot Of Tea',
    description: 'Light and delicate with a subtle fragrant edge. known as the champagne of teas, the combination of first and second flush teas in this blend gives a beautiful, unique and delicate flavour.',
    category: 'Twining\'s Tea',
    price: '60',
    published: true,
    order: 4
  },
  {
    name: 'Twinings Peach Pot Of Tea',
    description: 'A fine tea with a refreshing taste of perfectly ripe peaches, combining fine tea leaves with a light flavor and the gentle sweetness of peaches.',
    category: 'Twining\'s Tea',
    price: '60',
    published: true,
    order: 5
  },
  {
    name: 'Twinings Earl Grey Pot Of Tea',
    description: 'A tea for people who like things a little different, who travel off the beaten track, who don\'t always play by the rules.',
    category: 'Twining\'s Tea',
    price: '60',
    published: true,
    order: 6
  },
  {
    name: 'Twinings Wild Berry Pot Of Tea',
    description: 'Black tea deliciously flavoured with four red fruit flavours - blackberry, blackcurrant, strawberry and raspberry.',
    category: 'Twining\'s Tea',
    price: '60',
    published: true,
    order: 7
  },
  {
    name: 'Twinings Camomile Pot Of Tea',
    description: 'A golden infusion which is slightly sweet and floral, traditionally used to help you relax. made with all-natural ingredients, naturally caffeine free with no added sugar.',
    category: 'Twining\'s Tea',
    price: '60',
    published: true,
    order: 8
  },
  {
    name: 'Twinings Pure Peppermint Pot Of Tea',
    description: 'Cool and invigorating, expertly created peppermint infusion to help you feel refreshed and ready for the day with each sip.',
    category: 'Twining\'s Tea',
    price: '60',
    published: true,
    order: 9
  },
  {
    name: 'ASAHI',
    description: 'Full Pint 140/ Half Pint 75',
    category: 'Beers & Ciders',
    price: '140',
    published: true,
    order: 1
  },
  {
    name: 'HEINEKEN',
    description: 'Full Pint 140/ Half Pint 75',
    category: 'Beers & Ciders',
    price: '140',
    published: true,
    order: 2
  },
  {
    name: 'BUDWEISER',
    description: 'Budweiser 0.5cl 130b .25cl 65',
    category: 'Beers & Ciders',
    price: '130',
    published: true,
    order: 3
  },
  {
    name: 'TIGER',
    description: 'Pint 120/ Half Pint 65',
    category: 'Beers & Ciders',
    price: '120',
    published: true,
    order: 4
  },
  {
    name: 'GUINNESS',
    description: 'Pint 260/ Half Pint 140',
    category: 'Beers & Ciders',
    price: '260',
    published: true,
    order: 5
  },
  {
    name: 'HENRY WESTONS VINTAGE',
    description: 'Pint 220/ Half Pint 115',
    category: 'Beers & Ciders',
    price: '220',
    published: true,
    order: 6
  },
  {
    name: 'STELLA ARTOIS',
    description: 'Pint 219/Half Pint 120',
    category: 'Beers & Ciders',
    price: '219',
    published: true,
    order: 7
  },
  {
    name: 'BLACK & TAN',
    description: 'Pint 260/ Half Pint 140',
    category: 'Beers & Ciders',
    price: '260',
    published: true,
    order: 8
  },
  {
    name: 'BLACK VELVET',
    description: 'Pint 260/ Half Pint 140',
    category: 'Beers & Ciders',
    price: '260',
    published: true,
    order: 9
  },
  {
    name: 'SNAKEBITE',
    description: 'Pint 190/ Half Pint 100',
    category: 'Beers & Ciders',
    price: '190',
    published: true,
    order: 10
  },
  {
    name: 'HEINEKEN (Bottle/Can)',
    description: '',
    category: 'Beers & Ciders',
    price: '99',
    published: true,
    order: 11
  },
  {
    name: 'HEINEKEN ZERO ALC',
    description: '',
    category: 'Beers & Ciders',
    price: '95',
    published: true,
    order: 12
  },
  {
    name: 'SAN MIGUEL LIGHT',
    description: '',
    category: 'Beers & Ciders',
    price: '99',
    published: true,
    order: 13
  },
  {
    name: 'SAN MIGUEL ZERO SUGAR',
    description: '',
    category: 'Beers & Ciders',
    price: '95',
    published: true,
    order: 14
  },
  {
    name: 'TIGER (Bottle/Can)',
    description: '',
    category: 'Beers & Ciders',
    price: '95',
    published: true,
    order: 15
  },
  {
    name: 'CHANG',
    description: '',
    category: 'Beers & Ciders',
    price: '90',
    published: true,
    order: 16
  },
  {
    name: 'SINGHA',
    description: '',
    category: 'Beers & Ciders',
    price: '90',
    published: true,
    order: 17
  },
  {
    name: 'MY BEER',
    description: '',
    category: 'Beers & Ciders',
    price: '90',
    published: true,
    order: 18
  },
  {
    name: 'LEO',
    description: '',
    category: 'Beers & Ciders',
    price: '90',
    published: true,
    order: 19
  },
  {
    name: 'BUDWEISER (Bottle/Can)',
    description: '',
    category: 'Beers & Ciders',
    price: '99',
    published: true,
    order: 20
  },
  {
    name: 'STOWFORD PRESS DARK BERRY',
    description: 'A refreshing sparkling cider that is bursting with blackcurrant and blackberry richness',
    category: 'Beers & Ciders',
    price: '170',
    published: true,
    order: 21
  },
  {
    name: 'KOPPARBERG STRAWBERRY & LIME',
    description: 'Bottled Cider with a taste of fresh Strawberry and a hint of Lime',
    category: 'Beers & Ciders',
    price: '280',
    published: true,
    order: 22
  },
  {
    name: 'STRONGBOW CIDER',
    description: 'Dry Cider 440ml Can',
    category: 'Beers & Ciders',
    price: '220',
    published: true,
    order: 23
  },
  {
    name: 'MAGNERS IRISH CIDER',
    description: '500ml Can',
    category: 'Beers & Ciders',
    price: '220',
    published: true,
    order: 24
  },
  {
    name: 'HOUSE RED',
    description: 'Glass 170 / Corkage 400',
    category: 'House Wine',
    price: '170',
    published: true,
    order: 1
  },
  {
    name: 'HOUSE WHITE',
    description: 'Glass 170 / Corkage 400',
    category: 'House Wine',
    price: '170',
    published: true,
    order: 2
  },
  {
    name: 'House Brandy',
    description: '',
    category: 'Spirits',
    price: '85',
    published: true,
    order: 1
  },
  {
    name: 'Hennessey VS',
    description: '',
    category: 'Spirits',
    price: '160',
    published: true,
    order: 2
  },
  {
    name: 'House Gin (Two Trees)',
    description: '160 Double',
    category: 'Spirits',
    price: '85',
    published: true,
    order: 3
  },
  {
    name: 'Gordons',
    description: '',
    category: 'Spirits',
    price: '120',
    published: true,
    order: 4
  },
  {
    name: 'Beefeater',
    description: '',
    category: 'Spirits',
    price: '120',
    published: true,
    order: 5
  },
  {
    name: 'Beefeater 24',
    description: '',
    category: 'Spirits',
    price: '120',
    published: true,
    order: 6
  },
  {
    name: 'Bombay Sapphire',
    description: '',
    category: 'Spirits',
    price: '130',
    published: true,
    order: 7
  },
  {
    name: 'Sangsom',
    description: '80/150Dbl',
    category: 'Spirits',
    price: '80',
    published: true,
    order: 8
  },
  {
    name: 'Bacardi',
    description: '',
    category: 'Spirits',
    price: '120',
    published: true,
    order: 9
  },
  {
    name: 'Malibu',
    description: '',
    category: 'Spirits',
    price: '120',
    published: true,
    order: 10
  },
  {
    name: 'Captain Morgan',
    description: '',
    category: 'Spirits',
    price: '130',
    published: true,
    order: 11
  },
  {
    name: 'Bundaberg',
    description: 'All inc mixer (Exc Red Bull)',
    category: 'Spirits',
    price: '150',
    published: true,
    order: 12
  },
  {
    name: 'House Vodka (Two Trees)',
    description: '160 Double',
    category: 'Spirits',
    price: '85',
    published: true,
    order: 13
  },
  {
    name: 'Absolut',
    description: '',
    category: 'Spirits',
    price: '130',
    published: true,
    order: 14
  },
  {
    name: 'Smirnoff',
    description: '',
    category: 'Spirits',
    price: '120',
    published: true,
    order: 15
  },
  {
    name: 'Stolichnaya',
    description: '',
    category: 'Spirits',
    price: '120',
    published: true,
    order: 16
  },
  {
    name: 'Grey Goose',
    description: '',
    category: 'Spirits',
    price: '150',
    published: true,
    order: 17
  },
  {
    name: 'Vodka Redbull',
    description: '',
    category: 'Spirits',
    price: '170',
    published: true,
    order: 18
  },
  {
    name: 'House Whiskey',
    description: '120 Double',
    category: 'Spirits',
    price: '70',
    published: true,
    order: 19
  },
  {
    name: 'JW Red Label',
    description: '',
    category: 'Spirits',
    price: '130',
    published: true,
    order: 20
  },
  {
    name: 'JW Black Label',
    description: '',
    category: 'Spirits',
    price: '160',
    published: true,
    order: 21
  },
  {
    name: 'Chivas Regal',
    description: '',
    category: 'Spirits',
    price: '150',
    published: true,
    order: 22
  },
  {
    name: 'Famous Grouse',
    description: '',
    category: 'Spirits',
    price: '150',
    published: true,
    order: 23
  },
  {
    name: 'Glenfiddich Single Malt',
    description: '',
    category: 'Spirits',
    price: '225',
    published: true,
    order: 24
  },
  {
    name: 'Grants',
    description: '',
    category: 'Spirits',
    price: '250',
    published: true,
    order: 25
  },
  {
    name: 'Jamesons',
    description: '',
    category: 'Spirits',
    price: '150',
    published: true,
    order: 26
  },
  {
    name: 'Canadian Club',
    description: '',
    category: 'Spirits',
    price: '140',
    published: true,
    order: 27
  },
  {
    name: 'Jim Beam',
    description: '',
    category: 'Spirits',
    price: '130',
    published: true,
    order: 28
  },
  {
    name: 'Jack Daniels',
    description: '',
    category: 'Spirits',
    price: '150',
    published: true,
    order: 29
  },
  {
    name: 'Southern Comfort',
    description: '',
    category: 'Spirits',
    price: '130',
    published: true,
    order: 30
  },
  {
    name: 'Wild Turkey',
    description: '',
    category: 'Spirits',
    price: '150',
    published: true,
    order: 31
  },
  {
    name: 'Sierra Silver Tequila',
    description: '',
    category: 'Spirits',
    price: '120',
    published: true,
    order: 32
  },
  {
    name: 'El Toro Tequila',
    description: '',
    category: 'Spirits',
    price: '60',
    published: true,
    order: 33
  },
  {
    name: 'Sambuca Shot',
    description: '',
    category: 'Spirits',
    price: '80',
    published: true,
    order: 34
  },
  {
    name: 'Black Sambuca',
    description: '',
    category: 'Spirits',
    price: '80',
    published: true,
    order: 35
  },
  {
    name: 'English Breakfast Tea',
    description: '',
    category: 'Coffee & Tea',
    price: '65',
    published: true,
    order: 1
  },
  {
    name: 'Ceylon Tea',
    description: '',
    category: 'Coffee & Tea',
    price: '65',
    published: true,
    order: 2
  },
  {
    name: 'Darjeeling Tea',
    description: '',
    category: 'Coffee & Tea',
    price: '65',
    published: true,
    order: 3
  },
  {
    name: 'Earl Grey Tea',
    description: '',
    category: 'Coffee & Tea',
    price: '65',
    published: true,
    order: 4
  },
  {
    name: 'Peach Tea',
    description: '',
    category: 'Coffee & Tea',
    price: '65',
    published: true,
    order: 5
  },
  {
    name: 'Wild Berry Tea',
    description: '',
    category: 'Coffee & Tea',
    price: '65',
    published: true,
    order: 6
  },
  {
    name: 'Peppermint Tea',
    description: '',
    category: 'Coffee & Tea',
    price: '65',
    published: true,
    order: 7
  },
  {
    name: 'Chamomile Tea',
    description: '',
    category: 'Coffee & Tea',
    price: '65',
    published: true,
    order: 8
  },
  {
    name: 'Cup of Hot Tea',
    description: '',
    category: 'Coffee & Tea',
    price: '50',
    published: true,
    order: 9
  },
  {
    name: 'Van Houten Hot Chocolate',
    description: '',
    category: 'Coffee & Tea',
    price: '75',
    published: true,
    order: 10
  },
  {
    name: 'Glass of Milk',
    description: '',
    category: 'Coffee & Tea',
    price: '70',
    published: true,
    order: 11
  },
  {
    name: 'Extra Honey',
    description: '',
    category: 'Coffee & Tea',
    price: '15',
    published: true,
    order: 12
  },
  {
    name: 'Regular Coffee',
    description: '',
    category: 'Coffee & Tea',
    price: '80',
    published: true,
    order: 13
  },
  {
    name: 'Espresso',
    description: '',
    category: 'Coffee & Tea',
    price: '60',
    published: true,
    order: 14
  },
  {
    name: 'Americano',
    description: '',
    category: 'Coffee & Tea',
    price: '80',
    published: true,
    order: 15
  },
  {
    name: 'Cappuccino',
    description: '',
    category: 'Coffee & Tea',
    price: '80',
    published: true,
    order: 16
  },
  {
    name: 'Mocha',
    description: '',
    category: 'Coffee & Tea',
    price: '80',
    published: true,
    order: 17
  },
  {
    name: 'Cafe Latte',
    description: '',
    category: 'Coffee & Tea',
    price: '80',
    published: true,
    order: 18
  },
  {
    name: 'Latte Macchiato',
    description: 'Tall Espresso & Steamed Milk',
    category: 'Coffee & Tea',
    price: '80',
    published: true,
    order: 19
  },
  {
    name: 'Macchiato',
    description: 'Espresso with Dash of Steamed Milk',
    category: 'Coffee & Tea',
    price: '70',
    published: true,
    order: 20
  },
  {
    name: 'Coffee Crema',
    description: 'Coffee with Foam',
    category: 'Coffee & Tea',
    price: '80',
    published: true,
    order: 21
  },
  {
    name: 'Flat White',
    description: 'Micro-Foamed Milk Poured over Espresso',
    category: 'Coffee & Tea',
    price: '80',
    published: true,
    order: 22
  },
  {
    name: 'Lungo',
    description: 'Espresso Made with more Water',
    category: 'Coffee & Tea',
    price: '80',
    published: true,
    order: 23
  },
  {
    name: 'Ristretto',
    description: 'Espresso made with less Water - Extra Kick!',
    category: 'Coffee & Tea',
    price: '80',
    published: true,
    order: 24
  },
  {
    name: 'Iced Coffee',
    description: '',
    category: 'Coffee & Tea',
    price: '95',
    published: true,
    order: 25
  },
  {
    name: 'Iced Latte',
    description: '',
    category: 'Coffee & Tea',
    price: '95',
    published: true,
    order: 26
  },
  {
    name: 'Iced Cappuccino',
    description: '',
    category: 'Coffee & Tea',
    price: '95',
    published: true,
    order: 27
  },
  {
    name: 'Iced Tea',
    description: '',
    category: 'Coffee & Tea',
    price: '85',
    published: true,
    order: 28
  },
  {
    name: 'Soda / Tonic Water',
    description: '',
    category: 'Soft Drinks & Shakes',
    price: '50',
    published: true,
    order: 1
  },
  {
    name: 'Bottled Water',
    description: '',
    category: 'Soft Drinks & Shakes',
    price: '50',
    published: true,
    order: 2
  },
  {
    name: 'Banana Shake',
    description: '',
    category: 'Soft Drinks & Shakes',
    price: '120',
    published: true,
    order: 3
  },
  {
    name: 'Lemon Shake',
    description: '',
    category: 'Soft Drinks & Shakes',
    price: '120',
    published: true,
    order: 4
  },
  {
    name: 'Watermelon Shake',
    description: '',
    category: 'Soft Drinks & Shakes',
    price: '120',
    published: true,
    order: 5
  },
  {
    name: 'Pineapple Shake',
    description: '',
    category: 'Soft Drinks & Shakes',
    price: '120',
    published: true,
    order: 6
  },
  {
    name: 'Mixed Shake',
    description: 'Mix of 2-3 Shakes',
    category: 'Soft Drinks & Shakes',
    price: '140',
    published: true,
    order: 7
  },
  {
    name: 'Sprite',
    description: '',
    category: 'Soft Drinks & Shakes',
    price: '60',
    published: true,
    order: 8
  },
  {
    name: 'Fanta',
    description: '',
    category: 'Soft Drinks & Shakes',
    price: '60',
    published: true,
    order: 9
  },
  {
    name: 'Coke',
    description: '',
    category: 'Soft Drinks & Shakes',
    price: '60',
    published: true,
    order: 10
  },
  {
    name: 'Diet Coke/Coke Zero',
    description: '',
    category: 'Soft Drinks & Shakes',
    price: '60',
    published: true,
    order: 11
  },
  {
    name: 'Schweppes Lime',
    description: '',
    category: 'Soft Drinks & Shakes',
    price: '60',
    published: true,
    order: 12
  },
  {
    name: 'Syrup & Soda',
    description: '',
    category: 'Soft Drinks & Shakes',
    price: '60',
    published: true,
    order: 13
  },
  {
    name: 'Lipo / Red Bull',
    description: '',
    category: 'Soft Drinks & Shakes',
    price: '50',
    published: true,
    order: 14
  },
  {
    name: 'Lipton Ice Tea',
    description: '',
    category: 'Soft Drinks & Shakes',
    price: '50',
    published: true,
    order: 15
  },
  {
    name: 'Apple Juice',
    description: '',
    category: 'Soft Drinks & Shakes',
    price: '70',
    published: true,
    order: 16
  },
  {
    name: 'Orange Juice',
    description: '',
    category: 'Soft Drinks & Shakes',
    price: '70',
    published: true,
    order: 17
  },
  {
    name: 'Lemon Juice',
    description: '',
    category: 'Soft Drinks & Shakes',
    price: '70',
    published: true,
    order: 18
  },
  {
    name: 'Pineapple Juice',
    description: '',
    category: 'Soft Drinks & Shakes',
    price: '70',
    published: true,
    order: 19
  },
  {
    name: 'Tomato Juice',
    description: '',
    category: 'Soft Drinks & Shakes',
    price: '70',
    published: true,
    order: 20
  },
  {
    name: 'Cranberry Juice',
    description: '',
    category: 'Soft Drinks & Shakes',
    price: '85',
    published: true,
    order: 21
  },
  {
    name: 'Sex on the Beach',
    description: '',
    category: 'Cocktails & Alcopops',
    price: '185',
    published: true,
    order: 1
  },
  {
    name: 'Long Island',
    description: '',
    category: 'Cocktails & Alcopops',
    price: '195',
    published: true,
    order: 2
  },
  {
    name: 'White Russian',
    description: '',
    category: 'Cocktails & Alcopops',
    price: '195',
    published: true,
    order: 3
  },
  {
    name: 'Margarita',
    description: '',
    category: 'Cocktails & Alcopops',
    price: '185',
    published: true,
    order: 4
  },
  {
    name: 'Pina Colada',
    description: '',
    category: 'Cocktails & Alcopops',
    price: '185',
    published: true,
    order: 5
  },
  {
    name: 'Bloody Mary',
    description: '',
    category: 'Cocktails & Alcopops',
    price: '135',
    published: true,
    order: 6
  },
  {
    name: 'B52',
    description: '',
    category: 'Cocktails & Alcopops',
    price: '135',
    published: true,
    order: 7
  },
  {
    name: 'Mojito',
    description: '',
    category: 'Cocktails & Alcopops',
    price: '185',
    published: true,
    order: 8
  },
  {
    name: 'Mai Tai',
    description: '',
    category: 'Cocktails & Alcopops',
    price: '185',
    published: true,
    order: 9
  },
  {
    name: 'Purple Haze',
    description: '',
    category: 'Cocktails & Alcopops',
    price: '185',
    published: true,
    order: 10
  },
  {
    name: 'Black Russian',
    description: '',
    category: 'Cocktails & Alcopops',
    price: '195',
    published: true,
    order: 11
  },
  {
    name: 'Blowjob',
    description: '',
    category: 'Cocktails & Alcopops',
    price: '135',
    published: true,
    order: 12
  },
  {
    name: 'Blue Margarita',
    description: '',
    category: 'Cocktails & Alcopops',
    price: '185',
    published: true,
    order: 13
  },
  {
    name: 'Blue Hawaii',
    description: '',
    category: 'Cocktails & Alcopops',
    price: '185',
    published: true,
    order: 14
  },
  {
    name: 'Expresso Martini',
    description: '',
    category: 'Cocktails & Alcopops',
    price: '185',
    published: true,
    order: 15
  },
  {
    name: 'Gin Fizz',
    description: '',
    category: 'Cocktails & Alcopops',
    price: '185',
    published: true,
    order: 16
  },
  {
    name: 'Jager Bomb',
    description: '',
    category: 'Cocktails & Alcopops',
    price: '185',
    published: true,
    order: 17
  },
  {
    name: 'Martini Dry',
    description: '',
    category: 'Cocktails & Alcopops',
    price: '175',
    published: true,
    order: 18
  },
  {
    name: 'Slippery Nipple',
    description: '',
    category: 'Cocktails & Alcopops',
    price: '185',
    published: true,
    order: 19
  },
  {
    name: 'Dry Martini Cocktail',
    description: '',
    category: 'Cocktails & Alcopops',
    price: '185',
    published: true,
    order: 20
  },
  {
    name: 'Tequila Sunrise',
    description: '',
    category: 'Cocktails & Alcopops',
    price: '185',
    published: true,
    order: 21
  },
  {
    name: 'SMIRNOFF Ice Original',
    description: 'Crisp, Taste, Bubbly Finish, A Natural Lemon Line Flavour',
    category: 'Cocktails & Alcopops',
    price: '130',
    published: true,
    order: 22
  },
  {
    name: 'SPY Classic',
    description: 'Wine Cooler with a fresh and fruity taste',
    category: 'Cocktails & Alcopops',
    price: '90',
    published: true,
    order: 23
  },
  {
    name: 'SPY Red',
    description: 'Wine Cooler with a fresh and fruity taste',
    category: 'Cocktails & Alcopops',
    price: '90',
    published: true,
    order: 24
  },
];
