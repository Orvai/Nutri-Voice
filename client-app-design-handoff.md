# 1. Product Context
The trainee-facing app is a personal daily operations app for nutrition and training, with AI and coach-in-the-loop support.

- nutrition: log meals, compare intake to day-specific calorie budget, and use menu context (training/rest menus)
- workouts: report completed workouts, update workout logs/exercise weights, and view assigned workout programs
- daily tracking: set day type, monitor consumed/remaining calories, and track metrics (steps/water/sleep) + weight
- coach communication: read conversation thread messages and receive coach/AI replies
- assistant: AI triage + MCP tools can auto-reply, ask clarifications, and escalate to coach reply when needed
- community/social potential: currently no backend contracts for feed/stories/reactions/comments, but app architecture can extend into these domains

# 2. Client-Facing Domains Map
| Domain | Purpose | Main DTOs / entities | Read operations | Write operations | Notes / constraints |
|---|---|---|---|---|---|
| User / Client | identity + profile | `userResponseDto`, `createUserDto`, `updateUserDto`, `UserInfoResponseDto`, `ClientListItemDto` | `GET /api/users/:id/info`, `GET /api/clients`, `GET /api/clients/:id` | `PUT /api/users/:id/info`, auth/register routes | Ownership middleware is not attached to all user/profile routes; validate exposure policy before mobile release |
| Coach interaction | human support loop | `ConversationDto`, `MessageDto`, `SendCoachMessageRequestDto` | `GET /api/conversations/:id`, `GET /api/conversations/:id/messages` | `POST /api/conversations/:id/messages` (coach-only), `POST /api/messages/:id/handled` | No public client endpoint to send a new client message directly (client messaging currently enters via webhook/internal flow) |
| Daily state | aggregated "today" state | `DailyStateDto`, `DailyStateResponseDto`, `DailyStateToolDto` | `GET /api/tracking/daily-state`, `GET /api/tracking/daily-state/range` | none directly (derived from logs + menus + day type) | Calories depend on day type + active menu by day type |
| Day type | selects training/rest context | `DaySelectionCreateDto`, `DaySelectionResponseDto` | `GET /api/tracking/day-selection/today/:clientId` (coach) | `POST /api/tracking/day-selection` | Upsert-by-date behavior in service (`setDayType`) |
| Metrics log | daily health inputs | `MetricsLogCreateDto`, `MetricsLogResponseDto`, `UpsertMetricsToolDto` | `GET /api/tracking/metrics-log/history/:clientId` (coach) | `POST /api/tracking/metrics-log` | Service is upsert-per-day; MCP supports `ABSOLUTE` and `DELTA` modes |
| Weight log | bodyweight progression | `WeightLogCreateDto`, `WeightLogUpdateDto`, `WeightLogResponseDto` | `GET /api/tracking/weight-log/history/:clientId` (coach) | `POST /api/tracking/weight-log`, `PUT /api/tracking/weight-log/:logId` | Gateway DTO says partial update; controller currently parses create DTO (practically requires `weightKg`) |
| Meal log | nutrition event logging | `MealLogCreateDto`, `MealLogUpdateDto`, `MealLogResponseDto`, `ReportMealInputDto`, `UpdateMealInputDto` | `GET /api/tracking/meal-log/history/:clientId` (coach), daily-state aggregates | `POST /api/tracking/meal-log`, `PUT /api/tracking/meal-log/:logId` | No delete endpoint; MCP enforces dayType consistency with daily state |
| Workout log | workout event logging | `WorkoutLogCreateDto`, `WorkoutLogUpdateDto`, `WorkoutLogResponseDto`, `ReportWorkoutToolInputDto`, `UpdateWorkoutToolInputDto` | `GET /api/tracking/workout-log/history/:clientId` (coach), daily-state aggregates | `POST /api/tracking/workout-log`, `PUT /api/tracking/workout-log/:logId`, `PATCH /api/tracking/workout-log/exercise/:exerciseLogId` | No delete endpoint; patch endpoint effectively supports weight-only in tracking controller |
| Workout programs | assigned structured plans | `WorkoutProgramCreateRequestDto`, `WorkoutProgramUpdateRequestDto`, `WorkoutProgramResponseDto`, `GetWorkoutProgramsToolOutputDto` | `GET /api/workout/:clientId/workout-programs`, `GET /api/workout/:clientId/workout-programs/:programId` | Coach creates/updates/deletes; client is read-only | Key for workout context and guided reporting |
| Workout context | assistant runtime guidance | `GetWorkoutContextToolInputDto`, `GetWorkoutContextToolOutputDto` | MCP tool `get_workout_context` | none (read-only tool) | Picks a program + exercise list for reporting flow |
| Menus | day-type meal structure | `ClientMenuCreateDto`, `ClientMenuUpdateDto`, `ClientMenuResponseDto`, `ClientMenuListResponseDto` | `GET /api/client-menus`, `GET /api/client-menus/:id` | Coach create/update/deactivate/from-template | List endpoint currently returns summary rows, not full nested menu object |
| Notifications / coach reply | escalation surfacing | `MessageDto` (`aiDecision`, `handledBy`, `handledAt`) | `GET /api/inbox/pending` (coach) | `POST /api/messages/:id/handled` | Inbox query expects `sender=CLIENT && aiDecision=COACH_REPLY && handledAt=null` |
| Conversation state | assistant short-term memory | `ConversationStateDto`, `ConversationStatePatchDto`, `PendingActionToolInputDto` | internal state store (redis/memory, TTL) | MCP tool `set_conversation_state` | Stores pending meal/workout drafts and clarification state |
| Conversation / chat | thread + message timeline | `conversation.dto.js`, `message.dto.js`, enums | conversation/messages GET routes | coach send + message handled routes | Client can read owned conversations/messages; listing all conversations is coach-only |
| Inbox / pending coach messages | coach queue of unresolved client msgs | `PendingClientMessageResponseDto` | `GET /api/inbox/pending` | mark handled | Used for escalation and coach workload view |
| Assistant run / MCP result | AI decisioning + tool execution | `RunMcpDto`, `McpResultDto`, `RunCoachMcpDto`, `CoachMcpResultDto` | internal: `/internal/mcp/run`, `/internal/mcp/coach/run` | tool-triggered writes (logs/state) | Trusted actor headers enforced; decisions: `AUTO_REPLY` vs `COACH_REPLY` |

# 3. Actual DTO Structures
## 3.1 Identity and Client DTOs

### `userResponseDto`
- DTO name: `userResponseDto`
- Source file path: `services/idm-service/src/dto/user.dto.js`

| field name | type | required/optional | enum values | nullable | description |
|---|---|---|---|---|---|
| id | string | required |  | no | user id |
| email | string(email) | required |  | no | login email |
| firstName | string | required |  | no | first name |
| lastName | string | required |  | no | last name |
| phone | string | optional |  | no | phone number |
| status | enum | required | `active`, `deleted`, `locked` | no | account status |
| role | enum | required | `trainer`, `client`, `admin` | no | role |
| createdAt | string(datetime) | required |  | no | creation timestamp |
| updatedAt | string(datetime) | required |  | no | update timestamp |

Nested/arrays/refs: none.

### `createUserDto`
- DTO name: `createUserDto`
- Source file path: `services/idm-service/src/dto/user.dto.js`

| field name | type | required/optional | enum values | nullable | description |
|---|---|---|---|---|---|
| email | string(trim,email) | required |  | no | unique email |
| phone | string(trim,min4) | required |  | no | phone |
| firstName | string(trim,min1) | required |  | no | first name |
| lastName | string(trim,min1) | required |  | no | last name |

Notes: `.strict()`; unknown keys rejected.

### `updateUserDto`
- DTO name: `updateUserDto`
- Source file path: `services/idm-service/src/dto/user.dto.js`

| field name | type | required/optional | enum values | nullable | description |
|---|---|---|---|---|---|
| email | string(trim,email) | optional |  | no | update email |
| phone | string(trim) | optional |  | no | update phone |
| firstName | string(trim) | optional |  | no | update first name |
| lastName | string(trim) | optional |  | no | update last name |

Notes: `.strict()` + `superRefine`: at least one field must be provided.

### `ClientListItemDto`
- DTO name: `ClientListItemDto`
- Source file path: `services/gateway-service/src/dto/idm.dto.js`

| field name | type | required/optional | enum values | nullable | description |
|---|---|---|---|---|---|
| id | string | required |  | no | client id |
| name | string | required |  | no | display name |
| phone | string | required |  | yes | phone |
| email | string | required |  | yes | email |
| profileImageUrl | string(url) | required |  | yes | avatar URL |
| gender | string | required |  | yes | profile gender |
| age | number | required |  | yes | age |
| height | number | required |  | yes | height |
| weight | number | required |  | yes | weight snapshot |
| goals | any | required |  | yes | goals blob |
| activityLevel | any | required |  | yes | activity level blob |
| creationDate | string | required |  | yes | creation timestamp |
| city | string | required |  | yes | city |
| address | string | required |  | yes | address |

