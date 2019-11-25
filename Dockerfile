FROM node:13-buster

# Maintainers
LABEL maintainer="SHU-DDSA Group: Chris, Mike, Millan, Neil & Tiago"

EXPOSE 3000
ENV NODE_ENV="production"

# Install dependencies
RUN apt-get update && apt-get install -y apt-utils gnupg
RUN wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | apt-key add -
RUN echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/4.2 main" | tee /etc/apt/sources.list.d/mongodb-org-4.2.list
RUN apt-get update && apt-get install -y mongodb-org && apt-get clean
# There's no init.d script installed... so lets get one
RUN cd /etc/init.d && wget https://raw.githubusercontent.com/mongodb/mongo/master/debian/init.d && mv init.d mongod && chmod 777 /etc/init.d/mongod

RUN mkdir /rugbysuper6
WORKDIR "/rugbysuper6"

# Install all the packages
ADD package.json /rugbysuper6/package.json
ADD package-lock.json /rugbysuper6/package-lock.json
RUN npm install

# Add all the required code
ADD bin /rugbysuper6/bin
ADD config /rugbysuper6/_config
ADD errors /rugbysuper6/errors
ADD public /rugbysuper6/public
ADD routes /rugbysuper6/routes
ADD services /rugbysuper6/services
ADD super6db /rugbysuper6/super6db
ADD views /rugbysuper6/views
ADD app.js /rugbysuper6/app.js
ADD entrypoint.sh /rugbysuper6/

ENTRYPOINT ["./entrypoint.sh"]
# ENTRYPOINT ["bash"]
