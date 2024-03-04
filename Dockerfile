# create new docker file "Dockerfile"

# Add following properties and define according to your project

# Use an official Node.js runtime as a base image

FROM node:v20.10.0

# Set the working directory in the container

WORKDIR /app

# Copy package.json and package-lock.json to the working directory

COPY package\*.json ./

# Copy the rest of the application code

COPY . .

# Install dependencies

RUN npm install

# Expose the port your Node.js application will run on

EXPOSE 8002

# Command to run your project

CMD ["node", "server.js"]