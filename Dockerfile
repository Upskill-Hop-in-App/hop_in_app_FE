# Step 1: Use Node.js as the base image
FROM node:22-alpine AS node

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the entire Angular project into the container
COPY . .

# Step 6: Expose port 4200 for Angular's default dev server
EXPOSE 4200
