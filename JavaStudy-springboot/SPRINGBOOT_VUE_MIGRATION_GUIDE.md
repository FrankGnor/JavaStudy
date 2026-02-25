# JavaWeb -> Spring Boot + Vue Migration Guide (Interview Edition)

## 1. Current migration result in this repo

This repository has been migrated to:

- Backend: Spring Boot 2.7 + MyBatis + REST API
- Frontend: Vue3 + Vite + Axios
- Architecture: `Controller -> Service -> Mapper -> MySQL`

Core backend entry:

- `src/main/java/com/itheima/boot/JavaStudyBootApplication.java`

Core frontend entry:

- `frontend/src/main.js`

---

## 2. JavaWeb to Spring Boot one-to-one mapping

| Old JavaWeb | New Spring Boot | Notes |
|---|---|---|
| `web.xml` servlet registration | `@RestController` + `@RequestMapping` | No manual servlet registration |
| `HttpServlet#doGet/doPost` | `@GetMapping/@PostMapping` | Less boilerplate |
| `new UserService()` in Servlet | Spring IoC injection | Better testability |
| Manual `SqlSession` open/close | Mapper injected by Spring | Less resource management code |
| `response.getWriter().write(JSON)` | Return object directly | Jackson auto serialization |
| Per-servlet CORS headers | Global CORS config | Unified behavior |
| JSP rendering + redirect | Vue routes + API data | Frontend/backend separation |
| Filter auth interception | (Next step) Spring Security/JWT | Cleaner auth extension |

---

## 3. Old endpoint to new API mapping

| Old endpoint | New endpoint |
|---|---|
| `/loginServlet` | `POST /api/auth/login` |
| `/registerServlet` | `POST /api/auth/register` |
| `/ResetServlet` | `POST /api/auth/reset-password` |
| `/sentMsg` | `POST /api/auth/sms-code` |
| `/checkCodeServlet` | `GET /api/auth/captcha` |
| `/ExitServlet` | `POST /api/auth/logout` |
| `/UserDetailServlet` | `GET /api/users/{username}/stats` |
| `/tutorialServlet` | `GET /api/tutorials/{id}` |
| `/CataServlet` | `GET /api/tutorials/catalog` |
| `/SearchServlet` | `GET /api/tutorials/search?keyword=...` |
| `/questionServlet` | `GET /api/questions?topic=...&username=...` |
| `/DeleteQServlet` | `DELETE /api/questions/wrong/{qNo}?username=...` |
| `/codeQuestionServlet` | `GET /api/questions/code?topic=...` |
| `/checkExam` | `POST /api/exams/choice/submit` |
| `/insertCodeAnswer` | `POST /api/exams/code/submit` |

---

## 4. Why Spring Boot is stronger than your current JavaWeb style

1. Development speed
- Auto-configuration removes heavy XML/Servlet boilerplate.

2. Better architecture consistency
- Unified DI lifecycle and layered boundaries.

3. Better maintainability
- Controller/Service responsibilities are clearer.

4. Better extensibility
- Easy to plug in Security, Redis, MQ, Observability.

5. Better interview signal
- Matches mainstream enterprise stack expectations.

---

## 5. Code optimization done in this migration

1. Unified response envelope
- Added `ApiResponse<T>` and centralized exception handling.

2. Extracted business logic from Servlet style handlers
- Auth, exam submit, tutorial query are in `service` layer.

3. Removed hardcoded SMS secrets from source code
- Moved to `application.yml` (`app.sms.*`).

4. Added global CORS config
- Avoid repeated response header code.

5. Added request validation DTOs
- `LoginRequest`, `RegisterRequest`, `ResetPasswordRequest`, etc.

6. Preserved your existing MyBatis SQL assets
- Fast migration with low data-layer rewrite cost.

---

## 6. How to run

### Backend

1. Configure DB in `src/main/resources/application.yml`
2. Run:

```bash
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Default:
- Backend: `http://localhost:8080`
- Frontend: `http://localhost:5173`

---

## 7. Interview talking points (recommended)

1. Migration strategy
- "I used incremental migration: preserve Mapper SQL, replace Servlet with REST Controller, then split frontend into Vue app."

2. Risk control
- "I kept old schema and SQL stable first, then optimized service/API contracts."

3. Security debt awareness
- "Current password compare is plaintext-compatible for old data; next step is BCrypt migration with rolling upgrade."

4. Engineering quality
- "I added unified error model, config externalization, and modular API boundaries for scaling."

---

## 8. Future middleware roadmap (for enterprise readiness)

1. Security and auth
- Spring Security + JWT + refresh token
- BCrypt password hashing
- Login rate limit / CAPTCHA policy

2. Performance
- Redis cache for hot tutorials, question pools, user stats
- Caffeine local cache for small hot keys

3. Async and decoupling
- RabbitMQ/Kafka for exam result processing and notification workflows

4. Reliability
- Resilience4j for retries/circuit breaker around SMS provider
- Flyway for DB migration versioning

5. Observability
- Actuator + Micrometer + Prometheus + Grafana
- Structured logs with trace-id

6. Search
- Elasticsearch for tutorial keyword/fuzzy retrieval

7. DevOps
- Docker + CI/CD pipeline + environment-specific config

---

## 9. Suggested next milestone in this repo

1. Add Spring Security + JWT and remove session coupling.
2. Replace plaintext password with BCrypt migration strategy.
3. Add Redis cache and benchmark question/tutorial endpoints.
4. Add integration tests for auth and exam submission flow.
