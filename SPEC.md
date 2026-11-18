# Birthday Gift Flow — Rebuild Spec

Source: `birthday.mp4`, a 109 s, 1920×1032 desktop Chrome recording (incognito) of `ourmoments.live/birthday/` in **preview mode**. Times are approximate (`~mm:ss`). Colors are sampled by eye from frames and are approximate. Font names are guesses and are marked as such.

Recipient in the demo: **Needhi**. Sender: **Swayam**.

---

## Global

- **Tab title:** `🎂 A surprise for Needhi`, with a pink heart favicon.
- **URL:** `ourmoments.live/birthday/#draft=<base64 JSON>`. All content lives in the URL hash, so no server lookup is visible. The visible part decodes to:
  `{"v":1,"st":5,"n":"Needhi","a":"","b":"","ck":"p","rs":["Your laugh is my favourite sound","You…` (the rest is cut off).
  Likely meanings: `n` = name, `rs` = reasons, `ck` = cake/theme (unclear), `st` (unclear), `a`/`b` (unclear, empty).
- **Persistent top bar** on every screen after the PIN screen:
  - Left: `← Back`, a dark translucent pill.
  - Center: `👁 PREVIEW MODE`, a yellow pill (`#F5C04A`) with dark brown bold uppercase small text.
  - Right: a round speaker/mute icon button.
  - Under the bar there is a dark-to-transparent gradient.
- **Dark scenes background** (cake through final): deep plum vertical gradient, roughly `#1A0A1A` at the top to `#3D1530` at the bottom. It has soft blurred radial glows (purple on the left, red/maroon at the bottom left), small twinkling white dots, and a few gold 4-point sparkle stars ✦.
- **Primary CTA style** on dark scenes: a large pill with a horizontal gradient from coral `#F26B5B` to peach `#F5A962`, white bold text, and a soft glow.
- **Audio:** the video has an audio track (mean −22.7 dB, peak −3 dB), so sound is present. Whether it is music or effects, and what it contains, is **unclear**. A mute toggle exists in the top bar.

---

## Step 1 — PIN lock (~00:00–00:08)

**Layout:** light cream page (`#FDF7F1`). One centered column, about 590 px wide.

From top to bottom:
1. **Envelope illustration:** white with a beige outline (`#E6D5C3`). It has a rust-red circular seal (`#B5361F`) with a white padlock icon.
2. **Eyebrow:** `A PRIVATE GIFT`. Small, uppercase, letter-spaced, rust red.
3. **Heading:** `For Needhi`. Large, bold, rounded display font (looks like Baloo 2 or Fredoka; exact font unclear), dark brown `#3A2A22`.
4. **Body:** `Swayam locked this gift. Enter the 4-digit PIN to open it.` Gray-brown, in a Nunito-like font.
5. **Inputs:** 4 separate square PIN boxes, white with light beige borders and rounded corners. The active box gets a darker border.
6. **Hint:** `Ask Swayam if you do not have it.` Small, gray.
7. **Button:** `Open the gift`. Full column width, rounded rectangle (not a pill), rust gradient `#C03A22`→`#A8301C`, white bold text.
8. **Links:** `Back to edit` · `Change PIN`. Underlined, dark. These are creator-only links shown in preview.

**Interaction:** the user clicks the first box and types digits. Focus auto-advances to the next box. The demo PIN is `2011`. After clicking **Open the gift**:
- All 4 boxes turn green: light green fill `#EAF6EC` and green border.
- The hint changes to `Opening your gift…` in green.

The wrong-PIN state is **not shown**.

**Transition:** cuts to Step 2 after about 1 s. The exact transition is unclear and looks like a quick cut or fade.

---

## Step 2 — Cupid's bow (~00:09–00:15)

**Layout:** warm cream/blush background with a large soft pink radial glow behind the heart.
- Top: `a little something, for you`. Italic, letter-spaced, bold, mauve-pink `#B0406A`.
- Center-top: a large glossy 3D pink heart with a white highlight. It gently pulses or floats.
- Lower left: an emoji-style bow with a pink-fletched arrow, aimed up and to the right at the heart.
- Bottom center: `PULL & RELEASE`. Italic, uppercase, wide letter spacing, mauve.

