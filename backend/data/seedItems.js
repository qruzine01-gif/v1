module.exports = {
  Appetizers: [
    {
      name: "Garlic Bread Supreme",
      description: "Toasted baguette with herbed garlic butter",
      basePrice: 99,
      isVegetarian: true,
      image: "https://plus.unsplash.com/premium_photo-1711752902734-a36167479983?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z2FybGljJTIwYnJlYWR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=1000", // garlic bread
      preparationTime: 10,
    },
    {
      name: "Chicken Tikka Bites",
      description: "Smoky, spiced chicken skewers with mint dip",
      basePrice: 219,
      image: "https://plus.unsplash.com/premium_photo-1695931841253-1e17e7ed59b5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hpY2tlbiUyMHRpa2thfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=1000", // chicken tikka
      preparationTime: 15,
    },
    {
      name: "Paneer Tikka",
      description: "Marinated cottage cheese grilled to perfection",
      basePrice: 199,
      isVegetarian: true,
      image: "https://images.unsplash.com/photo-1701579231320-cc2f7acad3cd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGFuZWVyJTIwdGlra2F8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=1000", // paneer tikka
      preparationTime: 14,
    },
    {
      name: "Stuffed Mushrooms",
      description: "Cheese and herb stuffed button mushrooms",
      basePrice: 179,
      isVegetarian: true,
      image: "https://plus.unsplash.com/premium_photo-1661367926799-1daa093587ae?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3R1ZmZlZCUyMG11c2hyb29tc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=1000", // stuffed mushrooms
      preparationTime: 12,
    },
  ],
  "Main Course": [
    {
      name: "Veg Biryani",
      description: "Aromatic basmati rice with seasonal vegetables",
      basePrice: 249,
      isVegetarian: true,
      image: "https://images.unsplash.com/photo-1630409346824-4f0e7b080087?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmVnJTIwYmlyeWFuaXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=1000", // veg biryani
      preparationTime: 25,
      variants: [
        { name: "Regular", price: 249, isAvailable: true },
        { name: "Large", price: 299, isAvailable: true },
      ],
    },
    {
      name: "Chicken Biryani",
      description: "Hyderabadi style biryani slow-cooked",
      basePrice: 299,
      image: "https://images.unsplash.com/photo-1701579231349-d7459c40919d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmlyeWFuaXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=1000", // chicken biryani
      preparationTime: 30,
      variants: [
        { name: "Regular", price: 299, isAvailable: true },
        { name: "Family", price: 549, isAvailable: true },
      ],
      isSpecialItem: true,
    },
    {
      name: "Butter Chicken",
      description: "Creamy tomato gravy with tender chicken",
      basePrice: 329,
      image: "https://plus.unsplash.com/premium_photo-1661419883163-bb4df1c10109?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687", // butter chicken
      preparationTime: 22,
      isSpecialItem: true,
    },
    {
      name: "Paneer Butter Masala",
      description: "Rich and creamy tomato-cashew gravy",
      basePrice: 299,
      isVegetarian: true,
      image: "https://images.unsplash.com/photo-1690401767645-595de0e0e5f8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGFuZWVyJTIwYnV0dGVyJTIwbWFzYWxhfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=1000", // paneer butter masala
    },
    {
      name: "Margherita Pizza",
      description: "Classic pizza with basil and mozzarella",
      basePrice: 399,
      isVegetarian: true,
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1169", // margherita pizza
      variants: [
        { name: "Medium", price: 399, isAvailable: true },
        { name: "Large", price: 499, isAvailable: true },
      ],
    },
    {
      name: "Pepperoni Pizza",
      description: "Loaded with pepperoni and cheese",
      basePrice: 449,
      image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVwcGVyb25pJTIwcGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=1000", // pepperoni pizza
      variants: [
        { name: "Medium", price: 449 },
        { name: "Large", price: 549 },
      ],
      isSpecialItem: true,
    },
  ],
  Desserts: [
    {
      name: "Gulab Jamun",
      description: "Warm syrupy dumplings",
      basePrice: 99,
      isVegetarian: true,
      image: "https://images.unsplash.com/photo-1646578515903-67873a5398f9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074", // gulab jamun
    },
    {
      name: "Brownie with Ice Cream",
      description: "Chocolate brownie topped with vanilla ice cream",
      basePrice: 179,
      isVegetarian: true,
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnJvd25pZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=1000", // brownie with ice cream
      isSpecialItem: true,
    },
    {
      name: "Cheesecake",
      description: "Creamy New York cheesecake",
      basePrice: 229,
      isVegetarian: true,
      image: "https://plus.unsplash.com/premium_photo-1722686461601-b2a018a4213b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hlZXNlY2FrZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=1000", // cheesecake
    },
  ],
  Beverages: [
    {
      name: "Masala Chai",
      description: "Spiced Indian tea",
      basePrice: 49,
      isVegetarian: true,
      isVegan: true,
      image: "https://images.unsplash.com/photo-1625033405953-f20401c7d848?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFzYWxhJTIwY2hhaXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=1000", // masala chai
    },
    {
      name: "Cold Coffee",
      description: "Iced coffee with cream",
      basePrice: 129,
      image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aWNlZCUyMGNvZmZlZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=1000", // cold coffee
      variants: [
        { name: "Classic", price: 129 },
        { name: "Mocha", price: 149 },
      ],
    },
    {
      name: "Fresh Orange Juice",
      description: "Freshly squeezed oranges",
      basePrice: 99,
      isVegetarian: true,
      isVegan: true,
      image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b3JhbmdlJTIwanVpY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=1000", // orange juice
    },
    {
      name: "Craft Beer",
      description: "Local brewery selection",
      basePrice: 199,
      image: "https://images.unsplash.com/photo-1581927903420-941a127cc108?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y3JhZnQlMjBiZWVyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=1000", // beer glass
    },
  ],
  "Chef's Specials": [
    {
      name: "Lamb Rogan Josh",
      description: "Kashmiri style slow cooked lamb curry",
      basePrice: 399,
      image: "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cm9hc3QlMjBsYW1ifGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=1000", // lamb curry
      isSpecialItem: true,
    },
    {
      name: "Truffle Pasta",
      description: "Creamy pasta infused with black truffle",
      basePrice: 459,
      isVegetarian: true,
      image: "https://plus.unsplash.com/premium_photo-1694850980288-b14bd7f9c458?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=681", // truffle pasta
      isSpecialItem: true,
    },
  ],
};