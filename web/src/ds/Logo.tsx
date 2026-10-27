export function Logo({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M8 56V24A16 16 0 0 1 24 8h30" className="stroke-logo-a" strokeWidth={9} />
      <path d="M27 56V39a12 12 0 0 1 12-12h15" className="stroke-logo-b" strokeWidth={9} />
    </svg>
  );
}
