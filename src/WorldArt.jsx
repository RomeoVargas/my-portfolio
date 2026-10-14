import React from "react";

export function Character({
  x = 0,
  y = 0,
  moving = false,
  facing = 1,
  small = false,
}) {
  return (
    <g transform={`translate(${x} ${y})`} aria-hidden="true">
      <ellipse
        cy="3"
        rx={small ? 12 : 17}
        ry="5"
        fill="#193c3c"
        opacity=".28"
      />
      <g
        className={moving ? "sprite walking" : "sprite"}
        transform={`scale(${facing} 1)`}
      >
        {small ? (
          <>
            <path fill="#e9ae65" d="M-12-17h7v-7h5v7h7v-7h5v23H-12z" />
            <path fill="#ffdcab" d="M-8-10H8v10H-8z" />
            <path fill="#39344c" d="M-8-14h4v4h-4zm12 0h4v4H4zM-2-6h4v3h-4z" />
            <path fill="#c68344" d="M12-12h8v-8h5v17H12z" />
          </>
        ) : (
          <>
            <path fill="#30283d" d="M-9-8h7V2h-9zm12 0h7V2H3z" />
            <path fill="#b4a0f5" d="M-12-23h24v17h-24z" />
            <path fill="#8370c4" d="M-12-17h6v11h-6zm19 0h5v11H7z" />
            <path
              fill="#efbc90"
              d="M-15-20h5v12h-5zm25 0h5v12h-5zM-9-40H9v20H-9z"
            />
            <path fill="#3d3047" d="M-10-42H8v4h5v10H7v-6H-6v5h-6v-9z" />
            <path fill="#473644" d="M-6-29h3v4h-3zm10 0h3v4H4z" />
            <path fill="#de9f79" d="M-2-22h6v3h-6z" />
            <path fill="#e4d9ff" d="M-5-20h10v4H-5z" />
          </>
        )}
      </g>
    </g>
  );
}

