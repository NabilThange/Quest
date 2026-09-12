# Life RPG — Audio Asset Mapping Specification

This document defines the mapping between source audio files in `ASSETS/` and in-game events, UI interactions, and battle actions in the Life RPG application.

---

## 1. Inventory of Selected Audio Assets

| Sound Type | Source File in `ASSETS/` | Destination in `public/assets/audio/sfx/` | Format & Size | Acoustic Characteristics & Reason for Choice |
| :--- | :--- | :--- | :--- | :--- |
| **Page Change / Nav** | `ASSETS/MP3/Confirm.mp3` | `nav.mp3` | MP3 (22 KB) | Crisp, light UI click. Non-intrusive for frequent route and tab changes. |
| **Quest Complete** | `ASSETS/MP3/Get_Item.mp3` | `quest-complete.mp3` | MP3 (23 KB) | Bright, celebratory 8-bit chime indicating task fulfillment and reward drop. |
| **Coin / Gold Earned** | `ASSETS/10_UI_Menu_SFX/079_Buy_sell_01.wav` | `coin.wav` | WAV (353 KB) | Metallic coin clinking sound for gold collection and shop transactions. |
| **Level Up** | `ASSETS/MP3/Level_up_1.mp3` | `level-up.mp3` | MP3 (31 KB) | Triumphant ascending arpeggio fanfare for user and companion level-up milestones. |
| **Attack: Tackle / Slam** (Strength / Physical) | `ASSETS/MP3/Slash_1.mp3` | `attack-slash.mp3` | MP3 (17 KB) | Sharp, tactile physical impact and slash sound. |
| **Attack: Shock / Overload** (Intellect / Electric) | `ASSETS/8_Atk_Magic_SFX/18_Thunder_02.wav` | `attack-thunder.wav` | WAV (706 KB) | Crackling lightning and electrical burst for Intellect elemental moves. |
| **Attack: Quake / Guard Break** (Discipline / Earth) | `ASSETS/8_Atk_Magic_SFX/30_Earth_02.wav` | `attack-earth.wav` | WAV (706 KB) | Deep, rumbling subterranean stone crack and shockwave for Discipline moves. |
| **Attack: Confuse / Flash** (Creativity / Wind & Light) | `ASSETS/8_Atk_Magic_SFX/25_Wind_01.wav` | `attack-wind.wav` | WAV (529 KB) | Mystical whistling swirl of wind and glitter for Creativity elemental moves. |
| **Attack: Energy / Neutral** (Energy / Charge) | `ASSETS/8_Atk_Magic_SFX/45_Charge_05.wav` | `attack-charge.wav` | WAV (1.4 MB) | Resonant charging pulse for universal Energy cards. |
| **Damage Taken** (Player / Companion Counter-hit) | `ASSETS/MP3/Damage.mp3` | `damage.mp3` | MP3 (30 KB) | Punchy retro impact thud indicating enemy retaliation damage. |
| **Wild Encounter Spawned** | `ASSETS/10_Battle_SFX/55_Encounter_02.wav` | `encounter.wav` | WAV (1.4 MB) | Dramatic battle chord indicating a wild Pokémon appeared in the lodge. |
| **Encounter Defeated / Captured** | `ASSETS/10_Battle_SFX/69_Enemy_death_01.wav` | `enemy-death.wav` | WAV (706 KB) | Decisive retro defeat burst, followed by victory chime. |
| **Victory Voiceover** | `ASSETS/Audio/you_win.ogg` | `you-win.ogg` | OGG (34 KB) | Retro announcer voice proclaiming "You Win!" upon successful capture. |
| **Heal / Rest Lodge** | `ASSETS/MP3/Heal.mp3` | `heal.mp3` | MP3 (35 KB) | Soothing healing shimmer when resting at the lodge or restoring HP. |
| **Shop Purchase** | `ASSETS/10_UI_Menu_SFX/079_Buy_sell_01.wav` | `shop-buy.wav` | WAV (353 KB) | Satisfying cash register/coin transaction sound. |

---

## 2. In-Game Trigger & Integration Points

| Event | Code Location | Trigger Condition | Audio Played |
| :--- | :--- | :--- | :--- |
| **Page Change** | `src/components/app/NavSoundListener.tsx` & `Sidebar.tsx` | Route pathname change or nav link click | `nav.mp3` |
| **Tab Switch** | `src/components/app/QuestTabs.tsx` | User clicks All / To-Dos / Dailies / Habits | `nav.mp3` |
| **Quest Completion** | `src/components/app/TaskList.tsx` (`handleComplete`) | Task completion succeeds | `quest-complete.mp3` + `coin.wav` |
| **Player Level Up** | `src/components/app/TaskList.tsx` & `LevelUpModal.tsx` | `result.leveledUp === true` | `level-up.mp3` |
| **Companion Level Up** | `src/components/app/TaskList.tsx` | `result.companionLeveledUp === true` | `level-up.mp3` |
| **Move Card Attack** | `src/components/rpg/GamePanel.tsx` (`attack`) | Card is clicked to strike the encounter | Specific attack sound based on move name/type |
| **Enemy Counter Damage** | `src/components/rpg/GamePanel.tsx` (`run`) | `turn.counter_damage > 0` | `damage.mp3` |
| **Encounter Captured** | `src/components/rpg/GamePanel.tsx` (`run`) | `turn.captured === true` | `enemy-death.wav` + `you-win.ogg` |
| **Lodge Rest / Heal** | `src/components/rpg/GamePanel.tsx` (`run('rest')`) | User rests companion at the lodge | `heal.mp3` |
| **Shop Item Purchased** | `src/components/app/ShopGrid.tsx` (`handleBuy`) | Item purchase succeeds | `shop-buy.wav` |

---

## 3. Battle Move Audio Lookup Table

Based on the moves defined in `202609120001_life_rpg.sql`:

| Move Name | Element / Attribute | Power | Associated SFX | File |
| :--- | :--- | :--- | :--- | :--- |
| **Tackle** | Strength | 18 | Slash / Physical Strike | `attack-slash.mp3` |
| **Slam** | Strength | 30 | Heavy Slash / Slam | `attack-slash.mp3` |
| **Shock** | Intellect | 18 | Thunder / Electric Discharge | `attack-thunder.wav` |
| **Overload** | Intellect | 30 | Heavy Thunder Burst | `attack-thunder.wav` |
| **Quake** | Discipline | 18 | Earth Tremor | `attack-earth.wav` |
| **Guard Break** | Discipline | 30 | Heavy Earth / Rock Smash | `attack-earth.wav` |
| **Confuse** | Creativity | 18 | Wind / Mind Swirl | `attack-wind.wav` |
| **Flash** | Creativity | 30 | Dazzling Wind / Light Burst | `attack-wind.wav` |
| **Energy** | Energy | 10 | Resonant Pulse / Charge | `attack-charge.wav` |
| *(Any unlisted move)* | Any | Any | Physical Slash | `attack-slash.mp3` |
