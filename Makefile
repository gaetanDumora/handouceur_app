restart:
	docker compose down $(SVC) -v && docker compose up $(SVC)

clean:
	find . \( -type d -name raft -o -type f -name vault.db \) -exec rm -rf {} +
