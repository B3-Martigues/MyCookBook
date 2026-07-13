const bcrypt = require("bcryptjs");
const mongoose = require("../config/db");
const User = require("../models/User");
const Recipe = require("../models/Recipe");

const demoUsers = [
  { name: "Alice Martin", email: "alice@mycookbook.test" },
  { name: "Karim Dupont", email: "karim@mycookbook.test" },
];

const recipes = [
  {
    ownerEmail: "alice@mycookbook.test",
    name: "Pancakes moelleux",
    category: "Petit-déjeuner",
    difficulty: "Facile",
    cost: "Faible",
    preparation_time: { hours: 0, minutes: 20 },
    ingredients_and_quantities: [
      { name: "Farine", quantity: "200 g" },
      { name: "Lait", quantity: "25 cl" },
      { name: "Œufs", quantity: "2" },
      { name: "Sucre", quantity: "2 c. à soupe" },
    ],
    steps: [
      { step_number: 1, description: "Mélanger les ingrédients secs." },
      { step_number: 2, description: "Ajouter les œufs et le lait, puis fouetter." },
      { step_number: 3, description: "Cuire les pancakes dans une poêle chaude." },
    ],
    average_rating: 4.5,
  },
  {
    ownerEmail: "karim@mycookbook.test",
    name: "Curry de légumes",
    category: "Plat principal",
    difficulty: "Moyen",
    cost: "Moyen",
    preparation_time: { hours: 0, minutes: 45 },
    ingredients_and_quantities: [
      { name: "Pois chiches", quantity: "400 g" },
      { name: "Lait de coco", quantity: "40 cl" },
      { name: "Légumes variés", quantity: "500 g" },
      { name: "Curry", quantity: "2 c. à café" },
    ],
    steps: [
      { step_number: 1, description: "Découper et faire revenir les légumes." },
      { step_number: 2, description: "Ajouter le curry, les pois chiches et le lait de coco." },
      { step_number: 3, description: "Laisser mijoter pendant 25 minutes." },
    ],
    average_rating: 4.2,
  },
  {
    ownerEmail: "alice@mycookbook.test",
    name: "Mousse au chocolat",
    category: "Dessert",
    difficulty: "Facile",
    cost: "Faible",
    preparation_time: { hours: 0, minutes: 25 },
    ingredients_and_quantities: [
      { name: "Chocolat noir", quantity: "200 g" },
      { name: "Œufs", quantity: "6" },
      { name: "Sel", quantity: "1 pincée" },
    ],
    steps: [
      { step_number: 1, description: "Faire fondre le chocolat." },
      { step_number: 2, description: "Incorporer les jaunes puis les blancs montés en neige." },
      { step_number: 3, description: "Réserver au frais pendant au moins 3 heures." },
    ],
    average_rating: 4.8,
  },
];

async function seed() {
  const password = await bcrypt.hash("Demo123!", 12);
  const usersByEmail = {};

  for (const data of demoUsers) {
    const user = await User.findOneAndUpdate(
      { email: data.email },
      { $set: { ...data, password }, $setOnInsert: { favorites_recipes: [] } },
      { new: true, upsert: true, runValidators: true }
    );
    usersByEmail[data.email] = user;
  }

  const demoUserIds = Object.values(usersByEmail).map((user) => user._id);
  await Recipe.deleteMany({ user_id: { $in: demoUserIds } });

  await Recipe.insertMany(
    recipes.map(({ ownerEmail, ...recipe }) => ({
      ...recipe,
      user_id: usersByEmail[ownerEmail]._id,
    }))
  );

  console.log(`Seed terminé : ${demoUsers.length} utilisateurs et ${recipes.length} recettes.`);
  console.log("Connexion démo : alice@mycookbook.test / Demo123!");
}

seed()
  .catch((error) => {
    console.error("Échec du seed :", error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.connection.close());
