import Card from '../molecules/Card';

const ListRecipes = () => {
  // ... états et fonctions existants ...

  return (
    <div className="recipes-container">
      <div className="recipes-grid">
        {recipes.map((recipe) => (
          <Card
            key={recipe._id}
            recipe={recipe}
            favorites={favorites}
            setFavorites={setFavorites}
            ratingsData={ratingsData}
            onCardClick={(recipe) => setSelectedRecipe(recipe)}
            renderStars={renderStars}
          />
        ))}
      </div>

      {selectedRecipe && (
        <DetailsRecipe
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          favorites={favorites}
          setFavorites={setFavorites}
          updateRating={(recipeId, newRating) => {
            setRatingsData((prevRatings) => ({
              ...prevRatings,
              [recipeId]: newRating,
            }));
          }}
        />
      )}
    </div>
  );
}; 