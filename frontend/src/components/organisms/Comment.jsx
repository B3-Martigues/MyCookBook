import { useState, useEffect } from "react";
import { 
  addComment, 
  getCommentsByRecipe, 
  updateComment, 
  deleteComment 
} from "../../api/commentApi";
import useAuthStore from "../../store/AuthStore";
import { toast } from "react-toastify";
import "../../styles/organisms/Comment.css";

// Fonction de formatage de date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const Comment = ({ recipeId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isAuthenticated, currentUser } = useAuthStore();

  const getUsername = (userId) => {
    // Si c'est l'utilisateur courant, utilise son nom
    if (currentUser && userId === currentUser.id) {
      return "Moi";
    }
    
    // Sinon, trouve le username dans les commentaires (si disponible)
    const commentUser = comments.find(c => c.user_id === userId)?.username;
    return commentUser || "Utilisateur inconnu";
  };

  useEffect(() => {
    console.log("Debug - Authentication State:", {
      isAuthenticated,
      currentUser: currentUser ? { 
        id: currentUser.id, 
        name: currentUser.name,
        fullObject: currentUser
      } : null
    });
  }, [isAuthenticated, currentUser]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await getCommentsByRecipe(recipeId);
        console.log("API Response:", response); // Debug
    
        if (response.success) {
          // Ici nous sommes sûrs que response.comments est un tableau
          setComments(response.comments);
          setError(null);
        } else {
          setError(response.error || "Impossible de charger les commentaires");
          toast.error(response.error || "Erreur de chargement");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des commentaires:", err);
        toast.error("Erreur de connexion. Veuillez réessayer.");
        setError("Erreur de connexion. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    if (recipeId) {
      fetchComments();
    }
  }, [recipeId]);

  const handleAddComment = async (e) => {
    e.preventDefault();

    const isReallyAuthenticated = useAuthStore.getState().checkAuthentication();

    if (!isReallyAuthenticated) {
      toast.error("Veuillez vous reconnecter");
      return;
    }

    console.log("Debug - Add Comment Authentication Check:", {
      isAuthenticated,
      currentUser: currentUser ? {
        id: currentUser.id,
        name: currentUser.name,
        hasId: !!currentUser.id,
        fullObject: currentUser
      } : null
    });

    if (!isAuthenticated || !currentUser || !currentUser.id) {
      toast.error("Vous devez être connecté pour ajouter un commentaire");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Le commentaire ne peut pas être vide");
      return;
    }

    try {
      const response = await addComment(recipeId, newComment);
      if (response.success) {
        const newCommentData = {
          _id: response.comment._id,
          content: response.comment.content,
          username: currentUser.name, 
          user_id: currentUser.id,
          createdAt: response.comment.createdAt,
          updatedAt: response.comment.updatedAt
        };

        setComments(prevComments => [newCommentData, ...(prevComments || [])]);
        setNewComment("");
        toast.success("Commentaire ajouté avec succès");
      } else {
        toast.error(response.error || "Erreur lors de l'ajout du commentaire");
      }
    } catch (err) {
      console.error("Erreur lors de l'ajout du commentaire:", err);
      toast.error("Erreur lors de l'ajout du commentaire");
    }
  };

  const handleUpdateComment = async (e) => {
    e.preventDefault();
    
    if (!editContent.trim()) {
      toast.error("Le commentaire ne peut pas être vide");
      return;
    }

    try {
      const response = await updateComment(editingCommentId, editContent);
      if (response.success) {
        setComments(prevComments => 
          prevComments.map(comment => 
            comment._id === editingCommentId 
              ? { 
                  ...comment, 
                  content: editContent,
                  updatedAt: new Date().toISOString() 
                }
              : comment
          )
        );
        setEditingCommentId(null);
        setEditContent("");
        toast.success("Commentaire modifié avec succès");
      } else {
        toast.error(response.error || "Erreur lors de la modification");
      }
    } catch (err) {
      console.error("Erreur lors de la modification:", err);
      toast.error("Erreur lors de la modification du commentaire");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await deleteComment(commentId);
      if (response.success) {
        setComments(prevComments => 
          (prevComments || []).filter(comment => comment._id !== commentId)
        );
        toast.success("Commentaire supprimé avec succès");
      } else {
        toast.error(response.error || "Erreur lors de la suppression");
      }
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      toast.error("Erreur lors de la suppression du commentaire");
    }
  };

  return (
    <div className="comments-container">
      <h4>Commentaires:</h4>

      {isAuthenticated ? (
        <form onSubmit={handleAddComment} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ajouter un commentaire..."
            maxLength="500"
            required
          />
          <button type="submit" className="comment-btn">
            Publier
          </button>
        </form>
      ) : (
        <p className="comment-login-prompt">
          Connectez-vous pour laisser un commentaire
        </p>
      )}

      {loading ? (
        <p>Chargement des commentaires...</p>
      ) : comments.length > 0 ? (
        <ul className="comments-list">
          {comments.map((comment) => (
            <li key={comment._id} className="comment-item">
              <div className="comment-header">
              <span className="comment-username">
                {getUsername(comment.user_id?._id || comment.user_id)}
              </span>
                <span className="comment-date">
                  {formatDate(comment.createdAt)}
                  {comment.updatedAt && comment.updatedAt !== comment.createdAt && " (modifié)"}
                </span>
              </div>
              {editingCommentId === comment._id ? (
                <form onSubmit={handleUpdateComment} className="comment-edit-form">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    maxLength="500"
                    required
                  />
                  <div className="comment-edit-buttons">
                    <button type="submit" className="comment-btn">
                      Enregistrer
                    </button>
                    <button
                      type="button"
                      className="comment-btn-cancel"
                      onClick={() => {
                        setEditingCommentId(null);
                        setEditContent("");
                      }}
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              ) : (
                <div className="comment-content">
                  <p>{comment.content}</p>
                  {isAuthenticated &&
                    currentUser &&
                    comment.user_id === currentUser.id && (
                      <div className="comment-actions">
                        <button
                          className="comment-btn-edit"
                          onClick={() => {
                            setEditingCommentId(comment._id);
                            setEditContent(comment.content);
                          }}
                        >
                          Modifier
                        </button>
                        <button
                          className="comment-btn-delete"
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          Supprimer
                        </button>
                      </div>
                    )}
                </div>
              )}
            </li>
          ))}

        </ul>
      ) : (
        <p className="no-comments">Aucun commentaire pour cette recette.</p>
      )}
    </div>
  );
};

export default Comment;
