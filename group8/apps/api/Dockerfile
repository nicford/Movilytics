# PRODUCTION IMAGE
FROM node:latest as production

WORKDIR /usr/src/app

# copy in frontend static files (SPA)
COPY dist/apps/ucl-imdb ./ucl-imdb

# copy in api files
COPY dist/apps/api .

# RUN npm install --only=production
RUN npm install
RUN npm install class-transformer

CMD ["node", "main.js"]