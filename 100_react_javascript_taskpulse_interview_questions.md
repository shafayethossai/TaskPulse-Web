# 100 Junior Software Engineer Interview Questions & Answers
> **Coverage:** JavaScript Fundamentals & Internals, Modern React & Hooks, React Router v6, State Management & Context, Axios & REST APIs, Vite & Tailwind CSS, Performance & Accessibility, and TaskPulse Architecture.

---

## Section 1: JavaScript Fundamentals & Data Structures (Q1–Q15)

**1. What is the difference between a function declaration (statement) and a function expression?**
* **Answer:** A function declaration (`function print() {}`) is fully hoisted with its body and can be called before the line where it is written. A function expression (`const log = function() {}` or arrow function) behaves like a variable—calling it before initialization throws `TypeError` (with `var`) or `ReferenceError` (with `let`/`const`).

**2. What is the difference between a parameter and an argument?**
* **Answer:** A **parameter** is the placeholder variable listed in the function definition (`function add(a, b)`), whereas an **argument** is the actual value passed when calling the function (`add(4, 5)`).

**3. What is a first-class function and a callback function?**
* **Answer:** First-class functions mean JavaScript treats functions like any other value—they can be stored in variables, passed as arguments, and returned from other functions. A callback function is a function passed as an argument to another function to be executed later (e.g., `setTimeout(cb, 1000)` or `tasks.map(cb)`).

**4. Explain pass-by-value vs pass-by-reference in JavaScript.**
* **Answer:** Primitives (`number`, `string`, `boolean`, `null`, `undefined`, `symbol`, `bigint`) are copied by **value**—modifying them inside a function does not affect the outer variable. Objects and arrays are copied by **reference** (memory address)—mutating a property inside a function changes the original object outside.

**5. What is the difference between `==` and `===`?**
* **Answer:** `==` (loose equality) performs automatic type coercion before comparing (`"5" == 5` is `true`, `0 == ""` is `true`). `===` (strict equality) checks both value and data type without coercion (`"5" === 5` is `false`). Always use `===` in React.

**6. List all falsy values in JavaScript and explain the JSX `&&` trap.**
* **Answer:** The 6 falsy values are `false`, `0` (`-0`, `0n`), `""`, `null`, `undefined`, and `NaN`. Everything else (including `[]` and `{}`) is truthy. **JSX Trap:** `{tasks.length && <TaskList />}` renders `0` on screen when `tasks` is empty; always write `{tasks.length > 0 && <TaskList />}`.

**7. What is the difference between optional chaining (`?.`) and nullish coalescing (`??`) vs logical OR (`||`)?**
* **Answer:** `user?.address?.city` safely stops and returns `undefined` instead of throwing a `TypeError` if an intermediate property is `null`/`undefined`. `count ?? 10` falls back to `10` **only** when `count` is `null` or `undefined`, whereas `count || 10` also replaces valid falsy values like `0` or `""`.

**8. How does `.map()` differ from `.forEach()`?**
* **Answer:** `.map()` transforms each element via a callback and returns a **new array** of the same length (making it ideal for rendering JSX lists). `.forEach()` simply loops over elements for side effects and always returns `undefined`.

**9. How does `.filter()` differ from `.find()`?**
* **Answer:** `.filter()` returns a **new array** of *all* items where the callback returns `true` (or `[]` if none match). `.find()` stops at and returns the **first matching element** itself (or `undefined` if none match).

**10. How does `.reduce()` work, and how did you use it in TaskPulse?**
* **Answer:** `.reduce((accumulator, currentItem) => ..., initialValue)` iterates through an array to collapse it into a single value or object. In `DashboardPage.jsx`, we used `.reduce()` in a single pass over `tasks` to compute `{ total, todo, inProgress, done }`.

**11. Why does `.trim()` matter in form validation and search inputs?**
* **Answer:** `.trim()` removes leading and trailing whitespace without touching inner spaces. In `TaskForm.jsx`, `if (!title.trim())` rejects titles containing only spaces (`"   "`), and in `TasksPage.jsx`, `debouncedSearch.trim()` prevents accidental trailing spaces from breaking search matches.

**12. How does `this` behave in regular functions vs arrow functions?**
* **Answer:** In a regular function, `this` is dynamic and depends on *how* the function is called (`obj.fn()` $\rightarrow$ `obj`, plain `fn()` in strict mode $\rightarrow$ `undefined`). An arrow function has **no own `this`**; it lexically inherits `this` from its surrounding scope.

