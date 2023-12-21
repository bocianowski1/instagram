FROM golang:1.20 AS builder

WORKDIR /app

COPY . .

COPY go.mod go.sum ./
RUN go mod download

RUN CGO_ENABLED=0 GOOS=linux go build -o posts

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/posts .

EXPOSE 8080
CMD ["./posts"]
