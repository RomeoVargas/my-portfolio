import React, { useEffect, useRef, useState } from "react";
import WorldArt from "./WorldArt";
import {
  START,
  STATIONS,
  SPARKS,
  movePlayer,
  nearestStation,
  collectNearby,
  isWalkable,
} from "./world.js";

export default function Game({
  onOpen,
  active,
  motion,
  sound,
  gameRef,
  night,
}) {
  const [player, setPlayer] = useState(START);
  const [pet, setPet] = useState({ x: 407, y: 400 });
  const [moving, setMoving] = useState(false);
  const [facing, setFacing] = useState(1);
  const [collected, setCollected] = useState([]);
  const keys = useRef(new Set());
  const position = useRef(START);
  const companion = useRef({ x: 407, y: 400 });
  const target = useRef(null);
  const collection = useRef([]);
  const soundRef = useRef(sound);
  soundRef.current = sound;
  const nearest = nearestStation(player);
  useEffect(() => {
    const clear = () => {
      keys.current.clear();
      target.current = null;
    };
    const up = (e) => keys.current.delete(e.key.toLowerCase());
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    document.addEventListener("visibilitychange", clear);
    return () => {
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
      document.removeEventListener("visibilitychange", clear);
    };
  }, []);
  useEffect(() => {
    keys.current.clear();
    target.current = null;
    if (!active) {
      setMoving(false);
      return;
    }
    let frame,
      last = 0;
    function tick(time) {
      const dt = last ? Math.min((time - last) / 1000, 0.05) : 0;
      last = time;
      const k = keys.current;
      let dx =
        Number(k.has("arrowright") || k.has("d")) -
        Number(k.has("arrowleft") || k.has("a"));
      let dy =
        Number(k.has("arrowdown") || k.has("s")) -
        Number(k.has("arrowup") || k.has("w"));
      if (dx || dy) target.current = null;
      if (target.current) {
        dx = target.current.x - position.current.x;
        dy = target.current.y - position.current.y;
        if (Math.hypot(dx, dy) < 4) {
          target.current = null;
          dx = 0;
          dy = 0;
        }
      }
      if (dx || dy) {
        const p = movePlayer(position.current, dx, dy, dt);
        const changed =
          p.x !== position.current.x || p.y !== position.current.y;
        position.current = p;
        setPlayer(p);
        setMoving(changed);
        if (dx) setFacing(dx > 0 ? 1 : -1);
        if (!changed && dt > 0) target.current = null;
        const next = collectNearby(p, SPARKS, collection.current);
        if (next !== collection.current) {
          collection.current = next;
          setCollected(next);
          soundRef.current();
        }
      } else setMoving(false);
      const p = position.current,
        c = companion.current;
      const distance = Math.hypot(p.x - c.x, p.y - c.y);
      if (distance > 35) {
        const next = {
          x: c.x + (p.x - c.x) * Math.min(dt * 3, 1),
          y: c.y + (p.y - c.y) * Math.min(dt * 3, 1),
        };
        companion.current = next;
        setPet(next);
      }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active]);
  function openStation(s) {
    target.current = null;
    keys.current.clear();
    position.current = { ...s.entrance };
    setPlayer(position.current);
    onOpen(s.id);
  }
  function onKey(e) {
    if (e.target !== gameRef.current || e.ctrlKey || e.metaKey || e.altKey)
      return;
    const key = e.key.toLowerCase();
    if (
      [
        "arrowup",
        "arrowdown",
        "arrowleft",
        "arrowright",
        "w",
        "a",
        "s",
        "d",
      ].includes(key)
    ) {
      e.preventDefault();
      keys.current.add(key);
    }
    if (key === "e" && nearest && !e.repeat) {
      e.preventDefault();
      openStation(nearest);
    }
  }
  function clickGround(e) {
    if (e.target.closest("button")) return;
    gameRef.current.focus({ preventScroll: true });
    const box = e.currentTarget.getBoundingClientRect();
    const point = {
      x: ((e.clientX - box.left) / box.width) * 900,
      y: ((e.clientY - box.top) / box.height) * 600,
    };
    if (isWalkable(point)) target.current = point;
  }
  return (
    <div
      className={`game-shell ${motion ? "" : "still"} ${night ? "night" : ""}`}
    >
      <div className="world-topline">
        <span>
          <i /> WORLD 01{" "}
          <span className="world-name">/ THE MAKER’S ISLAND</span>
        </span>
        <span
          className="stars-counter"
          title="Collect the five stars around the island"
        >
          ✦ <b>{collected.length}</b> / 5
        </span>
      </div>
      <div
        className="game"
        ref={gameRef}
        tabIndex="0"
        role="region"
        aria-label="Interactive island. Use arrow keys or WASD to move, E near a building to explore. Or use the destination buttons."
        onKeyDown={onKey}
        onBlur={() => keys.current.clear()}
      >
        <div className="game-map" onPointerDown={clickGround}>
          <WorldArt
            player={player}
            pet={pet}
            moving={moving && motion}
            facing={facing}
            collected={collected}
            sparks={SPARKS}
            night={night}
          />
          {STATIONS.map((s) => (
            <button
              key={s.id}
              className={`destination ${nearest?.id === s.id ? "nearby" : ""}`}
              style={{
                left: `${(s.x - 82) / 9}%`,
                top: `${(s.y - 48) / 6}%`,
                width: `${164 / 9}%`,
                height: `${154 / 6}%`,
              }}
              onClick={() => openStation(s)}
              aria-label={`Explore ${s.name}: ${s.label.toLowerCase()}`}
            >
              <span>
                {s.label} <span>↗</span>
              </span>
            </button>
          ))}
          <div
            className="player-label"
            style={{ left: `${player.x / 9}%`, top: `${(player.y + 17) / 6}%` }}
          >
            YOU <span>▴</span>
          </div>
          {nearest && (
            <button
              className="interact-bubble"
              style={{
                left: `${player.x / 9}%`,
                top: `${(player.y - 73) / 6}%`,
              }}
              onClick={() => openStation(nearest)}
            >
              <kbd>E</kbd> {nearest.name}
            </button>
          )}
        </div>
      </div>
      <nav className="mobile-destinations" aria-label="Island destinations">
        {STATIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => openStation(s)}
            aria-label={`Explore ${s.name}: ${s.label.toLowerCase()}`}
          >
            {s.label} ↗
          </button>
        ))}
      </nav>
      <div className="game-bottomline">
        <span className="game-hint">
          {collected.length === 5
            ? "✦ All stars found. Explorer status: legendary."
            : "Click or tap the island to walk · Select a building to explore."}
        </span>
        <button className="text-button" onClick={() => onOpen("help")}>
          How to play <span>?</span>
        </button>
      </div>
      <div className="touch-controls" aria-label="Touch movement controls">
        {[
          ["←", "arrowleft", -1, 0],
          ["↑", "arrowup", 0, -1],
          ["↓", "arrowdown", 0, 1],
          ["→", "arrowright", 1, 0],
        ].map(([label, key, dx, dy]) => (
          <button
            key={key}
            aria-label={`Move ${key.slice(5)}`}
            onClick={(e) => {
              if (e.detail === 0)
                target.current = {
                  x: position.current.x + dx * 24,
                  y: position.current.y + dy * 24,
                };
            }}
            onPointerDown={(e) => {
              e.preventDefault();
              e.currentTarget.setPointerCapture(e.pointerId);
              keys.current.add(key);
            }}
            onPointerUp={() => keys.current.delete(key)}
            onPointerCancel={() => keys.current.delete(key)}
            onLostPointerCapture={() => keys.current.delete(key)}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                keys.current.add(key);
              }
            }}
            onKeyUp={() => keys.current.delete(key)}
            onBlur={() => keys.current.delete(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <span className="sr-only" role="status">
        {collected.length} of 5 stars found.{" "}
        {nearest ? `Near ${nearest.name}. Press E to explore.` : ""}
      </span>
    </div>
  );
}