### `ClientsListResponseDto`
- DTO name: `ClientsListResponseDto`
- Source file path: `services/gateway-service/src/dto/idm.dto.js`

| field name | type | required/optional | enum values | nullable | description |
|---|---|---|---|---|---|
| data | `ClientListItemDto[]` | required |  | no | client list |

### `UserInfoResponseDto`
- DTO name: `UserInfoResponseDto`
- Source file path: `services/gateway-service/src/dto/idm.dto.js` (mirrors `services/idm-service/src/dto/userInfo.dto.js`)

| field name | type | required/optional | enum values | nullable | description |
|---|---|---|---|---|---|
| id | string(uuid) | required |  | no | user info row id |
| userId | string(uuid) | required |  | no | user id fk |
| status | enum | required(default) | `active`, `deleted`, `archived` | no | info record status |
| dateOfBirth | string(datetime) | optional/nullish |  | yes | birth date |
| gender | string | optional/nullish |  | yes | gender |
| address | string | optional/nullish |  | yes | address |
| city | string | optional/nullish |  | yes | city |
| profileImageUrl | string(url) | optional/nullish |  | yes | profile image |
| height | number(int) | optional/nullish |  | yes | height |
| age | number(int) | optional/nullish |  | yes | age |
| createdAt | string(datetime) | required |  | no | creation time |
| updatedAt | string(datetime) | required |  | no | update time |

### `UserResponseDto`
- DTO name: `UserResponseDto`
- Source file path: `services/gateway-service/src/dto/idm.dto.js`

| field name | type | required/optional | enum values | nullable | description |
|---|---|---|---|---|---|
| id | string | required |  | no | user id |
| email | string(email) | required |  | no | email |
| firstName | string | required |  | no | first name |
| lastName | string | required |  | no | last name |
| phone | string | optional |  | no | phone |
| status | enum | required | `active`, `deleted`, `locked` | no | status |
| role | enum | required | `trainer`, `client`, `admin` | no | role |
| createdAt | string(datetime) | required |  | no | created at |
| updatedAt | string(datetime) | required |  | no | updated at |

## 3.2 Assistant Runtime DTOs

### `RunMcpDto`
- DTO name: `RunMcpDto`
- Source file path: `services/mcp-service/src/dtos/runMcp.dto.js`

| field name | type | required/optional | enum values | nullable | description |
|---|---|---|---|---|---|
| conversationId | string | required |  | no | conversation scope |
| messageId | string | required |  | no | source message id |
| sender | enum | required | `client`, `coach` | no | actor type |
| clientId | string | required |  | no | target client id |
| userId | string | optional |  | no | required if sender=coach |
| contentType | enum | optional(default) | `TEXT`, `IMAGE`, `AUDIO`, `VIDEO` | no | message content type |
| media | object | optional |  | no | media payload for non-text |
| userText | string | optional(default="") |  | no | message text |
| history | array | optional(default=[]) | roles: `user`, `assistant`, `system` | no | prior context |
| requestAudit | object | optional |  | no | trace/audit ids |

Nested:
- `media`: `mediaUrl`(url, required when non-text), `mediaMimeType?`, `mediaDurationSec?`, `mediaThumbnail?`
- `history[]`: `{ role, content }`
- `requestAudit`: `{ requestId, actorId, clientId?, toolName? }`

Validation rules:
- if `sender=coach` then `userId` required
- if `contentType != TEXT` then `media.mediaUrl` required

### `RunCoachMcpDto`
- DTO name: `RunCoachMcpDto`
- Source file path: `services/mcp-service/src/dtos/runCoachMcp.dto.js`

| field name | type | required/optional | enum values | nullable | description |
|---|---|---|---|---|---|
| conversationId | string(min1) | required |  | no | coach thread id |
| messageId | string(min1) | required |  | no | message id |
| sender | literal | optional(default) | `coach` | no | fixed sender |
| userId | string(min1) | required |  | no | coach actor id |
| clientId | string(min1) | optional(default null) |  | yes | target client context |
| userText | string(min1) | required |  | no | coach instruction text |
| history | array | optional(default=[]) | roles: `user`, `assistant`, `system` | no | prior messages |
| requestAudit | object | optional |  | no | trace metadata |
| metadata | record<any> | optional(default={}) |  | no | free-form execution metadata |

### `McpResultDto` (from `mcpResult.dto.js`)
- DTO name: `McpResultDto`
- Source file path: `services/mcp-service/src/dtos/mcpResult.dto.js`

| field name | type | required/optional | enum values | nullable | description |
|---|---|---|---|---|---|
| decision | enum | required | `AUTO_REPLY`, `COACH_REPLY` | no | escalation decision |
| replyText | string | required |  | yes | AI reply text (if auto) |
| coachSuggestedReply | string | optional |  | yes | optional suggested coach text |
| usedTools | string[] | optional(default=[]) |  | no | tool execution trace |

### `CoachMcpResultDto`
- DTO name: `CoachMcpResultDto`
- Source file path: `services/mcp-service/src/dtos/coachResult.dto.js`

| field name | type | required/optional | enum values | nullable | description |
|---|---|---|---|---|---|
| status | enum | required | `ok`, `clarification_required`, `out_of_scope`, `escalation_required`, `error` | no | assistant status |
| replyText | string | required(default null) |  | yes | returned coach-facing text |
| summary | string | required |  | no | summary sentence |
| resolvedClient | object | required(default null) |  | yes | resolved client context |
| toolResults | `CoachToolResultDto[]` | optional(default=[]) |  | no | normalized tool outputs |
| usedTools | string[] | optional(default=[]) |  | no | tool names |
| meta | record<any> | optional(default={}) |  | no | extra metadata |
| audit | object | optional(default={}) |  | no | audit payload |

Related DTO: `CoachToolResultDto`
- fields: `ok`, `entityType`, `entityId(nullable)`, `summary`, `data?`, `meta`, `audit`

### `CoachSessionStateDto`
- DTO name: `CoachSessionStateDto`
- Source file path: `services/mcp-service/src/dtos/coachSessionState.dto.js`

| field name | type | required/optional | enum values | nullable | description |
|---|---|---|---|---|---|
| activeClient | object | optional(default null) |  | yes | active client lock in session |
| pendingClarification | object | optional(default null) | `type=client_selection` | yes | disambiguation choices |
| lastOverview | object | optional(default null) |  | yes | last generated overview context |
| updatedAt | string(datetime) | required |  | no | state timestamp |

Nested:
- `activeClient`: `{ id, name? }`
- `pendingClarification.options[]`: `{ id, name }`
- `lastOverview`: `{ clientId, generatedAt }`

Patch DTO (`CoachSessionStatePatchDto`) adds optional same fields + `clearKeys[]` enum (`activeClient`, `pendingClarification`, `lastOverview`).

### `ShouldCoachReplyInputDto` and result DTO
- DTO names: `ShouldCoachReplyInputDto`, `ShouldCoachReplyResultDto`
- Source file path: `services/mcp-service/src/dtos/tools/shouldCoachReply.dto.js`

`ShouldCoachReplyInputDto` fields:
| field name | type | required/optional | enum values | nullable | description |
|---|---|---|---|---|---|
| userMessage | string | optional |  | no | user text |
| dailyState | any | optional |  | no | state context |
| previewMeal | object | optional | matchType: `NONE`,`PARTIAL`,`FULL` | no | nutrition confidence hints |
| lastAction | any | optional |  | no | previous operation context |
| hasUncertainty | boolean | optional |  | no | uncertainty flag |
| mentionsMedical | boolean | optional |  | no | medical/risk signal |
| repeatedCorrections | boolean | optional |  | no | unstable corrections flag |

Result (`ShouldCoachReplyResultDto`):
| field name | type | required/optional | enum values | nullable | description |
|---|---|---|---|---|---|
| decision | enum | required | `AUTO_REPLY`, `COACH_REPLY` | no | escalation decision |
| reasons | string[] | required |  | no | rationale list |

### `ConversationStateDto`
- DTO name: `ConversationStateDto`
- Source file path: `services/mcp-service/src/dtos/conversationState.dto.js`

