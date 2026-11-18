import React from 'react';

interface ManuscriptCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  accentColor?: string;
  elevated?: boolean;
}

/**
 * Single-elevation manuscript card using hairline borders and subtle top accent line (never thick left borders).
 */
export const ManuscriptCard: React.FC<ManuscriptCardProps> = ({
  children,
  accentColor,
  elevated = true,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`relative rounded-2xl bg-[var(--bg-card)] border border-[var(--border-hairline)] overflow-hidden transition-colors duration-150 ${
        elevated ? 'shadow-[0_2px_10px_rgba(20,40,75,0.04)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.28)]' : ''
      } ${className}`}
      {...props}
    >
      {accentColor && (
        <div
          className="absolute top-0 left-0 right-0 h-1 pointer-events-none"
          style={{ backgroundColor: accentColor }}
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
};

export const EditorialDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`h-px w-full bg-[var(--border-hairline)] ${className}`}
    role="separator"
  />
);
