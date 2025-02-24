const Recipe = require("../models/Recipe");
const mongoose = require("mongoose");
class RecipeController {
  static getAllRecipes = async (req, res) => {
    try {
      const recipes = await Recipe.find();
      res.status(200).json({
        success: "Succès de la récupération des recettes",
        recipes,
      });
    } catch (err) {
      res.status(500).json({
        error: "Erreur lors du chargement des recettes",
        details: err.message,
      });
    }
  };

  // const Recipe = require("../models/Recipe");

  // class RecipeController {
  //   static getRecipes = async (req, res) => {
  //     try {
  //       const recipes = await Recipe.find();
  //       res.json(recipes);
  //     } catch (err) {
  //       res.status(500).json({
  //         message: "Erreur lors du chargement des recettes",
  //         error: err,
  //       });
  //     }
  //   };

  // static getUserRecipes = async (req, res) => {
  //   try {
  //     const userId = req.user.id;
  //     const recipes = await Recipe.find({ userId });
  //     res.json(recipes);
  //   } catch (err) {
  //     res.status(500).json({
  //       message: "Erreur lors du chargement des recettes",
  //       error: err,
  //     });
  //   }
  // };

  static addRecipe = async (req, res) => {
    try {
      const {
        name,
        difficulty,
        cost,
        preparation_time,
        category,
        ingredients_and_quantities,
        steps,
      } = req.body;

      const parsedPreparationTime = JSON.parse(preparation_time);
      const parsedIngredients = JSON.parse(ingredients_and_quantities);
      const parsedSteps = JSON.parse(steps);

      const user_id = req.user.id;
      const picture = req.file ? `img/recipes/${req.file.filename}` : "";
      const newRecipe = new Recipe({
        user_id,
        name,
        difficulty,
        cost,
        picture,
        preparation_time: parsedPreparationTime,
        category,
        ingredients_and_quantities: parsedIngredients,
        steps: parsedSteps,
      });
      await newRecipe.save();
      res
        .status(201)
        .json({ success: "Reccete ajouté avec succès", recipe: newRecipe });
    } catch (err) {
      res
        .status(500)
        .json({
          error: "Erreur lors de l'ajout du recette",
          details: err.message,
        });
    }
  };
}

module.exports = RecipeController;
