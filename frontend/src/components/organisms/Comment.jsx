import { useState, useEffect } from "react";
import { addComment, getCommentsByRecipe, updateComment, deleteComment } from "../../api/commentApi";
import "../../styles/organisms/Comment.css";

const Comment = ({ recipeId, isAuthenticated, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupération des commentaires au chargement du composant
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await getCommentsByRecipe(recipeId);
        if (response.success) {
          setComments(response.comments);
        } else {
          setError(response.error || "Erreur lors de la récupération des commentaires");
        }
      } catch (err) {
        setError("Erreur lors de la récupération des commentaires");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (recipeId) {
      fetchComments();
    }
  }, [recipeId]);

  // Fonction pour ajouter un commentaire
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await addComment(recipeId, newComment);
      if (response.success) {
        // Ajouter le commentaire à la liste
        setComments([
          {
            _id: response.comment._id,
            content: response.comment.content,
            username: response.comment.username || currentUser.username,
            user_id: response.comment.user_id,
            createdAt: response.comment.createdAt,
            updatedAt: response.comment.updatedAt
          },
          ...comments
        ]);
        setNewComment("");
      } else {
        setError(response.error || "Erreur lors de l'ajout du commentaire");
      }
    } catch (err) {
      setError("Erreur lors de l'ajout du commentaire");
      console.error(err);
    }
  };

  // Fonction pour mettre à jour un commentaire
  const handleUpdateComment = async (e) => {
    e.preventDefault();
    if (!editContent.trim()) return;

    try {
      const response = await updateComment(editingCommentId, editContent);
      if (response.success) {
        // Mettre à jour le commentaire dans la liste
        setComments(
          comments.map((comment) =>
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
      } else {
        setError(response.error || "Erreur lors de la mise à jour du commentaire");
      }
    } catch (err) {
      setError("Erreur lors de la mise à jour du commentaire");
      console.error(err);
    }
  };

  // Fonction pour supprimer un commentaire
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
      return;
    }

    try {
      const response = await deleteComment(commentId);
      if (response.success) {
        // Supprimer le commentaire de la liste
        setComments(comments.filter((comment) => comment._id !== commentId));
      } else {
        setError(response.error || "Erreur lors de la suppression du commentaire");
      }
    } catch (err) {
      setError("Erreur lors de la suppression du commentaire");
      console.error(err);
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="comments-container">
      <h4>Commentaires:</h4>

      {/* Formulaire d'ajout de commentaire */}
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

      {/* Affichage des erreurs */}
      {error && <p className="comment-error">{error}</p>}

      {/* Chargement */}
      {loading ? (
        <p>Chargement des commentaires...</p>
      ) : (
        <>
          {/* Liste des commentaires */}
          {comments.length > 0 ? (
            <ul className="comments-list">
              {comments.map((comment) => (
                <li key={comment._id} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-username">{comment.username}</span>
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
                      {isAuthenticated && currentUser && comment.user_id === currentUser.id && (
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
        </>
      )}
    </div>
  );
};

export default Comment;