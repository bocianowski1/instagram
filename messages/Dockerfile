FROM go:1.20

WORKDIR /app

COPY . .

COPY go.mod go.sum ./
RUN go mod download

RUN CGO_ENABLED=0 GOOS=linux go build -o messages

EXPOSE 9999
CMD ["/app/messages"]
