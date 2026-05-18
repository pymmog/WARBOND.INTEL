import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, ShieldAlert, Target, Crosshair, Flame, X, Check } from 'lucide-react';

/* ── Data ──────────────────────────────────────────────────────────────── */

const WARBONDS = [
  {
    name: "Democratic Detonation",
    tier: "S+", price: 1000, type: "Premium", rebate: true, released: "Apr 2024",
    weapons: ["R-36 Eruptor", "CB-9 Exploding Crossbow", "GP-31 Grenade Pistol"],
    grenade: "G-123 Thermite", stratagems: [], boosters: ["Expert Extraction Pilot"],
    armor: ["CE-27 Ground Breaker", "CE-07 Demolition Specialist"],
    passive: "Engineering Kit — −50% recoil crouched/prone, +2 grenades",
    playstyles: ["heavy-assault"], verdict: "must-buy",
    notes: "Best value Warbond in the game. Eruptor, Crossbow & Thermites remain S-tier across all factions."
  },
  {
    name: "Dust Devils",
    tier: "S+", price: 1000, type: "Premium", rebate: true, released: "Sep 2025",
    weapons: ["AR-2 Coyote (incendiary AR)", "S-11 Speargun (gas)"],
    grenade: "G-7 Pineapple (cluster frag)",
    stratagems: ["EAT-700 Expendable Napalm", "MS-11 Solo Silo"], boosters: [],
    armor: ["DS-42 Federation's Blade", "DS-191 Scorpion"],
    passive: "Desert Stormer — 40% resist fire/gas/acid/arc, +20% throw range",
    playstyles: ["heavy-assault", "support"], verdict: "must-buy",
    notes: "Passive bundles 4 resistances + throw range — best armor passive in the game."
  },
  {
    name: "Control Group",
    tier: "S+", price: 1000, type: "Premium", rebate: true, released: "Jul 2025",
    weapons: ["Overclocked SMG", "Overclocked AR", "Prototype Sidearm"],
    grenade: "Prototype Frag", stratagems: ["Prototype Weapon"],
    boosters: ["Prototype Stim Booster"],
    armor: ["Prototype Light", "Prototype Heavy"],
    passive: "Experimental Augments — random buff per mission",
    playstyles: ["heavy-assault", "support"], verdict: "must-buy",
    notes: "Bleeding-edge prototypes that consistently overperform. Strong primaries + utility."
  },
  {
    name: "Servants of Freedom",
    tier: "S+", price: 1000, type: "Premium", rebate: true, released: "Jul 2025",
    weapons: ["Cyborg-themed Plasma Rifle", "Heavy Auto-Cannon Primary"],
    grenade: "EMP Grenade", stratagems: ["Servant Auto-Turret"],
    boosters: ["Conscript Conditioning"], armor: ["Cybernetic Heavy"],
    passive: "Cybernetic Reinforcement — +25% melee, EMP immunity",
    playstyles: ["heavy-assault"], verdict: "must-buy",
    notes: "Anti-Cyborg meta pick since Machinery of Oppression dropped. Crushing on Cyberstan ops."
  },
  {
    name: "Redacted Regiment",
    tier: "S", price: 1000, type: "Premium", rebate: true, released: "Sep 2025",
    weapons: ["Suppressed Marksman Rifle", "Compact SMG"],
    grenade: "Smoke Grenade Plus", stratagems: ["Ghost Drop Beacon"],
    boosters: ["Operational Security"],
    armor: ["Ghost Operator (light)", "Black Ops (medium)"],
    passive: "Shadow Operative — reduced detection range, silent footsteps",
    playstyles: ["stealth"], verdict: "must-buy",
    notes: "The only true stealth-focused Warbond. Essential for solo/duo dives on bots."
  },
  {
    name: "Polar Patriots",
    tier: "S", price: 1000, type: "Premium", rebate: true, released: "May 2024",
    weapons: ["AR-61 Tenderizer", "PLAS-101 Purifier", "P-113 Verdict"],
    grenade: "G-13 Incendiary Impact", stratagems: [],
    boosters: ["Motivational Shocks"],
    armor: ["CW-4 Arctic Ranger", "CW-22 Kodiak"],
    passive: "Servo-Assisted variants — extended throw range, limb damage resist",
    playstyles: ["support"], verdict: "must-buy",
    notes: "Motivational Shocks is a top-3 booster. Solid all-round primaries."
  },
  {
    name: "Siege Breakers",
    tier: "S", price: 1000, type: "Premium", rebate: true, released: "Feb 2026",
    weapons: ["CQC-20 Breaching Hammer", "LAS-16 Trident"],
    grenade: "Breaching Charge", stratagems: ["Demolition Drop Pod"], boosters: [],
    armor: ["Breach Vanguard (heavy)", "Rags of the Fashionable"],
    passive: "Fortified Plus — explosive resist + reduced reload while crouched",
    playstyles: ["heavy-assault"], verdict: "must-buy",
    notes: "Hammer is melee-meta on bug fronts. Built for close, dangerous work."
  },
  {
    name: "Exo Experts",
    tier: "S", price: 1000, type: "Premium", rebate: true, released: "Apr 2026",
    weapons: ["SMG-203 Gallant", "P-33 Missile Pistol", "MGX-42 Bullet Storm"],
    grenade: null, stratagems: ["EXO-51 Lumberer", "EXO-55 Breakthrough"], boosters: [],
    armor: ["Mech Pilot (light)", "Hardsuit Operator (medium)"],
    passive: "Pilot Reflexes — faster mech entry/exit, +15% mech turn rate",
    playstyles: ["heavy-assault", "support"], verdict: "must-buy",
    notes: "Two meta-defining exosuits. Skip the primaries (Stoker outclasses them), buy for the mechs."
  },
  {
    name: "Urban Legends",
    tier: "A", price: 1000, type: "Premium", rebate: true, released: "Aug 2025",
    weapons: ["Compact Carbine", "Urban Shotgun"],
    grenade: "Flashbang", stratagems: ["Urban Recon Drone"],
    boosters: ["Urban Combat Doctrine"],
    armor: ["Urban Scout (light)", "Riot Control (medium)"],
    passive: "Urban Camo — +30% scout drone effectiveness in urban biomes",
    playstyles: ["support", "stealth"], verdict: "situational",
    notes: "Strong specifically on urban-biome rotations. Outside that, mid-tier."
  },
  {
    name: "Entrenched Division",
    tier: "A", price: 1000, type: "Premium", rebate: true, released: "Mar 2026",
    weapons: ["SMG/FLAM-34 Stoker", "Trench Carbine"],
    grenade: "Bunker Buster", stratagems: ["Sandbag Drop"],
    boosters: ["Foxhole Doctrine"],
    armor: ["Trench Coat (medium)", "Bunker Plate (heavy)"],
    passive: "Dug-In — +25% damage resist while stationary",
    playstyles: ["heavy-assault", "support"], verdict: "must-buy",
    notes: "The Stoker (flame underbarrel SMG) is S-tier — best horde-clearing primary right now."
  },
  {
    name: "Borderline Justice",
    tier: "A", price: 1000, type: "Premium", rebate: true, released: "Jun 2025",
    weapons: ["R-2124 Constitution", "P-4 Senator (revised)", "Marshal's Rifle"],
    grenade: "G-11 Tear Gas", stratagems: [], boosters: [],
    armor: ["Frontier Marshal (light)", "Outlaw Hunter (medium)"],
    passive: "Quickdraw — +50% sidearm draw/reload speed",
    playstyles: ["stealth"], verdict: "situational",
    notes: "Western theme. Strong if you build around revolver/marksman; niche otherwise."
  },
  {
    name: "Freedom's Flame",
    tier: "A", price: 1000, type: "Premium", rebate: true, released: "Mar 2025",
    weapons: ["FLAM-66 Torcher", "Crisper sidearm"],
    grenade: "G-11 Incendiary", stratagems: [], boosters: ["Firebomb Hellpods"],
    armor: ["CE-81 Juggernaut", "Salamander Class"],
    passive: "Inflammable — fire immunity",
    playstyles: ["heavy-assault"], verdict: "situational",
    notes: "Required if you main flamethrower. Otherwise the Inflammable passive is the only draw."
  },
  {
    name: "Chemical Agents",
    tier: "B", price: 1000, type: "Premium", rebate: true, released: "Jan 2025",
    weapons: ["SG-451 Cookout", "P-11 Stim Pistol"],
    grenade: "G-4 Gas", stratagems: ["Orbital Gas Strike"], boosters: [],
    armor: ["Sterilizer (light)", "Hazmat Plus (medium)"],
    passive: "Advanced Filtration — gas immunity, gas DoT amplified on enemies you hit",
    playstyles: ["support"], verdict: "situational",
    notes: "Gas builds are real but niche. Stim Pistol is genuinely useful for support players."
  },
  {
    name: "Cutting Edge",
    tier: "B", price: 1000, type: "Premium", rebate: true, released: "Feb 2024",
    weapons: ["LAS-16 Sickle", "LAS-7 Dagger", "ARC-12 Blitzer"],
    grenade: "G-23 Stun", stratagems: [], boosters: ["Localization Confusion"],
    armor: ["EX-03 Prototype 3", "EX-16 Prototype 16"],
    passive: "Electrical Conduit — arc damage resistance",
    playstyles: ["stealth", "support"], verdict: "situational",
    notes: "Sickle is still elite, Stun grenades are top-tier — but tier dropped after laser nerfs."
  },
  {
    name: "Steeled Veterans",
    tier: "B", price: 1000, type: "Premium", rebate: true, released: "Feb 2024",
    weapons: ["SG-225IE Breaker Incendiary", "P-19 Redeemer", "JAR-5 Dominator"],
    grenade: "G-10 Incendiary", stratagems: [], boosters: ["Hellpod Space Optimization"],
    armor: ["CM-14 Physician", "B-08 Light Gunner"],
    passive: "Med-Kit / Fortified variants",
    playstyles: ["heavy-assault", "stealth"], verdict: "situational",
    notes: "Hellpod Space Optimization is best-in-slot booster. Dominator still solid vs bots."
  },
  {
    name: "Viper Commandos",
    tier: "B", price: 1000, type: "Premium", rebate: true, released: "Jun 2024",
    weapons: ["AR-23A Liberator Carbine", "P-72 Crisper"],
    grenade: "G-13 Incendiary Impact", stratagems: [],
    boosters: ["Experimental Infusion"],
    armor: ["Peak Physique armor sets"],
    passive: "Peak Physique — +100% melee, drastically faster weapon handling",
    playstyles: ["support"], verdict: "situational",
    notes: "Buy for two things: Experimental Infusion booster + Peak Physique passive. Weapons are filler."
  },
  {
    name: "Truth Enforcers",
    tier: "B", price: 1000, type: "Premium", rebate: true, released: "Apr 2025",
    weapons: ["Riot Shield primary combo", "Stun Baton"],
    grenade: "G-11 Pepper Grenade", stratagems: ["Anti-Riot Sentry"], boosters: [],
    armor: ["Peacekeeper (medium)"],
    passive: "Crowd Control — knockback resist, ballistic shield deploy speed",
    playstyles: ["support"], verdict: "situational",
    notes: "Built around the shield meta. Fun, but niche outside specific build paths."
  },
  {
    name: "Python Commandos",
    tier: "B", price: 1000, type: "Premium", rebate: true, released: "Dec 2025",
    weapons: ["AR-23P Liberator Predator", "Tactical Bow"],
    grenade: "G-50 Snake Venom", stratagems: [], boosters: ["Jungle Survival Training"],
    armor: ["Jungle Stalker (light)"],
    passive: "Jungle Camo — reduced detection in foliage, faster sprint in dense biomes",
    playstyles: ["stealth"], verdict: "situational",
    notes: "Niche jungle-biome specialist. Spiritual successor to Viper Commandos."
  },
  {
    name: "Force of Law",
    tier: "C", price: 1000, type: "Premium", rebate: true, released: "May 2025",
    weapons: ["Tactical Shotgun", "P-2 Peacemaker"],
    grenade: "G-11 Concussion", stratagems: [], boosters: [],
    armor: ["Patrol (light)"],
    passive: "Cop Reflexes — minor sidearm draw bonus",
    playstyles: ["support"], verdict: "niche",
    notes: "Cosmetic-heavy. Pass unless you love the police aesthetic."
  },
  {
    name: "Masters of Ceremony",
    tier: "C", price: 1000, type: "Premium", rebate: true, released: "Jul 2024",
    weapons: ["Ceremonial Saber", "Parade Rifle"],
    grenade: null, stratagems: [], boosters: [],
    armor: ["Honor Guard sets"],
    passive: "Parade Step — cosmetic-leaning, minor stamina bonus",
    playstyles: ["support"], verdict: "niche",
    notes: "Honor Guard fashion show. Weakest combat utility of any Premium Warbond."
  },
  {
    name: "Halo: ODST",
    tier: "D", price: 1500, type: "Legendary", rebate: false, released: "Jul 2025",
    weapons: ["MA5C ICWS", "M6C SOCOM", "M7S Caseless SMG"],
    grenade: "M9 Frag", stratagems: ["Drop Pod Reinforcement (cosmetic)"], boosters: [],
    armor: ["ODST Battle Dress", "Helljumper variant"],
    passive: "Drop Trooper — faster reinforcement cooldown",
    playstyles: ["heavy-assault"], verdict: "niche",
    notes: "Pure crossover fanservice. 1500 SC with no rebate. Skip unless you're a Halo fan."
  },
  {
    name: "Righteous Revenants",
    tier: "D", price: 1500, type: "Legendary", rebate: false, released: "Sep 2025",
    weapons: ["StA-52 Assault Rifle", "PLAS-39 Accelerator Rifle", "StA-11 SMG"],
    grenade: null, stratagems: [], boosters: [],
    armor: ["Helghast Heavy", "Helghast Trooper"],
    passive: "Helghast Resolve — minor armor + iconic red-eye visor",
    playstyles: ["stealth", "heavy-assault"], verdict: "niche",
    notes: "Killzone crossover. Free if you already bought any Helghast Superstore item. Otherwise 1500 SC for aesthetics."
  }
];

