FROM node:18-alpine as base
RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /app
COPY package*.json ./
EXPOSE 3000

# Create .npm directory 
RUN mkdir -p /home/nextjs/.npm

FROM base as builder
WORKDIR /app
COPY package*.json ./
COPY ./public ./public
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

FROM base as production
WORKDIR /app

ENV NODE_ENV=production
RUN npm ci

# RUN addgroup -g 1001 -S nodejs
# RUN adduser -S nextjs -u 1001
# USER nextjs

# RUN chown -R nextjs:nodejs /home/nextjs/.npm

# COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# CMD npm start
CMD node .next/standalone/server.js
