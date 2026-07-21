// Inline SVG Taegukgi (South Korean flag). Rendered as SVG rather than the flag
// emoji because the emoji renders as "KR" letters on many Windows builds.

type Bar = "solid" | "broken";

type Trigram = {
  x: number;
  y: number;
  rotate: number;
  bars: [Bar, Bar, Bar];
};

// Standard corner placement: Geon (☰) top-left, Ri (☲) bottom-left,
// Gam (☵) top-right, Gon (☷) bottom-right. Bars sit perpendicular to the
// diagonal running to the central taeguk.
const TRIGRAMS: readonly Trigram[] = [
  { x: 8.5, y: 6, rotate: 56.31, bars: ["solid", "solid", "solid"] },
  { x: 8.5, y: 18, rotate: -56.31, bars: ["solid", "broken", "solid"] },
  { x: 27.5, y: 6, rotate: -56.31, bars: ["broken", "solid", "broken"] },
  { x: 27.5, y: 18, rotate: 56.31, bars: ["broken", "broken", "broken"] },
];

const BAR_WIDTH = 6.2;
const BAR_HEIGHT = 0.95;
const BAR_STEP = 1.85;
const BREAK_GAP = 1.3;

function barRects(bar: Bar, offsetY: number) {
  const y = offsetY - BAR_HEIGHT / 2;

  if (bar === "solid") {
    return [{ x: -BAR_WIDTH / 2, y, width: BAR_WIDTH, height: BAR_HEIGHT }];
  }

  const segmentWidth = (BAR_WIDTH - BREAK_GAP) / 2;

  return [
    { x: -BAR_WIDTH / 2, y, width: segmentWidth, height: BAR_HEIGHT },
    { x: BREAK_GAP / 2, y, width: segmentWidth, height: BAR_HEIGHT },
  ];
}

type KoreanFlagProps = {
  className?: string;
  title: string;
};

export function KoreanFlag({ className, title }: KoreanFlagProps) {
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
      {/* Taeguk: blue lower half filled first, red S-curve laid over the top. */}
      <circle cx={18} cy={12} r={6} fill="#0047a0" />
      <path
        d="M12 12 A6 6 0 0 1 24 12 A3 3 0 0 1 18 12 A3 3 0 0 0 12 12 Z"
        fill="#cd2e3a"
      />
      {TRIGRAMS.map((trigram) => (
        <g
          key={`${trigram.x}-${trigram.y}`}
          fill="#000000"
          transform={`translate(${trigram.x} ${trigram.y}) rotate(${trigram.rotate})`}
        >
          {trigram.bars.flatMap((bar, index) =>
            barRects(bar, (index - 1) * BAR_STEP).map((rect) => (
              <rect
                key={`${index}-${rect.x}`}
                x={rect.x}
                y={rect.y}
                width={rect.width}
                height={rect.height}
              />
            )),
          )}
        </g>
      ))}
    </svg>
  );
}
