FROM ubuntu:15.10


# Install required packages
RUN apt-get update -y && \
    apt-get install -y \
        git \
        nodejs-legacy \
        npm \
        unzip \
        lighttpd
RUN npm install -g \
    bower \
    gulp


# Install dependencies
RUN mkdir /blurry
COPY build/package.json /blurry/package.json
COPY build/bower.json /blurry/bower.json
WORKDIR /blurry
RUN npm install
RUN bower install --allow-root


# Unpack the application code
COPY build/blurry.zip /tmp/blurry.zip
RUN unzip -o /tmp/blurry.zip -d /


# Container settings
WORKDIR /blurry
EXPOSE 80
CMD lighttpd -D -f /etc/lighttpd/lighttpd.conf