| field name | type | required/optional | enum values | nullable | description |
|---|---|---|---|---|---|
| pending_meal_candidate | object | optional(default null) | source: `MENU_MATCH`,`ESTIMATE`,`USER_PROVIDED` | yes | draft meal before commit |
| pending_meal_update | object | optional(default null) |  | yes | draft meal update |
| pending_workout_candidate | object | optional(default null) | effort: `EASY`,`NORMAL`,`HARD`,`FAILED`,`SKIPPED` | yes | draft workout before commit |
| pending_workout_update | object | optional(default null) | toolName: `update_workout`,`update_workout_exercise` | yes | draft update action |
| awaiting_day_type | boolean | optional(default false) |  | no | day-type clarification gate |
| awaiting_missing_fields | object | optional(default null) | actionType: `report_meal`,`update_meal`,`report_workout`,`update_workout`,`update_workout_exercise` | yes | missing fields tracker |
| last_menu_check | object | optional(default null) | dayType enum | yes | last menu-fit result |
| last_calorie_estimate | object | optional(default null) |  | yes | last calorie estimation context |
| last_workout_context | object | optional(default null) | completion: `UNKNOWN`,`NOT_REPORTED`,`PARTIAL`,`DONE` | yes | last program/workout context |
| resolved_day_type | object | optional(default null) | source: `TOOL_DAILY_STATE`,`SET_DAY_TYPE`,`USER_TEXT` | yes | cached day type |
| updatedAt | string(datetime) | required |  | no | state update time |

### `ConversationStatePatchDto`
- DTO name: `ConversationStatePatchDto`
- Source file path: `services/mcp-service/src/dtos/conversationState.dto.js`

Fields are optional patch versions of `ConversationStateDto` keys + `clearKeys[]` enum of clearable keys.

### `PendingActionToolInputDto`
- DTO name: `PendingActionToolInputDto`
- Source file path: `services/mcp-service/src/dtos/conversationState.dto.js`

This DTO is structurally identical to `ConversationStatePatchDto` and is used by `set_conversation_state` tool input.

## 3.3 Tracking DTOs

### `daySelection.dto.js` structures
- Source file path: `services/client-tracking-service/src/dto/daySelection.dto.js`

`DaySelectionCreateDto`
| field name | type | required/optional | enum values | nullable | description |
|---|---|---|---|---|---|
| dayType | enum | required | `TRAINING`, `REST` | no | selected day type |
| date | string(datetime) | optional |  | no | effective date |

`DaySelectionResponseDto`
| field name | type | required/optional | enum values | nullable | description |
|---|---|---|---|---|---|
| id | string | required |  | no | row id |
| clientId | string | required |  | no | owner |
| date | Date | required |  | no | selected date |
| dayType | enum | required | `TRAINING`,`REST` | no | day type |
| changedAt | Date | required |  | no | last change timestamp |

### `MealLogCreateDto`, `MealLogUpdateDto`, `MealLogResponseDto`
- Source file path: `services/client-tracking-service/src/dto/mealLog.dto.js`

`MealLogCreateDto`
| field | type | required/optional | enum | nullable | notes |
|---|---|---|---|---|---|
| date | string(datetime) | optional |  | no | defaults to now in service |
| calories | int | required |  | no | kcal |
| protein | int | required |  | no | grams |
| carbs | int | required |  | no | grams |
| fat | int | required |  | no | grams |
| description | string | optional |  | no | meal text |
| matchedMenuItemId | string | optional |  | no | linked menu item |
| dayType | enum | required | `TRAINING`,`REST` | no | required day type |

`MealLogUpdateDto` (partial)
- optional: `calories`, `protein`, `carbs`, `fat`, `description`, `matchedMenuItemId(nullable)`, `dayType`

`MealLogResponseDto`
- fields: `id`, `clientId`, `date`, `dayType`, `calories`, `protein`, `carbs`, `fat`, `description(nullable)`, `matchedMenuItemId(nullable)`, `loggedAt?`

### `MealLogCreateRequestDto`, `MealLogUpdateRequestDto`, `MealLogResponseDto` (gateway)
- Source file path: `services/gateway-service/src/dto/tracking.dto.js`

`MealLogCreateRequestDto` and `MealLogUpdateRequestDto` mirror service DTO shapes (request layer).

`MealLogResponseDto` (gateway wrapper):
| field | type | required/optional | enum | nullable | notes |
|---|---|---|---|---|---|
| data | object | required |  | no | contains meal log payload (same fields as service response) |

### `ReportMealInputDto` / `UpdateMealInputDto`
- Source file paths:
  - `services/mcp-service/src/dtos/tools/menu-meal/reportMeal.dto.js`
  - `services/mcp-service/src/dtos/tools/menu-meal/updateMeal.dto.js`

`ReportMealInputDto` extends create-meal with assistant metadata: `source`, `confidence`, `isEstimated`, `outsideMenu`, `portionText`, `caloriesUsedForLog`.

`UpdateMealInputDto`:
| field | type | required/optional | enum | nullable | notes |
|---|---|---|---|---|---|
| logId | string(min1) | required |  | no | target log id |
| calories/protein/carbs/fat | int | optional |  | no | partial updates |
| description | string | optional |  | no | note update |
| matchedMenuItemId | string | optional |  | yes | relink/clear |
| dayType | enum | optional | `TRAINING`,`REST` | no | checked against current daily state if provided |

### `WorkoutLogCreateDto`, `WorkoutLogUpdateDto`, `WorkoutLogResponseDto`
- Source file path: `services/client-tracking-service/src/dto/workoutLog.dto.js`

`WorkoutLogCreateDto`
| field | type | required/optional | enum | nullable | notes |
|---|---|---|---|---|---|
| date | string(datetime) | optional |  | no | defaults now |
| workoutType | string(min1) | required |  | no | workout label |
| effortLevel | enum | required | `EASY`,`NORMAL`,`HARD`,`FAILED`,`SKIPPED` | no | effort |
| notes | string | optional |  | no | notes |
| exercises | array | required |  | no | `[{exerciseName, weight?}]` |

`WorkoutLogUpdateDto` (partial): `workoutType?`, `effortLevel?`, `notes?`, `exercises?` (`id`,`exerciseName`,`weight?`).

`WorkoutLogResponseDto` fields: `id`,`clientId`,`date`,`workoutType`,`effortLevel`,`notes(nullable)`,`loggedAt?`,`exercises[]`.

### `WorkoutLogCreateRequestDto`, `WorkoutLogUpdateRequestDto`, `WorkoutLogResponseDto` (gateway)
- Source file path: `services/gateway-service/src/dto/tracking.dto.js`

Request DTOs mirror service structures.

`WorkoutLogResponseDto` is wrapper `{ data: { ...workoutLog } }`.

### `ReportWorkoutToolInputDto` / `UpdateWorkoutToolInputDto`
- Source file path: `services/mcp-service/src/dtos/tools/workout/reportWorkout.dto.js` and `.../updateWorkout.dto.js`

`ReportWorkoutToolInputDto` fields:
- required: `workoutType`, `effortLevel`, `exercises(min 1)`
- optional: `date`, `notes`, `durationMin`, `intensity(LOW|MEDIUM|HIGH)`, `performedAsPlanned`, `caloriesBurnEstimate`

`UpdateWorkoutToolInputDto` fields:
- required: `logId`
- optional: `workoutType`, `effortLevel`, `notes`, `exercises[{id,exerciseName,weight?}]`

### `metricsLog.dto.js` structures
- Source file path: `services/client-tracking-service/src/dto/metricsLog.dto.js`

`MetricsLogCreateDto`: optional `date`, `steps>=0`, `waterLiters>=0`, `sleepHours 0..24`, `notes`.

`MetricsLogResponseDto`: `id`, `clientId`, `date(Date)`, `steps(nullable)`, `waterLiters(nullable)`, `sleepHours(nullable)`, `notes(nullable)`, `updatedAt(Date)`.

`MetricsHistoryResponseDto`: array of response rows.

### `weightLog.dto.js` structures
- Source file path: `services/client-tracking-service/src/dto/weightLog.dto.js`

`WeightLogCreateDto`: `date?`, `weightKg(required)`, `notes?`.

`WeightLogUpdateDto`: `weightKg?`, `notes?(nullable)`.

`WeightLogResponseDto`: `id`, `clientId`, `date`, `weightKg`, `notes(nullable)`, `loggedAt?`.

### `DailyStateDto`, `DailyStateResponseDto`, `DailyStateToolDto`
- Source files:
  - `services/client-tracking-service/src/dto/dailyState.dto.js`
  - `services/gateway-service/src/dto/tracking.dto.js`
  - `services/mcp-service/src/dtos/tools/DailyState/dailyState.dto.js`

`DailyStateDto` (service aggregate):
- `dayType(nullable)`
- `calorieTargets{trainingDay,restDay}`
- `activeCaloriesAllowed(nullable)`
- `consumedCalories`
- `remainingCalories(nullable)`
- `meals[]`, `workouts[]`, `weight(nullable)`, `metrics(nullable)`

`DailyStateResponseDto` (gateway): wrapper `data` around equivalent aggregate shape.

