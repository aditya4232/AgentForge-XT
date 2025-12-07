# Changelog

All the stuff I've changed, organized by version.

---

## v0.5.0-beta (2025-12-07)

The "it actually works now" release.

### Added
- Proper test suite with pytest fixtures
- SQLite in-memory testing (no more needing a running Postgres to test)
- Tests for all API endpoints
- Tests for the LangGraph engine
- `pytest.ini` config for async support

### Changed
- Flattened project structure (bye bye nested `agentforge/` folder)
- Rewrote all documentation to sound less robotic
- Updated requirements.txt with all the deps we actually need

### Fixed
- Frontend build was failing due to missing `input_data` in Run interface
- Tests were failing because they tried to connect to a real database
- Import paths were broken after restructuring

### Removed
- Duplicate folders that shouldn't have existed
- Those placeholder PDF docs that weren't useful

---

## v0.1.0 (2025-12-06)

Initial release. The "let's see if this idea works" version.

### Added
- FastAPI backend with async everything
- Next.js 15 frontend with React Flow canvas
- LangGraph-based execution engine
- Celery workers for async agent runs
- PostgreSQL for persistence
- Redis for task queue
- Ollama integration for local LLMs
- Docker Compose setup for one-command launch
- Helm charts for Kubernetes deployment
- Terraform configs for AWS infra
- Prometheus + Grafana observability
- MLflow for experiment tracking

---

## Roadmap

What's coming next (no promises on timeline):

### v0.6
- [ ] User authentication (finally)
- [ ] Agent versioning — keep old versions when you edit
- [ ] Conditional nodes — if/else branching in graphs
- [ ] More tools — web scraping, SQL queries, etc.

### v0.7
- [ ] Collaborative editing — multiple people on one agent
- [ ] Agent marketplace — share and import agents
- [ ] Scheduled runs — cron-style triggers

### v1.0
- [ ] Production security audit
- [ ] Horizontal scaling validation
- [ ] Public API with proper rate limiting
- [ ] Plugin system for custom nodes

---

## Contributing

Found a bug? Have an idea? Open an issue or PR. I'm pretty responsive.