/* ── Config ─────────────────────────────────────────────────────────────── */

const TIER_CONFIG = {
  "S+": { color: "#FF2244", bgDark: "#180008", glow: "rgba(255,34,68,0.75)",  glowClass: "tier-sp-glow" },
  "S":  { color: "#FF6B00", bgDark: "#180900", glow: "rgba(255,107,0,0.65)",  glowClass: "tier-s-glow"  },
  "A":  { color: "#FFD700", bgDark: "#151100", glow: "rgba(255,215,0,0.5)",   glowClass: ""             },
  "B":  { color: "#39FF14", bgDark: "#021200", glow: "rgba(57,255,20,0.4)",   glowClass: ""             },
  "C":  { color: "#00AAFF", bgDark: "#000e18", glow: "rgba(0,170,255,0.4)",   glowClass: ""             },
  "D":  { color: "#555566", bgDark: "#0d0d12", glow: "rgba(85,85,102,0.3)",   glowClass: ""             },
};

const TIER_ORDER = { "S+": 0, "S": 1, "A": 2, "B": 3, "C": 4, "D": 5 };

const VERDICT_CONFIG = {
  "must-buy":    { label: "◆ PRIORITY ACQUISITION", color: "#FFD700", border: "rgba(255,215,0,0.4)",  bg: "rgba(255,215,0,0.07)",  icon: Check  },
  "situational": { label: "◈ SITUATIONAL",           color: "#00AAFF", border: "rgba(0,170,255,0.35)", bg: "rgba(0,170,255,0.06)",  icon: Target },
  "niche":       { label: "◇ NICHE / SKIP",          color: "#555566", border: "rgba(85,85,102,0.3)",  bg: "rgba(85,85,102,0.04)",  icon: X      },
};

