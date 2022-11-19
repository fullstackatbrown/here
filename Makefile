all: envoy

envoy:
	docker run -d --name here -p 3333:3333 -p 9901:9901 here

build:
	protoc --go_out=. --go-grpc_out=. ./model/general.proto ./model/admin.proto ./model/uta.proto ./model/student.proto
	protoc --js_out=import_style=commonjs:./frontend/src/ --grpc-web_out=import_style=commonjs,mode=grpcwebtext:./frontend/src/ ./model/general.proto ./model/admin.proto ./model/uta.proto ./model/student.proto
	protoc --plugin=./frontend/./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=./frontend/src/ ./model/general.proto ./model/admin.proto ./model/uta.proto ./model/student.proto

docker:
	docker build -t here . 
backend:
	go run backend/main.go

frontend:
	npm run dev