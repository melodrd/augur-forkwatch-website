// Inline SVG United States flag. Rendered as SVG rather than the flag emoji
// because the emoji renders as "US" letters on many Windows builds. The star
// field is simplified to a 9-row grid of dots, which reads cleanly at the
// small sizes this component is used at.

const STRIPE_COUNT = 13;
const STRIPE_HEIGHT = 24 / STRIPE_COUNT;
const CANTON_WIDTH = 14.4;
const CANTON_HEIGHT = STRIPE_HEIGHT * 7;

// Red stripes occupy the even rows (0, 2, 4, …). Precomputing their y-offsets
// gives each rendered stripe a stable, unique key without relying on the array
// index.
const RED_STRIPE_OFFSETS = Array.from(
  { length: STRIPE_COUNT },
  (_, index) => index,
)
  .filter((index) => index % 2 === 0)
  .map((index) => index * STRIPE_HEIGHT);

const STAR_ROWS = 9;
const STAR_ROW_STEP = CANTON_HEIGHT / (STAR_ROWS + 1);
const STAR_COL_STEP = 2.4;

const STARS = Array.from({ length: STAR_ROWS }, (_, row) => {
  const count = row % 2 === 0 ? 6 : 5;
  const startX = row % 2 === 0 ? STAR_COL_STEP / 2 : STAR_COL_STEP;

  return Array.from({ length: count }, (_, col) => ({
    x: startX + col * STAR_COL_STEP,
    y: STAR_ROW_STEP * (row + 1),
  }));
}).flat();

type USFlagProps = {
  className?: string;
  title: string;
};

export function USFlag({ className, title }: USFlagProps) {
  return (
    <svg
      className={className}
      role="img"
      viewBox="0 0 36 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <rect
        width={36}
        height={24}
        fill="#ffffff"
        stroke="rgba(0,0,0,0.28)"
        strokeWidth={0.6}
      />
      {RED_STRIPE_OFFSETS.map((y) => (
        <rect key={y} y={y} width={36} height={STRIPE_HEIGHT} fill="#b22234" />
      ))}
      <rect width={CANTON_WIDTH} height={CANTON_HEIGHT} fill="#3c3b6e" />
      {STARS.map((star) => (
        <circle
          key={`${star.x}-${star.y}`}
          cx={star.x}
          cy={star.y}
          r={0.55}
          fill="#ffffff"
        />
      ))}
    </svg>
  );
}
