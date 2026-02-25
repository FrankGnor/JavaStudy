# JavaWeb -> Spring Boot + Vue 迁移指南（面试版）

## 1. 当前仓库迁移结果

本仓库已经迁移为：

- 后端：Spring Boot 2.7 + MyBatis + REST API
- 前端：Vue3 + Vite + Axios
- 架构：`Controller -> Service -> Mapper -> MySQL`

后端入口：

- `src/main/java/com/itheima/JavaStudyBootApplication.java`

前端入口：

- `frontend/src/main.js`

---

## 2. JavaWeb 到 Spring Boot 对照表

| 旧 JavaWeb | 新 Spring Boot | 说明 |
|---|---|---|
| `web.xml` 注册 Servlet | `@RestController` + `@RequestMapping` | 不再手工注册 Servlet |
| `HttpServlet#doGet/doPost` | `@GetMapping/@PostMapping` | 样板代码更少 |
| Servlet 中 `new UserService()` | Spring IoC 注入 | 更易测试和维护 |
| 手工 `SqlSession` 开关 | Spring 注入 Mapper | 资源管理代码更少 |
| `response.getWriter().write(JSON)` | 直接返回对象 | Jackson 自动序列化 |
| 每个 Servlet 单独配 CORS | 全局 CORS 配置 | 行为一致、统一治理 |
| JSP 渲染 + 重定向 | Vue 路由 + API 数据 | 前后端分离 |
| Filter 鉴权拦截 | （下一步）Spring Security/JWT | 鉴权扩展更规范 |

---

## 3. 旧接口到新接口映射

| 旧接口 | 新接口 |
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

## 4. 为什么 Spring Boot 更强

1. 开发效率更高  
自动配置减少 XML/Servlet 样板代码。

2. 架构一致性更好  
依赖注入和分层边界更清晰。

3. 可维护性更好  
Controller/Service 职责分离明显。

4. 可扩展性更好  
更容易接入 Security、Redis、MQ、可观测体系。

5. 面试信号更强  
契合主流企业技术栈。

---

## 5. 本次迁移已完成的优化

1. 统一响应模型  
新增 `ApiResponse<T>` 与全局异常处理。

2. 将 Servlet 风格业务逻辑下沉到 Service  
认证、交卷、教程查询都在 `service` 层。

3. 移除短信密钥硬编码  
改为 `application.yml`（`app.sms.*`）配置。

4. 增加全局 CORS  
避免在每个接口重复写响应头。

5. 增加请求 DTO 校验  
如 `LoginRequest`、`RegisterRequest`、`ResetPasswordRequest`。

6. 保留原有 MyBatis SQL 资产  
迁移快，数据层改动成本低。

---

## 6. 运行方式

### 后端

1. 在 `src/main/resources/application.yml` 配置数据库
2. 运行：

```bash
mvn spring-boot:run
```

### 前端

```bash
cd frontend
npm install
npm run dev
```

默认地址：

- 后端：`http://localhost:8080`
- 前端：`http://localhost:5173`

---

## 7. 面试表达建议

1. 迁移策略  
“我采用渐进式迁移：先保留 Mapper SQL，把 Servlet 替换为 REST Controller，再拆出 Vue 前端。”

2. 风险控制  
“先保证旧库结构和 SQL 稳定，再逐步优化 service/API 契约。”

3. 安全债务认知  
“当前为了兼容历史数据，密码仍支持明文校验；下一步做 BCrypt 滚动升级。”

4. 工程质量  
“我补齐了统一错误模型、配置外置化和模块化 API 边界，方便后续扩展。”

---

## 8. 企业化中间件路线图

1. 安全与鉴权
- Spring Security + JWT + refresh token
- BCrypt 密码哈希
- 登录限流与验证码策略

2. 性能
- Redis 缓存热门教程、题库、用户统计
- Caffeine 本地缓存热点小 key

3. 异步解耦
- RabbitMQ/Kafka 处理交卷后的异步通知与流程

4. 可靠性
- Resilience4j 保护短信服务调用（重试/熔断）
- Flyway 做数据库版本化迁移

5. 可观测性
- Actuator + Micrometer + Prometheus + Grafana
- 结构化日志 + trace-id

6. 搜索
- Elasticsearch 提升教程关键词与模糊检索

7. DevOps
- Docker + CI/CD + 多环境配置治理

---

## 9. 建议的下一里程碑

1. 接入 Spring Security + JWT，去掉 Session 耦合。  
2. 实施 BCrypt 密码升级策略。  
3. 接入 Redis 并压测题库/教程接口。  
4. 为认证与交卷流程补齐集成测试。  