**Interaction:** the cursor turns into a grab hand over the bow. The user drags the bow back (pull) and releases. In the demo the bow is dragged slightly, and on release the arrow leaves the bow.

**Animation:**
1. The arrow flies to the heart. A small pink/gold spark is visible near the top.
2. The heart turns into a solid **magenta circle** (`#C8105A`, radial highlight) in the center.
3. The circle grows until it fills the screen. This acts as a circular wipe into Step 3.

---

## Step 3 — "Happy Birthday" title card (~00:16–00:17)

**Layout:** full-bleed magenta gradient (`#D0186A` → `#B0084E`), lighter pink at the top-left corner, with a faint grid texture. The top and bottom are letterboxed in near-black.
- Small italic text at the top: `make a wish…`. It is partly cut off by the letterbox, light pink/white.
- Huge text: `Happy` / `Birthday` on two lines. Very heavy, tight grotesque (exact font unclear). Off-white `#FBF3EE` with a soft drop shadow.
- Subtitle: `to someone worth celebrating`. Italic, light.

**Animation:** the letters animate in one by one. Each rises or pops up into place, as seen mid-word in `Bi…` and then `Birthday`. The card holds for about 1 s.

**Transition:** fades to a blank warm cream/gold radial screen (~00:18), which leads into Step 4.

---

## Step 4 — Blooming heart tree (~00:19–00:27)

**Layout:** soft peach/cream background with a bright warm glow behind the tree.
- **Right/center:** a tree with a dark plum-brown trunk (`#5A2E3A`).
- **Left:** a translucent frosted panel, a large rounded rectangle with a slightly lighter pink tint. It contains:
  - `it's officially your day`. Italic, bold, mauve.
  - `Happy` / `Birthday,` / `Needhi`. Large handwritten-rounded bold font (looks like Gochi Hand or Chewy; unclear). The color goes from pink `#D8407A` to deep raspberry `#9A1048` across the three lines, with a soft glow.
  - `here's to a year that blooms`. Italic, bold, mauve.
- Bottom center (appears later): `tap anywhere to continue`. Small, muted mauve.

**Animation:**
1. Bare branches grow upward from the trunk.
2. Glossy hearts (pink, magenta, coral, gold) pop in on the branches. They fill into a big heart-shaped canopy over about 3 s.
3. At the same time, the headline is typed in. Bars or cursor blocks appear first, then the text.
4. Loose hearts float and drift down the whole screen continuously. Small hearts also fall from the canopy.

**Interaction:** tap anywhere to advance.

---

## Step 5 — Cake (~00:28–00:37)

**Layout:** the dark plum scene.
- Heading: `First things first 🎂`. White, bold, geometric sans (looks like Outfit; unclear).
- Center: a flat-illustration cake with pink layers and darker pink stripes. It has white drippy frosting and sits on a white plate line.
- Status text under the cake: `Baking something sweet…`. Small, white.

**Animation (all automatic, about 6 s):**
1. A pink candle drops in from the top while the cake layers stack up one by one (the first frame shows only the base).
2. White frosting drips down over the top.
3. The candle becomes a white/cream candle with pink stripes and lights with a flickering flame.
4. A **confetti burst** of multicolored dots shoots up from the cake.
5. Small pink and white confetti flakes drift across the whole background for the rest of the step.
6. `Happy Birthday, Needhi!` is typed out character by character in a handwritten font, gold `#E0A030`. Under it, `Make a wish 🕯️` appears.
7. `Make a wish 🕯️` is then replaced by `tap anywhere to continue`.

Blowing out the candle is **not shown**. It is unclear whether any blow or mic interaction exists. The flame stays lit.

**Interaction:** tap anywhere to advance.

---

## Step 6 — Pop the balloons (~00:38–00:60)

**Header:**
- `Pop the balloons 🎈`. White, bold.
- `5 balloons. Each one holds a reason you're loved. Pop them all 🎈`. Small, light pink-white.

**Balloons:** there are **5**, clustered and overlapping just under the header. Each is glossy, egg-shaped, has a thin gray string, and gently bobs. The order and colors are:

