import test from "node:test";
import assert from "node:assert/strict";
import {
  movePlayer,
  nearestStation,
  collectNearby,
  START,
  STATIONS,
  isWalkable,
} from "../src/world.js";

test("movement travels at the same speed diagonally and horizontally", () => {
  const a = movePlayer(START, 1, 0, 0.1);
  const b = movePlayer(START, 1, 1, 0.1);
  assert.ok(
    Math.abs(
      Math.hypot(a.x - START.x, a.y - START.y) -
        Math.hypot(b.x - START.x, b.y - START.y),
    ) < 0.001,
  );
});
test("the player cannot leave the island or walk through buildings", () => {
  let p = START;
  for (let i = 0; i < 300; i++) p = movePlayer(p, 0, 1, 0.016);
  assert.ok(p.y <= 490);
  p = { x: 200, y: 300 };
  for (let i = 0; i < 150; i++) p = movePlayer(p, 0, -1, 0.016);
  assert.ok(p.y >= 260);
});
test("station interaction is available only near an entrance", () => {
  assert.equal(nearestStation(STATIONS[0].entrance)?.id, STATIONS[0].id);
  assert.equal(nearestStation({ x: 800, y: 450 }), null);
});
test("collectibles are awarded once and only within reach", () => {
  const coins = [
    { x: 10, y: 10 },
    { x: 100, y: 100 },
  ];
  assert.deepEqual(collectNearby({ x: 10, y: 10 }, coins, []), [0]);
  assert.deepEqual(collectNearby({ x: 10, y: 10 }, coins, [0]), [0]);
});

test("water and the stepped island edges are not walkable", () => {
  assert.equal(isWalkable({ x: 100, y: 480 }), false);
  assert.equal(isWalkable({ x: 790, y: 480 }), false);
  assert.equal(isWalkable({ x: 700, y: 420 }), false);
  assert.equal(isWalkable(START), true);
});
