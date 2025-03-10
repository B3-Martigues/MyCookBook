import { getRatings, addRating } from "../../api/ratingApi";
import { useState, useEffect } from "react";
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

  // Récupération des notes et des IDs des toutes les recettes au chargement du composant
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await getRatings();
        if (response.error) {
          console.error(response.error);
          return;
        }
        setRatingsData(response.ratings);
      } catch (err) {
        console.error(
          `Une erreur est survenue lors du chargement des notes: ${err}`
        );
      }
    };
    fetchRatings();
  }, []);

  // Mise à jour de la note sélectionné par l'utilisateur
  const handleRatingChange = (rating) => {
    setNewRating(rating);
  };

  // Envoi de la note au backend après confirmation
  const handleSubmitRating = async () => {
    try {
      if (!isAuthenticated) {
        // Seul un utilisateur peut noter les recettes
        toast("Vous devez être connecté pour noter une recette");
        return;
      }
      const response = await addRating(recipeId, newRating);
      if (response.error) {
        console.error("Erreur lors de l'ajout de la note", response.error);
        toast("La note n'a pas été enregistrée");
        return;
      }
      // Mise à jour des notes dans  l'état local
      setRatingsData((prevRatings) => ({
        ...prevRatings,
        [recipeId]: response.averageRatings,
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

  //         <h3></h3>
  //         {/* {Object.entries(ratingsData).map(([id, rating]) => (
  //           <div key={id}>
  //             Recipe ID: {id} - Average Rating: {rating}
  //           </div>
  //         ))} */}
  //       </div>
  //     </div>
  //   );
};

export default Rating;
