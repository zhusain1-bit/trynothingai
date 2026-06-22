# Image Placeholders

Drop real licensed or owned images here. Each illustration component accepts an optional `src` prop that replaces the SVG/CSS art when provided.

## Slot names

| File name | Used in component | Replaces |
|-----------|-------------------|----------|
| `shorts-product.jpg` | `ShortsCard` | SVG shorts illustration |
| `album-art.jpg` | `SongCard` | gradient album art |
| `trial-screen.jpg` | `TrialCard` | free trial UI mock |
| `email-preview.jpg` | `EmailCard` | email screenshot |
| `order-confirm.jpg` | `OrderCard` | order confirmation UI |
| `login-form.jpg` | `LoginCard` | login form UI |
| `travel-photo.jpg` | `TravelScene` | gradient travel landscape |
| `concert-poster.jpg` | `PosterCard` | Beach House concert poster |

## Usage

Pass the path as `src` to the component:

```tsx
<ShortsCard src="/images/shorts-product.jpg" brand="H&M" price="$17.99" />
<PosterCard src="/images/concert-poster.jpg" artist="Beach House" />
```
