import './ErrorDisplay.scss';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorDisplay({ 
  message, 
  onRetry,
  className = '' 
}: ErrorDisplayProps) {
  return (
    <div className={`error-display ${className}`}>
      <div className="error-icon">⚠️</div>
      <p className="error-message">{message}</p>
      {onRetry && (
        <button 
          className="retry-button"
          onClick={onRetry}
        >
          Retry
        </button>
      )}
    </div>
  );
}
