import { useState, useEffect } from "react";
import { 
  addComment, 
  getCommentsByRecipe, 
  updateComment, 
  deleteComment 
} from "../../api/commentApi";
import useAuthStore from "../../store/AuthStore";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faPaperPlane, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import "../../styles/organisms/CommentChat.css";

// Fonction de formatage de date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const Comment = ({ recipeId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, currentUser } = useAuthStore();
  const [editContent, setEditContent] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await getCommentsByRecipe(recipeId);
        if (response.success) {
          setComments(response.comments.reverse());
        }
      } catch (err) {
        toast.error("Erreur de chargement des commentaires");
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [recipeId]);

  // Fonction pour fermer le menu si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.message-actions')) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSendComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await addComment(recipeId, newComment);
      if (response.success) {
        const newCommentData = {
          _id: response.comment._id,
          content: response.comment.content,
          username: currentUser.name,
          user_id: currentUser.id,
          createdAt: response.comment.createdAt
        };
        setComments(prev => [newCommentData, ...prev]);
        setNewComment("");
      }
    } catch (err) {
      toast.error("Erreur lors de l'envoi du commentaire");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editContent.trim()) return;
    
    try {
      const response = await updateComment(commentId, editContent);
      if (response.success) {
        setComments(prev => 
          prev.map(comment => 
            comment._id === commentId 
              ? { ...comment, content: editContent, updatedAt: new Date().toISOString() }
              : comment
          )
        );
        setEditingCommentId(null);
        setEditContent("");
      }
    } catch (err) {
      toast.error("Erreur lors de la modification");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await deleteComment(commentId);
      if (response.success) {
        setComments(prev => prev.filter(comment => comment._id !== commentId));
        setActiveMenu(null);
      }
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {loading ? (
          <div className="loading-messages">Chargement des messages...</div>
        ) : comments.length === 0 ? (
          <div className="no-messages">Soyez le premier à commenter cette recette !</div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className={`message ${
                comment.user_id === currentUser?.id ? "message-own" : "message-other"
              }`}
            >
              <div className="message-header">
                <span className="message-author">
                  {comment.user_id === currentUser?.id ? "Moi" : comment.username}
                </span>
                <span className="message-time">
                  {formatDate(comment.createdAt)}
                  {comment.updatedAt && comment.updatedAt !== comment.createdAt && 
                    <span className="edited-tag">(modifié)</span>
                  }
                </span>
              </div>
              <div className="message-wrapper">
                <div className="message-content">
                  {editingCommentId === comment._id ? (
                    <div className="edit-message-container">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        autoFocus
                        className="edit-textarea"
                      />
                      <div className="edit-actions">
                        <button 
                          className="edit-confirm"
                          onClick={() => handleEditComment(comment._id)}
                        >
                          Enregistrer
                        </button>
                        <button 
                          className="edit-cancel"
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditContent("");
                          }}
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p>{comment.content}</p>
                  )}
                </div>
                
                {comment.user_id === currentUser?.id && !editingCommentId && (
                  <div className="message-actions">
                    <button 
                      className="action-menu-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === comment._id ? null : comment._id);
                      }}
                    >
                      <FontAwesomeIcon icon={faEllipsisVertical} />
                    </button>
                    
                    {activeMenu === comment._id && (
                      <div className="action-menu">
                        <button 
                          className="menu-item"
                          onClick={() => {
                            setEditingCommentId(comment._id);
                            setEditContent(comment.content);
                            setActiveMenu(null);
                          }}
                        >
                          <FontAwesomeIcon icon={faPencil} />
                          <span>Modifier</span>
                        </button>
                        <button 
                          className="menu-item delete"
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                          <span>Supprimer</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="chat-input-container">
        {isAuthenticated ? (
          <>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Écrivez votre commentaire..."
              maxLength="500"
            />
            <button 
              className={`send-button ${!newComment.trim() ? 'inactive' : ''}`}
              onClick={handleSendComment}
              disabled={!newComment.trim()}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </>
        ) : (
          <div className="login-prompt">
            Connectez-vous pour participer à la discussion
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