**13. Explain `.call()`, `.apply()`, and `.bind()`.**
* **Answer:** All three explicitly set `this` for a function: `fn.call(ctx, a, b)` invokes immediately with comma-separated args; `fn.apply(ctx, [a, b])` invokes immediately with an array of args; `fn.bind(ctx, a)` returns a **new bound function** to be called later.

**14. What is the prototype chain in JavaScript?**
* **Answer:** Every JS object has a hidden `[[Prototype]]` link to another object. When accessing a property/method not found on the object itself (like `arr.map`), JS walks up the prototype chain (`Array.prototype` $\rightarrow$ `Object.prototype` $\rightarrow$ `null`) until found or returning `undefined`.

**15. How does JavaScript Garbage Collection work, and what causes memory leaks in React?**
* **Answer:** JS engines use **Mark-and-Sweep** garbage collection: starting from roots (`window`), anything reachable is kept, and unreachable memory is freed. In React, leaks happen when `useEffect` leaves active `setInterval` timers, `window.addEventListener` listeners, or open subscriptions after a component unmounts.

---

## Section 2: JavaScript Internals & Async Execution (Q16–Q28)

**16. What is an Execution Context and what are its two phases?**
* **Answer:** It is the environment in which JS code runs, containing a **Memory Component** and a **Code Component**. In the **Creation Phase**, memory is allocated (`var` $\rightarrow$ `undefined`, function declarations $\rightarrow$ full function, `let`/`const` $\rightarrow$ TDZ). In the **Execution Phase**, code executes line by line.

**17. How does the Call Stack manage function calls?**
* **Answer:** The Call Stack is a LIFO (Last-In, First-Out) stack. The Global Execution Context sits at the bottom; each function call pushes a new Local Execution Context onto the top, and `return` pops it off.

**18. Explain Hoisting and the Temporal Dead Zone (TDZ).**
* **Answer:** Hoisting is memory allocation during the creation phase before execution. `var` is initialized as `undefined`. `let` and `const` are also hoisted, but remain uninitialized in the **TDZ** from the start of their block until their declaration line—accessing them early throws `ReferenceError`.

**19. What is Lexical Environment and Scope Chain?**
* **Answer:** A Lexical Environment is a context's own local memory plus a reference to its parent's lexical environment. If a variable isn't found locally, JS searches outward through parent environments up to Global (the Scope Chain), throwing `ReferenceError` if not found.

**20. Define a Closure and give a practical React example.**
* **Answer:** A closure is a function bundled together with its parent's lexical environment, allowing it to remember outer variables even after the parent function has finished and left the Call Stack. In `useDebounce`, the `setTimeout` callback and cleanup function close over `timerId` and `value`.

**21. What is the difference between Concurrency and Parallelism, and which does JS use?**
* **Answer:** Concurrency is one core rapidly context-switching between multiple tasks so they appear simultaneous. Parallelism is multiple CPU cores executing multiple tasks at the exact same instant. JavaScript is single-threaded, so it achieves asynchronous **concurrency** using the Event Loop.

**22. Explain the Event Loop execution order (Sync vs Microtask vs Callback Queue).**
* **Answer:** (1) Run all synchronous code on the Call Stack. (2) Once empty, drain the entire **Microtask Queue (VIP line)** (`Promise.then/catch/finally`, code after `await`, `queueMicrotask`). (3) Take **one** task from the **Callback/Task Queue** (`setTimeout`, `setInterval`, DOM events). (4) Repeat.

**23. Why does `Promise.resolve().then(...)` execute before `setTimeout(..., 0)`?**
* **Answer:** Promise callbacks enter the high-priority **Microtask Queue**, which the Event Loop must empty completely before taking a single task from the lower-priority **Callback Queue** where `setTimeout` waits.

**24. How does Node.js handle asynchronous file reads (`fs.readFile`) vs network I/O?**
* **Answer:** `fs.readFile` is handed off from the Call Stack to `libuv`'s **Thread Pool** (4 C++ worker threads by default) to read disk without blocking JS; when finished, its callback enters the Queue. Network I/O uses OS-level non-blocking polling (`epoll`/`kqueue`) rather than the thread pool.

