import "../../styles/atoms/RecipeCardSkeleton.css";

const RecipeCardSkeleton = () => {
  return (
    <div className="recipe-card-skeleton">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-author"></div>
        <div className="skeleton-details">
          <div className="skeleton-detail"></div>
          <div className="skeleton-detail"></div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCardSkeleton; 