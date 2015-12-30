#!/bin/sh

if [ ! -d build/ ]; then
    mkdir build/
    ln ../package.json build/package.json
    ln ../bower.json build/bower.json
fi

./zip_source.sh
sudo docker build -t blurry .
