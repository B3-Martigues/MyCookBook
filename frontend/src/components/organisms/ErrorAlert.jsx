import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import "../../styles/organisms/ErrorAlert.css";

const ErrorAlert = ({ title, message }) => {
  return (
    <div className="error-alert">
      <div className="error-icon">
        <FontAwesomeIcon icon={faExclamationTriangle} />
      </div>
      <div className="error-content">
        <h3 className="error-title">{title}</h3>
        <p className="error-message">{message}</p>
      </div>
    </div>
  );
};

export default ErrorAlert; 