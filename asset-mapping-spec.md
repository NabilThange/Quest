# Life RPG — Asset Mapping Spec (Phase 3)

Guiding principles for your agent:
- The banner is a **CSS progress-path**, not a real game engine — the avatar's position is a function of "% of today's tasks completed," animated with a spring transition. No canvas, no physics, no game loop.
- Reuse the pre-made **Catchimon Battle/Menu UI art** directly for the battle modal — it already has an HP bar and panel chrome, so no custom UI needs to be designed from scratch.
- Extract sprite-sheet frames using `background-position` (CSS, for static icons) or `drawImage` (canvas, for animated walk cycles) — see extraction notes at the bottom.
- Audio plays only at high-emotion moments (starter pick, battle open) — never as a persistent loop during normal task browsing.

---

## 1. Audio

| Asset | Used where | Why / how |
|---|---|---|
| `Pokemon Battle music.mp3` | Starter-selection screen (looped, low volume) + Battle modal (looped while open, fades out on close) | Marks the two "exciting" moments distinctly from routine task-checking. Global mute toggle in the header, preference saved to `users.sound_enabled`. |

---

## 2. Player avatar (overworld, cosmetic only — separate from Pokémon)

| Asset | Used where | Why / how |
|---|---|---|
| `PLAYER RED.png` / `PLAYER LEAF.png` (8 characters total) | Avatar picker at onboarding (after starter Pokémon pick); walk-cycle in the banner | Classic Pokémon-style overworld sprite — extract the walk-frame row via `drawImage`/CSS steps for a simple 2-4 frame walk loop while the avatar's position animates. |
| Tiny Adventure Pack Char1 (idle/walk/sword/bow/shield/fall/pick-item) | Alternate avatar skin option, richer animation set mapped to app states: idle = default, walk = task-complete step, sword/bow attack = battle-open flourish, **shield idle/walk = active-streak visual** (shield = "protected" streak state), fall = HP hits 0 / bad day, pick-item = reward/shop purchase claimed | This character has enough distinct animations to reflect actual app state, not just decoration — e.g. showing the shield pose automatically whenever `streak_count > 0` is a free, satisfying "alive and tactile" touch. |
| Tiny Adventure Pack Char2 (same animation set) | Second alternate avatar skin, same state-mapping as Char1 | Gives users a second cosmetic option using the same logic, zero extra code. |
| Additional Animations (Char1-6: bump/hit, push, pull, roll, swim) | Stretch only — "roll" as a quick flourish on fast task-completion streaks, "bump/hit" as the reaction when a daily is missed | Lower priority; only wire these up if core loop is done early. |
| Pocket Creature Tamer trainer sheet | Third alternate avatar skin | Gives 3 distinct visual styles to choose from at onboarding — purely a personalization option, same underlying `avatar_style` field from the base spec's placeholder-sprite design. |

---

## 3. Creatures (wild Pokémon species art)

| Asset | Used where | Why / how |
|---|---|---|
| Catchimon Water-Grass #19/#20, Fire #01/#02, Water-Fly #11-13 (single-frame battlers) | `species.sprite_url` for your wild-tier species rows | Ready-made "front battler" art — ignore the pack's own Water/Fire/Flying naming, just assign each image to one of your 4 gameplay types (Strength/Intellect/Discipline/Creativity) however fits visually. The filename doesn't need to match your game's type system. |
| Celebi-style sprite sheet (multi-frame) | A rare, high-tier species (e.g. unlocked only past level 15-20, or as the "critical catch" bonus creature) | Has more animation frames than the others, so it visually reads as special — good fit for a milestone reward rather than a common encounter. |
| Pocket Creature Tamer 2EVO/3EVO creatures | Evolution-stage art, **if the source pack includes multiple stage files per line** (check the folder for sibling files beyond `01.png`/`02.png`) | If multiple stages exist, wire directly to a `evolves_at_level` field on `species` — real evolution mechanic with zero extra art needed. If only one stage file exists per creature, just treat each as a standalone species for now. |
| `_alt` colour variants (every creature has one) | The "critical catch" shiny-variant bonus from the battle spec | Perfect pre-made match — no extra art work required for that stretch feature. |
| Unique creature #06 (horse-like) | Rare-tier wild spawn | Flag as a low-probability weighted-random pick in the opponent-selection engine. |

---

## 4. Enemies (Goblin, Skeleton)

| Asset | Used where | Why / how |
|---|---|---|
| Goblin, Skeleton (idle/walk/bow sprite strips) | Optional "obstacle" blockers on the banner path, visually distinct from catchable creatures | These read as classic RPG enemies, not Pokémon — good for a different game-feel: "defeat" one (i.e., complete a flagged hard task) to clear the path forward, vs. "catch" a creature. Keep this a stretch feature (Phase 3+) so it doesn't compete for build time with the core catch loop. |

