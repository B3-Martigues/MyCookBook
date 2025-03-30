import { addRating, getRatings } from "../../api/ratingApi";
import { useState, useEffect } from "react";
import useAuthStore from "../../store/AuthStore";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import "../../styles/organisms/Rating.css";

const Rating = ({ recipeId, updateRating }) => {
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const { isAuthenticated } = useAuthStore();

  // Charger la note existante au montage du composant
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await getRatings();
        if (response.success && response.ratings[recipeId]) {
          setNewRating(response.ratings[recipeId]);
        }
      } catch (err) {
        console.error("Erreur lors du chargement de la note:", err);
      }
    };
    
    if (recipeId) {
      fetchRating();
    }
  }, [recipeId]);

  const handleRatingClick = async (rating) => {
    try {
      if (!isAuthenticated) {
        toast("Vous devez être connecté pour noter une recette", {
          position: "top-center",
          autoClose: 2000,
        });
        return;
      }

      // Mise à jour optimiste de l'UI
      setNewRating(rating);
      
      const response = await addRating(recipeId, rating);
      
      if (response.error) {
        // En cas d'erreur, on revient à l'état précédent
        setNewRating(prevRating => prevRating);
        toast.error("La note n'a pas été enregistrée");
        return;
      }

      // Mise à jour de la note moyenne dans l'interface
      updateRating(recipeId, response.averageRating);
      toast.success("Votre note a été enregistrée !");
    } catch (err) {
      // En cas d'erreur, on revient à l'état précédent
      setNewRating(prevRating => prevRating);
      toast.error("Une erreur s'est produite. Veuillez réessayer");
      console.error(`Erreur: ${err}`);
    }
  };

  const handleMouseEnter = (rating) => {
    setHoverRating(rating);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  return (
    <div className="rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={`rating-btn ${
            star <= (hoverRating || newRating) ? "filled" : "outlined"
          }`}
          onMouseEnter={() => handleMouseEnter(star)}
          onClick={() => handleRatingClick(star)}
          onMouseLeave={handleMouseLeave}
        >
          {star <= (hoverRating || newRating) ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
};

export default Rating;
