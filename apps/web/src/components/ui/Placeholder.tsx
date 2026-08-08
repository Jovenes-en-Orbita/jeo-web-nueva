/**
 * Image placeholder matching the wireframe's .ph styling.
 * TODO: Replace with actual <Image> components when real images are available.
 */
export function Placeholder({
  label,
  className = '',
  style,
}: {
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`ph ${className}`} style={style}>
      {label && <span>{label}</span>}
    </div>
  );
}