**25. What is a Promise and what are its three states?**
* **Answer:** A Promise is an object representing the eventual result of an asynchronous operation. Its states are `pending` (in progress), `fulfilled` (resolved with a value), and `rejected` (failed with an error). Once settled, its state never changes.

**26. How does `async / await` differ from raw Promises?**
* **Answer:** `async / await` is syntactic sugar over Promises. An `async` function always returns a Promise, and `await` pauses execution *only inside that function* until the Promise settles, allowing flat `try / catch` error handling instead of nested `.then()` chains.

**27. Compare `Promise.all()`, `Promise.allSettled()`, `Promise.race()`, and `Promise.any()`.**
* **Answer:**
  * `Promise.all([...])`: Runs in parallel; resolves when **all** succeed, rejects immediately if **any one** fails.
  * `Promise.allSettled([...])`: Waits for **all** to finish regardless of success/failure and returns each status/value.
  * `Promise.race([...])`: Settles as soon as the **first** promise settles (whether fulfilled or rejected).
  * `Promise.any([...])`: Resolves with the **first fulfilled** promise; rejects only if **all** fail.

**28. Explain Debouncing vs Throttling from scratch.**
* **Answer:** **Debouncing** delays execution until `delay` ms *after* the user stops triggering events (used for search inputs). **Throttling** guarantees a function runs at most once every `limit` ms during continuous events (used for scroll or window resize listeners).

---

## Section 3: React Core, JSX & Lifecycle (Q29–Q45)

**29. What is a Single Page Application (SPA) and how does `#root` work?**
* **Answer:** In an SPA, the browser loads a single `index.html` containing `<div id="root"></div>` and a JS bundle once. `ReactDOM.createRoot(document.getElementById('root')).render(<App />)` mounts the entire app there, and subsequent navigation swaps components and fetches JSON without reloading HTML pages.

**30. Explain the Virtual DOM and Reconciliation (Diffing).**
* **Answer:** The Virtual DOM is an in-memory JS representation of the UI tree. When state or props change, React builds a new Virtual DOM tree, compares it with the previous tree (diffing), and updates **only the changed nodes** in the real browser DOM.

**31. What is the difference between `.js` and `.jsx` files?**
* **Answer:** `.js` files contain standard JavaScript logic (API clients, custom hooks, utilities). `.jsx` files contain JSX markup (`<div>`, `<TaskCard />`), which build tools like Vite/esbuild transpile into `React.createElement()` calls.

**32. What is the difference between `export default` and named `export`?**
* **Answer:** A file can have only **one** `export default`, imported without curly braces using any name (`import Modal from './Modal'`). A file can have **multiple** named exports, which must be imported with exact matching names inside curly braces (`import { useDebounce } from './useDebounce'`).

**33. Why must React component names start with a capital letter?**
* **Answer:** React treats lowercase tags (`<div>`, `<span>`) as built-in HTML DOM elements and capitalized identifiers (`<TaskCard />`) as custom React components.

**34. What is the difference between `<div>...</div>` and React Fragment `<>...</>`?**
* **Answer:** `<div>` creates an actual HTML `<div>` node in the DOM (which can interfere with CSS Grid/Flexbox layouts). `<>...</>` groups multiple sibling elements without adding any extra node to the real DOM.

**35. Props vs State — what are the key differences?**
* **Answer:** **Props** are passed into a component from its parent and are **read-only** (one-way data flow). **State** is managed internally by the component itself and triggers a re-render when updated via its setter function.

**36. Why must React state updates be immutable?**
* **Answer:** React uses shallow reference comparison (`Object.is`) to detect changes. Mutating an array/object directly (`arr.push(x)`) keeps the exact same memory reference, so React thinks nothing changed and skips re-rendering. Always create new copies (`[...arr, x]`, `{ ...obj, key: val }`).

**37. Why should you never use array index as `key` when rendering dynamic lists?**
* **Answer:** Keys help React identify which items changed, moved, or were deleted across renders. If items are deleted or reordered, array indexes shift, causing React to attach old component state or input focus to the wrong item. Always use a unique, stable ID (`task.id`).

**38. What is the difference between Controlled and Uncontrolled inputs?**
* **Answer:** In a **controlled** input, React state is the single source of truth via `value={title}` and `onChange={(e) => setTitle(e.target.value)}`. In an **uncontrolled** input, the DOM itself stores the value and you read it on demand using a `useRef`.

