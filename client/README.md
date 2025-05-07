# Project Styles Guide

This project uses **SCSS** for styling. Since the tutorial is based on SCSS, we'll maintain consistency by using it throughout the codebase.

> ⚠️ **Important:** Only **Yarn** should be used for installing dependencies.

```bash
yarn install
```

---

## 🔤 Fonts

The following fonts are already imported into the global stylesheet and ready for use:

- **Hanken Grotesk** — Used for primary headings and text.
- **Instrument Sans** — Optional clean sans-serif font.
- **LogoFont** — A custom font used for logo or branding purposes (loaded locally).

You can apply these fonts with:

```scss
font-family: "Hanken Grotesk", sans-serif;
font-family: "Instrument Sans", sans-serif;
font-family: "LogoFont";
```

---

## ✍️ Typography

Default styles for text elements have been predefined, including responsive scaling through media queries.

### Heading Styles

| Element | Font           | Example Use      |
| ------- | -------------- | ---------------- |
| `h1`    | Hanken Grotesk | Page titles      |
| `h2`    | Hanken Grotesk | Section headers  |
| `h3`    | Hanken Grotesk | Sub-sections     |
| `h4`    | Hanken Grotesk | Smaller headings |
| `p`     | Instrumentsans | Paragraph text   |

Font sizes automatically adjust at screen widths below 1025px and 768px for better responsiveness.

> If your styles aren’t being applied correctly, consider using `!important`.

---

## 🎨 Colors

Colors are defined as CSS custom properties (variables) and can be used with `rgba()` to control transparency.

### Example Usage

```scss
background-color: rgba(var(--primary-color), 1);
color: rgba(var(--gray-color), 0.8);
```

### Available Variables

- `--primary-color`: `107, 203, 58`
- `--secondary-color`: `132, 235, 134`
- `--accent-color`: `68, 244, 70`
- `--black-color`: `8, 13, 8`
- `--off-white-color`: `248, 251, 246`
- `--gray-color`: `70, 73, 70`

Use these to maintain consistency across components.

---

## 🔘 Buttons

The following button styles are included:

### ✅ Primary Button

```html
<button className="primary-btn">Click Me</button>
```

- Uses the primary color for background and border.
- Includes hover effect with slight transparency.

### 🔲 Outline Button

```html
<button className="outline-btn">Click Me</button>
```

- Transparent background.
- Black border with subtle hover background.

Both button types include padding, flex alignment, transition effects, and responsive sizing.

---

## 🔗 Links

Use the `.link` className to style anchor tags with consistent behavior:

```html
<Link to="/" className="link">Read more</Link>
```

- Inherits text color.
- Removes underline.
- Adds hover fade effect.

⚠️ Use <Link> from react-router-dom instead of <a> tags for internal navigation to ensure client-side routing works properly.

---

## 🧠 Notes

- SCSS is required for all styling.
- Use `!important` if your styles are not applying as expected.
- Feel free to create additional utility classes in index.css file or extend the existing ones in your components.
