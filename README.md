# Here

## How to Run
- If running for the first time, build docker image: `make docker`
- If any changes are made to the files in `model`, run `make build` to compile
- Start envoy (proxy): `make envoy`
- Start backend: `make backend`
- Start frontend: `make frontend`

## Development
- Go to firebase project and follow the steps [here](https://firebase.google.com/docs/admin/setup#initialize-sdk) to generate a private key file. Put it in the root of backend folder and rename it as `dev-firebase-config.json`