`DailyStateToolDto` (assistant-friendly): same core + helper fields:
- `dailyCaloriesTarget?`
- `mealsSummary{count,lastMealAt}`
- `metricsSummary{hasMetrics,steps,waterLiters,sleepHours}`
- `workoutPlanned?`, `workoutCompleted?`
- `missingCriticalFields?`

## 3.4 Conversation and Inbox DTOs

### `message.dto.js` relevant structures
- Source files:
  - `services/gateway-service/src/dto/conversation/message.dto.js`
  - `services/conversation-service/src/dtos/message.dto.js`

Gateway `MessageDto` fields:
| field | type | required/optional | enum | nullable | notes |
|---|---|---|---|---|---|
| id | string | required |  | no | message id |
| conversationId | string | required |  | no | thread id |
| sender | enum | required | `CLIENT`,`COACH`,`AI` | no | actor |
| contentType | enum | required | `TEXT`,`IMAGE`,`AUDIO`,`VIDEO` | no | content type |
| text | string | required |  | yes | text payload |
| mediaUrl/mediaMimeType/mediaDurationSec/mediaThumbnail | mixed | required |  | yes | media metadata |
| sourceMessageId | string | optional |  | yes | external source id |
| autoGenerated | boolean | optional |  | yes | AI-generated flag |
| aiDecision | enum | required | `AUTO_REPLY`,`COACH_REPLY` | yes | triage decision |
| aiSuggestedReply | string | required |  | yes | AI recommendation |
| handledAt | string(datetime) | required |  | yes | handling time |
| handledBy | enum | required | `AI`,`COACH` | yes | handler |
| createdAt | string(datetime) | required |  | no | creation time |
| updatedAt | string(datetime) | optional |  | no | update time |

Conversation-service message input DTOs:
- `CreateClientMessageDto`: `conversationId`, `contentType`, `text?`, `media?`, `sourceMessageId?` (+ refine for non-TEXT mediaUrl)
- `CreateCoachMessageDto`: similar, no `sourceMessageId`
- `CreateAiMessageDto`: `conversationId`, `text(min1)`, `autoGenerated?`
- `MarkClientMessageHandledDto`: `handledBy(AI|COACH)`

### `SendCoachMessageRequestDto`
- Source file: `services/gateway-service/src/dto/conversation/message.requests.dto.js`

| field | type | required/optional | enum | nullable | notes |
|---|---|---|---|---|---|
| contentType | enum | optional(default) | `TEXT`,`IMAGE`,`AUDIO`,`VIDEO` | no | defaults `TEXT` |
| text | string | optional |  | no | required if TEXT |
| media | object | optional |  | no | required if non-TEXT |

Validation refine: TEXT requires `text`; non-TEXT requires `media`.

### `PendingClientMessageResponseDto`
- Source file: `services/gateway-service/src/dto/conversation/inbox.dto.js`

| field | type | required/optional | enum | nullable | description |
|---|---|---|---|---|---|
| data | `MessageDto[]` | required |  | no | pending client messages for coach inbox |

### `conversation.dto.js` relevant structures
- Source files:
  - `services/gateway-service/src/dto/conversation/conversation.dto.js`
  - `services/conversation-service/src/dtos/conversation.dto.js`

Gateway `ConversationDto` fields:
| field | type | required/optional | enum | nullable | notes |
|---|---|---|---|---|---|
| id | string | required |  | no | conversation id |
| coachId | string | required |  | no | coach participant |
| clientId | string | required |  | no | client participant |
| channel | enum | required | `WHATSAPP`,`TELEGRAM`,`APP` | no | channel type |
| createdAt | string(datetime) | required |  | no | created time |
| updatedAt | string(datetime) | required |  | no | updated time |
| lastMessageAt | string(datetime) | required |  | yes | recency |

Conversation-service DTOs:
- `GetOrCreateConversationDto`: `coachId`, `clientId`, `channel`
- `GetConversationsByCoachDto`: `coachId`
- `GetConversationByIdDto`: `id`

## 3.5 Menu DTOs

### `ClientMenuCreateDto`, `ClientMenuUpdateDto`, `ClientMenuCreateFromTemplateDto`, `ClientMenuListQueryDto`
- Source file: `services/menu-service/src/dto/clientMenu.dto.js`

`ClientMenuCreateDto` fields:
- `name(min1)` required
- `type(string)` required
- `notes(nullable)?`
- `startDate?`, `endDate?`

`ClientMenuUpdateDto` fields (partial + nested ops):
- base: `name?`, `type?`, `notes?(nullable)`, `isActive?`, `startDate?(nullable)`, `endDate?(nullable)`
- meals: `mealsToAdd[]`, `mealsToUpdate[]`, `mealsToDelete[]`
- meal-options (top-level): `mealOptionsToAdd[]`, `mealOptionsToDelete[]`, `mealOptionsToUpdate[]`
- vitamins: `vitaminsToAdd[]`, `vitaminsToUpdate[]`, `vitaminsToDelete[]`

`ClientMenuCreateFromTemplateDto` fields:
- `templateMenuId` required
- `name?`
- `selectedOptions?[]` with `{ templateMealId, optionId }`

`ClientMenuListQueryDto` fields:
- `includeInactive?`, `clientId?`, `coachId?` (all strings)

### `ClientMenuCreateRequestDto`, `ClientMenuUpdateRequestDto`, `ClientMenuResponseDto`, `ClientMenuListResponseDto`
- Source file: `services/gateway-service/src/dto/menu/clientMenu.dto.js`

`ClientMenuCreateRequestDto`: same base create shape.

`ClientMenuUpdateRequestDto`: similar to service update, but nested operations are primarily under `mealsToUpdate[].optionsTo*` (no documented top-level `mealOptionsTo*` arrays).

`ClientMenuResponseDto` fields:
- root: `id`, `clientId`, `coachId`, `name`, `type`, `notes(nullable)`, `isActive`, `startDate(nullable)`, `endDate(nullable)`, `totalCalories`
- `meals[]`:
  - `id`, `name`, `notes(nullable)`, `totalCalories`, `selectedOptionId(nullable)`
  - `options[]`:
    - `id`, `name(nullable)`, `orderIndex`
    - `items[]`: `id`, `role`, `grams`, `foodItem{id,name,caloriesPer100g(nullable)}`
- `vitamins[]`: `id`, `vitaminId(nullable)`, `name`, `description(nullable)`, `notes(nullable)`

`ClientMenuListResponseDto`: `{ data: ClientMenuResponseDto[] }`.

## 3.6 Workout Program and Context DTOs

### `WorkoutProgramCreateRequestDto`, `WorkoutProgramUpdateRequestDto`, `WorkoutProgramResponseDto`
- Source files:
  - `services/workout-service/src/dto/workoutProgram.dto.js` (service)
  - `services/gateway-service/src/dto/workout.dto.js` (gateway)

Service `WorkoutProgramCreateRequestDto`:
- required: `name(min2)`, `clientId`, `coachId`
- optional: `templateId`, `exercises[]` (defaults `[]`)

Gateway `WorkoutProgramCreateRequestDto`:
- required: `name(min2)`, `clientId`, `coachId`
- optional: `templateId`
- no `exercises[]` in gateway DTO

`WorkoutProgramUpdateRequestDto` (both layers):
- `name?`
- `exercisesToAdd?[]` (`exerciseId`, `sets`, `reps`, `weight?`, `rest?`, `order`, `notes?`)
- `exercisesToUpdate?[]` (`id` + partial fields)
- `exercisesToDelete?[]` (`id`)

`WorkoutProgramResponseDto`:
- root: `id`, `name`, `clientId`, `coachId`, `templateId?(nullable)`, `createdAt`, `updatedAt`
- exercises[]:
  - service DTO: no nested `exercise` object guaranteed
  - gateway DTO: includes nested `exercise{ id, name, muscleGroup }`

### `getWorkoutPrograms.dto.js` structures
- Source file: `services/mcp-service/src/dtos/tools/workout/getWorkoutPrograms.dto.js`

`GetWorkoutProgramsToolInputDto`:
- `includeExercises?: boolean` (default `true`)

`WorkoutProgramResponseDto` in this file:
- `id,name,clientId,coachId,templateId?,createdAt,updatedAt`
- `exercises[]` with `id,programId,exerciseId,sets,reps,weight,rest,order,notes,createdAt,updatedAt,exercise{id,name,muscleGroup}`

`GetWorkoutProgramsToolOutputDto`:
- `data: WorkoutProgramResponseDto[]`
- optional `summaries[]`: `{id,name,exerciseCount,muscleGroups[]}`

### `getWorkoutContext.dto.js` structures
- Source file: `services/mcp-service/src/dtos/tools/workout/getWorkoutContext.dto.js`

`GetWorkoutContextToolInputDto`:
- `programId?: string(min1)`

