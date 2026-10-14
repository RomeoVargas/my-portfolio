export const START = { x: 445, y: 382 };
export const STATIONS = [
  {
    id: "services",
    name: "The studio",
    label: "SERVICES",
    x: 202,
    y: 169,
    entrance: { x: 210, y: 295 },
  },
  {
    id: "projects",
    name: "Project lab",
    label: "MY WORK",
    x: 493,
    y: 116,
    entrance: { x: 493, y: 276 },
  },
  {
    id: "about",
    name: "Base camp",
    label: "ABOUT ME",
    x: 700,
    y: 238,
    entrance: { x: 698, y: 365 },
  },
  {
    id: "contact",
    name: "Say hello",
    label: "CONTACT",
    x: 239,
    y: 397,
    entrance: { x: 300, y: 420 },
  },
];
export const SPARKS = [
  { x: 340, y: 285 },
  { x: 555, y: 327 },
  { x: 614, y: 414 },
  { x: 375, y: 454 },
  { x: 131, y: 339 },
];
const BLOCKS = [
  { left: 637, right: 777, top: 380, bottom: 451 },
  { left: 135, right: 276, top: 170, bottom: 260 },
  { left: 416, right: 568, top: 125, bottom: 238 },
  { left: 640, right: 763, top: 244, bottom: 328 },
];
export function isWalkable({ x, y }) {
  return (
    x >= 92 &&
    x <= 800 &&
    y >= 176 &&
    y <= 490 &&
    (y <= 394 || x >= 125) &&
    (y <= 443 || (x >= 200 && x <= 705)) &&
    (y <= 465 || (x >= 315 && x <= 580)) &&
    !BLOCKS.some((b) => x > b.left && x < b.right && y > b.top && y < b.bottom)
  );
}
export function movePlayer(p, dx, dy, dt) {
  const length = Math.hypot(dx, dy);
  if (!length) return p;
  const speed = (140 * Math.min(dt, 0.05)) / length;
  let next = { ...p };
  if (isWalkable({ x: p.x + dx * speed, y: p.y })) next.x += dx * speed;
  if (isWalkable({ x: next.x, y: p.y + dy * speed })) next.y += dy * speed;
  return next;
}
export function nearestStation(p) {
  return (
    STATIONS.find(
      (s) => Math.hypot(s.entrance.x - p.x, s.entrance.y - p.y) < 65,
    ) ?? null
  );
}
export function collectNearby(p, coins, collected) {
  const found = coins.flatMap((c, i) =>
    !collected.includes(i) && Math.hypot(c.x - p.x, c.y - p.y) < 24 ? [i] : [],
  );
  return found.length ? [...collected, ...found] : collected;
}