**39. What is `children` prop in React?**
* **Answer:** `children` is a special prop automatically passed to a component containing whatever JSX is nested between its opening and closing tags—used heavily in wrapper components like `<ProtectedRoute>`, `<AppLayout>`, and `<Modal>`.

**40. What are the three phases of a React component's lifecycle, and how do Hooks map to them?**
* **Answer:**
  1. **Mounting:** Component is created and inserted into the DOM $\rightarrow$ `useEffect(() => { ... }, [])`.
  2. **Updating:** Component re-renders due to state/prop/context changes $\rightarrow$ `useEffect(() => { ... }, [dep])`.
  3. **Unmounting:** Component is removed from the DOM $\rightarrow$ `return () => { ... }` cleanup inside `useEffect`.

**41. Trace the exact render cycle of a component using `useState` and `useEffect`.**
* **Answer:** (1) Component function runs synchronously and returns JSX (e.g., `Loading...`). (2) React commits changes to the real DOM and browser paints the screen. (3) `useEffect` runs asynchronously after paint, fetches data, and calls `setState`. (4) Component re-renders with new data, skips `useEffect` if dependencies haven't changed, and settles.

**42. Why does React `<StrictMode>` run `useEffect` twice on mount in development?**
* **Answer:** Starting in React 18, `<StrictMode>` intentionally mounts, unmounts, and remounts components in development to verify that your `useEffect` cleanup properly cancels requests, timers, and listeners. In production, it runs only once.

**43. What is state batching in React 18?**
* **Answer:** Automatic batching groups multiple `setState` calls (even inside Promises, `setTimeout`, or native event handlers) into a **single re-render** for better performance instead of re-rendering after each setter call.

**44. What is Lifting State Up?**
* **Answer:** Moving shared state to the closest common ancestor component so sibling components stay synchronized—for example, lifting `searchInput` and `tasks` into `TasksPage.jsx` so `TaskFilters`, `TaskList`, and `Pagination` all reflect the same state.

**45. What is an Error Boundary and why is it still written as a Class Component?**
* **Answer:** An Error Boundary catches JavaScript errors anywhere in its child component tree during rendering and displays a fallback UI instead of crashing the whole app. It still requires a Class Component because there are no Hook equivalents yet for `getDerivedStateFromError` and `componentDidCatch`.

---

## Section 4: React Hooks Deep Dive (Q46–Q62)

**46. What are the two strict Rules of Hooks?**
* **Answer:** (1) Call Hooks **only at the top level** of a React function—never inside `if` statements, loops, or nested functions (so React can preserve hook call order across renders). (2) Call Hooks **only from React function components or custom hooks**.

**47. What is lazy state initialization in `useState` and when should you use it?**
* **Answer:** Passing an initializer function `useState(() => localStorage.getItem('token'))` instead of a direct value ensures React runs the expensive `localStorage` read **only once on initial mount**, rather than on every subsequent re-render.

**48. When should you use functional state updates `setCount(prev => prev + 1)`?**
* **Answer:** Whenever the new state depends on the previous state—especially inside async callbacks, `setTimeout`, or batched updates—so you never read a stale closure value (`setRetryCount((c) => c + 1)`).

**49. What happens if you omit the dependency array in `useEffect`?**
* **Answer:** `useEffect(fn)` runs after **every single render**. If it calls `setState` unconditionally, it triggers an infinite render loop.

**50. When exactly does a `useEffect` cleanup function run?**
* **Answer:** It does **not** run on the first mount. It runs: (1) **before** the effect re-runs whenever any dependency changes, and (2) **once** when the component unmounts.

**51. What is a Race Condition in `useEffect` data fetching, and how do you solve it?**
* **Answer:** When a user triggers multiple requests quickly (e.g., typing `"L"` then `"Le"`), an older slow request (`"L"`) can resolve *after* a newer fast request (`"Le"`) and overwrite the UI with stale data. Solve it by creating an `AbortController` in `useEffect` and calling `controller.abort()` in the cleanup function.

**52. What is Stale Data when switching dynamic IDs (e.g., `/tasks/1` to `/tasks/2`), and how do you prevent it?**
* **Answer:** When `id` changes, React renders once with the new `id` before `useEffect` runs, briefly showing the previous task's data unless you reset state (`setLoading(true)` or `setTask(null)`) at the start of the effect.

