#!/bin/bash

# Create textures directory if it doesn't exist
mkdir -p public/textures

# Download textures from NASA's public repositories
curl -L "https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/flat_sun.jpg" -o "public/textures/sun.jpg"
curl -L "https://svs.gsfc.nasa.gov/vis/a000000/a004800/a004850/mercury.jpg" -o "public/textures/mercury.jpg"
curl -L "https://svs.gsfc.nasa.gov/vis/a000000/a004800/a004850/venus.jpg" -o "public/textures/venus.jpg"
curl -L "https://svs.gsfc.nasa.gov/vis/a000000/a004800/a004850/earth.jpg" -o "public/textures/earth.jpg"
curl -L "https://svs.gsfc.nasa.gov/vis/a000000/a004800/a004850/mars.jpg" -o "public/textures/mars.jpg"
curl -L "https://svs.gsfc.nasa.gov/vis/a000000/a004800/a004850/jupiter.jpg" -o "public/textures/jupiter.jpg"
curl -L "https://svs.gsfc.nasa.gov/vis/a000000/a004800/a004850/saturn.jpg" -o "public/textures/saturn.jpg"
curl -L "https://svs.gsfc.nasa.gov/vis/a000000/a004800/a004850/uranus.jpg" -o "public/textures/uranus.jpg"
curl -L "https://svs.gsfc.nasa.gov/vis/a000000/a004800/a004850/neptune.jpg" -o "public/textures/neptune.jpg"

# Verify downloads
for planet in sun mercury venus earth mars jupiter saturn uranus neptune; do
  if [ ! -s "public/textures/$planet.jpg" ]; then
    echo "Warning: $planet.jpg may not have downloaded correctly"
  fi
done

echo "Download attempt completed. Please check the textures folder." 