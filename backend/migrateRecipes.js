const mongoose = require("./config/db");
const Recipe = require("./models/Recipe");

async function migrate() {
  try {
    console.log("I stert the migration...");

    const recipes = await Recipe.find({});
    console.log(`Found ${recipes.length} recipes to process.`);

    for (const recipe of recipes) {
      try {
        console.log(`Processing recipe: ${recipe.name}`);

        if (recipe.steps && recipe.steps.length > 0) {
          console.log(
            `Found ${recipe.steps.length} steps in recipe: ${recipe.name}`
          );

          let needsUpdate = false;

          recipe.steps = recipe.steps.map((step) => {
            if (!step._id) {
              console.log(`Adding _id to step: ${step.step_number}`);
              needsUpdate = true;
              return { ...step, _id: new mongoose.Types.ObjectId() };
            }
            console.log(
              `Step ${step.step_number} already has _id: ${step._id}`
            );
            return step;
          });

          if (needsUpdate) {
            recipe.markModified("steps");
            await recipe.save();
            console.log(`Updated recipe: ${recipe.name}`);
          } else {
            console.log(`No changes needed for recipe: ${recipe.name}`);
          }
        } else {
          console.log(`No steps found in recipe: ${recipe.name}`);
        }
      } catch (error) {
        console.error(`Error updating recipe ${recipe.name}:`, error);
      }
    }

    console.log("Migration ended!");
  } catch (error) {
    console.error("Migration error :", error);
  } finally {
    await mongoose.disconnect();
  }
}

migrate();