const PLAYSTYLES = [
  { id: "all",           label: "ALL DOCTRINES",  icon: Crosshair  },
  { id: "stealth",       label: "STEALTH OPS",    icon: Target     },
  { id: "heavy-assault", label: "HEAVY ASSAULT",  icon: Flame      },
  { id: "support",       label: "SUPPORT",        icon: ShieldAlert },
];

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function StatusDot({ color = "#FFD700", pulse = true }) {
  return (
    <span
      className={pulse ? "animate-status" : ""}
      style={{
        display: "inline-block",
        width: 6, height: 6,
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 6px ${color}`,
        flexShrink: 0,
      }}
    />
  );
}

function ContentBlock({ label, items }) {
  const empty = !items || items.length === 0;
  return (
    <div>
      <div style={{ color: "#555577", fontSize: 10, letterSpacing: "0.18em", marginBottom: 4 }}>{label}</div>
      {empty ? (
        <div style={{ color: "#333344", fontStyle: "italic", fontSize: 11 }}>— none —</div>
      ) : (
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {items.map((it, i) => (
            <li key={i} style={{ fontSize: 11, lineHeight: 1.6, color: "#9999bb" }}>
              <span style={{ color: "#FFD700", marginRight: 6 }}>›</span>{it}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── Card ──────────────────────────────────────────────────────────────────── */

function WarbondCard({ w, isOpen, onToggle }) {
  const tc = TIER_CONFIG[w.tier];
  const vc = VERDICT_CONFIG[w.verdict];
  const VIcon = vc.icon;

  const wrapperStyle = {
    filter: `drop-shadow(0 0 8px ${tc.glow})`,
    transition: "filter 0.35s ease",
  };

  const hoverGlow = {
    "--hover-glow": `drop-shadow(0 0 18px ${tc.glow})`,
  };

  return (
    <div
      className={`hd-card-wrapper ${tc.glowClass}`}
      style={wrapperStyle}
      onMouseEnter={e => { if (!tc.glowClass) e.currentTarget.style.filter = `drop-shadow(0 0 16px ${tc.glow})`; }}
      onMouseLeave={e => { if (!tc.glowClass) e.currentTarget.style.filter = `drop-shadow(0 0 8px ${tc.glow})`; }}
    >
      <article
        className="hd-card relative overflow-hidden"
        style={{
          background: tc.bgDark,
          border: `1px solid ${tc.color}`,
          borderOpacity: 0.6,
        }}
      >
        {/* Subtle inner noise texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "repeating-linear-gradient(135deg, transparent, transparent 20px, rgba(255,255,255,0.005) 20px, rgba(255,255,255,0.005) 40px)",
          }}
        />

        {/* Top accent line in tier color */}
        <div style={{ height: 2, background: `linear-gradient(90deg, ${tc.color}, transparent)`, opacity: 0.8 }} />

        {/* Tier badge — top-right diagonal */}
        <div
          className="tier-badge absolute top-0 right-0 display-font"
          style={{
            background: tc.color,
            color: ["S+","S","D"].includes(w.tier) ? "#000" : "#000",
            padding: "4px 12px 4px 18px",
            fontSize: 18,
            lineHeight: 1,
            fontWeight: 900,
            letterSpacing: "0.05em",
            zIndex: 5,
          }}
        >
          {w.tier}
        </div>

        <div className="relative z-10 p-4 pt-3">
          {/* Breadcrumb */}
          <div style={{ fontSize: 9, letterSpacing: "0.25em", color: "#444455", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
            <StatusDot color={tc.color} pulse={w.tier === "S+" || w.tier === "S"} />
            <span>{w.type.toUpperCase()}</span>
            <span style={{ color: "#222233" }}>//</span>
            <span>{w.released.toUpperCase()}</span>
            {w.type === "Legendary" && (
              <>
                <span style={{ color: "#222233" }}>//</span>
                <span style={{ color: "#FF6B00" }}>LEGENDARY</span>
              </>
            )}
          </div>

          {/* Name */}
          <h2
            className="display-font"
            style={{ fontSize: 20, color: "#e8e8f0", lineHeight: 1.1, marginBottom: 10, marginRight: 40 }}
          >
            {w.name}
          </h2>

          {/* Verdict + price row */}
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
            <span
              className="rajdhani"
              style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                fontSize: 10, letterSpacing: "0.15em", fontWeight: 700,
                color: vc.color,
                border: `1px solid ${vc.border}`,
                background: vc.bg,
                padding: "2px 8px",
              }}
            >
              <VIcon size={10} />
              {vc.label}
            </span>
            <span style={{ fontSize: 10, letterSpacing: "0.1em", color: "#444466" }}>
              {w.price} SC
              {w.rebate
                ? <span style={{ color: "#39FF14", marginLeft: 6 }}>+ REBATE</span>
                : <span style={{ color: "#FF4444", marginLeft: 6 }}>NO REBATE</span>
              }
            </span>
          </div>

          {/* Notes */}
          <p style={{ fontSize: 11, lineHeight: 1.65, color: "#8888aa", marginBottom: 10 }}>
            {w.notes}
          </p>

          {/* Passive — highlighted block */}
          <div
            style={{
              borderLeft: `2px solid ${tc.color}`,
              paddingLeft: 8,
              marginBottom: 10,
              background: `linear-gradient(90deg, ${tc.color}0d, transparent)`,
              padding: "6px 8px",
            }}
          >
            <div style={{ fontSize: 9, letterSpacing: "0.2em", color: tc.color, marginBottom: 3 }}>ARMOR PASSIVE</div>
            <div style={{ fontSize: 11, color: "#c8c8e0" }}>{w.passive}</div>
          </div>

          {/* Playstyle tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {w.playstyles.map(ps => (
              <span
                key={ps}
                style={{
                  fontSize: 9, letterSpacing: "0.18em",
                  padding: "2px 7px",
                  border: "1px solid #1e1e30",
                  background: "#0d0d18",
                  color: "#555577",
                }}
              >
                {ps.toUpperCase().replace("-", " ")}
              </span>
            ))}
          </div>

          {/* Expand button */}
          <button
            onClick={onToggle}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid #1a1a28",
              paddingTop: 8,
              background: "none",
              cursor: "pointer",
              color: isOpen ? tc.color : "#333344",
              fontSize: 9,
              letterSpacing: "0.2em",
              fontFamily: "inherit",
              transition: "color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = tc.color}
            onMouseLeave={e => e.currentTarget.style.color = isOpen ? tc.color : "#333344"}
          >
            <span>{isOpen ? "▲ COLLAPSE MANIFEST" : "▼ VIEW FULL MANIFEST"}</span>
            {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {/* Expanded contents */}
          {isOpen && (
            <div className="animate-expand-in" style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ height: 1, background: `linear-gradient(90deg, ${tc.color}40, transparent)` }} />
              <ContentBlock label="PRIMARY / SECONDARY WEAPONS" items={w.weapons} />
              {w.grenade && <ContentBlock label="GRENADE" items={[w.grenade]} />}
              <ContentBlock label="STRATAGEMS" items={w.stratagems} />
              <ContentBlock label="BOOSTERS" items={w.boosters} />
              <ContentBlock label="ARMOR SETS" items={w.armor} />
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

/* ── Filter Button ───────────────────────────────────────────────────────── */

function FilterBtn({ active, onClick, children, accentColor = "#FFD700" }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "5px 12px",
        fontSize: 10, letterSpacing: "0.18em",
        fontFamily: "inherit",
        cursor: "pointer",
        border: `1px solid ${active ? accentColor : "#1e1e30"}`,
        background: active ? `${accentColor}18` : "transparent",
        color: active ? accentColor : "#333355",
        transition: "all 0.2s",
        clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = "#333355"; e.currentTarget.style.color = "#7777aa"; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = "#1e1e30"; e.currentTarget.style.color = "#333355"; } }}
    >
      {children}
    </button>
  );
}

/* ── Sort Button ─────────────────────────────────────────────────────────── */

function SortBtn({ active, dir, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "4px 8px",
        fontSize: 10, letterSpacing: "0.18em",
        fontFamily: "inherit",
        cursor: "pointer",
        background: "none", border: "none",
        color: active ? "#FFD700" : "#2a2a3f",
        transition: "color 0.2s",
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.color = "#555577"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.color = "#2a2a3f"; }}
    >
      {children}
      {active && (dir === "asc" ? <ChevronUp size={10} /> : <ChevronDown size={10} />)}
    </button>
  );
}

/* ── Main Dashboard ──────────────────────────────────────────────────────── */

export default function WarbondDashboard() {
  const [sortBy,    setSortBy]    = useState("tier");
  const [sortDir,   setSortDir]   = useState("asc");
  const [playstyle, setPlaystyle] = useState("all");
  const [search,    setSearch]    = useState("");
  const [verdict,   setVerdict]   = useState("all");
  const [expanded,  setExpanded]  = useState(null);

  const filtered = useMemo(() => {
    let list = [...WARBONDS];
    if (playstyle !== "all") list = list.filter(w => w.playstyles.includes(playstyle));
    if (verdict   !== "all") list = list.filter(w => w.verdict === verdict);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(w =>
        w.name.toLowerCase().includes(q) ||
        w.weapons.some(x => x.toLowerCase().includes(q)) ||
        (w.passive || "").toLowerCase().includes(q) ||
        (w.notes   || "").toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "tier")    cmp = TIER_ORDER[a.tier] - TIER_ORDER[b.tier];
      if (sortBy === "name")    cmp = a.name.localeCompare(b.name);
      if (sortBy === "price")   cmp = a.price - b.price;
      if (sortBy === "verdict") {
        const v = { "must-buy": 0, "situational": 1, "niche": 2 };
        cmp = v[a.verdict] - v[b.verdict];
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [sortBy, sortDir, playstyle, verdict, search]);

  const toggleSort = key => {
    if (sortBy === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(key); setSortDir("asc"); }
  };

  const counts = useMemo(() => ({
    total:   WARBONDS.length,
    mustBuy: WARBONDS.filter(w => w.verdict === "must-buy").length,
    showing: filtered.length,
  }), [filtered]);

  return (
    <div className="scanlines" style={{ minHeight: "100vh", background: "#030306", position: "relative" }}>

      {/* Ambient background dot-grid */}
      <div className="dot-grid" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.5 }} />

      {/* Animated sweep line */}
      <div
        className="animate-scan-sweep"
        style={{
          position: "fixed", top: 0, left: 0, width: 3, height: "100vh",
          background: "linear-gradient(180deg, transparent, rgba(255,215,0,0.15), transparent)",
          zIndex: 1, pointerEvents: "none",
        }}
      />

      {/* ── HEADER ── */}
      <header
        className="stripe-bg scanlines relative"
        style={{
          borderBottom: "2px solid #FFD700",
          background: "linear-gradient(180deg, #0a080e 0%, #060408 100%)",
          position: "relative", zIndex: 2,
          boxShadow: "0 4px 40px rgba(255,215,0,0.08)",
        }}
      >
        {/* Top edge accent */}
        <div style={{ height: 3, background: "linear-gradient(90deg, #FFD700, #FF6B00, #FFD700)", opacity: 0.8 }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 16px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>

            {/* Left: branding */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <StatusDot color="#FFD700" pulse />
                <span style={{ fontSize: 9, letterSpacing: "0.35em", color: "#444455" }}>
                  MINISTRY OF DEFENSE — ACQUISITIONS BRIEFING
                </span>
              </div>

              <h1
                className="display-font animate-flicker"
                style={{ fontSize: "clamp(28px, 6vw, 52px)", lineHeight: 1, color: "#e8e8f0", marginBottom: 8 }}
              >
                WARBOND<span style={{ color: "#FFD700" }}>.</span>INTEL
              </h1>

              {/* Stats row */}
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                {[
                  { label: "PATCH",      value: "6.2.2"            },
                  { label: "ASSETS",     value: counts.total       },
                  { label: "PRIORITY",   value: counts.mustBuy     },
                  { label: "SHOWING",    value: counts.showing     },
                ].map(s => (
                  <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: 8, letterSpacing: "0.25em", color: "#333344" }}>{s.label}</span>
                    <span className="display-font" style={{ fontSize: 16, color: "#FFD700", lineHeight: 1 }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: classification marker */}
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 8, letterSpacing: "0.3em", color: "#333344", marginBottom: 4 }}>CLASSIFICATION</div>
              <div
                className="display-font"
                style={{
                  fontSize: 20, color: "#FF2244",
                  border: "1px solid rgba(255,34,68,0.4)",
                  padding: "4px 12px",
                  background: "rgba(255,34,68,0.06)",
                  letterSpacing: "0.12em",
                  clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                }}
              >
                EYES ONLY
              </div>
              <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "#222233", marginTop: 6 }}>
                <span className="animate-blink" style={{ color: "#FF2244" }}>●</span>
                {" "}LIVE — {new Date().toISOString().slice(0, 10)}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── CONTROLS ── */}
      <section
        style={{
          borderBottom: "1px solid #0e0e1a",
          background: "linear-gradient(180deg, #08080f, #050508)",
          position: "sticky", top: 0, zIndex: 20,
          boxShadow: "0 2px 20px rgba(0,0,0,0.6)",
        }}
      >
        {/* Accent line */}
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #FFD70030, transparent)" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>

          {/* Search */}
          <div style={{ position: "relative" }}>
            <Search
              size={14}
              style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#333355", pointerEvents: "none" }}
            />
            <input
              type="text"
              placeholder="SEARCH WEAPONS / PASSIVES / WARBOND NAMES..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%", boxSizing: "border-box",
                background: "#07070e",
                border: "1px solid #1a1a28",
                outline: "none",
                paddingLeft: 36, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
                fontSize: 10, letterSpacing: "0.18em",
                color: "#c8c8e0",
                fontFamily: "inherit",
                clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                transition: "border-color 0.2s",
              }}
              onFocus={e  => e.target.style.borderColor = "#FFD700"}
              onBlur={e   => e.target.style.borderColor = "#1a1a28"}
            />
          </div>

          {/* Playstyle + Verdict filters */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 8, letterSpacing: "0.25em", color: "#222233", marginBottom: 6 }}>DOCTRINE //</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {PLAYSTYLES.map(p => {
                  const Icon = p.icon;
                  return (
                    <FilterBtn key={p.id} active={playstyle === p.id} onClick={() => setPlaystyle(p.id)}>
                      <Icon size={10} />{p.label}
                    </FilterBtn>
                  );
                })}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 8, letterSpacing: "0.25em", color: "#222233", marginBottom: 6 }}>RECOMMENDATION //</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {["all", "must-buy", "situational", "niche"].map(v => (
                  <FilterBtn key={v} active={verdict === v} onClick={() => setVerdict(v)}>
                    {v === "all" ? "ALL" : VERDICT_CONFIG[v].label}
                  </FilterBtn>
                ))}
              </div>
            </div>
          </div>

          {/* Sort bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap", borderTop: "1px solid #0e0e1a", paddingTop: 8 }}>
            <span style={{ fontSize: 8, letterSpacing: "0.25em", color: "#222233", marginRight: 4 }}>SORT //</span>
            {["tier", "name", "price", "verdict"].map(key => (
              <SortBtn key={key} active={sortBy === key} dir={sortDir} onClick={() => toggleSort(key)}>
                {key.toUpperCase()}
              </SortBtn>
            ))}
            <span style={{ marginLeft: "auto", fontSize: 9, letterSpacing: "0.2em", color: "#222233" }}>
              <span style={{ color: "#FFD700" }}>{counts.showing}</span> / {counts.total} ASSETS
            </span>
          </div>
        </div>
      </section>

      {/* ── GRID ── */}
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 16px 40px", position: "relative", zIndex: 2 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#1e1e30", fontSize: 11, letterSpacing: "0.3em" }}>
            // NO ASSETS MATCH CURRENT PARAMETERS
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 14,
          }}>
            {filtered.map(w => (
              <WarbondCard
                key={w.name}
                w={w}
                isOpen={expanded === w.name}
                onToggle={() => setExpanded(expanded === w.name ? null : w.name)}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer
        style={{
          borderTop: "1px solid #0e0e1a",
          background: "#030306",
          position: "relative", zIndex: 2,
        }}
      >
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #FFD70020, transparent)" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 16px 32px" }}>
          <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "#222233", marginBottom: 8 }}>// METHODOLOGY</div>
          <p style={{ fontSize: 11, lineHeight: 1.8, color: "#333344", maxWidth: 720, margin: 0, fontFamily: "inherit" }}>
            Tier rankings synthesized from U.GG community tier list (May 2026, Patch 6.2.2) and current weapon/stratagem
            performance data. "Priority Acquisition" = S+/S tier with SC rebate. "Situational" = A/B tier or
            build-dependent. "Niche / Skip" = C/D tier, cosmetic-led, or no Super Credit rebate.
            Free Helldivers Mobilize Warbond excluded — this dashboard covers only paid acquisition decisions.
          </p>
          <div style={{ marginTop: 20, fontSize: 9, letterSpacing: "0.3em", color: "#1a1a28" }}>
            // FOR LIBERTY. FOR MANAGED DEMOCRACY. //
          </div>
        </div>
      </footer>
    </div>
  );
}
