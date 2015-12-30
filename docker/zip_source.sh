#!/bin/sh

APP_NAME=blurry
branch=$(git rev-parse --abbrev-ref HEAD)

cd ..
git archive --format zip --prefix "${APP_NAME}/" --output docker/build/${APP_NAME}.zip \
    "$branch"
