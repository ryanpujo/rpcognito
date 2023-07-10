build_run:
	@echo "stop all container"
	docker-compose down -v
	@echo "build the container"
	docker-compose up --build
	@echo "container is built and started"
