FROM golang:1.19

WORKDIR /app

COPY . .

COPY go.mod go.sum ./
RUN go mod download

RUN CGO_ENABLED=0 GOOS=linux go build -o auth

EXPOSE 8080
CMD ["/app/auth"]
