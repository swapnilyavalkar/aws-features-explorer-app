# Use the official lightweight Nginx image
FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove the default Nginx static assets
RUN rm -rf ./*

# Copy all the app files to the Nginx HTML directory
COPY . .

# Expose port 80 to allow traffic on that port
EXPOSE 80

# Start Nginx when the container is run
CMD ["nginx", "-g", "daemon off;"]
