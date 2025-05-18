FROM golang:1.21-alpine AS build
WORKDIR /app
COPY . .
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o auth-service ./src

FROM alpine:latest
WORKDIR /app
RUN apk add --no-cache curl
COPY --from=build /app/auth-service .
EXPOSE 8081
CMD ["./auth-service"]