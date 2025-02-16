# xnamewiz Technical Documentation

## Tech Stack

### Frontend Core

- React + TypeScript
- Vite (build tool)

### UI/Styling

- Plain CSS for components as modern vite react template
- Responsive design (desktop/mobile)
- Theme support:
  - Auto-detects system preference (light/dark)
  - CSS variables for theming
  - Media query: `prefers-color-scheme`
- Mobile-first approach
- Accessible design patterns
- Rapid UI development with MSW mocks
  - Fast, consistent API responses
  - No backend dependencies
  - Predictable data for UI states

### Key Dependencies

- **HTTP/API:** axios
- **UI/UX:** react-dropzone
- **i18n:** i18next, react-i18next, i18next-browser-languagedetector
- **Testing:** vitest, @vitest/ui, msw (API mocking)
- **Deployment:** gh-pages or local app

### Development Tools

- ESLint with React plugins
- TypeScript types
- Vite plugins

## Cloudflare Integration

### Setup

- Cloudflare Workers for API proxy
- Wrangler CLI for deployment
- Cloudflare account required

### Benefits

- CORS handling
- Security: API endpoint protection, store API key in CF secrets, so keep out from client app
- Caching & performance
- Rate limiting capabilities

## User Flow

1. Select AI model
2. Input method: keywords or image upload
3. Adjust parameters (optional)
4. Generate names
5. View results and api request stats, possibly share results to X/TG/LinkedIn

## Development Modes

- `npm run dev`: Local development with mocked APIs no need of CF proxy
  - Uses MSW for instant API responses
  - Simulates success/error states
  - Consistent data for UI testing
- `npm run preview`: Production build with CF Worker proxy .env file is required

Note for windows users: `npm run dev` will fails, you need to run `set NODE_ENV=development ; npx vite`

## API Flow

React App ➜ CF Worker ➜ Origin API ➜ CF Worker ➜ React App
