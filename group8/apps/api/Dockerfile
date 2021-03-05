# DEVELOPMENT IMAGE
FROM node:latest As development

RUN cd /usr/src && mkdir -p app
WORKDIR /usr/src/app

COPY package.json .

RUN npm install -g nx




# PRODUCTION IMAGE
# FROM node:12.13-alpine as production

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm install --only=production

# COPY . .

# COPY --from=development /usr/src/app/dist ./dist

# CMD ["node", "dist/main"]