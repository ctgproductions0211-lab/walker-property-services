// Looping scene: truck pulls up, junk hops from the curb into the bed, truck drives off.
// All motion shares one 10s timeline so the hops line up with the truck being parked.

const css = `
.jt-truck   { animation: jt-drive 10s ease-in-out infinite; }
.jt-wheel   { animation: jt-spin 10s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.jt-bounce  { animation: jt-bounce 0.5s ease-in-out infinite alternate; }
.jt-hop1    { animation: jt-hop1 10s linear infinite; }
.jt-hop2    { animation: jt-hop2 10s linear infinite; }
.jt-hop3    { animation: jt-hop3 10s linear infinite; }
.jt-bed1    { animation: jt-bed1 10s step-end infinite; }
.jt-bed2    { animation: jt-bed2 10s step-end infinite; }
.jt-bed3    { animation: jt-bed3 10s step-end infinite; }
.jt-dust    { animation: jt-dust 10s ease-out infinite; }

@keyframes jt-drive {
  0%   { transform: translateX(-440px); }
  18%  { transform: translateX(0); }
  62%  { transform: translateX(0); }
  86%  { transform: translateX(560px); }
  100% { transform: translateX(560px); }
}
@keyframes jt-spin {
  0%   { transform: rotate(0deg); }
  18%  { transform: rotate(900deg); }
  62%  { transform: rotate(900deg); }
  86%  { transform: rotate(2000deg); }
  100% { transform: rotate(2000deg); }
}
@keyframes jt-bounce { from { transform: translateY(0); } to { transform: translateY(-1.5px); } }

@keyframes jt-hop1 {
  0%, 22% { transform: translate(0, 0); opacity: 1; }
  26%     { transform: translate(-132px, -80px) rotate(-90deg); opacity: 1; }
  30%     { transform: translate(-265px, -48px) rotate(-180deg); opacity: 1; }
  30.1%, 92% { opacity: 0; transform: translate(-265px, -48px); }
  100%    { transform: translate(0, 0); opacity: 1; }
}
@keyframes jt-hop2 {
  0%, 32% { transform: translate(0, 0); opacity: 1; }
  36%     { transform: translate(-140px, -82px) rotate(-200deg); opacity: 1; }
  40%     { transform: translate(-280px, -48px) rotate(-400deg); opacity: 1; }
  40.1%, 92% { opacity: 0; transform: translate(-280px, -48px); }
  100%    { transform: translate(0, 0); opacity: 1; }
}
@keyframes jt-hop3 {
  0%, 42% { transform: translate(0, 0); opacity: 1; }
  46%     { transform: translate(-153px, -85px) rotate(40deg); opacity: 1; }
  50%     { transform: translate(-307px, -48px) rotate(0deg); opacity: 1; }
  50.1%, 92% { opacity: 0; transform: translate(-307px, -48px); }
  100%    { transform: translate(0, 0); opacity: 1; }
}
@keyframes jt-bed1 { 0% { opacity: 0; } 30% { opacity: 1; } }
@keyframes jt-bed2 { 0% { opacity: 0; } 40% { opacity: 1; } }
@keyframes jt-bed3 { 0% { opacity: 0; } 50% { opacity: 1; } }

@keyframes jt-dust {
  0%, 62% { opacity: 0; transform: translateX(0) scale(0.6); }
  66%     { opacity: 0.5; }
  80%     { opacity: 0; transform: translateX(-60px) scale(1.4); }
  100%    { opacity: 0; }
}

.jt-hop1, .jt-hop2, .jt-hop3 { transform-box: fill-box; transform-origin: center; }

@media (prefers-reduced-motion: reduce) {
  .jt-truck, .jt-wheel, .jt-bounce, .jt-hop1, .jt-hop2, .jt-hop3,
  .jt-bed1, .jt-bed2, .jt-bed3, .jt-dust { animation: none; }
  .jt-hop1, .jt-hop2, .jt-hop3, .jt-dust { opacity: 0; }
}
`

const GREEN = '#6B8C23'
const GREEN_DARK = '#4f6a17'

