FROM ubuntu:15.10


# Install required packages
RUN apt-get update -y && \
    apt-get install -y \
        git \
        nodejs-legacy \
        npm \
        unzip \
        nginx
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


# Unpack and build the application code
COPY build/blurry.zip /tmp/blurry.zip
RUN unzip -o /tmp/blurry.zip -d /
RUN gulp


# Setup nginx
COPY blurry-nginx.conf /etc/nginx/sites-available/blurry
RUN ln -s /etc/nginx/sites-available/blurry /etc/nginx/sites-enabled/blurry
COPY nginx.conf /etc/nginx/nginx.conf
RUN rm /etc/nginx/sites-enabled/default


# Container settings
WORKDIR /blurry
EXPOSE 80
CMD nginx