**53. What is `useRef`, and what are its two main use cases?**
* **Answer:** `useRef(initial)` returns a mutable `{ current: initial }` object that persists across renders **without causing re-renders** when changed. Uses: (1) accessing real DOM elements (`titleInputRef.current.focus()`), and (2) silently storing mutable values like timer IDs or previous values.

**54. Compare `useState`, `useRef`, and `useEffect`.**
* **Answer:** Use `useState` when changing data must update the screen; use `useRef` to hold a DOM node or silent value without triggering a re-render; use `useEffect` to synchronize with external systems (APIs, timers, `window` events) after render.

**55. Explain `useMemo` vs `useCallback` with examples.**
* **Answer:** `useMemo(() => computeStats(tasks), [tasks])` executes the function during render and caches its **return value**. `useCallback(() => deleteTask(id), [id])` caches the **function reference itself** without calling it, preventing unnecessary re-renders of child components wrapped in `React.memo`.

**56. Why shouldn't you wrap every single variable and function in `useMemo` and `useCallback`?**
* **Answer:** Both hooks have memory and dependency-comparison overhead on every render. Wrapping cheap primitive calculations or components that aren't memoized adds complexity and can actually slow down rendering. Use them for genuinely expensive calculations or referential equality needs.

**57. What is a Custom Hook, and how did you design `useDebounce`?**
* **Answer:** A custom hook is a reusable JavaScript function starting with `use` that composes built-in hooks. `useDebounce(value, delay)` stores `debouncedValue` in `useState`, schedules a `setTimeout` inside `useEffect`, and clears the previous timer in cleanup (`clearTimeout(timerId)`) on every keystroke.

**58. What is Prop Drilling, and how does `useContext` solve it?**
* **Answer:** Prop drilling is passing data through multiple intermediate components that don't need it just to reach a deeply nested child (`App` $\rightarrow$ `Layout` $\rightarrow$ `Navbar` $\rightarrow$ `UserBadge`). `createContext` + `Provider` + `useContext` lets any descendant read the data directly.

**59. What is the performance downside of Context API?**
* **Answer:** Whenever a Context Provider's `value` changes, **every component** consuming that context re-renders—even if it only uses one property that didn't change. That's why Context is best for low-frequency global state (auth user, theme) rather than rapidly changing data.

**60. What is Derived State and why is it better than extra `useState` variables?**
* **Answer:** Derived state is any value computed directly from existing state or props during render (like `totalPages = Math.ceil(totalCount / LIMIT)` or `stats` via `useMemo`). Storing derived values in separate `useState` hooks risks state synchronization bugs and causes extra re-renders.

**61. What are `useTransition` and `useOptimistic` in modern React?**
* **Answer:** `useTransition` marks non-urgent state updates (like filtering a huge list) as low-priority so urgent updates (like typing in an input) stay responsive. `useOptimistic` lets you show an immediate optimistic UI state while an async action is pending, automatically reverting when it settles.

**62. What are `React.lazy()` and `<Suspense>`?**
* **Answer:** They enable **code splitting**: `const TaskDetailsPage = React.lazy(() => import('./pages/TaskDetailsPage'))` loads that page's JS bundle only when the user navigates to it, while `<Suspense fallback={<Skeleton />}>` displays a loading placeholder while the chunk downloads.

---

## Section 5: React Router v6+ & URL State (Q63–Q72)

**63. Why must `<BrowserRouter>` wrap `<App />` in `main.jsx`?**
* **Answer:** `<BrowserRouter>` connects React to the browser's History API (`window.location` and `history.pushState`) and provides routing context to the entire tree. Without it, `<Routes>`, `<Link>`, `useNavigate`, and `useSearchParams` will throw runtime errors.

**64. Explain the relationship between `<Routes>`, `<Route>`, and `<Outlet />`.**
* **Answer:** `<Routes>` matches the current URL against its child `<Route>` definitions and renders the best match. When a parent `<Route element={<AppLayout />}>` wraps child routes, `<Outlet />` acts as the placeholder inside `AppLayout` where the matched child page renders.

