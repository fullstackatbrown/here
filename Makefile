all: envoy

envoy:
	docker run -d --name here -p 3333:3333 -p 9901:9901 here

build:
	protoc --go_out=. --go-grpc_out=. ./model/*.proto
	protoc --plugin=./frontend/node_modules/.bin/protoc-gen-ts --js_out="import_style=commonjs,binary:./frontend/src/" --ts_out=./frontend/src/ ./model/*.proto
	protoc --plugin=./frontend/node_modules/.bin/protoc-gen-ts --js_out="import_style=commonjs,binary:./frontend/src/" --ts_out=service=grpc-web:./frontend/src/ ./model/*.proto

docker:
	docker build -t here ./frontend 

backend:
	go run backend/main.go

frontend:
	npm run dev