`GetWorkoutContextToolOutputDto`:
| field | type | required/optional | enum | nullable | notes |
|---|---|---|---|---|---|
| currentProgram | object | required |  | yes | selected program |
| workoutDay | string | required |  | yes | day/program name |
| exerciseList | array | required |  | no | normalized exercise items |
| completionStatus | enum | required | `UNKNOWN`,`NOT_REPORTED`,`PARTIAL`,`DONE` | no | completion state |
| notes | string[] | required |  | no | advisory notes |
| substitutions | array | required |  | no | substitutions list |
| progressionContext | object | required |  | no | progression hints |

## 3.7 Cross-Layer Near-Identical DTO Comparisons

1. `MealLogCreateDto` vs `MealLogCreateRequestDto`
- Same business fields.
- Difference: request DTO is gateway contract; service DTO is internal strict parser.
- Response difference: gateway wraps in `{ data }`, service returns object (often with extra `message`).

2. `WorkoutLogCreateDto` vs `WorkoutLogCreateRequestDto`
- Same payload semantics.
- Patch endpoint docs reference `WorkoutExerciseUpdateDto` (id+exerciseName+weight), but tracking controller patch actually parses only `{ weight }`.

3. `userResponseDto` (idm) vs `UserResponseDto` (gateway)
- Almost identical fields/enums.
- Gateway acts as forwarding/public contract; idm is service validation model.

4. `ClientMenuCreateDto` vs `ClientMenuCreateRequestDto`
- Same shape for core create.
- `ClientMenuCreateFromTemplateDto` (service) does not require `clientId` (from identity headers), while gateway `ClientMenuCreateFromTemplateRequestDto` requires `clientId` in request body.

5. `WorkoutProgramCreateRequestDto` (gateway) vs same name in workout-service
- Gateway DTO omits `exercises[]`.
- Service DTO supports optional `exercises[]` and defaults to `[]`.

6. `ConversationStatePatchDto` vs `PendingActionToolInputDto`
- Structurally identical in code.
- Different usage intent: generic patch vs LLM tool input shape.

7. `ClientMenuListResponseDto` documented vs runtime service response
- DTO/docs/SDK describe full nested menu object list.
- Actual list service selects summary fields only (`id,name,type,isActive,totalCalories,startDate,endDate`).

# 4. Enums and State Machines
| Enum / State | Where it appears | Values | Product meaning | UI implications |
|---|---|---|---|---|
| `DayType` | day selection, meal logs, daily state, menu type | `TRAINING`, `REST` | determines calorie target/menu context | prominent day switcher; day-type-required blocking states |
| `EffortLevel` | workout logs | `EASY`, `NORMAL`, `HARD`, `FAILED`, `SKIPPED` | workout completion intensity | effort chips/dropdown, progress semantics |
| `ConversationChannel` | conversation DTO/model | `WHATSAPP`, `TELEGRAM`, `APP` | transport channel | show channel badge/icon; app channel is future-facing |
| `MessageSender` | message DTO/model | `CLIENT`, `COACH`, `AI` | message origin | bubble styling and attribution |
| `MessageContentType` | message DTO/requests/webhook | `TEXT`, `IMAGE`, `AUDIO`, `VIDEO` | content rendering mode | media cards/audio/video players + fallback text |
| `AIDecision` | message model + mcp result | `AUTO_REPLY`, `COACH_REPLY` | if AI answers directly or escalates | show waiting-for-coach state; escalation labels |
| `MessageHandledBy` | message DTO/mark handled | `AI`, `COACH` | who resolved the client message | badge in thread/inbox; audit timeline |
| `McpResultDto.decision` | MCP client run result | `AUTO_REPLY`, `COACH_REPLY` | assistant output gate | auto-send vs coach handoff flow |
| `CoachMcpResultDto.status` | coach assistant response | `ok`, `clarification_required`, `out_of_scope`, `escalation_required`, `error` | execution lifecycle | explicit status UIs for assistant panel |
| `ShouldCoachReplyResult.decision` | should-coach-reply tool | `AUTO_REPLY`, `COACH_REPLY` | safety/risk governance | controlled escalation UX |
| `ConversationState.awaiting_missing_fields.actionType` | conversation memory | `report_meal`, `update_meal`, `report_workout`, `update_workout`, `update_workout_exercise` | pending structured form completion | draft-resume flow, multi-step capture UI |
| `ConversationState.last_workout_context.completionStatus` | workout context memory | `UNKNOWN`, `NOT_REPORTED`, `PARTIAL`, `DONE` | inferred workout completion status | status tags in workout assistant |
| `Meal candidate source` | report meal + memory | `MENU_MATCH`, `ESTIMATE`, `USER_PROVIDED` | provenance/confidence for nutrition data | confidence badges + warning microcopy |
| `Metrics updateMode` | upsert metrics tool | `ABSOLUTE`, `DELTA` | overwrite totals vs incremental addition | quick-add controls vs full edit form |
| `Coach clarification type` | coach session state | `client_selection` | ambiguous client resolution | selection modal/list required before action |

State-machine highlights:
1. Client incoming message -> MCP run -> `AUTO_REPLY` or `COACH_REPLY`.
2. If pending structured action, conversation state stores draft (`pending_*`) until confirmation/required fields complete.
3. Day type missing can block meal logging/menu-context and triggers clarification (`awaiting_day_type`).
4. Coach assistant can return `clarification_required` when client context is ambiguous.

# 5. Real JSON Examples
## user/client
```json
{
  "id": "5f36db2e-0db9-4f74-b10e-5c8eaa8f29d3",
  "email": "noa.levi@example.com",
  "firstName": "Noa",
  "lastName": "Levi",
  "phone": "+972541112233",
  "status": "active",
  "role": "client",
  "createdAt": "2026-02-20T09:12:44.102Z",
  "updatedAt": "2026-03-18T10:30:21.501Z"
}
```

## daily state
```json
{
  "data": {
    "dayType": "TRAINING",
    "calorieTargets": {
      "trainingDay": 2350,
      "restDay": 1950
    },
    "activeCaloriesAllowed": 2350,
    "consumedCalories": 1480,
    "remainingCalories": 870,
    "meals": [
      {
        "id": "cmeallog_001",
        "clientId": "5f36db2e-0db9-4f74-b10e-5c8eaa8f29d3",
        "date": "2026-03-18T08:12:00.000Z",
        "dayType": "TRAINING",
        "calories": 620,
        "protein": 42,
        "carbs": 55,
        "fat": 22,
        "description": "Greek yogurt bowl + granola",
        "matchedMenuItemId": "cmenuitem_breakfast_1",
        "loggedAt": "2026-03-18T08:13:02.000Z"
      },
      {
        "id": "cmeallog_002",
        "clientId": "5f36db2e-0db9-4f74-b10e-5c8eaa8f29d3",
        "date": "2026-03-18T13:05:00.000Z",
        "dayType": "TRAINING",
        "calories": 860,
        "protein": 58,
        "carbs": 84,
        "fat": 31,
        "description": "Chicken rice plate",
        "matchedMenuItemId": "cmenuitem_lunch_2",
        "loggedAt": "2026-03-18T13:06:12.000Z"
      }
    ],
    "workouts": [
      {
        "id": "cworklog_010",
        "clientId": "5f36db2e-0db9-4f74-b10e-5c8eaa8f29d3",
        "date": "2026-03-18T17:00:00.000Z",
        "workoutType": "Upper A",
        "effortLevel": "NORMAL",
        "notes": "Good session",
        "loggedAt": "2026-03-18T18:02:10.000Z",
        "exercises": [
          {
            "id": "cwex_100",
            "workoutLogId": "cworklog_010",
            "exerciseName": "Bench Press",
            "weight": 62.5
          }
        ]
      }
    ],
    "weight": {
      "id": "cw_300",
      "clientId": "5f36db2e-0db9-4f74-b10e-5c8eaa8f29d3",
      "date": "2026-03-18T06:50:00.000Z",
      "weightKg": 78.4,
      "notes": null,
      "loggedAt": "2026-03-18T06:51:00.000Z"
    },
    "metrics": {
      "id": "cm_700",
      "clientId": "5f36db2e-0db9-4f74-b10e-5c8eaa8f29d3",
      "date": "2026-03-18T00:00:00.000Z",
      "steps": 9200,
      "waterLiters": 2.1,
      "sleepHours": 7.3,
      "notes": "Slept late",
      "updatedAt": "2026-03-18T14:09:02.000Z"
    }
  }
}
```

## meal log
```json
{
  "data": {
    "id": "cmeallog_002",
    "clientId": "5f36db2e-0db9-4f74-b10e-5c8eaa8f29d3",
    "date": "2026-03-18T13:05:00.000Z",
    "dayType": "TRAINING",
    "calories": 860,
    "protein": 58,
    "carbs": 84,
    "fat": 31,
    "description": "Chicken rice plate",
    "matchedMenuItemId": "cmenuitem_lunch_2",
    "loggedAt": "2026-03-18T13:06:12.000Z"
  }
}
```

