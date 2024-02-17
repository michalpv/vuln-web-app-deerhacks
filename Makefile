dev:
	docker compose -f compose.dev.yaml up --build -d

dev-stop:
	docker compose -f compose.dev.yaml down

start:
	docker compose -f compose.yaml up --build -d

stop:
	docker compose -f compose.yaml down

logs:
	docker compose -f compose.yaml logs --follow

db:
	mongosh "mongodb://root:password@localhost:27017/appdb?authSource=admin"
