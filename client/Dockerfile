FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# Next.js collects telemetry data by default. Disable it.
ENV NEXT_TELEMETRY_DISABLED 1

CMD ["npm", "run", "dev"]