## workout log
```json
{
  "data": {
    "id": "cworklog_010",
    "clientId": "5f36db2e-0db9-4f74-b10e-5c8eaa8f29d3",
    "date": "2026-03-18T17:00:00.000Z",
    "workoutType": "Upper A",
    "effortLevel": "NORMAL",
    "notes": "Good session",
    "loggedAt": "2026-03-18T18:02:10.000Z",
    "exercises": [
      {
        "id": "cwex_100",
        "workoutLogId": "cworklog_010",
        "exerciseName": "Bench Press",
        "weight": 62.5
      },
      {
        "id": "cwex_101",
        "workoutLogId": "cworklog_010",
        "exerciseName": "Lat Pulldown",
        "weight": 55
      }
    ]
  }
}
```

## workout program
```json
{
  "id": "cprog_77",
  "name": "Upper / Lower 4-day",
  "clientId": "5f36db2e-0db9-4f74-b10e-5c8eaa8f29d3",
  "coachId": "8a1d9f04-5b89-43a9-b9c6-c0a9f6fcd201",
  "templateId": "ctmpl_3",
  "createdAt": "2026-03-05T09:20:00.000Z",
  "updatedAt": "2026-03-17T11:42:00.000Z",
  "exercises": [
    {
      "id": "cpex_1",
      "programId": "cprog_77",
      "exerciseId": "cex_bench",
      "sets": 4,
      "reps": "8-10",
      "weight": 62.5,
      "rest": 120,
      "order": 0,
      "notes": null,
      "createdAt": "2026-03-05T09:21:00.000Z",
      "updatedAt": "2026-03-17T11:42:00.000Z",
      "exercise": {
        "id": "cex_bench",
        "name": "Bench Press",
        "muscleGroup": "CHEST"
      }
    }
  ]
}
```

## menu
```json
{
  "id": "cmenu_44",
  "clientId": "5f36db2e-0db9-4f74-b10e-5c8eaa8f29d3",
  "coachId": "8a1d9f04-5b89-43a9-b9c6-c0a9f6fcd201",
  "name": "Training Day Menu",
  "type": "TRAINING",
  "notes": "Higher carbs pre/post workout",
  "isActive": true,
  "startDate": "2026-03-01T00:00:00.000Z",
  "endDate": null,
  "totalCalories": 2350,
  "meals": [
    {
      "id": "cmeal_1",
      "name": "Lunch",
      "notes": null,
      "totalCalories": 780,
      "selectedOptionId": "copt_11",
      "options": [
        {
          "id": "copt_11",
          "name": "Chicken Bowl",
          "orderIndex": 0,
          "items": [
            {
              "id": "citem_500",
              "role": "PROTEIN",
              "grams": 180,
              "foodItem": {
                "id": "food_chicken",
                "name": "Chicken Breast",
                "caloriesPer100g": 165
              }
            }
          ]
        }
      ]
    }
  ],
  "vitamins": [
    {
      "id": "cv_90",
      "vitaminId": "vmag",
      "name": "Magnesium",
      "description": "Evening",
      "notes": "After dinner"
    }
  ]
}
```

## metrics log
```json
{
  "id": "cm_700",
  "clientId": "5f36db2e-0db9-4f74-b10e-5c8eaa8f29d3",
  "date": "2026-03-18T00:00:00.000Z",
  "steps": 9200,
  "waterLiters": 2.1,
  "sleepHours": 7.3,
  "notes": "Slept late",
  "updatedAt": "2026-03-18T14:09:02.000Z"
}
```

## weight log
```json
{
  "data": {
    "id": "cw_300",
    "clientId": "5f36db2e-0db9-4f74-b10e-5c8eaa8f29d3",
    "date": "2026-03-18T06:50:00.000Z",
    "weightKg": 78.4,
    "notes": null,
    "loggedAt": "2026-03-18T06:51:00.000Z"
  }
}
```

## conversation state
```json
{
  "pending_meal_candidate": null,
  "pending_meal_update": null,
  "pending_workout_candidate": {
    "workoutType": "Upper A",
    "effortLevel": "NORMAL",
    "exercises": [
      {
        "exerciseName": "Bench Press",
        "weight": 62.5
      },
      {
        "exerciseName": "Lat Pulldown",
        "weight": 55
      }
    ],
    "notes": "Good session",
    "durationMin": 58,
    "intensity": "MEDIUM",
    "performedAsPlanned": true,
    "caloriesBurnEstimate": 420
  },
  "pending_workout_update": null,
  "awaiting_day_type": false,
  "awaiting_missing_fields": {
    "actionType": "report_workout",
    "missingFields": [
      "exerciseWeights"
    ],
    "draftPayload": {
      "workoutType": "Upper A"
    }
  },
  "last_menu_check": {
    "dayType": "TRAINING",
    "inMenu": true,
    "likelyMatch": "Chicken Bowl",
    "mismatchReason": null,
    "queryFoodText": "chicken rice"
  },
  "last_calorie_estimate": {
    "queryFoodText": "protein bar",
    "estimatedCalories": 210,
    "portionAssumption": "1 bar",
    "confidence": 0.72,
    "inMenu": false,
    "outsideMenu": true
  },
  "last_workout_context": {
    "programId": "cprog_77",
    "programName": "Upper / Lower 4-day",
    "workoutDay": "Upper A",
    "completionStatus": "NOT_REPORTED",
    "exerciseCount": 5,
    "expectedExercises": [
      "Bench Press",
      "Lat Pulldown"
    ],
    "availablePrograms": [
      {
        "id": "cprog_77",
        "name": "Upper / Lower 4-day"
      }
    ]
  },
  "resolved_day_type": {
    "dayType": "TRAINING",
    "source": "TOOL_DAILY_STATE",
    "capturedAt": "2026-03-18T10:11:12.000Z"
  },
  "updatedAt": "2026-03-18T10:15:00.000Z"
}
```

## pending coach reply item
```json
{
  "data": [
    {
      "id": "cmsg_982",
      "conversationId": "cconv_200",
      "sender": "CLIENT",
      "contentType": "TEXT",
      "text": "יש לי כאב חד בברך אחרי הסקוואט",
      "mediaUrl": null,
      "mediaMimeType": null,
      "mediaDurationSec": null,
      "mediaThumbnail": null,
      "sourceMessageId": "tg_889100",
      "autoGenerated": false,
      "aiDecision": "COACH_REPLY",
      "aiSuggestedReply": "תודה ששיתפת, המאמן יחזור אליך אישית.",
      "handledAt": null,
      "handledBy": null,
      "createdAt": "2026-03-18T12:21:02.000Z",
      "updatedAt": "2026-03-18T12:21:02.000Z"
    }
  ]
}
```

## assistant MCP result
```json
{
  "decision": "COACH_REPLY",
  "replyText": null,
  "coachSuggestedReply": "תודה ששיתפת. כדי לשמור עליך בטוח, המאמן יחזור אליך עם הנחיה מדויקת.",
  "usedTools": [
    "get_daily_state",
    "should_coach_reply"
  ]
}
```

# 6. Screen-Oriented Data Mapping
| Screen | Main data sources / DTOs | Primary actions | Secondary actions | Empty states | Error / escalation states | Notes for design |
|---|---|---|---|---|---|---|
| Home / Today | `DailyStateResponseDto`, `DaySelectionResponseDto` | fetch daily state, set day type | refresh, jump to meal/workout logging | no day type, no logs today | missing day type prompt, no active menu target | Make day type + remaining calories top-level |
| Nutrition | `ClientMenuListResponseDto`, `ClientMenuResponseDto`, `MealLogResponseDto` | view active menu, log meal | ask calories, update meal log | no active menu, no meals | dayType missing; menu mismatch/outside-menu warnings | Show source/confidence for assistant-estimated meals |
| Meal detail / edit | `MealLogResponseDto`, `MealLogUpdateRequestDto` | edit meal values | relink menu item, adjust day type | meal not found | update validation failure | Keep quick-edit macros + descriptive note field |
| Workout | `WorkoutProgramResponseDto`, `WorkoutLogResponseDto`, `DailyStateResponseDto` | view assigned program, report workout | update workout header/exercises | no program assigned | report requires missing fields (assistant flow) | Distinguish planned vs performed contexts |
| Exercise detail / edit | workout exercise items + patch endpoint | update exercise weight | rename (UI optional; backend support inconsistent on patch) | no exercise rows | patch rejects unsupported fields | Design primarily for weight update to match backend reality |
| Progress / Metrics | `DailyStateResponseDto`, `MetricsLogResponseDto` | upsert steps/water/sleep | day/range filters | no metrics data | date parsing/type inconsistencies | Show "today totals" and trend cards from range state |
| Weight tracking | `WeightLogResponseDto` | create weight log | edit latest weight | no weight logs | update may require `weightKg` despite optional docs | Favor append-first UX with latest editable card |
| Assistant chat | `RunMcpDto`/`McpResultDto` (internal), `ConversationStateDto` | ask assistant, run guided flows | calorie check, guided workout report | no previous messages | `COACH_REPLY` escalation handoff | Include explicit "coach will reply" states |
| Coach inbox / replies (client-side view) | `MessageDto` (`aiDecision`, `handledBy`) | read thread updates | mark read locally | no replies yet | escalation pending | Client cannot call coach inbox endpoint; render from conversation messages |
| Profile | `UserResponseDto`, `UserInfoResponseDto` | update profile info | avatar, city/address updates | missing profile info | unauthorized/ownership concerns | Keep editable fields aligned with upsert DTO |
| Notifications | message timeline + future notification center | open relevant thread/log | dismiss local items | no notifications | failed fetch | Backend notification-center entity currently missing |
| Community feed (future) | missing contracts (proposed in section 9) | browse posts | react/comment/share | no posts | moderation/flag states | Plan as phase-2 backend extension |
| Stories bar (future) | missing contracts (proposed in section 9) | view story sequence | reply/react | no active stories | media load failures | Requires media + expiry contracts |

