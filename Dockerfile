# Use an official Node.js LTS image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose your backend port
EXPOSE 3005

# Start the server
CMD ["node", "server.js"]