**65. What is the difference between `<Link>`, `<NavLink>`, `useNavigate()`, and `<Navigate>`?**
* **Answer:**
  * `<Link to="/tasks">`: Declarative link that navigates without reloading the page.
  * `<NavLink to="/tasks">`: Like `<Link>`, but provides an `isActive` boolean to style active navigation links.
  * `useNavigate()`: Hook returning a `navigate()` function for imperative navigation inside event handlers (e.g., after login or delete).
  * `<Navigate to="/login" replace />`: Component that triggers an immediate redirect during render (used in `ProtectedRoute`).

**66. What does `{ replace: true }` do in `navigate('/tasks', { replace: true })` or `<Navigate replace />`?**
* **Answer:** Instead of pushing a new entry onto the browser's history stack, it **replaces** the current entry. In TaskPulse, using `replace: true` after deleting a task prevents the user from clicking the Back button and landing on a deleted task's `404` page.

**67. Compare `useParams()` and `useSearchParams()`.**
* **Answer:** `useParams()` is **read-only** and extracts dynamic path segments defined with `:` (e.g., `/tasks/:id` $\rightarrow$ `{ id }`). `useSearchParams()` returns `[searchParams, setSearchParams]` to **both read and update** URL query strings (`?status=todo&page=2`).

**68. Why did you make `useSearchParams` the single source of truth in `TasksPage.jsx`?**
* **Answer:** Storing `page`, `q`, `status`, `priority`, and `sort` in the URL ensures the exact filtered view survives `F5` page reloads, works with browser Back/Forward buttons, and can be shared or bookmarked as a link.

**69. Why does `TasksPage` keep `searchInput` in `useState` while keeping `status` and `page` in `searchParams`?**
* **Answer:** Updating `searchParams` on every single keystroke would fire an API call on every letter and pollute browser history. Keeping `searchInput` in local `useState` makes typing instantaneous, while `useDebounce(searchInput, 300)` updates `?q=` in the URL once after typing stops.

**70. How does `new URLSearchParams(searchParams)` work when updating filters?**
* **Answer:** `searchParams` should not be mutated directly. Cloning it with `const next = new URLSearchParams(searchParams)` lets us safely call `next.set('status', 'todo')`, `next.delete('q')`, and `next.set('page', '1')` before committing with `setSearchParams(next)`.

**71. Why must `page` always reset to `'1'` whenever a search query or filter changes?**
* **Answer:** If a user is viewing Page 3 of 14 tasks and applies a filter that only matches 2 tasks (1 page total), staying on `page=3` would display an empty list. Resetting `next.set('page', '1')` guarantees valid results are shown immediately.

**72. How do you configure a catch-all 404 route in React Router v6?**
* **Answer:** Add `<Route path="*" element={<NotFoundPage />} />` inside `<Routes>` to match any URL that didn't match earlier routes.

---

## Section 6: Authentication, APIs, Tailwind & TaskPulse Architecture (Q73–Q100)

**73. Explain how `ProtectedRoute` works in TaskPulse.**
* **Answer:** `ProtectedRoute` reads `token` from `useAuth()`. If `!token`, it returns `<Navigate to="/login" replace />` during render; otherwise, it renders `{children}` (such as `<AppLayout />`).

**74. List all 5 `localStorage` methods and explain how objects are stored.**
* **Answer:** `setItem(key, val)`, `getItem(key)`, `removeItem(key)`, `clear()`, and `key(index)`. Because `localStorage` only stores strings, objects must be serialized with `JSON.stringify(user)` on save and parsed with `JSON.parse(raw)` on read.

**75. What are the security trade-offs of storing JWT tokens in `localStorage` vs `httpOnly` cookies?**
* **Answer:** `localStorage` is easy to use in SPAs, but any malicious JavaScript injected via **XSS (Cross-Site Scripting)** can read it (`localStorage.getItem('token')`). An `httpOnly` + `Secure` + `SameSite` cookie cannot be accessed by JavaScript, protecting against XSS (while `SameSite` mitigates CSRF).

**76. Compare `fetch` vs `axios`.**
* **Answer:** `axios` automatically parses JSON into `res.data`, rejects Promises on HTTP error statuses (`404`, `500`), supports centralized instances (`axios.create`), and provides request/response interceptors. `fetch` requires manual `res.json()` parsing and does not reject on `404`/`500` unless you check `res.ok`.

