# React.js & TaskPulse — Complete Interview & Architecture Notes

> **Purpose:** Complete revision guide combining your handwritten JavaScript & React course notes (with visual ASCII boxes, memory diagrams, and trace tables) with modern React Hooks, React Router, Axios, Tailwind CSS, and every architectural decision built across Phases 0–5 of **TaskPulse**.
>
> **Format:** Concept + **Visual Box / Diagram** + **সহজ কথায় (Bangla)** + Project Code Example + Interview Trap.

## Table of Contents

 1. [Project Setup, Node.js, Vite, Tailwind & Package Files](#1-project-setup-nodejs-vite-tailwind--package-files)

 2. [JavaScript Fundamentals & Internals (Handwritten Notes + Visual Diagrams)](#2-javascript-fundamentals--internals-handwritten-notes--visual-diagrams)

 3. [JSX, Modules, Fragments & DOM Events](#3-jsx-modules-fragments--dom-events)

 4. [React Core & Lifecycle (Render Cycle, StrictMode, Virtual DOM)](#4-react-core--lifecycle)

 5. [All Hooks Used in TaskPulse (Deep Dive)](#5-all-hooks-used-in-taskpulse)

 6. [React Router v6+ (Navigation, Params, SearchParams & Protected Routes)](#6-react-router-v6)

 7. [Authentication, Context API & `localStorage`](#7-authentication-context-api--localstorage)

 8. [Frontend–Backend Connection (`Axios`, `json-server`, `AbortController`, Optimistic UI)](#8-frontendbackend-connection)

 9. [TaskPulse End-to-End Execution Trace (Phases 0–5)](#9-taskpulse-end-to-end-execution-trace)

10. [Top 30 Interview Questions & Rapid Answers](#10-top-30-interview-questions--rapid-answers)

## 1. Project Setup, Node.js, Vite, Tailwind & Package Files

### 1.1 Why Node.js Is Required & How to Install It

To run a React.js project locally, **Node.js** must be installed first because React's build tool (**Vite**) and package manager (**npm**) run on top of Node.js during development.

* **npm (Node Package Manager):** Installed automatically with Node.js to download libraries (`react`, `react-router-dom`, `axios`, `tailwindcss`, `json-server`).

* **Vite Dev Server & Bundler:** Node.js executes Vite to transpile JSX into browser-ready JavaScript, run hot-reloading (`localhost:5173`), and bundle static assets for production (`dist/`). *(Once built with `npm run build`, the static `dist/` folder can be hosted on any web server or CDN without Node.js.)*

```bash
# Install Node.js LTS on Ubuntu (if not already installed)
sudo apt update && sudo apt install -y nodejs npm

# Verify Node.js and npm versions (aim for Node v20+ LTS)
node -v && npm -v
```

### 1.2 Step-by-Step Beginner React Project Setup (TaskPulse Stack)

**Vite** (French for "fast") is the modern replacement for `create-react-app`. It serves files over native ES Modules in development (instant startup) and uses Rollup to bundle optimized static assets for production.

```bash
# 1. Create Vite + React template
npm create vite@latest taskpulse-web -- --template react

# 2. Enter folder and install base dependencies
cd taskpulse-web
npm install

# 3. Install routing, HTTP client, and mock backend
npm install react-router-dom axios
npm install -D json-server

# 4. Install Tailwind CSS (v4 Vite plugin setup)
npm install -D tailwindcss @tailwindcss/vite
```

### 1.3 Connecting Tailwind CSS to the Project

1. **`vite.config.js`:** Register the Tailwind CSS plugin alongside React:

   ```javascript
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';
   import tailwindcss from '@tailwindcss/vite';
   
   export default defineConfig({
     plugins: [react(), tailwindcss()],
   });
   ```

2. **`src/index.css`:** Replace the default Vite boilerplate CSS with:

   ```css
   @import "tailwindcss";
   ```

3. **`src/main.jsx`:** Imports `./index.css` once at the root so every component in the tree can use Tailwind utility classes (`flex`, `grid-cols-3`, `bg-blue-600`, `md:p-8`).

*(Note: For Tailwind v3 setups, install `tailwindcss postcss autoprefixer`, run `npx tailwindcss init -p`, configure `content: ["./index.html", "./src/**/*.{js,jsx}"]` in `tailwind.config.js`, and add `@tailwind base; @tailwind components; @tailwind utilities;` in `src/index.css`.)*

### 1.4 Mock Backend (`db.json`), Folder Structure & Running Both Servers

1. **Create `db.json`** in the project root with initial `"users"` and `"tasks"` arrays.

2. **Update `package.json` scripts:**

   ```json
   "scripts": {
     "dev": "vite",
     "api": "json-server --watch db.json --port 4000",
     "build": "vite build"
   }
   ```

3. **Recommended Folder Structure:**

   ```text
   taskpulse-web/
   ├── db.json                  # Mock REST database
   ├── .env                     # VITE_API_URL=http://localhost:4000
   ├── src/
   │   ├── api/                 # client.js (Axios + interceptors) & tasks.js
   │   ├── context/             # AuthContext.jsx
   │   ├── hooks/               # useDebounce.js
   │   ├── components/          # ProtectedRoute, Navbar, Sidebar, Modal, TaskForm, TaskCard
   │   ├── pages/               # LoginPage, DashboardPage, TasksPage, TaskDetailsPage
   │   ├── App.jsx              # Route definitions
   │   └── main.jsx             # BrowserRouter + AuthProvider + ReactDOM.createRoot
   ```

4. **Run Both Servers (in two terminal tabs):**

   * **Terminal 1 (Mock Backend):** `npm run api` $\rightarrow$ `http://localhost:4000`

   * **Terminal 2 (React Frontend):** `npm run dev` $\rightarrow$ `http://localhost:5173`

### 1.5 `package.json` vs `package-lock.json` vs `db.json`

| File | What It Is & Why It Exists | 
| ----- | ----- | 
| **`package.json`** | The **manifest / blueprint** of the project. Lists project metadata, `scripts` (`"dev": "vite"`, `"api": "json-server --watch db.json --port 4000"`), `dependencies` (needed in production, e.g., `react`, `axios`), and `devDependencies` (only needed while developing, e.g., `vite`, `tailwindcss`, `json-server`). | 
| **`package-lock.json`** | Automatically generated lockfile that records the **exact resolved version and integrity hash** of every package and sub-dependency. Ensures every developer and CI server installs the exact same dependency tree (`npm ci`). **Always commit it to Git.** | 
| **`db.json`** | Our local **mock database** file watched by `json-server`. Top-level keys (`"users"`, `"tasks"`) automatically become REST endpoints (`/users`, `/tasks`) supporting `GET`, `POST`, `PATCH`, `DELETE`, `_page`, `_limit`, `_sort`, `_order`, and `q` full-text search. | 

* **সহজ কথায়:** `package.json` হলো বাজারের লিস্ট (যেমন: "চাল, ডাল লাগবে"), আর `package-lock.json` হলো রসিদ (যেমন: "কোন ব্র্যান্ডের, কত কেজি, কত তারিখে কেনা হয়েছে")। আর `db.json` হলো আমাদের নকল ডেটাবেস ফাইল, যা `json-server` দিয়ে আসল REST API-এর মতো চালানো হয়।

---

## 2. JavaScript Fundamentals & Internals (Handwritten Notes + Visual Diagrams)

> **Core Truth:** React is just JavaScript. Every React interview question rests on functions, references, execution context, call stack, closures, and the event loop.

### 2.1 Types of Functions (Interview Favourite)

| Type | Example | Key Rule to Remember |
| :--- | :--- | :--- |
| **Function Statement / Declaration** | `function print() {}` | **Fully hoisted:** can call it *before* the line it is written on. |
| **Function Expression** | `var log = function() {}` | Variable is `undefined` in creation phase $\rightarrow$ calling early gives `TypeError: log is not a function`. |
| **Anonymous Function / IIFE** | `(function() {})();` | Function with no name; **IIFE** (Immediately Invoked Function Expression) runs immediately. |
| **Arrow Function** | `const print = () => {}` | Behaves like a variable expression (not hoisted as a function) and has **no own `this`**. |
| **First-Class Function** | `call(sum)` or `return add;` | Functions treated like values: passed as arguments or returned from other functions. |
| **Callback Function** | `setTimeout(cb, 1000)` | The function you pass into another function to be called back later. |

```javascript
print(); // ✅ "Hello world" (statement is hoisted with full body)
log();   // ❌ TypeError: log is not a function (log is still undefined)

function print() { console.log("Hello world"); }
var log = function () { console.log("Bye Bye"); };
```

* **Parameter vs Argument:** In `function print(text)` $\rightarrow$ `text` is the **parameter** (receives). In `print("Hello")` $\rightarrow$ `"Hello"` is the **argument** (passed).
* **সহজ কথায়:** Function statement আগে বা পরে যেকোনো জায়গা থেকে call করা যায়। Function expression creation phase-এ `undefined` থাকে, তাই আগে call করলে `TypeError` আসে।

```javascript
// First-class: pass a function in & return a function out
function call(add) { add(4, 5); }
function sum(a, b) { console.log(a + b); }
call(sum); // 9

function makeAdd() {
  function add(a, b) { console.log(a + b); }
  return add;
}
const add = makeAdd();
add(2, 3); // 5
```

---

### 2.2 Objects, Classes (`super`), Destructuring & Immutable Updates

```javascript
class Human {
  constructor(age) { this.age = age; }
}
class User extends Human {
  constructor(first, last) {
    super(10); // ⚠️ MUST call parent constructor first before using `this`
    this.first = first;
    this.last = last;
  }
  print() { console.log(this.first, this.last); }
}
const superUser = new User("Ali", "Shafa");
superUser.print(); // Ali Shafa
```

#### Destructuring & Spread (`...`)
```javascript
const { boxes } = this.state;              // same as const boxes = this.state.boxes
const { title, price } = props;            // used in every React component
const user2 = { ...user, role: "Full Stack" }; // copy object, override one key
const skills2 = [...skills, "React"];          // copy array, add one item
```
* **Why it matters in React:** React compares the **old reference vs the new reference** (`Object.is`). `arr.push()` mutates the same array, so the memory reference stays identical and React **does not re-render**. Spread (`...`) creates a brand-new reference.

---

### 2.3 Pass by Value vs Pass by Reference

| Data Type | What Is Copied | Change Inside Function Affects Outside? |
| :--- | :--- | :--- |
| **Primitive** (`number`, `string`, `boolean`, `null`, `undefined`) | The **actual value** | **No** |
| **Non-Primitive** (`object`, `array`, `function`) | The **memory address (reference)** | **Yes**, if you mutate its properties/elements |

```javascript
function change(n, obj) { n = 99; obj.name = "New"; }
let x = 1, u = { name: "Old" };
change(x, u);
console.log(x, u.name); // 1 "New"
```

---

### 2.4 How `.map()`, `.filter()`, `.find()`, `.forEach()` & `.reduce()` Work Inside

* **`.map()`:** Calls callback once per item and pushes the returned value into a **new array** (same length).
* **`.filter()`:** Pushes the item into a **new array** only if callback returns `true`.
* **`.find()`:** Returns the **first matching item** itself (or `undefined`).
* **`.forEach()`:** Just loops for side effects and always returns `undefined`.
* **`.reduce()`:** Collapses an array into a **single value or object**.

```javascript
// Polyfill from handwritten notes — how .map() and .filter() work under the hood
Array.prototype.myMap = function (callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) result.push(callback(this[i], i));
  return result;
};

Array.prototype.myFilter = function (callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) if (callback(this[i], i)) result.push(this[i]);
  return result;
};

[1, 2, 3].myMap((n) => n * 2);    // [2, 4, 6]
[1, 2, 3].myFilter((n) => n > 1);  // [2, 3]
```

* **Implicit Return Rule:** With `() => (...)` (round brackets) or a single expression, no `{ }` and no `return` are needed. With `{ }`, you **must** write `return`.
* **TaskPulse `.reduce()` & `.trim()` Examples:**
  ```javascript
  // DashboardPage.jsx: single-pass stats counter
  const byStatus = tasks.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {}); // { todo: 9, 'in-progress': 3, done: 2 }

  // TaskForm.jsx: .trim() strips leading/trailing spaces so "   " fails validation
  if (!title.trim()) setError('Task title is required');
  ```

---

### 2.5 Execution Context & Call Stack (Visual Box Diagram)

When JS runs code, it creates an **Execution Context** with **2 components** and executes in **2 phases**:

```text
+-----------------------------------------------------------------------+
|                        EXECUTION CONTEXT                              |
+-----------------------------------+-----------------------------------+
|   1. Memory Component             |   2. Code Component               |
|      (Variable Environment)       |      (Thread of Execution)        |
|                                   |                                   |
|   - Stores variables & functions  |   - Runs code line by line        |
|   - Phase 1 (Creation):           |   - Phase 2 (Execution):          |
|     * var -> undefined            |     * Assigns real values         |
|     * fn statement -> full f{..}  |     * Pushes function calls onto  |
|     * let/const -> TDZ            |       the Call Stack              |
+-----------------------------------+-----------------------------------+
```

#### Step-by-Step Trace & Call Stack Diagram
```javascript
var a = 10;
function add(x, y) { var z = x + y; return z; }
var result = add(4, 7);
console.log(result); // 11
```

| Step | Memory Component | What Happens |
| :--- | :--- | :--- |
| **Creation Phase** | `a: undefined`, `add: f{...}`, `result: undefined` | Memory reserved, nothing runs yet |
| **Execution Line 1** | `a: 10` | Value `10` assigned |
| **`add(4, 7)` called** | New local context: `x: 4, y: 7, z: undefined -> 11` | Pushed on Call Stack, returns `11`, popped off |
| **Last Line** | `result: 11` | Prints `11` |

```text
CALL STACK (LIFO - Last In, First Out)
+-----------------------------------------------------------------------+
|  [TOP] Local Context: add(4, 7)    <-- Pushed on call, popped on return|
|  +-------------------------------+-------------------------------+    |
|  | Memory Component              | Code Component                |    |
|  | x: 4, y: 7                    | var z = x + y;                |    |
|  | z: undefined -> 11            | return z;                     |    |
|  +-------------------------------+-------------------------------+    |
|                                  ▲                                    |
|                                  | pushes / pops                      |
|  [BOTTOM] Global Execution Context <-- Created first, stays till end  |
|  +-------------------------------+-------------------------------+    |
|  | Memory Component              | Code Component                |    |
|  | a: undefined -> 10            | var a = 10;                   |    |
|  | add: f (whole function)       | var result = add(4, 7);       |    |
|  | result: undefined -> 11       | console.log(result);          |    |
|  +-------------------------------+-------------------------------+    |
+-----------------------------------------------------------------------+
```

---

### 2.6 Hoisting, Temporal Dead Zone (TDZ) & 4 Memory Scopes

* **Hoisting:** In the creation phase, variables and functions get memory before execution. Calling `var` early gives `undefined`, not an error.
* **TDZ (Temporal Dead Zone):** Only applies to `let` and `const`. They are hoisted too, **but not initialized with `undefined`**. The time from the start of their scope until the declaration line is the **TDZ**—accessing them throws `ReferenceError`.

```javascript
console.log(a); // ✅ undefined       (var: hoisted with undefined)
console.log(x); // ❌ ReferenceError  (let: inside TDZ!)
var a = 5;
let x = 10;     // <-- TDZ ends here
```

| Feature | `var` | `let` / `const` |
| :--- | :--- | :--- |
| **Scope** | Function / Global | Block `{ }` |
| **Stored In** | Global object (`window`) | Script / Block scope (separate memory) |
| **Before Declaration** | `undefined` | `ReferenceError` (TDZ) |
| **Re-declare** | Allowed | Not allowed (`SyntaxError`) |
| **Re-assign** | Allowed | `let`: Yes \| `const`: No (objects inside `const` can still mutate) |

```text
4 MEMORY SCOPES IN JS ENGINE:
var a = 10; let b = 20; if (true) { let c = 30; } function f() { var d = 40; }

+--------------------+--------------------+--------------------+--------------------+
|   Global Memory    |   Script Memory    |    Block Memory    |    Local Memory    |
+--------------------+--------------------+--------------------+--------------------+
| a: 10              | b: 20              | c: 30              | d: 40              |
| f: f{...}          | (top-level let/    | (gone after `{ }`  | (gone when `f()`   |
| (var + fn stmt)    |  const; TDZ)       |  block finishes)   |  returns)          |
+--------------------+--------------------+--------------------+--------------------+
```

---

### 2.7 Scope, Scope Chain, Lexical Environment & Shadowing

* **Scope:** Where a variable can be accessed.
* **Lexical Environment:** A context's **own local memory + a reference to its parent's lexical environment**.
* **Scope Chain:** If a variable is not in my memory, ask the parent (mother) context, then grandparent, up to Global. Not found anywhere $\rightarrow$ `ReferenceError`.
* **Shadowing:** An inner variable with the same name hides the outer variable inside that inner scope.

```javascript
var a = 10;
function print() {
  var b = 20;
  console.log(a); // 10 (not in print's memory -> found in parent via scope chain)
  console.log(b); // 20
}
print();
console.log(b);   // ❌ ReferenceError: b is not defined (lived only in print)
```

```text
SCOPE CHAIN LOOKUP ("Not in my memory? Ask the mother context!"):

+-----------------------------------+     +-----------------------------------+
| print() Local Memory              |     | print() Code                      |
|   b : 20                          |     |   console.log(a); // 10           |
|   a : [not here] -----------------+--+  |   console.log(b); // 20           |
+-----------------------------------+  |  +-----------------------------------+
                                       |  1. Look in print's memory: no
                                       ▼  2. Walk link to parent (Global)
+-----------------------------------+  |  3. Found a = 10 -> use it!
| Global Memory                     |<-+
|   a : 10                          |     Lookup for `b` in Global:
|   print : f{...}                  |     No parent left -> ReferenceError!
+-----------------------------------+
```

---

### 2.8 Closure (Function + Parent's Lexical Environment)

* **Interview Definition:** A **closure** is a function bundled together with its parent's lexical environment. The inner function remembers the parent's variables even after the parent function has finished and been popped off the Call Stack.

```javascript
function outer() {
  var a = 10;
  function print() { console.log(a); }
  return print;
}
const log = outer(); // outer() is finished and popped off Call Stack!
log();               // 10 -> print still remembers `a` via closure
```

```text
HOW CLOSURE SURVIVES AFTER outer() POPS OFF CALL STACK:

  1. const log = outer();         2. outer() finishes             3. log();
+-------------------------+     +-------------------------+     +-------------------------+
| outer() context         |     | outer() context         |     | Closure = log           |
|   a : 10                | --> | [Popped off Call Stack] | --> |   print() function      |
|   print : f             |     | returned print as `log` |     |   + parent lexical env: |
+-------------------------+     +-------------------------+     |     [ a : 10 ]          |
  (on the Call Stack)                                           +-------------------------+
                                                                  log() prints 10!
```

* **সহজ কথায়:** `outer()` শেষ হয়ে Call Stack থেকে চলে গেলেও `print` তার সাথে `a`-কে বেঁধে নিয়ে যায়। React-এ `useDebounce`, event handler, `setTimeout` সবই closure দিয়ে কাজ করে।

---

### 2.9 OS & Hardware Basics Behind JS Execution

```text
HARD DISK                    RAM (Memory)                 PROCESSOR (CPU)
+---------------+            +--------------------+       +-----------------------+
| 001101...     |   load     | [ P1 ] [ P2 ] [ P3]| <---> | Processing Unit       |
| 010100...     | ---------> | programs running   |       |  (add, sub, mul, div) |
| 101011...     |            +--------------------+       | Register Set          |
| (binary files)|                     |                   |  (AX, BX, CX, DX, IP) |
+---------------+                     v                   +-----------------------+
                             +--------------------------------------------+
                             | PCB (Process Control Block)                |
                             | Saves P1's register values on context      |
                             | switch so P1 can resume right where it left|
                             +--------------------------------------------+
```

* **Process vs Thread:** A **Process** is a running program (each browser tab is a process); a **Thread** is a smaller execution unit inside a process.
* **Context Switching:** CPU jumps rapidly between processes; the **PCB** saves register states so each resumes cleanly.
* **Concurrency vs Parallelism:**
  ```text
  CONCURRENCY (1 Core - Interleaved)       PARALLELISM (3 Cores - Simultaneous)
  Core 1: [P1][P2][P3][P1][P2][P3]         Core 1: [-------- P1 --------]
  (switches ~every 1/10s; feels parallel,  Core 2: [-------- P2 --------]
   but runs one at a time)                 Core 3: [-------- P3 --------]
  ```
  JavaScript has **one thread of execution**, so it uses **concurrency (Event Loop)**—not parallelism—for async work.

---

### 2.10 Browser Runtime, Web APIs, Queues & Event Loop (VIP vs Normal Line)

The JS Engine (**Call Stack + Heap**) lives inside the Browser (or Node.js). The browser provides extra superpowers through **Web APIs** via the global `window` object (`setTimeout`, DOM `document`, `fetch`, `localStorage`, `console`, `location`).

```text
+-----------------------------------------------------------------------------------+
|                                  BROWSER RUNTIME                                  |
|  +-----------------------------+      +----------------------------------------+  |
|  |         JS ENGINE           |      |        Web APIs (via `window`)         |  |
|  |  +-----------------------+  |      |  - setTimeout() / setInterval()        |  |
|  |  |      Call Stack       |  | ---> |  - DOM APIs (document)                 |  |
|  |  |  (one thing at a time)|  |      |  - fetch() / XMLHttpRequest            |  |
|  |  +-----------------------+  |      |  - localStorage / console / location   |  |
|  |  |         Heap          |  |      +-------------------+--------------------+  |
|  |  |  (objects & arrays)   |  |                          | (threads wait in      |  |
|  |  +-----------------------+  |                          |  background)          |  |
|  +--------------^--------------+                          v                       |  |
|                 |                     +----------------------------------------+  |
|                 |                     |   MICROTASK QUEUE (VIP LINE - 1st)     |  |
|         pushes  |                     |   Promise.then/catch, after `await`,   |  |
|        callback |                     |   queueMicrotask()                     |  |
|                 |                     +-------------------+--------------------+  |
|         +-------+-------+                                 | 1st: empty ALL        |  |
|         |  EVENT LOOP   | <-------------------------------+                       |  |
|         | (waits until  |                                                         |  |
|         | stack empty)  | <-------------------------------+                       |  |
|         +---------------+                                 | 2nd: take ONE task    |  |
|                                       +-------------------+--------------------+  |
|                                       |   CALLBACK / TASK QUEUE (2nd)          |  |
|                                       |   setTimeout, setInterval, click/scroll|  |
|                                       +----------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

#### Locker / Key Card Analogy & Execution Order
* **Key Card Analogy:** Think of the **Call Stack** as a single key card to the CPU room. Synchronous code holds the key card until finished. Async tasks hand off their work to a background worker (Web API / `libuv` thread pool). When finished, they get a ticket for either the **VIP Line (Microtask Queue)** or **Standard Line (Callback Queue)**. The Event Loop hands the key card to the next ticket holder *only when the CPU room is empty*, always draining **every VIP ticket** before taking one Standard ticket.

| Priority | Queue / Phase | Operations Categorized Here |
| :--- | :--- | :--- |
| **0 (Highest)** | **Synchronous Call Stack** | Normal line-by-line JS execution |
| **1 (VIP Line)** | **Microtask Queue** | `Promise.then()`, `.catch()`, `.finally()`, lines after `await`, `queueMicrotask()`, `MutationObserver` |
| **2 (Normal Line)** | **Callback / Task Queue** | `setTimeout`, `setInterval`, `setImmediate` (Node), DOM event callbacks (`click`, `keydown`), I/O callbacks |

```javascript
console.log("1. Sync Start");

setTimeout(() => console.log("2. Callback Queue (Task Queue)"), 0);

Promise.resolve().then(() => console.log("3. Microtask Queue (VIP)"));

queueMicrotask(() => console.log("4. Another Microtask"));

console.log("5. Sync End");

// Exact Output Order:
// 1. Sync Start
// 5. Sync End
// 3. Microtask Queue (VIP)
// 4. Another Microtask
// 2. Callback Queue (Task Queue)
```

* **Node.js `fs.readFile` Note:** `fs.readFile` does *not* wait inside a queue. It is handed off to `libuv`'s **Thread Pool** (4 C++ worker threads by default) to read from disk. Once read, its callback enters the Queue (`fs.promises.readFile` $\rightarrow$ Microtask Queue; normal callback $\rightarrow$ Callback Queue). Network requests use OS polling (`epoll`/`kqueue`) instead of the thread pool.

---

### 2.11 Promise, `async/await`, `==` vs `===` & `this` / `call` / `apply` / `bind`

* **Promise:** An object representing a future value (`pending` $\rightarrow$ `fulfilled` or `rejected`). `.then()` runs on success; `.catch()` runs on error—both enter the Microtask Queue.
* **`async / await`:** `async` makes a function return a Promise; `await` pauses *only that function* until the Promise settles, letting the rest of the code continue cleanly with `try / catch`.
  ```javascript
  // Promise.all vs allSettled vs race vs any
  const [users, tasks] = await Promise.all([api.get('/users'), api.get('/tasks')]);
  ```
* **`==` vs `===`:** `==` converts types before comparing (`'5' == 5` $\rightarrow$ `true`, `0 == ''` $\rightarrow$ `true`, `null == undefined` $\rightarrow$ `true`). `===` compares both value and type (`'5' === 5` $\rightarrow$ `false`). Always use `===`.
* **`this` & `.call()` / `.apply()` / `.bind()`:**
  ```javascript
  const user = { name: 'Habib', hi() { console.log(this.name); } };
  user.hi();             // "Habib" (this = user)
  const f = user.hi;
  f();                   // undefined (lost its object!)

  function greet(city, country) { console.log(this.name, city, country); }
  greet.call(user, 'Dhaka', 'BD');     // runs now, args comma-separated
  greet.apply(user, ['Dhaka', 'BD']);  // runs now, args as array
  const later = greet.bind(user, 'Dhaka');
  later('BD');                         // returns a NEW bound function to run later
  ```
* **Prototype Chain:** Every object has a hidden `[[Prototype]]` link. If a property isn't on `arr` itself (`arr.map`), JS walks up `Array.prototype` $\rightarrow$ `Object.prototype` $\rightarrow$ `null`.
* **Garbage Collection:** JS frees memory for unreachable objects (**Mark-and-Sweep**). Memory leaks in React happen when `useEffect` forgets to clean up `setInterval` timers or `window` event listeners.

---

## 3. JSX, Modules, Fragments & DOM Events

### 3.1 `.jsx` vs `.js` Files

* **`.js`:** Plain JavaScript modules with no HTML-like tags—used for utilities, custom hooks, and API layers (`src/api/client.js`, `src/api/tasks.js`, `src/hooks/useDebounce.js`).

* **`.jsx`:** JavaScript XML files containing JSX syntax (`<div>`, `<TaskCard />`), which Vite/esbuild transpiles into `React.createElement(...)` calls (`src/App.jsx`, `src/pages/TasksPage.jsx`).

### 3.2 `export default function` vs `export function` (Named Export)

| Syntax | How to Import | Rule | 
| ----- | ----- | ----- | 
| `export default function TasksPage()` | `import TasksPage from './TasksPage'` | Only **one** default export per file; importer can choose any local name. | 
| `export function useDebounce()` | `import { useDebounce } from './useDebounce'` | **Multiple** named exports allowed per file; importer **must** use the exact name inside `{ }`. | 

### 3.3 `<div>...</div>` vs Fragment `<>...</>`

* JSX expressions must return a **single parent element**.

* **`<div>`:** Adds a real HTML `<div>` node to the DOM (which can interfere with CSS Flexbox/Grid layouts or table structures if nested unnecessarily).

* **`<>...</>` (React Fragment):** Groups multiple sibling elements **without adding any extra node to the real DOM**. (Use `<React.Fragment key={id}>` when mapping a list that needs a `key`).

### 3.4 `e.preventDefault()` vs `e.stopPropagation()`

* **`e.preventDefault()`:** Stops the **browser's default action** for an element—such as stopping a `<form>` submission from reloading the page, or stopping a `<Link>` / `<a>` tag from navigating.

* **`e.stopPropagation()`:** Stops the event from **bubbling up** the DOM tree to parent elements.

* *Why both are used in `TaskCard.jsx`:* The entire card is wrapped in `<Link to="/tasks/${task.id}">`. Inside it sits a **Mark Done** `<button>`. Clicking that button calls both `e.preventDefault()` and `e.stopPropagation()` so clicking the button toggles status *without* triggering the outer `<Link>` navigation.

### 3.5 Window Event Listeners & `alert()`

* **`window.addEventListener('keydown', handleKeyDown)` / `window.removeEventListener(...)`:** Used inside `Modal.jsx`'s `useEffect` to close the modal when the user presses `Escape`. Removing the listener in the cleanup function prevents memory leaks and duplicate handlers when the modal closes.

* **`alert()` / `window.confirm()`:** Synchronous browser dialog APIs (`window.confirm('Delete this task?')` returns `true` on OK, `false` on Cancel). Useful for quick prototypes, though production apps often replace them with custom modals and toast notifications.

---

## 4. React Core & Lifecycle

### 4.1 Render Cycle & Virtual DOM

```text
+--------------------+     +--------------------+     +--------------------+
| State/Props Change | --> |   Render Phase     | --> |   Commit & Paint   |
| (mount / setState) |     | (run fn, Virtual   |     | (patch changed     |
+--------------------+     |  DOM diffing)      |     |  real DOM nodes)   |
         ^                 +--------------------+     +---------+----------+
         |                                                      |
         |                                                      v
+--------------------+     +--------------------+     +--------------------+
|   Data Arrives     | <-- |    Effect Runs     | <-- |  Deps Changed?     |
|  (setState called) |     | (cleanup old first,|     |  NO -> Idle / Skip |
+--------------------+     |  then fetch/timer) |     |  YES -> Run Effect |
                           +--------------------+     +--------------------+
```

1. **Trigger:** Initial mount, `setState` call, parent re-render, or Context value change.

2. **Render Phase (Pure & Synchronous):** React calls your component function from top to bottom, runs `useMemo` synchronously, and builds a new **Virtual DOM** tree.

3. **Commit & Paint Phase:** React diffs the new Virtual DOM against the previous one and patches **only the changed nodes** in the real browser DOM.

4. **Effect Phase (After Paint):** React runs cleanup functions from any previous effect whose dependencies changed, then executes the new `useEffect` callbacks.

### 4.2 Class Lifecycle vs Modern Hooks

| Lifecycle Stage | Class Component | Functional Component (Hooks) | 
| ----- | ----- | ----- | 
| **State Init** | `constructor` / `this.state = {}` | `useState(initialValue)` | 
| **Mount (1st render)** | `componentDidMount()` | `useEffect(() => { ... }, [])` | 
| **Update (dep change)** | `componentDidUpdate()` | `useEffect(() => { ... }, [dep1, dep2])` | 
| **Unmount / Cleanup** | `componentWillUnmount()` | `return () => { ... }` inside `useEffect` | 

### 4.3 Why `<StrictMode>` Runs `useEffect` Twice in Development

* In development, React 18+ intentionally runs **Mount** $\rightarrow$ **Unmount** $\rightarrow$ **Remount** on every component inside `<StrictMode>`.

* **Purpose:** Exposes missing cleanup functions (like unclosed timers, unremoved `keydown` listeners, or uncanceled `fetch`/`axios` calls) immediately during development. In production builds (`npm run build`), it runs only **once**.

---

## 5. All Hooks Used in TaskPulse

> **Rules of Hooks:** (1) Call hooks **only at the top level** of a React function component or custom hook—never inside `if`, loops, or nested callbacks. (2) Only call hooks from React functions.

| Hook | Purpose | Where & Why Used in TaskPulse | 
| ----- | ----- | ----- | 
| **`useState`** | Component memory that triggers a re-render when updated via its setter. Supports **lazy initialization** (`useState(() => localStorage.getItem('token'))`) so expensive reads run only once on mount. | `tasks`, `loading`, `error`, `retryCount`, `searchInput`, `isCreateOpen`, `AuthProvider` (`user`, `token`). | 
| **`useEffect`** | Runs side effects (API calls, timers, event listeners) **after** the screen paints. | Fetching tasks, syncing debounced search to URL, `Escape` key listener in `Modal`, auto-focusing input in `TaskForm`. | 
| **`useRef`** | Returns `{ current: value }` that persists across renders **without triggering re-renders** when mutated. | `titleInputRef` in `TaskForm.jsx` to call `titleInputRef.current?.focus()` when the modal opens. | 
| **`useContext`** | Subscribes to a React Context to read global state without prop drilling. | Wrapped inside our custom `useAuth()` hook to read `{ user, token, login, logout }` anywhere. | 
| **`useMemo`** | Caches the **computed return value** of an expensive calculation during render until dependencies change. | `DashboardPage.jsx`: caches `stats` (`.reduce()`) and `recentTasks` (`.sort().slice(0, 5)`) so they only recompute when `tasks` changes. | 
| **`useCallback`** | Caches a **function reference** between renders so memoized child components (`React.memo`) don't re-render needlessly. | Interview essential alongside `useMemo`. | 
| **`useDebounce`** *(Custom)* | Delays updating a rapidly changing value until `delay` ms after the last change. | `TasksPage.jsx`: delays updating `?q=` for `300ms` while typing in the search bar so 6 keystrokes fire 1 API call instead of 6. | 

### Deep Dive: `useEffect` Dependency Array Variations

* **`useEffect(fn)` (No array):** Runs after **every single render** (calling `setState` inside causes an infinite loop).

* **`useEffect(fn, [])` (Empty array):** Runs **once** after the initial mount.

* **`useEffect(fn, [dep1])` (Single dependency):** Runs on mount + whenever `dep1` changes (`Object.is` comparison).

* **`useEffect(fn, [page, query, status, priority, sort, retryCount])` (Multiple dependencies):** Runs on mount + whenever **any one** of those dependencies changes. In `TasksPage.jsx`, changing page, search query, filter, sort, or clicking Retry automatically triggers a fresh fetch.

---

## 6. React Router v6+

### 6.1 Core Router Components & Hooks

* **`<BrowserRouter>`:** Wraps `<App />` in `main.jsx`. Connects React to the browser's HTML5 History API (`window.location`, `pushState`) so URL changes swap components without full page reloads.

* **`<Routes>` & `<Route>`:** `<Routes>` inspects the current URL and renders the **single best-matching** `<Route path="..." element={<Component />} />`. Supports nested layout routes using `<Outlet />` (`AppLayout` renders `Navbar` + `Sidebar` around `<Outlet />`).

* **`<Link>` vs `<NavLink>`:**

  * `<Link to="/tasks">`: Declarative SPA navigation without page reload (replaces `<a href>`).

  * `<NavLink to="/tasks">`: Same as `<Link>`, but automatically knows whether its `to` path matches the current URL (`isActive`), making it ideal for highlighting active sidebar links.

* **`useNavigate()` vs `<Navigate>`:**

  * `const navigate = useNavigate()` (**Hook**): Imperative navigation inside event handlers or async functions after an action finishes (e.g., `navigate('/')` after login succeeds, or `navigate('/tasks', { replace: true })` after deleting a task).

  * `<Navigate to="/login" replace />` (**Component**): Declarative redirect during render based on a condition (used inside `ProtectedRoute.jsx` when `!token`). `{ replace: true }` overwrites the current history entry so pressing Back doesn't loop back to the restricted page.

### 6.2 `useParams()` vs `useSearchParams()` vs `URLSearchParams`

| Feature | `useParams()` | `useSearchParams()` | 
| ----- | ----- | ----- | 
| **Reads From** | Dynamic path segments (`/tasks/:id` $\rightarrow$ `id = "5"`) | Query string after `?` (`/tasks?status=todo&page=2`) | 
| **Read / Write?** | **Read-only** | **Read AND Write** (`[searchParams, setSearchParams]`) | 
| **Primary Use** | Item detail pages (`TaskDetailsPage.jsx`) | Search, filters, sorting, pagination (`TasksPage.jsx`) | 

* **How `query = searchParams.get('q') || ''` works:**

  * `searchParams.get('q')` looks for `?q=...` in the URL. If present (e.g., `?q=Router`), it returns `'Router'`; if absent, it returns `null`.

  * The `|| ''` fallback turns `null` into an empty string `''` so controlled inputs and `if (query)` checks never break.

* **`new URLSearchParams(searchParams)`:** Creates a mutable clone of the current URL query parameters so we can safely call `.set('page', '1')` or `.delete('q')` before passing `next` into `setSearchParams(next)`.

---

## 7. Authentication, Context API & `localStorage`

### 7.1 `localStorage` API (All 5 Methods)

`localStorage` is a browser Web Storage API that stores string key–value pairs persistently across tab closes and browser reloads (\~5MB limit per origin):

1. `localStorage.setItem(key, value)` — Saves a string (use `JSON.stringify(obj)` for objects).

2. `localStorage.getItem(key)` — Reads a string by key (returns `null` if missing; use `JSON.parse()` for objects).

3. `localStorage.removeItem(key)` — Deletes a single key (used on `logout()`).

4. `localStorage.clear()` — Wipes all keys stored for the current domain.

5. `localStorage.key(index)` — Returns the key name at numeric position `index`.

### 7.2 How `AuthProvider` and `useAuth()` Work Together

1. **Create Context:** `const AuthContext = createContext(null);`

2. **Provide State (`AuthProvider` in `src/context/AuthContext.jsx`):**

   * Initializes `user` and `token` lazily from `localStorage` so sessions survive `F5`.

   * Defines `login(email, password)`: queries `GET /users?email=...&password=...`, verifies `res.data.length === 1`, generates a token, saves both to `localStorage`, and updates React state (`setUser`, `setToken`).

   * Defines `logout()`: removes `user` and `token` from `localStorage` and resets state to `null`.

   * Wraps `{children}` in `<AuthContext.Provider value={{ user, token, login, logout }}>`.

3. **Consume Cleanly (`useAuth`):**

   ```javascript
   export const useAuth = () => useContext(AuthContext);
   ```

   Any component (`ProtectedRoute`, `LoginPage`, `Navbar`) simply calls `const { user, token, logout } = useAuth()` without importing `AuthContext` or `useContext` directly.

---

## 8. Frontend–Backend Connection

### 8.1 How Frontend & Backend Connect (`src/api/client.js`)

Our React app runs on `http://localhost:5173` (Vite) and communicates over HTTP with `json-server` running on `http://localhost:4000`.

```javascript
// src/api/client.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
});

// Request Interceptor: runs automatically before EVERY API request leaves the browser
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

* **Why `axios.create({ baseURL })`?** Avoids repeating `http://localhost:4000` in every file and lets you switch to a deployed Go/Node backend later by changing one environment variable (`VITE_API_URL`).

### 8.2 `fetch` vs `axios`

| Feature | `fetch` (Built-in Browser API) | `axios` (Library) | 
| ----- | ----- | ----- | 
| **JSON Parsing** | Manual (`const data = await res.json()`) | Automatic (`res.data`) | 
| **HTTP Error Handling (404/500)** | Does **not** reject Promise; must check `if (!res.ok)` | Automatically rejects Promise and jumps to `catch` | 
| **Interceptors** | Not built-in | Built-in (`api.interceptors.request/response`) | 
| **Query Params** | Must manually build `URLSearchParams` string | Pass `{ params: { _page: 1, status: 'todo' } }` directly | 

### 8.3 `AbortController` & Race Condition Prevention

* **Problem (Race Condition):** User types `"R"` (slow request takes 800ms), then types `"Re"` (fast request takes 100ms). Without cancellation, `"Re"` renders first, and 700ms later the stale `"R"` response arrives and overwrites the screen with wrong results.

* **Solution:**

  ```javascript
  useEffect(() => {
    const controller = new AbortController();
    getTasks(params, controller.signal)
      .then((res) => setTasks(res.data))
      .catch((err) => {
        if (err.name === 'CanceledError' || err.name === 'AbortError') return;
        setError(err.message);
      });
    return () => controller.abort(); // Cancels old request when deps change or unmount
  }, [page, query, status]);
  ```

### 8.4 Optimistic UI Update (`TasksPage.jsx`)

1. **Snapshot:** Save current state (`const previousTasks = tasks`).

2. **Immediate Update:** Update `tasks` in state *before* awaiting the API (`setTasks(...)`), giving instant visual feedback with zero spinner lag.

3. **Persist & Rollback:** Call `await updateTask(id, { status: nextStatus })`. If the network call fails, `catch` restores `setTasks(previousTasks)`.

---

## 9. TaskPulse End-to-End Execution Trace (Phases 0–5)

```text
[TasksPage.jsx]  -->  [Modal.jsx]  -->  [TaskForm.jsx]  -->  [tasks.js: createTask()]
       |
       +-->  [TaskList.jsx]  -->  [TaskCard.jsx]  -->  (Mark Done) --> [TasksPage: handleToggleStatus()]
                                        |
                                 (Click Card)
                                        v
                             [TaskDetailsPage.jsx]  -->  [tasks.js: getTask(), deleteTask()]
                                        |
                                   (Click Edit)
                                        v
                                   [Modal.jsx]  -->  [TaskForm.jsx]  -->  [tasks.js: updateTask()]
```

1. **Boot (`main.jsx`):** Renders `<BrowserRouter><AuthProvider><App /></AuthProvider></BrowserRouter>`. `AuthProvider` reads `localStorage` synchronously.

2. **Route Guard (`App.jsx`** $\rightarrow$ **`ProtectedRoute.jsx`):** Visiting `/` hits `<ProtectedRoute>`. If `token` is `null`, `<Navigate to="/login" replace />` redirects to `/login`.

3. **Login (`LoginPage.jsx`):** `handleSubmit` calls `e.preventDefault()`, validates `@` and password length, calls `await login(email, password)`, stores user + token, and runs `navigate('/')`.

4. **Dashboard (`DashboardPage.jsx`):** Renders `<Skeleton count={4} />` while `loading === true`. After paint, `useEffect` fetches all tasks with `AbortController`. `useMemo` computes `stats` (`.reduce()`) and `recentTasks` (newest 5).

5. **Tasks Management (`TasksPage.jsx`):**

   * Reads `page`, `q`, `status`, `priority`, `sort` from `useSearchParams()`.

   * Typing updates `searchInput` immediately $\rightarrow$ `useDebounce(searchInput, 300)` waits 300ms $\rightarrow$ updates `?q=...&page=1` in URL.

   * Fetch `useEffect` requests `_page`, `_limit: 6`, filters, and sort from `json-server`, reading `res.headers['x-total-count']` to render `<Pagination />`.

   * Clicking **+ New Task** opens `<Modal>` + `<TaskForm>` (`useRef` auto-focuses Title) and calls `createTask()`.

   * Clicking **Mark Done** on `<TaskCard>` runs `e.preventDefault()` + `e.stopPropagation()` and triggers optimistic `handleToggleStatus()`.

6. **Task Details (`TaskDetailsPage.jsx`):** Clicking a card navigates to `/tasks/:id`, fetches via `useParams()` + `getTask(id)`, edits via the same `<Modal>` + `<TaskForm>` (`initialData={task}`), or deletes via `deleteTask(id)` + `navigate('/tasks', { replace: true })`.

---

## 10. Top 30 Interview Questions & Rapid Answers

 1. **What is the Virtual DOM and how does React update the screen?**
    An in-memory lightweight copy of the real DOM. On state/prop change, React creates a new Virtual DOM tree, diffs it against the old one (Reconciliation), and updates only the changed nodes in the real DOM.

 2. **Why must state updates in React be immutable?**
    React compares object/array references (`Object.is`). Mutating with `.push()` keeps the same reference, so React assumes nothing changed and skips re-rendering.

 3. **Why shouldn't you use array index as `key` in `.map()`?**
    When items are deleted, added, or reordered, array indexes shift, causing React to mismatch component state, input focus, and DOM nodes. Use a stable unique ID (`task.id`).

 4. **Explain the execution order of `useEffect` and its cleanup function.**
    Render runs $\rightarrow$ DOM updates & browser paints $\rightarrow$ cleanup from the *previous* render runs (if dependencies changed) $\rightarrow$ new `useEffect` runs. On unmount, only cleanup runs.

 5. **What is the difference between `useEffect(fn)`, `useEffect(fn, [])`, and `useEffect(fn, [a, b])`?**
    Runs after every render / runs once on mount / runs on mount and whenever `a` or `b` changes.

 6. **How do you prevent race conditions when fetching data in `useEffect`?**
    Create an `AbortController`, pass `controller.signal` to `fetch`/`axios`, and call `controller.abort()` inside `useEffect`'s cleanup function.

 7. **Why does `useEffect` run twice on mount in React 18 development?**
    `<StrictMode>` intentionally mounts, unmounts, and remounts components in development to surface missing cleanup logic and side-effect bugs.

 8. **`useState` vs `useRef`?**
    Both persist values across renders, but `setState` triggers a re-render while mutating `ref.current` does not. `useRef` also accesses real DOM nodes (`inputRef.current.focus()`).

 9. **`useMemo` vs `useCallback`?**
    `useMemo` calls a function during render and caches its **return value**; `useCallback` caches the **function reference itself** without calling it (useful when passing callbacks to `React.memo` children).

10. **How does `useDebounce` work internally?**
    Inside `useEffect`, it starts a `setTimeout` to update debounced state after `delay` ms, and returns `() => clearTimeout(timerId)` so every new keystroke cancels the previous pending timer.

11. **Controlled vs Uncontrolled components?**
    Controlled: React state owns the input value via `value` + `onChange`. Uncontrolled: the DOM owns the value and you read it via `useRef`.

12. **When should you use Context API vs props vs Zustand/Redux?**
    Props for 1–2 levels; Context for low-frequency global state (`auth`, `theme`); Zustand/Redux/TanStack Query for high-frequency shared client state or server caching.

13. **`<Link>` vs `useNavigate()` vs `<Navigate>`?**
    `<Link>` for user-clicked navigation; `useNavigate()` for programmatic navigation after logic/API calls; `<Navigate>` for conditional redirects during render (like `ProtectedRoute`).

14. **`useParams()` vs `useSearchParams()`?**
    `useParams` reads dynamic route segments (`/tasks/:id`); `useSearchParams` reads and updates URL query strings (`?status=todo&page=2`).

15. **Why store filter and pagination state in the URL (`useSearchParams`) instead of `useState`?**
    So filters and page numbers survive `F5` refreshes, work with browser Back/Forward buttons, and can be bookmarked or shared via link.

16. **How does an Axios Request Interceptor work?**
    It intercepts every outgoing HTTP request before it leaves the app, allowing centralized injection of headers like `Authorization: Bearer <token>`.

17. **What is Optimistic UI?**
    Updating the UI immediately when the user acts (assuming success) before the server responds, and rolling back to the previous state snapshot if the API request fails.

18. **`e.preventDefault()` vs `e.stopPropagation()`?**
    `preventDefault()` cancels the browser's default behavior (form reload, link navigation); `stopPropagation()` stops the event from bubbling up to parent elements.

19. **What is a Closure in JavaScript?**
    A function bundled with its parent's lexical environment, allowing it to access outer variables even after the outer function has finished executing.

20. **Explain the JavaScript Event Loop order.**
    Run all synchronous code on the Call Stack $\rightarrow$ empty the entire Microtask Queue (`Promises`, `await`) $\rightarrow$ run one task from the Callback Queue (`setTimeout`, DOM events) $\rightarrow$ repeat.

21. **Hoisting & Temporal Dead Zone (TDZ)?**
    `var` is hoisted as `undefined`; function declarations are hoisted completely; `let`/`const` are hoisted into the TDZ and throw `ReferenceError` if accessed before declaration.

22. **HTTP status codes every frontend developer must know?**
    `200` OK, `201` Created, `400/422` Validation error, `401` Unauthenticated (redirect to login), `403` Forbidden, `404` Not Found, `500` Server Error.

23. **What is CORS and where is it fixed?**
    Cross-Origin Resource Sharing—a browser security policy blocking requests to a different origin unless the **backend server** includes `Access-Control-Allow-Origin` headers.

24. **Where should JWT tokens be stored in production?**
    `localStorage` is simple for learning/demos but vulnerable to XSS scripts; `httpOnly` + `Secure` + `SameSite` cookies set by the backend are safer against XSS.

25. **`package.json` vs `package-lock.json`?**
    `package.json` defines project dependencies and scripts; `package-lock.json` locks exact sub-dependency versions for reproducible installs.

26. **How does Tailwind CSS work?**
    Utility-first CSS framework that scans source files (`content` in `tailwind.config.js`) and generates a minimal CSS bundle containing only the utility classes actually used.

27. **`PATCH` vs `PUT`?**
    `PUT` replaces the entire resource; `PATCH` updates only the specified fields (e.g., `{ status: 'done' }`).

28. **How do you make a Modal accessible?**
    Close on `Escape` key (`keydown` listener with cleanup), close on backdrop click (`e.target === e.currentTarget`), auto-focus the first input (`useRef`), and include proper `<label>` / `aria-label` attributes.

29. **What is `<div>` vs `<>...</>` (Fragment)?**
    `<div>` inserts a real DOM element; `<>...</>` groups sibling JSX elements without adding extra nodes to the DOM.

30. **Why `.trim()` user inputs?**
    Strips leading/trailing whitespace so whitespace-only strings (`"   "`) fail required validation and search queries don't miss matches due to accidental spaces.