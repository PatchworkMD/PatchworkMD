const STAR_COUNT = 46;
const ACCENT_STRIDE = 9;

function seeded(index: number, salt: number) {
  let value = (index + 1) * 2654435761 + salt * 40503;
  value = (value ^ (value >>> 13)) >>> 0;
  return (value % 1000) / 1000;
}

const accentClass = (index: number) => {
  switch (index % ACCENT_STRIDE) {
    case 0:
      return 'orbit-star--cyan';
    case 4:
      return 'orbit-star--amber';
    case 7:
      return 'orbit-star--mint';
    default:
      return '';
  }
};

export default function OrbitStarfield() {
  const stars = Array.from({ length: STAR_COUNT }, (_, i) => {
    const left = (seeded(i, 1) * 100).toFixed(2);
    const top = (seeded(i, 2) * 100).toFixed(2);
    const size = 1 + seeded(i, 3) * 2;
    const duration = (3 + seeded(i, 4) * 4).toFixed(2);
    const delay = (seeded(i, 5) * -8).toFixed(2);
    return { left, top, size, duration, delay, className: accentClass(i) };
  });

  return (
    <div className="orbit-starfield" aria-hidden="true">
      {stars.map((star, i) => (
        <span
          key={i}
          className={`orbit-star ${star.className}`}
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
      <div className="orbit-ufo">
        <span className="orbit-ufo-dome" />
        <span className="orbit-ufo-hull" />
      </div>
    </div>
  );
}
