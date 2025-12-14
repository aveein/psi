export function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="16.65" y1="16.65" x2="21" y2="21" />
    </svg>
  );
}

export function SearchLargeIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 48 48"
    >
      <circle cx="22" cy="22" r="14" />
      <line x1="32.5" y1="32.5" x2="44" y2="44" />
    </svg>
  );
}

export function DatabaseLargeIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 48 48"
    >
      <ellipse cx="24" cy="9" rx="16" ry="6" />
      <path d="M8 9v12c0 3.314 7.163 6 16 6s16-2.686 16-6V9" />
      <path d="M8 21v12c0 3.314 7.163 6 16 6s16-2.686 16-6V21" />
    </svg>
  );
}
