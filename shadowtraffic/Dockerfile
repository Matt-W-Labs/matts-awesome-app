FROM shadowtraffic/shadowtraffic:latest

# Copy the config file into the image
COPY postgres-retail.json /home/config.json

# Default command (can be overridden at runtime)
CMD ["--config", "/home/config.json", "--sample", "100"]