function Box() {
  return (
    <g>
      <rect width="34" height="32" rx="2" fill="#b07d46" />
      <rect x="0" y="0" width="34" height="7" fill="#9a6a38" />
      <rect x="14" y="0" width="6" height="32" fill="#d9b27c" opacity="0.8" />
    </g>
  )
}

function Tire() {
  return (
    <g>
      <circle r="15" fill="#1f1f1f" stroke="#3a3a3a" strokeWidth="3" />
      <circle r="6" fill="#6b6b6b" />
    </g>
  )
}

function Bag() {
  return (
    <g>
      <path d="M-17 18 Q-20 -2 -8 -12 L-3 -16 L3 -16 L8 -12 Q20 -2 17 18 Z" fill="#2b2b2b" stroke="#444" strokeWidth="1.5" />
      <path d="M-4 -16 L0 -22 L4 -16" fill="none" stroke="#9cc23a" strokeWidth="2" strokeLinecap="round" />
    </g>
  )
}

export default function JunkTruckAnimation() {
  return (
    <svg
      viewBox="0 62 600 168"
      className="w-full h-auto block"
      role="img"
      aria-label="Walker Property Services truck picking up junk from the curb and hauling it away"
    >
      <style>{css}</style>

      {/* Road and curb */}
      <rect x="0" y="198" width="600" height="32" fill="#1a1a1a" />
      <g stroke="#3a3a3a" strokeWidth="3" strokeDasharray="22 18">
        <line x1="0" y1="216" x2="600" y2="216" />
      </g>
      <rect x="370" y="194" width="230" height="6" rx="2" fill="#2a2a2a" />

      {/* Junk waiting on the curb */}
      <g transform="translate(400 166)"><g className="jt-hop1"><Box /></g></g>
      <g transform="translate(470 179)"><g className="jt-hop2"><Tire /></g></g>
      <g transform="translate(535 176)"><g className="jt-hop3"><Bag /></g></g>

      {/* Truck */}
      <g className="jt-truck">
        <g className="jt-dust">
          <circle cx="104" cy="186" r="9" fill="#6b6b6b" />
          <circle cx="90" cy="180" r="6" fill="#6b6b6b" />
        </g>
        <g className="jt-bounce">
          {/* Load riding in the bed */}
          <g className="jt-bed1"><g transform="translate(135 118)"><Box /></g></g>
          <g className="jt-bed2"><g transform="translate(190 135)"><Tire /></g></g>
          <g className="jt-bed3"><g transform="translate(228 132)"><Bag /></g></g>

          {/* Bed */}
          <path d="M120 106 H252 V152 H120 Z" fill="none" stroke={GREEN} strokeWidth="4" strokeLinejoin="round" />
          <g stroke={GREEN} strokeWidth="3">
            <line x1="153" y1="106" x2="153" y2="152" />
            <line x1="186" y1="106" x2="186" y2="152" />
            <line x1="219" y1="106" x2="219" y2="152" />
          </g>
          <rect x="116" y="150" width="210" height="22" rx="4" fill={GREEN} />
          <text x="186" y="166" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" letterSpacing="2">WALKER</text>

          {/* Cab */}
          <path d="M256 150 V112 Q256 104 264 104 H292 Q300 104 305 112 L322 136 Q326 141 326 148 V150 Z" fill={GREEN} />
          <path d="M268 112 H290 L304 134 H268 Z" fill="#cfe3f2" opacity="0.85" />
          <rect x="318" y="140" width="10" height="6" rx="2" fill="#ffe08a" />
          <rect x="250" y="146" width="80" height="6" fill={GREEN_DARK} />
        </g>

        {/* Wheels */}
        <g className="jt-wheel">
          <circle cx="160" cy="182" r="16" fill="#141414" stroke="#333" strokeWidth="3" />
          <circle cx="160" cy="182" r="6" fill="#8a8a8a" />
          <line x1="160" y1="170" x2="160" y2="194" stroke="#555" strokeWidth="2" />
        </g>
        <g className="jt-wheel">
          <circle cx="294" cy="182" r="16" fill="#141414" stroke="#333" strokeWidth="3" />
          <circle cx="294" cy="182" r="6" fill="#8a8a8a" />
          <line x1="294" y1="170" x2="294" y2="194" stroke="#555" strokeWidth="2" />
        </g>
      </g>
    </svg>
  )
}
