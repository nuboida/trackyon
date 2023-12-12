# Builder container to compile typescript
FROM node:lts-alpine AS build
WORKDIR /usr/src/app

RUN npm cache clean --force

# Copy the application source
COPY . .
RUN npm install -g @angular/cli@17.0.4
RUN npm install
# Build typescript
RUN ng build

FROM nginx:latest
COPY --from=build ./usr/src/app/dist/TrackingSystem/browser /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
