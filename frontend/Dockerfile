FROM node:20-alpine
WORKDIR /tmp
COPY public/ /tmp/public
COPY src/ /tmp/src
COPY package.json /tmp/
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]