# 7. Action Inventory for the Trainee App
## Read-only actions
| Action name | Trigger source | Backend endpoint or MCP tool | Input DTO | Output DTO | Side effects | Blocking constraints | Coach escalation possibility |
|---|---|---|---|---|---|---|---|
| Get my daily state | Home/Today refresh | `GET /api/tracking/daily-state` | query optional `clientId` (coach only) | `DailyStateResponseDto` | none | for coach context, `clientId` required | via assistant if unresolved context |
| Get daily state range | Progress date range | `GET /api/tracking/daily-state/range` | query `startDate,endDate` | `DailyStateResponseDto[]` | none | date query required | no direct |
| Get client menus list | Nutrition | `GET /api/client-menus` | `ClientMenuListQueryDto` | documented `ClientMenuListResponseDto` | none | ownership; clientId auto-injected for clients | no direct |
| Get client menu details | Nutrition -> menu detail | `GET /api/client-menus/:id` | path id | `ClientMenuResponseDto` | none | ownership required | no direct |
| Get workout programs (self) | Workout tab | `GET /api/workout/:clientId/workout-programs` | path `clientId` | `WorkoutProgramResponseDto[]` | none | ownership required | no direct |
| Get workout program by id | Workout detail | `GET /api/workout/:clientId/workout-programs/:programId` | path params | `WorkoutProgramResponseDto` | none | ownership required | no direct |
| Get exercises/templates catalog | Workout browse | `GET /api/workout/exercises`, `GET /api/workout/templates` | none | `ExerciseResponseDto[]`, `WorkoutTemplateResponseDto[]` | none | auth required | no direct |
| Get conversation by id | Chat entry | `GET /api/conversations/:id` | path id | `ConversationResponseDto` | none | no client list endpoint; id must be known | escalation shown by message state |
| Get conversation messages | Chat thread | `GET /api/conversations/:id/messages` | path id | `MessageListResponseDto` | none | ownership required | yes (if messages marked `COACH_REPLY`) |
| Get profile info | Profile | `GET /api/users/:id/info` | path id | `UserInfoResponseDto` | none | auth required; verify ownership policy | no direct |

## Write actions
| Action name | Trigger source | Backend endpoint or MCP tool | Input DTO | Output DTO | Side effects | Blocking constraints | Coach escalation possibility |
|---|---|---|---|---|---|---|---|
| Set day type | Home quick action | `POST /api/tracking/day-selection` | `DaySelectionCreateRequestDto` | `DaySelectionResponseDto` | upsert `DaySelection` for date | dayType required | indirectly (assistant asks if missing) |
| Log meal | Nutrition quick log | `POST /api/tracking/meal-log` | `MealLogCreateRequestDto` | `MealLogResponseDto` | creates meal row | dayType required | yes via assistant if uncertain |
| Update meal | Meal detail edit | `PUT /api/tracking/meal-log/:logId` | `MealLogUpdateRequestDto` | `MealLogResponseDto` | updates existing meal row | at least one meaningful field expected | yes via assistant governance |
| Log workout | Workout report | `POST /api/tracking/workout-log` | `WorkoutLogCreateRequestDto` | `WorkoutLogResponseDto` | creates workout + exercise rows | exercises array required | yes on tool failures |
| Update workout | Workout edit | `PUT /api/tracking/workout-log/:logId` | `WorkoutLogUpdateRequestDto` | `WorkoutLogResponseDto` | updates workout + child exercises | exercise ids needed for child updates | yes |
| Update workout exercise | Exercise row edit | `PATCH /api/tracking/workout-log/exercise/:exerciseLogId` | documented `WorkoutExerciseUpdateDto` but controller expects `weight` only | runtime returns updated exercise | updates one exercise row | payload/schema mismatch in current stack | yes |
| Log weight | Weight tab | `POST /api/tracking/weight-log` | `WeightLogCreateRequestDto` | `WeightLogResponseDto` | creates weight row | weight required | no direct |
| Update weight | Weight edit | `PUT /api/tracking/weight-log/:logId` | documented `WeightLogUpdateRequestDto` | `WeightLogResponseDto` | updates row | controller currently parses create DTO (likely requires `weightKg`) | no direct |
| Upsert metrics | Progress quick actions | `POST /api/tracking/metrics-log` | `MetricsLogCreateDto` / tool `UpsertMetricsToolDto` | `MetricsLogResponseDto` | create-or-update daily metrics | day key uniqueness by date | no direct |
| Update profile | Profile form | `PUT /api/users/:id/info` | `UpsertUserInfoRequestDto` | `UpsertUserInfoResponseDto` | upserts profile info | at least one field required | no direct |

## Assistant-only actions
| Action name | Trigger source | Backend endpoint or MCP tool | Input DTO | Output DTO | Side effects | Blocking constraints | Coach escalation possibility |
|---|---|---|---|---|---|---|---|
| Run trainee MCP | assistant pipeline/internal | `POST /internal/mcp/run` | `RunMcpDto` | `McpResultDto` | may call tools + mutate logs/state | internal token + trusted actor headers | primary mechanism (`COACH_REPLY`) |
| Get daily state tool | assistant | `get_daily_state` | none | `DailyStateToolDto` | none | context required | used for escalation decisions |
| Ask calories tool | assistant | `ask_calories` | `AskCalories` args | `AskCaloriesResultDto` | none | requires daily state context for full result | no direct |
| Report meal tool | assistant | `report_meal` | `ReportMealInputDto` | `ReportMealResponseDto` | meal log create | dayType must align with daily state | yes on failure/uncertainty |
| Update meal tool | assistant | `update_meal` | `UpdateMealInputDto` | `UpdateMealResponseDto` | meal update | requires `logId` | yes |
| Get workout programs tool | assistant | `get_workout_programs` | `GetWorkoutProgramsToolInputDto` | `GetWorkoutProgramsToolOutputDto` | none | `context.clientId` required | no direct |
| Get workout context tool | assistant | `get_workout_context` | `GetWorkoutContextToolInputDto` | `GetWorkoutContextToolOutputDto` | none | fails if no programs | yes |
| Report workout tool | assistant | `report_workout` | `ReportWorkoutToolInputDto` | `ReportWorkoutToolOutputDto` | workout log create | required fields + exercise weights flow | yes |
| Update workout tool | assistant | `update_workout` | `UpdateWorkoutToolInputDto` | `UpdateWorkoutToolOutputDto` | workout update | needs at least one changed field | yes |
| Update workout exercise tool | assistant | `update_workout_exercise` | `UpdateWorkoutExerciseToolInputDto` | `UpdateWorkoutExerciseToolOutputDto` | patch exercise row | backend currently effectively weight-only | yes |
| Should coach reply tool | assistant governance | `should_coach_reply` | `ShouldCoachReplyInputDto` | `ShouldCoachReplyResultDto` | none | none | direct |
| Set conversation state tool | assistant memory | `set_conversation_state` | `PendingActionToolInputDto` | `{success,state}` | state-store patch | internal only | indirect |

