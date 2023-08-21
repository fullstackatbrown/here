.PHONY: backend frontend

backend:
	cd backend ; go run main.go

frontend:
	cd frontend ; npm i && npm run dev