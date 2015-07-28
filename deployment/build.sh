#!/bin/sh

APP_NAME=blurry
branch=$(git rev-parse --abbrev-ref HEAD)

git archive --format zip --prefix "${APP_NAME}/" --output ./${APP_NAME}.zip "$branch"