## Escalation-related actions
| Action name | Trigger source | Backend endpoint or MCP tool | Input DTO | Output DTO | Side effects | Blocking constraints | Coach escalation possibility |
|---|---|---|---|---|---|---|---|
| AI decision to coach | MCP runtime | `McpResultDto.decision=COACH_REPLY` | `RunMcpDto` | `McpResultDto` | stops auto-reply | triggered on risk/uncertainty/tool failure | yes (explicit) |
| Create pending inbox item | conversation triage | message update (`aiDecision`) | internal triage input | `MessageDto` | marks message triage result | inbox query expects `handledAt=null` | yes |
| Fetch pending inbox (coach) | coach dashboard | `GET /api/inbox/pending` | none | `PendingClientMessageResponseDto` | none | coach-only | yes |
| Coach sends reply | coach action | `POST /api/conversations/:id/messages` | `SendCoachMessageRequestDto` | `MessageResponseDto` | outbound message dispatch | coach-only + ownership | closes escalation thread |
| Mark message handled | coach action | `POST /api/messages/:id/handled` | `{handledBy}` | `MessageResponseDto` | sets `handledAt`,`handledBy` | ownership; enum required | yes |

# 8. Design-Critical Constraints
1. Client ownership is enforced for most tracking/menu/workout/chat routes; the app must always operate in self-context unless coach mode is explicitly active.
2. There are no delete endpoints for meal logs, workout logs, or weight logs in gateway tracking routes; UX should focus on edit/correct, not destructive removal.
3. Client cannot create/update/delete workout programs or client menus; those are coach-administered domains (client reads assigned content).
4. Day type (`TRAINING`/`REST`) materially changes calorie target and menu context; unresolved day type causes assistant clarification flows.
5. Metrics and day selection behave as upsert-per-date in service logic, so repeated writes update same day rather than create duplicates.
6. Assistant conversation memory is persisted with TTL (redis/memory backend), so unfinished multi-step flows can resume but eventually expire.
7. Assistant write tools can escalate to coach on tool failures, uncertainty, safety signals, or step-limit exhaustion.
8. `PATCH /tracking/workout-log/exercise/:exerciseLogId` is documented with full exercise object but controller currently parses weight-only; design patch UI around weight edit first.
9. `PUT /tracking/weight-log/:logId` is documented as partial update, but tracking controller parses create DTO; practical UX should send `weightKg` on update.
10. Menu list contract mismatch: documented/SDK list item is full nested menu, but service list currently returns summary fields only.
11. Metrics date fields in generated SDK become loose object types (`{[key:string]:unknown}`) because gateway DTO uses `z.date`; mobile typing layer should normalize to ISO strings.
12. Meal history endpoint in tracking service applies ~30-day window internally; if historical depth is needed, rely on daily-state range or add dedicated client history contract.
13. Conversation API currently lacks a client-facing "create/send client message" endpoint; trainee app messaging write path is missing in public API.
14. Conversation list endpoint is coach-only; client can fetch a conversation only if it already has conversation id.
15. In triage flow, code sets `handledAt/handledBy=AI` when updating client message after AI decision; this conflicts with inbox query logic that expects pending coach-reply items to have `handledAt=null`.
16. Server-side day boundaries use server timezone (`startOfDay/endOfDay`), so cross-timezone trainees may see day cutoff differences unless standardized.

# 9. Missing Pieces / Gaps for Design
| Missing area | Proposed entity names | Suggested core fields | MVP or phase 2 |
|---|---|---|---|
| stories | `Story`, `StorySlide`, `StoryView` | `id`, `authorId`, `mediaType`, `mediaUrl`, `caption`, `createdAt`, `expiresAt`, `visibility`, `viewerCount` | Phase 2 |
| community posts | `CommunityPost` | `id`, `authorId`, `text`, `media[]`, `tags[]`, `createdAt`, `editedAt`, `visibility`, `status` | MVP-lite if community is launch-critical; otherwise phase 2 |
| reactions | `PostReaction`, `CommentReaction`, `StoryReaction` | `id`, `userId`, `targetType`, `targetId`, `reactionType`, `createdAt` | Phase 2 |
| comments | `PostComment`, `CommentThread` | `id`, `postId`, `authorId`, `text`, `parentCommentId`, `createdAt`, `editedAt`, `status` | Phase 2 |
| social feed | `FeedItem`, `FeedCursor` | `id`, `type`, `actorId`, `targetId`, `rankScore`, `createdAt`, `reason`, pagination cursor fields | MVP if feed is central, otherwise phase 2 |
| media attachments | `MediaAsset`, `UploadSession` | `id`, `ownerId`, `mimeType`, `url`, `thumbnailUrl`, `durationSec`, `sizeBytes`, `processingStatus`, `createdAt` | MVP (foundational for stories/posts) |
| profile badges | `Badge`, `UserBadge` | `id`, `name`, `icon`, `criteria`, `awardedAt`, `sourceEvent` | Phase 2 |
| streaks / achievements | `Streak`, `Achievement`, `UserAchievementEvent` | `id`, `userId`, `metricType`, `currentCount`, `bestCount`, `lastQualifiedAt`, achievement thresholds | MVP for retention if desired |
| push notification center | `Notification`, `NotificationPreference`, `NotificationDelivery` | `id`, `userId`, `type`, `title`, `body`, `deepLink`, `status(read/archived)`, `sentAt`, `readAt`, channel prefs | MVP |

Recommended sequencing for social extensions:
1. `MediaAsset` + `Notification` foundation first.
2. `CommunityPost` + `PostComment` + `PostReaction`.
3. `Story` + views/reactions.
4. badges/achievements optimization layer.

# 10. Figma Handoff Summary
- top-level app information architecture:
  - Today (daily state)
  - Nutrition (menu + meal logging)
  - Workout (program + workout reporting)
  - Progress (metrics + weight)
  - Chat (assistant + coach thread)
  - Profile
- recommended navigation structure:
  - bottom tabs: `Today`, `Nutrition`, `Workout`, `Progress`, `Chat`
  - profile/settings reachable from top-right avatar on every tab
- primary reusable components implied by DTOs:
  - day-type segmented control (`TRAINING`/`REST`)
  - calorie budget card (target/consumed/remaining)
  - meal log card with macro rows + source badge
  - workout log card + effort chip
  - metrics quick-input module (steps/water/sleep)
  - conversation bubble set by `sender` + `contentType`
  - escalation banner (`COACH_REPLY`, pending states)
- dynamic content patterns:
  - wrapper responses with `data` payload
  - nullable-heavy fields requiring graceful placeholder content
  - list/detail mismatch risks (menus, workout program nested data)
- critical states designers must cover:
  - missing day type
  - no active menu for selected day type
  - no assigned workout program
  - partial assistant draft flow (awaiting missing fields)
  - coach escalation pending
  - validation errors on updates (weight patch/update mismatches)
- what should be designed first:
  1. Today + Nutrition logging loop (highest daily usage)
  2. Workout report/edit loop (with assistant-guided completion)
  3. Chat + escalation states
  4. Progress/metrics and profile

## Recommended files to send to design/figma planning
- `services/gateway-service/src/dto/tracking.dto.js`
- `services/gateway-service/src/dto/menu/clientMenu.dto.js`
- `services/gateway-service/src/dto/workout.dto.js`
- `services/gateway-service/src/dto/conversation/message.dto.js`
- `services/gateway-service/src/dto/conversation/message.requests.dto.js`
- `services/gateway-service/src/dto/conversation/conversation.dto.js`
- `services/gateway-service/src/dto/conversation/inbox.dto.js`
- `services/gateway-service/src/dto/idm.dto.js`
- `services/client-tracking-service/src/dto/daySelection.dto.js`
- `services/client-tracking-service/src/dto/mealLog.dto.js`
- `services/client-tracking-service/src/dto/workoutLog.dto.js`
- `services/client-tracking-service/src/dto/metricsLog.dto.js`
- `services/client-tracking-service/src/dto/weightLog.dto.js`
- `services/client-tracking-service/src/dto/dailyState.dto.js`
- `services/menu-service/src/dto/clientMenu.dto.js`
- `services/workout-service/src/dto/workoutProgram.dto.js`
- `services/mcp-service/src/dtos/runMcp.dto.js`
- `services/mcp-service/src/dtos/mcpResult.dto.js`
- `services/mcp-service/src/dtos/runCoachMcp.dto.js`
- `services/mcp-service/src/dtos/coachSessionState.dto.js`
- `services/mcp-service/src/dtos/coachResult.dto.js`
- `services/mcp-service/src/dtos/conversationState.dto.js`
- `services/mcp-service/src/dtos/tools/menu-meal/reportMeal.dto.js`
- `services/mcp-service/src/dtos/tools/menu-meal/updateMeal.dto.js`
- `services/mcp-service/src/dtos/tools/workout/reportWorkout.dto.js`
- `services/mcp-service/src/dtos/tools/workout/updateWorkout.dto.js`
- `services/mcp-service/src/dtos/tools/workout/getWorkoutPrograms.dto.js`
- `services/mcp-service/src/dtos/tools/workout/getWorkoutContext.dto.js`
- `services/mcp-service/src/dtos/tools/DailyState/dailyState.dto.js`
- `services/mcp-service/src/dtos/tools/shouldCoachReply.dto.js`
