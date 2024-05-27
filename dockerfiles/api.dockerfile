#
# 🧑‍💻 Development
#
FROM node:22-alpine as dev
# add the missing shared libraries from alpine base image
RUN apk add --no-cache libc6-compat shadow
# Update npm 
RUN npm install -g npm

ARG USERNAME=node_user
ARG USER_UID=2222
ARG USER_GID=$USER_UID

# Create app folder
WORKDIR /app

# Set to dev environment
ENV NODE_ENV development

# Create non-root user for Docker
RUN groupadd --gid $USER_GID $USERNAME && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME
# Change ownership of the working directory to the new user and grant necessary permissions
RUN chown -R $USERNAME:$USERNAME /app && chmod -R u+rwx /app

COPY ./app/api/package.json .
COPY ./app/api/prisma/ .

RUN npm install
RUN npx prisma generate

# Copy source code into app folder
COPY --chown=$USERNAME:$USERNAME ./app/api/ .

# Set Docker as a non-root user
USER $USERNAME

# Start NestJS server in dev mode
CMD [ "npm", "run", "start:docker" ]

#
# 🏡 Production Build
#
FROM node:22-alpine as build

WORKDIR /app
RUN apk add --no-cache libc6-compat

# Set to production environment
ENV NODE_ENV production

# Re-create non-root user for Docker
RUN addgroup --system --gid 1001 node
RUN adduser --system --uid 1001 node

# In order to run `npm run build` we need access to the Nest CLI.
# Nest CLI is a dev dependency.
COPY --chown=node:node --from=dev /app/node_modules ./node_modules
# Copy source code
COPY --chown=node:node . .

# Generate the production build. The build script runs "nest build" to compile the application.
RUN npm run build

# Install only the production dependencies and clean cache to optimize image size.
RUN npm ci --only=production && npm cache clean --force

# Set Docker as a non-root user
USER node

#
# 🚀 Production Server
#
FROM node:22-alpine as prod

WORKDIR /app
RUN apk add --no-cache libc6-compat

# Set to production environment
ENV NODE_ENV production

# Re-create non-root user for Docker
RUN addgroup --system --gid 1001 node
RUN adduser --system --uid 1001 node

# Copy only the necessary files
COPY --chown=node:node --from=build /app/dist dist
COPY --chown=node:node --from=build /app/node_modules node_modules

# Set Docker as non-root user
USER node

CMD ["node", "dist/main.js"]
