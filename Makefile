.PHONY: backend frontend

backend:
	cd backend ; go run main.go

frontend:
	cd frontend ; npm i && npm run dev

update_privacy_pal:
	cd backend ; go get github.com/privacy-pal/privacy-pal@$(version)