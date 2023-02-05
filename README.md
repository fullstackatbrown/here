# Here

## Developer Guide
Make sure you have Go and npm installed on your device

- If running for the first time, 
    - Install [protobuf](http://google.github.io/proto-lens/installing-protoc.html)
    - build docker image: `make docker`
    - in frontend folder, `npm i`
    - in backend folder, `go install`
- If any changes are made to the files in `model`, run `make build` to compile
- Start envoy (proxy): `make envoy`
- Start backend: `make backend`
- Start frontend: `make frontend`

## Development
- Go to firebase project and follow the steps [here](https://firebase.google.com/docs/admin/setup#initialize-sdk) to generate a private key file. Put it in the root of backend folder and rename it as `dev-firebase-config.json`

## Trouble Shooting
1. When running `make build`, if this error occurs: `protoc-gen-go: program not found or is not executable`
- Update your PATH so that the protoc compiler can find the plugins: `export PATH="$PATH:$(go env GOPATH)/bin"`