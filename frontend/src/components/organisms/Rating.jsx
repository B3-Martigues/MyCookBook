import { addRating } from "../../api/ratingApi";
import { useState } from "react";
import useAuthStore from "../../store/AuthStore";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import "../../styles/organisms/Rating.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faStar } from "@fortawesome/free-solid-svg-icons";
const Rating = ({ recipeId }) => {
  const [ratingsData, setRatingsData] = useState({}); // Objet contenant les notes moyennes des recettes sous forme {idRecette: noteMoyenne}
  const [newRating, setNewRating] = useState(0); // Stocke la note sélectionnée avant validation
  const { isAuthenticated } = useAuthStore();
  const [hoverRating, setHoverRating] = useState(0); // Stocke la note temporaire lorsqu'on survole les étoiles

  // Mise à jour de la note sélectionné par l'utilisateur
  const handleRatingChange = (rating) => {
    setNewRating(rating);
  };

  // Envoi de la note au backend après confirmation
  const handleSubmitRating = async () => {
    try {
      // Seul un utilisateur peut noter les recettes
      if (!isAuthenticated) {
        toast("Vous devez être connecté pour noter une recette");
        return;
      }
      const response = await addRating(recipeId, newRating);
      if (response.error) {
        console.error("Erreur lors de l'ajout de la note", response.error);
        toast("La note n'a pas été enregistrée");
        return;
      }
      // Mise à jour des notes dans l'état local
      setRatingsData((prevRatings) => ({
        ...prevRatings,
        [recipeId]: newRating,
      }));
      // Réinitialisation de la note sélectionnée
      setNewRating(0);
      toast("Votre note a été enregistrée !");
    } catch (err) {
      toast("Une erreur s'est produite. Veuillez réessayer");
      console.error(`Erreur: ${err}`);
    }
  };

  // Un effect interactive du style après avoir ciblé une des etoiles avec le cursor,
  const handleMouseEnter = (rating) => {
    setHoverRating(rating);
  };
  // Suppression de l'effet de survol après sortie du curseur
  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  return (
    <div>
      <div className="rating">
        {/* Affichage dynamique des étoiles*/}
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${
              star <= (hoverRating || newRating) ? "green" : "" // Condition ternaire pour le hover
            } `}
            onMouseEnter={() => handleMouseEnter(star)}
            onClick={() => handleRatingChange(star)}
            onMouseLeave={handleMouseLeave}
            data-tooltip-id="rating-tooltip"
          >
            <Tooltip id="rating-tooltip" place="bottom">
              Notez et confirmez
            </Tooltip>
            <FontAwesomeIcon icon={faStar} />
          </span>
        ))}
        <button
          data-tooltip-id="thumb-tooltip"
          className="thumb-icon"
          onClick={handleSubmitRating}
        >
          <FontAwesomeIcon icon={faThumbsUp} />
        </button>
        <Tooltip id="thumb-tooltip" place="bottom">
          Confirmez
        </Tooltip>
      </div>
    </div>
  );
};

export default Rating;
