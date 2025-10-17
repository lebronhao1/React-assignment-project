import './EmptyState.scss';

interface EmptyStateProps {
  message: string;
  icon?: string;
  className?: string;
}

export default function EmptyState({ 
  message,
  icon = '🎬',
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`empty-state ${className}`}>
      <div className="empty-icon">{icon}</div>
      <p className="empty-message">{message}</p>
    </div>
  );
}