**77. How does the Axios Request Interceptor in `src/api/client.js` work?**
* **Answer:** `api.interceptors.request.use((config) => { ... })` runs automatically before every outgoing API request leaves the browser. It reads `token` from `localStorage` and attaches `config.headers.Authorization = 'Bearer ' + token`, eliminating repetitive header code across API functions.

**78. Why does `getTasks` return the full Axios response while `getTask` and `createTask` unwrap `.then((res) => res.data)`?**
* **Answer:** `TasksPage` needs both `res.data` (the 6 tasks) and `res.headers['x-total-count']` (the total matching count from `json-server` to compute `totalPages`). Single-item operations (`getTask`, `createTask`, `updateTask`, `deleteTask`) only need the task object itself.

**79. Explain the difference between `PUT` and `PATCH` HTTP methods.**
* **Answer:** `PUT` replaces the entire resource with a complete new payload, whereas `PATCH` applies a partial update to only the specified fields (e.g., `api.patch('/tasks/3', { status: 'done' })`).

**80. What are the most important HTTP status codes a frontend developer handles?**
* **Answer:** `200` (OK), `201` (Created), `204` (No Content), `400`/`422` (Bad Request / Validation error $\rightarrow$ show form errors), `401` (Unauthorized $\rightarrow$ clear token & redirect to `/login`), `403` (Forbidden), `404` (Not Found), and `500` (Internal Server Error $\rightarrow$ show retry UI).

**81. What is CORS and how do you fix a CORS error?**
* **Answer:** Cross-Origin Resource Sharing is a browser security mechanism that blocks frontend JavaScript from reading responses from a different origin (protocol + domain + port) unless the **backend server** explicitly sends `Access-Control-Allow-Origin` headers. It is fixed on the backend, not in React.

**82. What is XSS (Cross-Site Scripting) and how does React protect against it?**
* **Answer:** XSS occurs when untrusted user input containing malicious `<script>` tags executes in another user's browser. React automatically escapes all values rendered inside `{text}` JSX expressions; danger arises only if you bypass this using `dangerouslySetInnerHTML` with unsanitized input.

**83. How do environment variables work in Vite?**
* **Answer:** Variables in `.env` must be prefixed with `VITE_` (e.g., `VITE_API_URL=http://localhost:4000`) and are read in code via `import.meta.env.VITE_API_URL`. Never put private API secrets in frontend `.env` files because they are bundled into public client JS.

**84. What is the difference between `package.json` and `package-lock.json`?**
* **Answer:** `package.json` declares direct dependencies, version ranges (`^18.3.1`), and npm scripts. `package-lock.json` locks the exact resolved versions and integrity hashes of every direct and transitive package so every environment installs the exact same `node_modules`.

**85. What is the difference between `dependencies` and `devDependencies`?**
* **Answer:** `dependencies` are required at runtime in production (`react`, `react-dom`, `react-router-dom`, `axios`). `devDependencies` are only needed during development and build time (`vite`, `tailwindcss`, `postcss`, `json-server`, `eslint`).

**86. How does Tailwind CSS work under the hood?**
* **Answer:** Tailwind is a utility-first CSS framework. During build/dev, it scans all file paths configured in `tailwind.config.js` (`content`), finds every utility class name used, and compiles a minimal CSS stylesheet containing only those classes.

**87. Explain CSS Flexbox vs CSS Grid and how you used both in TaskPulse.**
* **Answer:** Flexbox is **1-dimensional** (row *or* column—used in `Navbar`, `TaskFilters`, and `Modal` headers with `flex items-center justify-between`). Grid is **2-dimensional** (rows *and* columns simultaneously—used in `TaskList` with `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`).

