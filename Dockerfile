FROM node:20-alpine AS frontend
WORKDIR /fe
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend ./
ENV NEXT_PUBLIC_API_URL=/api
ENV MOVITUR_STATIC_EXPORT=1
RUN rm -f src/middleware.ts && npm run build

FROM maven:3.9-eclipse-temurin-17 AS backend
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN rm -rf src/main/resources/static/*
COPY --from=frontend /fe/out/ ./src/main/resources/static/
RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=backend /app/target/movitur-backend-0.0.1-SNAPSHOT.jar /app/app.jar
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh && mkdir -p /app/uploads
ENV MOVITUR_UPLOAD_DIR=/app/uploads
EXPOSE 8080
CMD ["/app/start.sh"]
