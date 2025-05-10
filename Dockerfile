ARG NODE_VERSION=22.13.1
FROM node:${NODE_VERSION}-slim

WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install

# Copy the source code
COPY . .

# Expose development port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]
