# Here

## Codebase

The frontend is a React (Next.js) app written in Typescript, while the backend is a REST API written in Go. We also use Firebase Authentication and Firestore.

## Set up
1. Make sure you have Go and npm/yarn installed on your device
2. Install backend dependencies
    ```
    cd backend
    go mod tidy
    go get .
    ```
3. Install frontend dependencies
    ```
    cd frontend
    npm install // or yarn install
    ```


4. In the Firebase console, go to **Project Settings > Service Accounts** and generate a new private key file. Detailed steps can be found [here](https://firebase.google.com/docs/admin/setup#initialize-sdk). Take the downloaded JSON file, put it in the root of backend folder and rename it as `dev-firebase-config.json`

5. Create a `.env.local` file under the root of frontend folder. Copy the contents in `example.env` and copy over the corresponding Firebase credentials from earlier. For the last environment variable, set it to `http://localhost:8080`.

    - Make sure to not push `.env.local` to remote (it should be already git-ignored) 

6. Run backend
    ```
    cd backend
    go run main.go
    ```
7. Run frontend
    ```
    cd frontend
    npm run dev // or yarn dev
    ```

## Backend APIs
For a full list of the backend APIs, visit [API documentation](./API.md).

