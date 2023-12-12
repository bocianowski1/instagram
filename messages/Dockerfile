FROM golang:1.20 AS builder

WORKDIR /app

COPY . .

COPY go.mod go.sum ./
RUN go mod download

RUN CGO_ENABLED=0 GOOS=linux go build -o messages

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/messages .

EXPOSE 9999
CMD ["./messages"]
