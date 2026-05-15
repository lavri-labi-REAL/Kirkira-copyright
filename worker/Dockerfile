FROM mcr.microsoft.com/playwright:v1.44.0-jammy

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Install Playwright browsers
RUN npx playwright install chromium

COPY . .
RUN npm run build

# Create screenshot dir
RUN mkdir -p /app/screenshots /app/screenshots/certificates

ENV SCREENSHOT_DIR=/app/screenshots
ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