| # | Color | Approx hex | Position |
|---|---|---|---|
| 1 | Pink | `#F07AAE` | far left, high |
| 2 | Yellow | `#F2C54E` | left, low |
| 3 | Purple | `#A57BEA` | center |
| 4 | Teal/mint | `#3ED8B8` | right, highest |
| 5 | Coral | `#F0725A` | far right |

**Pop interaction:** the cursor is a pointer hand over a balloon. Clicking a balloon does the following:
1. The balloon disappears and is replaced by a **particle burst** of small dots in mixed colors (orange, pink, purple, teal).
2. A **reason card** slides or fades in below the balloon cluster.
3. The remaining balloons move up a little as the card stack grows. The whole block re-centers and later scrolls up.

In the demo the balloons are popped in order 1 → 5, from left to right. Cards are numbered by pop order. It is unclear whether reason N is tied to balloon N or to pop count.

**Reason card:**
- Dark translucent plum rounded rectangle (`~#3A1830`), about 520 px wide, with a soft outer glow.
- The left edge and border tint match the popped balloon's color: pink, yellow, purple, teal, coral.
- Top-left chip: `REASON NO.1 💖`. Small, gold uppercase bold text on a brown translucent pill.
- Text: white, bold, about 18 px.
- A gold ✨ sparkle sits at the right end.
- The cards stack vertically in pop order.

**Reasons (demo content):**
1. Your laugh is my favourite sound
2. My worst days get shorter when you call
3. You believed in me when I didn't
4. You make ordinary days feel special
5. The world is kinder with you in it

**After all 5 are popped:**
- `...and a thousand more reasons 💛` fades in under the stack. It is in the gold handwritten font.
- About 1 s later, a **`Keep going 💛`** gradient pill button fades in. Clicking it advances.

---

## Step 7 — Memory lane (~01:01–01:06)

**Layout:**
- `A walk down memory lane`. White, bold.
- `swipe through 📸`. Small, light.
- A thin horizontal string with glowing warm-yellow fairy-light dots runs across.
- A **polaroid carousel** hangs from the string. The current photo is centered and held by a gold clip. It has a white/cream frame, a thicker bottom border, a small gold 💛 in the bottom margin, and a slight tilt. The next photo peeks in from the right edge, cropped by the carousel container.
- Pagination: **5 dots**. The active dot is gold and the others are dim.
- A `Keep going 💛` gradient pill button appears after about 4 s.

**Interaction:** swiping or dragging should change photos. This is **not demonstrated**, because the user clicks Keep going on photo 1. The demo photos are stock images (a man with headphones at a mic; a woman in a sari).

---

## Step 8 — Letter (final reveal) (~01:07–01:27)

**8a. Sealed envelope:**
- `One last thing, Needhi…`. White, bold.
- `Swayam wrote you a letter.`. Small, light.
- A large **gold envelope** (`#D9A040`–`#B8802C` gradient, with diagonal fold shading). In the center is a round gold wax seal with the letter `N`, the recipient's initial. There is a warm glow behind it.
- Below: a bouncing 👆 emoji and `Tap to open your letter` in bold, light pink.

**8b. Opening animation (on tap):**
1. The envelope's top flap flips open upward, and the heading slides behind it.
2. A cream letter slides up out of the envelope. Small cake and heart emoji particles fly out.
3. The envelope goes away and the letter grows into a centered card.

**8c. Letter card:**
- Cream lined-paper card (`#FBF3E4`) with faint horizontal ruled lines, a thin gold border, rounded corners, a drop shadow, and a warm glow behind it. It is about 550 px wide.
- `Dear Needhi,`. Bold handwritten font, brown `#7A4E1E`, with a thin divider line under it.
- The body is in a handwritten font (looks like Gaegu or Itim; unclear), dark brown, about 22 px, with generous line height.
- Body text (demo): `I keep thinking about how lucky I got with you. You have seen me at my worst and stayed anyway, and I do not say thank you nearly enough for that 🤍 This year, I hope life is gentle with you...`
  - Words wrap mid-word (for example `wit|h`, `thank y|ou`). This looks like character-level wrapping (`word-break: break-all`).
