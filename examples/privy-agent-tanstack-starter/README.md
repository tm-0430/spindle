# Privy Agent Tanstack Starter

A modern web application built with TanStack Router, React, and Solana integration, featuring authentication via Privy and AI capabilities.

## 🚀 Features

- **Authentication**: Secure user authentication powered by Privy
- **Solana Integration**: Built with Solana Agent Kit for blockchain interactions
- **AI Capabilities**: OpenAI integration for intelligent features
- **Modern UI**: Built with Radix UI components and Tailwind CSS
- **Type Safety**: Full TypeScript support
- **Database**: PostgreSQL with Drizzle ORM
- **Routing**: TanStack Router for type-safe routing
- **Development Tools**: Biome for linting and formatting

## 🛠️ Tech Stack

- **Frontend**: React 19, TanStack Router
- **Authentication**: Privy
- **Blockchain**: Solana Web3.js, Solana Agent Kit
- **Styling**: Tailwind CSS, Radix UI
- **Database**: PostgreSQL, Drizzle ORM
- **AI**: OpenAI SDK
- **Development**: TypeScript, Biome, Vinxi

## 📦 Installation

1. Clone the repository:
```bash
# CLone the starter template
npx gitpick sendaifun/solana-agent-kit/examples/privy-agent-tanstack-starter -b v2
cd privy-solana-agent
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the necessary environment variables.

4. Run database migrations:
```bash
pnpm db:generate
pnpm db:migrate
```

## 🚀 Development

Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## 🧹 Linting and Formatting

Run linting:
```bash
pnpm lint
```

Fix linting issues:
```bash
pnpm lint:fix
```

## 📦 Database Management

- Generate migrations: `pnpm db:generate`
- Run migrations: `pnpm db:migrate`
- Open database studio: `pnpm db:studio`
- Push schema changes: `pnpm db:push`
- Pull schema changes: `pnpm db:pull`
- Check schema: `pnpm db:check`
- Update schema: `pnpm db:up`

## 🏗️ Project Structure

```
src/
├── components/     # React components
├── functions/     # Server-side functions
├── hooks/         # Custom React hooks
├── lib/           # Library code and utilities
├── routes/        # Application routes
├── styles/        # Global styles
└── utils/         # Utility functions
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Note

This is a starter template and may not include all features or optimizations for production use (e.g the use of the OpenAI API key on the client). Please review and modify as necessary for your specific use case.

# Solana Token Price Tracker

This application includes a feature to display real-time Solana token prices with interactive UI components.

## Token Price Implementation

The token price feature is implemented with the following components:

### Data Structure

- `TokenData` interface in `src/types/token.ts` defines the structure for token data
- Initial token data is stored in `src/data/tokens.tsx` with static values
- Live price updates are fetched from the Raydium API

### Components

- `TokenCard.tsx`: Renders an individual token card with price, change, and chart
- `TokenPriceSection.tsx`: Container component that fetches and updates prices
- Price data is managed using the `useTokenPrices` React hook

### Real-time Updates

- Token prices are updated every minute using the Raydium API
- Users can manually refresh prices with the "Refresh" button
- The UI shows loading and error states during price updates

## Adding New Tokens

To add a new token:

1. Edit `src/data/tokens.tsx` and add a new entry to the `tokenData` array
2. Follow the `TokenData` interface structure
3. Add appropriate SVG icon and styling

## Customizing the UI

- Token cards use Tailwind CSS for styling
- The gradient colors for token icons can be customized in the `tokenData` array
- Chart paths are SVG paths that can be customized for each token

## API Integration

The application uses the Raydium API for price data:

```typescript
// API endpoint
const PRICE_ENDPOINT = "https://api.raydium.io/v2/main/price";
```

Price updates are handled by the `tokenPrices.ts` module in `src/lib/api/`.