export default function WorldArt({
  player,
  pet,
  moving,
  facing,
  collected,
  sparks,
  night,
}) {
  return (
    <svg className="world-art" viewBox="0 0 900 600" aria-hidden="true">
      <defs>
        <pattern
          id="grass"
          width="34"
          height="31"
          patternUnits="userSpaceOnUse"
        >
          <path d="M9 12h3v-3h2v6H9m16 11h4v2h-4" fill="#397c65" opacity=".3" />
        </pattern>
        <pattern id="soil" width="32" height="24" patternUnits="userSpaceOnUse">
          <path d="M0 6h12v5H0m20 10h8v4h-8" fill="#3a494e" opacity=".4" />
        </pattern>
        <pattern id="roof" width="17" height="12" patternUnits="userSpaceOnUse">
          <path
            d="M0 9h17M8 0v9"
            stroke="#8b4b54"
            strokeWidth="2"
            opacity=".4"
          />
        </pattern>
        <g id="pine">
          <ellipse cx="0" cy="4" rx="22" ry="8" fill="#285a50" opacity=".3" />
          <path d="M-5-23H5V3H-5z" fill="#795c4f" />
          <path
            d="M-5-87H5v10h8v10h8v12h9v12h-8v9h13v13H-35v-13h13v-9h-8v-12h9v-12h8v-10h8z"
            fill="#295c50"
          />
          <path
            d="M-5-87H5v10h8v10h8v12h-8v8H5v9H-16v-8h-14v-9h9v-12h8v-10h8z"
            fill="#3d8265"
          />
          <path d="M-5-78H3v11h8v10H-6v9h-14v-7h7v-12h8z" fill="#57977a" />
        </g>
        <g id="bush">
          <path d="M-19-9h6v-9H7v5h12v17h-38z" fill="#36745b" />
          <path d="M-13-13H4v5h8v7h-29v-8h4z" fill="#559269" />
          <path d="M-6-7h4v4h-4m15 2h4v4H9" fill="#efb2a3" />
        </g>
        <g id="flower">
          <path d="M0 0v8" stroke="#326d55" strokeWidth="2" />
          <path d="M-4-4H0v-4h4v4h4v4H4v4H0V0h-4z" fill="#f4d78b" />
          <path d="M0-4h4v4H0z" fill="#cf8e6a" />
        </g>
        <g id="rock">
          <path d="M-12-6h5v-7H6v5h8V3H-12z" fill="#728680" />
          <path d="M-7-11H5v5H-7z" fill="#9da89a" />
        </g>
      </defs>
      <g className="cloud cloud-one" fill="#c1bfd9" opacity=".09">
        <path d="M32 100h23V86h46v9h25v13h27v16H32z" />
        <path d="M659 59h25V43h46v10h18v12h33v17H659z" />
      </g>
      <g className="cloud cloud-two" fill="#c1bfd9" opacity=".06">
        <path d="M730 480h26v-13h45v10h25v12h28v15H730z" />
        <path d="M75 465h16v-13h42v8h28v19H75z" />
      </g>
      <ellipse
        cx="450"
        cy="550"
        rx="305"
        ry="22"
        fill="#101625"
        opacity=".45"
      />
      <g className="island">
        <path
          d="M81 166H185V124H350V108H566V141H704V174H790V211H828V418H801V474H720V509H598V536H429V548H298V526H184V500H109V451H71V377H49V227H81z"
          fill="#343f47"
        />
        <path
          d="M71 208H828V403H801V463H720V498H598V520H429V531H298V514H184V487H109V438H71V365H49V241H71z"
          fill="#655d52"
        />
        <path
          d="M71 208H828V403H801V463H720V498H598V520H429V531H298V514H184V487H109V438H71V365H49V241H71z"
          fill="url(#soil)"
        />
        <path
          d="M108 406h24v64h-24zm88 31h18v53h-18zm112 26h14v52h-14zm389-35h16v64h-16zm69-48h18v62h-18z"
          fill="#3c5049"
        />
        <path
          d="M81 151H185V111H350V95H566V126H704V159H790V196H828V391H801V447H720V482H598V509H429V521H298V499H184V473H109V424H71V350H49V212H81z"
          fill="#3d785b"
        />
        <path
          d="M81 146H185V106H350V90H566V121H704V154H790V191H828V376H801V432H720V467H598V494H429V506H298V484H184V458H109V409H71V335H49V207H81z"
          fill="#73a879"
        />
        <path
          d="M81 146H185V106H350V90H566V121H704V154H790V191H828V376H801V432H720V467H598V494H429V506H298V484H184V458H109V409H71V335H49V207H81z"
          fill="url(#grass)"
        />
        <path
          d="M211 250V329H488V239M488 329H693V360M393 329V424H266"
          fill="none"
          stroke="#5c956e"
          strokeWidth="45"
          strokeLinejoin="round"
        />
        <path
          d="M211 250V329H488V239M488 329H693V360M393 329V424H266"
          fill="none"
          stroke="#d7c493"
          strokeWidth="32"
        />
        <path
          d="M211 268v55h277v-69m0 75h205v23M393 345v79H276"
          fill="none"
          stroke="#e4d2a2"
          strokeWidth="18"
          opacity=".5"
        />
        <g fill="#a89a77" opacity=".5">
          <path d="M267 321h8v4h-8m49 13h5v3h-5m158-49h9v4h-9m88 33h10v4h-10m-188 56h6v4h-6m-59 43h8v4h-8" />
        </g>
        <path
          d="M637 393h30v-13h79v15h31v47h-24v16h-93v-12h-23z"
          fill="#4e8f75"
        />
        <path
          d="M644 397h28v-11h68v15h30v34h-23v16h-81v-12h-22z"
          fill="#64b5b4"
        />
        <path
          d="M665 403h32m21 24h36m-79 14h31"
          stroke="#9ed7c5"
          strokeWidth="3"
          className="water"
        />
        <path d="M743 403h12v5h-12m-77 22h13v5h-13" fill="#458b71" />
        <path d="M750 398h5v5h-5" fill="#edb2bd" />
        {[
          [110, 199],
          [154, 153],
          [282, 151],
          [316, 130],
          [374, 123],
          [600, 153],
          [649, 171],
          [766, 227],
          [800, 295],
          [109, 397],
          [154, 437],
          [548, 475],
        ].map(([x, y], i) => (
          <use
            key={i}
            href="#pine"
            transform={`translate(${x} ${y}) scale(${i % 3 === 0 ? 0.85 : 1})`}
          />
        ))}
        {/* Studio: a small coral-roofed workshop. */}
        <ellipse
          cx="207"
          cy="258"
          rx="87"
          ry="15"
          fill="#376e56"
          opacity=".3"
        />
        <path d="M137 179h137v78H137z" fill="#e6c8a0" />
        <path d="M137 245h137v14H137z" fill="#b68e75" />
        <path d="M137 179h13v68h-13m111-68h26v68h-26" fill="#d4ae8d" />
        <path
          d="M122 184v-13h12v-15h13v-15h15v-15h91v15h14v15h13v15h12v13z"
          fill="#754858"
        />
        <path d="M131 173v-9h13v-15h15v-14h91v14h14v15h13v9z" fill="#ce7b79" />
        <path
          d="M131 173v-9h13v-15h15v-14h91v14h14v15h13v9z"
          fill="url(#roof)"
        />
        <path d="M240 119h15v33h-15z" fill="#bca496" />
        <path d="M236 117h23v8h-23z" fill="#e3c5a6" />
        <g className="smoke" fill="#d3cde1" opacity=".35">
          <rect x="241" y="101" width="10" height="10" />
          <rect x="250" y="84" width="13" height="13" />
          <rect x="245" y="64" width="17" height="14" />
        </g>
        <path d="M193 211h31v47h-31z" fill="#6b5857" />
        <path d="M199 217h19v39h-19z" fill="#886a61" />
        <rect x="214" y="236" width="3" height="3" fill="#f4d78b" />
        <path d="M152 198h27v28h-27zm80 0h27v28h-27z" fill="#886b67" />
        <path
          d="M156 202h19v20h-19zm80 0h19v20h-19z"
          fill={night ? "#f5d789" : "#a7c4bd"}
        />
        <path
          d="M165 202v20m80-20v20m-89-10h19m61 0h19"
          stroke="#e8cda6"
          strokeWidth="3"
        />
        <path d="M185 259h47v7h-47m-5 7h57v6h-57" fill="#d9b68d" />
        <use href="#bush" transform="translate(151 258)" />
        <use href="#bush" transform="translate(260 258)" />
        {/* Project lab: glowing screens and a rooftop satellite. */}
        <ellipse
          cx="493"
          cy="238"
          rx="87"
          ry="13"
          fill="#376e56"
          opacity=".3"
        />
        <path d="M418 139h151v96H418z" fill="#bcb1d2" />
        <path d="M418 224h151v15H418z" fill="#8c819f" />
        <path d="M551 139h18v85h-18" fill="#9c91b8" />
        <path d="M404 140v-14h14v-14h137v14h27v14z" fill="#64577d" />
        <path d="M417 127v-9h132v9h19v5H417z" fill="#9481b4" />
        <path d="M434 157h47v34h-47zm63 0h47v34h-47z" fill="#514c69" />
        <path d="M439 162h37v24h-37zm63 0h37v24h-37z" fill="#80c4bb" />
        <path
          d="m446 173 6-5m-6 5 6 5m16-10-6 10m48-5h21"
          fill="none"
          stroke="#d4f3d3"
          strokeWidth="3"
        />
        <path d="M480 203h28v35h-28" fill="#645a79" />
        <path d="M485 209h18v27h-18" fill="#7d7197" />
        <rect x="498" y="220" width="3" height="3" fill="#f1d684" />
        <path d="M472 239h44v7h-44m-5 7h54v6h-54" fill="#c8b6a6" />
        <path
          d="M523 114V86m-19 0h35M504 72h6v7h22v-7h7v14h-35z"
          stroke="#d3c5dc"
          strokeWidth="5"
          fill="none"
        />
        <path d="M522 72h5v5h-5z" fill="#f4d78b" className="signal" />
        <path d="M430 103h41v12h-41" fill="#5e6376" />
        <path d="M434 106h10v5h-10m14-5h10v5h-10m4-5h5v5h-5" fill="#8ab6bd" />
        <use href="#bush" transform="translate(553 236)" />
        {/* Base camp. */}
        <ellipse
          cx="697"
          cy="331"
          rx="76"
          ry="12"
          fill="#376e56"
          opacity=".3"
        />
        <path
          d="M631 329v-15h12v-19h12v-20h12v-21h12v-21h12v-17h14v17h12v21h12v21h12v20h12v19h12v15z"
          fill="#e3bc77"
        />
        <path
          d="M698 222v108h67v-16h-12v-19h-12v-20h-12v-21h-12v-21h-12v-11z"
          fill="#bc9164"
        />
        <path d="M676 329v-34h11v-23h11v57z" fill="#55504b" />
        <path d="M698 274h10v22h11v33h-21z" fill="#7b6450" />
        <path d="M638 330h127v5H638z" fill="#8f7154" />
        <path d="m627 334 43-90m97 90-44-87" stroke="#d3cbb0" strokeWidth="2" />
        <path d="M623 330h6v10h-6m142-10h6v10h-6" fill="#675b50" />
        <path d="M704 214v-35h4v35" fill="#8c7261" />
        <path d="M708 178h30v18h-30z" fill="#c49bd6" />
        <path d="M708 178h9v18h-9z" fill="#e0bcdf" />
        {/* Mailbox and camp details. */}
        <path d="M233 390h8v43h-8z" fill="#795c50" />
        <path d="M214 365h44v28h-44z" fill="#8882aa" />
        <path d="M214 365h30v28h-30z" fill="#b4a1d4" />
        <path d="M215 365h29v6h-29z" fill="#d5bfec" />
        <path d="M219 379h18v4h-18z" fill="#5d5574" />
        <path d="M252 365v-14h13v7h-9v7z" fill="#f2c67e" />
        <path
          d="M181 371v41m-24-30h49m-45 9h41"
          stroke="#b99872"
          strokeWidth="7"
        />
        <path
          d="M324 388h37v11h-37m4 0v8m29-8v8"
          stroke="#916e52"
          strokeWidth="5"
          fill="#c19a6e"
        />
        <path d="M592 206v46m-21-45h47v24h-47z" fill="#b3966a" />
        <path d="M577 213h35v10h-35" fill="#725e50" />
        <path
          d="m588 216 8 0m-2-3 5 5-5 5"
          fill="none"
          stroke="#dfc89a"
          strokeWidth="2"
        />
        {[
          [95, 276],
          [321, 220],
          [372, 166],
          [608, 283],
          [767, 371],
          [298, 470],
          [483, 472],
          [585, 442],
          [126, 429],
        ].map(([x, y], i) => (
          <use
            key={i}
            href="#bush"
            transform={`translate(${x} ${y}) scale(.7)`}
          />
        ))}
        {[
          [95, 233],
          [118, 248],
          [312, 190],
          [338, 204],
          [582, 183],
          [617, 267],
          [776, 338],
          [750, 364],
          [474, 458],
          [511, 448],
          [320, 448],
          [178, 362],
          [159, 382],
          [302, 397],
        ].map(([x, y], i) => (
          <use
            key={i}
            href="#flower"
            transform={`translate(${x} ${y}) scale(${i % 2 ? 0.65 : 0.8})`}
          />
        ))}
        {[
          [81, 330],
          [329, 148],
          [578, 166],
          [779, 412],
          [563, 459],
          [191, 436],
        ].map(([x, y], i) => (
          <use key={i} href="#rock" transform={`translate(${x} ${y})`} />
        ))}
        {sparks.map(
          (s, i) =>
            !collected.includes(i) && (
              <g key={i} transform={`translate(${s.x} ${s.y})`}>
                <ellipse cy="8" rx="9" ry="3" fill="#416a50" opacity=".3" />
                <g className="spark" style={{ animationDelay: `${i * -0.4}s` }}>
                  <path d="M-3-14h6v7h7v6H3v7h-6v-7h-7v-6h7z" fill="#f9db86" />
                  <path d="M-2-7h4v6h-4z" fill="#fff0bd" />
                </g>
              </g>
            ),
        )}
        <Character x={pet.x} y={pet.y} small moving={moving} facing={facing} />
        <Character x={player.x} y={player.y} moving={moving} facing={facing} />
      </g>
      <g fill="#c8bee9" className="sky-stars">
        <path d="M70 60h3v7h-3m-2-5h7v3h-7M820 124h3v7h-3m-2-5h7v3h-7M860 385h3v7h-3m-2-5h7v3h-7M341 48h3v7h-3m-2-5h7v3h-7" />
        <rect x="170" y="58" width="3" height="3" />
        <rect x="791" y="67" width="3" height="3" />
      </g>
    </svg>
  );
}