**88. Explain the CSS Box Model and `box-sizing: border-box`.**
* **Answer:** Every element consists of `content` $\rightarrow$ `padding` $\rightarrow$ `border` $\rightarrow$ `margin`. With `box-sizing: border-box` (Tailwind's default), an element's declared `width` includes its `padding` and `border` rather than expanding beyond it.

**89. Compare CSS `position` values: `static`, `relative`, `absolute`, `fixed`, and `sticky`.**
* **Answer:** `static` is normal flow; `relative` offsets from its normal spot and acts as an anchor for `absolute` children; `absolute` positions relative to its nearest positioned ancestor; `fixed` pins to the viewport (used for `Modal`'s `fixed inset-0` backdrop); `sticky` toggles between relative and fixed while scrolling.

**90. How did you make `Modal.jsx` accessible and user-friendly?**
* **Answer:** (1) Added a `window` `keydown` listener in `useEffect` (with `removeEventListener` cleanup) so pressing `Escape` closes the modal. (2) Checked `e.target === e.currentTarget` on the overlay so clicking the dark backdrop closes it while clicking inside the form does not. (3) Auto-focused the Title input on mount via `useRef`.

**91. Why do you need both `e.preventDefault()` and `e.stopPropagation()` on the quick-toggle button inside `TaskCard.jsx`?**
* **Answer:** Because the entire card is wrapped in `<Link to="/tasks/${task.id}">`. `e.preventDefault()` stops the `<Link>`'s default navigation, and `e.stopPropagation()` prevents the click event from bubbling up from the `<button>` to the parent `<Link>`.

**92. Walk through how Optimistic UI works in `TasksPage.jsx`'s `handleToggleStatus`.**
* **Answer:** (1) Save a snapshot `const previousTasks = tasks`. (2) Immediately call `setTasks` to flip the task's `status` in UI before the API call finishes. (3) `await updateTask(taskId, { status: nextStatus })`. (4) If the server request throws an error, restore `setTasks(previousTasks)` in the `catch` block.

**93. How did you reuse `TaskForm.jsx` for both Creating and Editing tasks?**
* **Answer:** `TaskForm` accepts an optional `initialData` prop. When creating (`initialData = null`), `useState` initializes empty fields and submits to `handleCreateTask`. When editing (`initialData = task`), `useState` pre-fills existing values and submits to `handleUpdate`.

**94. Why do `LoginPage` and `TaskForm` track a `submitting` boolean state?**
* **Answer:** Setting `submitting = true` while an async `POST`/`PATCH` request is in flight disables the submit button (`disabled={submitting}`) and shows `"Saving..."`, preventing duplicate submissions from accidental double-clicks.

**95. How does `DashboardPage.jsx` prevent mutating state when sorting `recentTasks`?**
* **Answer:** JavaScript's `.sort()` mutates the array in place. Inside `useMemo`, we shallow-copy first (`[...tasks].sort(...)`) so the original `tasks` state array is never mutated.

**96. What is Semantic HTML and why does it matter in React apps?**
* **Answer:** Using meaningful tags (`<nav>`, `<main>`, `<header>`, `<button>`, `<label htmlFor="...">`) instead of generic `<div>`s improves screen-reader accessibility, built-in keyboard navigation (`Enter`/`Space` on `<button>`), and SEO.

**97. How do you prevent unnecessary re-renders in a large React list?**
* **Answer:** Use stable unique `key`s, paginate or virtualize long lists (e.g., server-side `_limit=6` on web, `<FlatList>` on React Native), memoize filtered/sorted data with `useMemo`, wrap heavy row cards in `React.memo`, and stabilize row callbacks with `useCallback`.

**98. What is the difference between Client-Side Pagination and Server-Side Pagination?**
* **Answer:** Client-side pagination fetches all records once and slices them in JS (fast for small datasets, slow/heavy for thousands of rows). Server-side pagination (`_page=2&_limit=6` + `x-total-count`) fetches only the current page's records from the backend, keeping memory and payload size small.

**99. How do React web concepts translate to React Native (Expo)?**
* **Answer:** Hooks (`useState`, `useEffect`, `useContext`, `useRef`, `useMemo`), props, Context, and Axios work identically. Only UI primitives and navigation change: `<div>` $\rightarrow$ `<View>`, `<p>` $\rightarrow$ `<Text>`, `<input>` $\rightarrow$ `<TextInput>`, `<button>` $\rightarrow$ `<Pressable>`, `.map()` lists $\rightarrow$ `<FlatList>`, `localStorage` $\rightarrow$ `expo-secure-store`, and React Router $\rightarrow$ Expo Router.

**100. If you were migrating TaskPulse from `json-server` to a production Go/PostgreSQL backend, what changes in the React frontend?**
* **Answer:** Almost nothing in the UI components! Because all HTTP calls are isolated in `src/api/client.js` and `src/api/tasks.js`, you simply update `VITE_API_URL` to the Go server's URL, align pagination/query param names (`page`, `limit`, `search`) with the Go API contract, and handle real `401` token expiration in an Axios response interceptor.