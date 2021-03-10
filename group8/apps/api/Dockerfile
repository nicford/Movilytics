# # DEVELOPMENT IMAGE
# FROM node:latest As development

# RUN cd /usr/src && mkdir -p app
# WORKDIR /usr/src/app

# # VOLUME [ "/data" ]

# COPY package.json .

# RUN npm install -g nx



# PRODUCTION IMAGE
FROM node:latest as production

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# copy in frontend static files (SPA)
COPY dist/apps/ucl-imdb ./ucl-imdb

# copy in api files
COPY dist/apps/api .

RUN npm install --only=production

CMD ["node", "main.js"]