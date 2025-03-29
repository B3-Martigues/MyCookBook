import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faUtensils, faStar } from "@fortawesome/free-solid-svg-icons";
import "../../styles/organisms/Placeholder.css";

export const RecipeCardPlaceholder = () => {
  return (
    <div className="recipe-card-placeholder shimmer">
      <div className="img-container-placeholder">
        <div className="favorites-rating-placeholder">
          <div className="rating-placeholder">
            <FontAwesomeIcon icon={faStar} className="icon-placeholder" />
            <div className="text-placeholder"></div>
          </div>
        </div>
        <div className="img-placeholder"></div>
        <div className="recipe-info-placeholder">
          <div className="title-placeholder"></div>
          <div className="author-placeholder"></div>
          <div className="details-placeholder">
            <div className="detail-item-placeholder">
              <FontAwesomeIcon icon={faClock} className="icon-placeholder" />
              <div className="text-placeholder small"></div>
            </div>
            <div className="detail-item-placeholder">
              <FontAwesomeIcon icon={faUtensils} className="icon-placeholder" />
              <div className="text-placeholder small"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FeaturedRecipePlaceholder = () => {
  return (
    <div className="featured-recipe-placeholder shimmer">
      <div className="featured-image-placeholder"></div>
      <div className="featured-content-placeholder">
        <div className="featured-label-placeholder"></div>
        <div className="featured-title-placeholder"></div>
        <div className="featured-meta-placeholder">
          <div className="meta-item-placeholder"></div>
          <div className="meta-item-placeholder"></div>
          <div className="meta-item-placeholder"></div>
        </div>
      </div>
    </div>
  );
}; 