---

## 5. NPCs

| Asset | Used where | Why / how |
|---|---|---|
| NPC 1 / NPC 2 idle sprites | Decorative figures placed near buildings on the banner (e.g. standing by the shop) | Purely cosmetic scenery — no logic needed, just static placement. |

---

## 6. Items

| Asset | Used where | Why / how |
|---|---|---|
| Pokéball sprite sheet (7 variants) | Capture animation in the battle modal (ball-throw → shake → sparkle on successful catch) | Directly visualizes the "captured" resolution from the battle spec. Different ball colors can later flag capture-item rarity if you add a stretch catch-chance mechanic. |
| Potions (red/green/blue/yellow) | Shop items that heal a fainted Pokémon (`shop_items` table, `type = 'potion'`) | Maps 1:1 to the "Heal a fainted Pokémon" reward-sink already in your base spec — different colors can map to different heal amounts. |
| Gold/silver/bronze coins | Currency icon everywhere `currency` is displayed | Immediate visual upgrade over a generic icon — use the gold coin as your default currency glyph app-wide. |
| Gems (red/green/blue/multi) | Rare cosmetic shop badges, or a secondary "premium" currency if you want tiered rewards | Optional — only add a second currency if you have time; otherwise use as cosmetic-only shop items. |
| Leather/Iron gear (armor, weapons, tools) | Cosmetic shop items that swap the avatar's equipped-item sprite (e.g. buying "Bow" switches which Tiny Adventure Pack attack animation plays) | This ties a shop purchase to a real visual change using assets you already have — no new art needed, just swapping which sprite-sheet frame set is active for that avatar. |
| Locks/keys | Gate a rare milestone unlock (e.g. a 30-day-streak reward) | Stretch feature — nice flavor, not required for MVP. |
| Food items, boomerang/crossbow/anvil/bomb, etc. | Filler variety in the shop grid | No functional logic needed — just seed a handful into `shop_items` for visual variety. |

---

## 7. Environment, buildings, and tilesets

| Asset | Used where | Why / how |
|---|---|---|
| Grass/Path/Dirt/Water tilesets | Repeating background strip of the banner | Tile horizontally behind the avatar to form the "world" — this is static background art, doesn't need to scroll in real time; can shift left slightly each day to feel like forward progress across a longer journey. |
| Buildings (premade houses) | Fixed landmarks along the banner (e.g. "shop" building near the Rewards page's icon) | Visual anchor points, not interactive beyond maybe a click-through to `/app/rewards`. |
| Trees, bushes, rocks, flowers, signs, bridges | Decorative props placed at fixed points along the path | Purely cosmetic scenery — breaks up the path visually so it doesn't feel like an empty progress bar. |
| Treasure chest | The "bonus reward" marker at a fixed % along today's path (see banner mechanic diagram above) | Opens on reaching it, granting a small bonus currency/card — cheap extra dopamine hit mid-day. |
| Quest exclamation mark | Icon shown above the day's next incomplete daily task, and/or above the encounter marker on the banner | Universal "something to do here" signal — reuse it in both the todo list and the banner for visual consistency. |

---

## 8. Battle / Menu UI

| Asset | Used where | Why / how |
|---|---|---|
| Battle background + battle spot | Backdrop of the Battle modal | Pre-made art, use as-is — saves you designing this screen's visuals from scratch. |
| Battle UI (HP bar, move counter panel) | Chrome around your live HP bars and card-count in the battle modal | Overlay your real data (current HP, cards remaining) on top of this pre-made frame rather than styling bars yourself. |
| Menu UI panel | Background chrome for the Pokédex/Collection and Team screens | Consistent visual language across all Pokémon-related screens. |

---

## 9. Sprite extraction notes for your agent

Most assets are sprite sheets, not single images. Two approaches, both fine:
- **Static icons** (items, single-frame battlers): CSS `background-position` at fixed pixel offsets — cheapest, no JS needed.
- **Animated sprites** (walk cycles, attacks): a small reusable `<SpriteAnimator>` component using `drawImage` on a canvas, cycling through frame columns on an interval — build this once, reuse for every animated asset in this document.
- For one-time batch extraction into individual frame files (optional, only if easier for your agent's workflow), the Python/Pillow crop script from your asset inventory doc works directly — run once per sheet, commit the individual frames.

Known frame sizes: Tiny Adventure Pack ≈ 16×16px (32×32px for sword/bow attacks), `rpgItems.png` ≈ 16×16px per cell, `PLAYER RED/LEAF` ≈ 16×16px per frame. Catchimon battlers are standalone images, no extraction needed.