- **Typewriter effect:** the body appears character by character over about 15 s. The newest characters have an orange/peach glow that fades out behind the cursor.
- The signature fades in after the body, right-aligned, italic bold, gold-brown:
  `With all my love,` / `— Swayam`
- Bottom-right corner: a small round orange button with a 🎂 emoji. Its function is **unclear**.
- About 1 s after the signature, a **`Continue`** gradient pill button fades in under the card.

---

## Step 9 — Surprise video (~01:28–01:41)

**Entry:** a box or frame rises from the bottom with a cluster of balloons above it. It is semi-transparent while it moves in.

**Layout:**
- A portrait video frame, about 390×690 px, with rounded corners and a thin cream border.
- A **bunting garland** of multicolored triangular flags is strung across the top edge.
- Two balloons are attached at the lower sides: pink on the left, teal on the right. Each has a string.
- `Skip ›` is shown under the frame. It is underlined and muted.

**Content:** the demo video is a clip of a hand at a tiny door, and kittens come out carrying a cake. It plays automatically. Whether the video has sound is **unclear**.

**Exit:** when the video ends, the frame shrinks and moves upward off the screen. A confetti shower starts.

---

## Step 10 — Final celebration + share (~01:42–01:49, end of recording)

**Layout (centered):**
- `HAPPY` / `BIRTHDAY`. Large white bold uppercase sans with a soft glow.
- `Needhi!`. Large gold handwritten font (`#E0A030`).
- An animated **cat sticker**: a cat in a red "LA" cap holding pink tulips, with headphones. It looks like a transparent GIF or WebP.
- `Made with love, just for you — Swayam 💛`. The sender name is bold gold.
- **`Send It to Needhi 🎁`**. A large gradient pill CTA.
- `🔗 This creates the private link you'll send them`. Small, light.

**Animation:**
- The text appears first (around 01:43). The cat appears next.
- Continuous multicolored confetti strips fall from the top.
- **Firework bursts** (rings of colored dots in gold, purple, teal, and coral) go off repeatedly on the left and right of the content and around the button.
- The CTA and the made-with-love line fade in about 3 s after the title.

---

## Share link flow

What the recording shows:
- The whole experience is a **creator preview**. Evidence: the `PREVIEW MODE` badge, the `Back to edit` / `Change PIN` links on the lock screen, and a `#draft=` URL.
- The draft content (name, reasons, and so on) is stored as **base64-encoded JSON in the URL hash**.
- The last screen's CTA `Send It to Needhi 🎁` is labeled as creating "the private link you'll send them".
- The recipient's view starts at the same PIN lock screen (Step 1). PIN entry gates the content.

What happens after clicking **Send It to Needhi** is **unclear**. The recording ends with the cursor on the button, and no share dialog, generated link, or copy action is visible. The final link's format, whether the PIN is enforced server-side or client-side, and the recipient-side differences (no preview badge, no edit links) are also **unclear**.

---

## Typography summary (all font names are guesses)

| Use | Style | Likely candidate |
|---|---|---|
| PIN heading | Rounded heavy display | Baloo 2 / Fredoka |
| PIN body/UI | Rounded sans | Nunito |
| Dark-scene headings, cards, buttons | Geometric sans, bold | Outfit / Urbanist |
| Name lines, "thousand more reasons", gold titles | Casual handwritten | unclear (Gochi Hand–like) |
| Letter body | Handwritten | unclear (Gaegu / Itim–like) |
| Big pink "Happy Birthday" | Extra-heavy tight grotesque | unclear |
| Italic taglines ("a little something…", "PULL & RELEASE") | Bold italic sans, letter-spaced | unclear |

## Color summary (approximate)

| Token | Hex |
|---|---|
| Cream (lock screen) | `#FDF7F1` |
| Rust primary (lock) | `#B5361F` |
| Dark brown text | `#3A2A22` |
| Success green | `#2E8B57` / fill `#EAF6EC` |
| Preview pill | `#F5C04A` |
| Plum bg top / bottom | `#1A0A1A` / `#3D1530` |
| Magenta (title card) | `#C8105A` |
| Gold text | `#E0A030` |
| CTA gradient | `#F26B5B` → `#F5A962` |
| Letter paper | `#FBF3E4` |
| Envelope gold | `#D9A040` → `#B8802C` |
