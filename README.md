# GenOS

**GenOS — Build AI workflows, not just prompts.**

GenOS is a CLI-based, local-first AI orchestration runtime.
It lets you build AI systems using graphs that combine LLMs, tools, functions, and RAG.

---

## 🚀 Why GenOS?

Most AI tools focus on prompts.

GenOS focuses on **systems**.

With GenOS, you can:

* Chain LLMs, tools, and functions
* Build RAG pipelines
* Run everything locally (Ollama-friendly)
* Define workflows using simple JSON graphs
* Extend behavior with custom functions

---

## 🧠 Core Idea

GenOS works like an operating system for AI:

* **State** → memory
* **Nodes** → execution units
* **Tools** → system calls
* **Graphs** → workflows

---

## ⚙️ Installation

```bash
npm install -g genos
```

---

## 🏁 Quick Start

```bash
genos init
genos create project help-bot
genos run help-bot
```

---

## 🧩 Example Projects

### 1. Help Bot (RAG)

* Ask questions from documents
* Uses embeddings + LLM

### 2. Weather Info Bot (Tool chaining)

* Extract city → geocode → fetch weather

### 3. Document Analyzer (Local automation)

* Read files → summarize → extract insights

---

## 📂 Workspace Structure

```
workspace/
├─ genos.config.json
├─ projects/
├─ embeddings/
└─ .genos/
```

---

## 🔧 Features

* Graph-based execution engine
* Tool integration (HTTP + local)
* Function plugins
* RAG support
* CLI-first workflow
* Debugging (trace + doctor)

---

## 🧪 Example Workflow

```
input → llm → function → tool → llm → output
```

---

## 🛠 Built-in Concepts

* **LLM nodes** → reasoning
* **Function nodes** → logic
* **Tool nodes** → actions
* **RAG nodes** → knowledge

---

## 🔍 Debugging

```bash
genos doctor
genos run <project> --trace
```

---

## 🌱 Philosophy

GenOS treats AI as a **system**, not a single model call.

---

## 📌 Status

GenOS is in **v0.1** — early but functional.

---

## 🤝 Contributing

Contributions, ideas, and feedback are welcome.
