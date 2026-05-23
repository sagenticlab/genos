# GenOS

Composable graph-based AI orchestration runtime by __Sagentic__.

Build local-first AI systems using workflows, tools, functions, embeddings, and agentic execution.

## Installation

```bash
npm install -g @sagentic/genos
```

# Getting Started

## 1. Install GenOS

```bash
npm install -g @sagentic/genos
```

## 2. Create a Workspace

Create a new GenOS workspace:

```bash
genos workspace create my-genos-workspace
```

Move into the workspace:

```bash
cd my-genos-workspace
```

A workspace contains:

- projects
- embeddings
- functions
- runtime configuration
- generated artifacts

You can create multiple independent GenOS workspaces anywhere on your system.

## 3. Setup Local AI Runtime

GenOS currently uses __Ollama__ as the default local runtime for language models and embeddings.

Install Ollama:

https://ollama.com/download

Then run the guided setup (use `-d` to accept recommended models without prompting):

```bash
genos setup -d
```

The setup command will (interactive by default). Use `-d, --default` to run non-interactively and accept the recommended models.

- detect Ollama
- prompt to choose supported models (or accept recommended defaults with `-d`)
- pull missing models automatically
- validate model connections
- create the following workspace structure
- configure `genos.config.json`

```
my-genos-workspace/
├─ genos.config.json
├─ documents/
├─ projects/
├─ embeddings/
└─ .genos/
```

Recommended starter models:

- `phi3`
- `mxbai-embed-large`

You can verify your environment anytime using:

```bash
genos doctor
```

## 4. Create Your First Project

Create a basic RAG chatbot project:

```bash
genos project create help-bot
```


## 5. Create an Embedding

Create an embedding knowledge base:

```bash
genos embedding create help-docs -o
```

This creates:

```text
embeddings/help-docs/help-docs.txt
```

and opens the file.

## 6. Add Your Knowledge

Add any content you want your bot to learn from to this file.

Example:

```text
GenOS is a graph-based AI orchestration runtime.

It supports:
- graph execution
- tools
- functions
- embeddings
- local-first AI workflows
```


## 7. Build Embeddings

Generate vector embeddings from your documents:

```bash
genos embedding build help-docs
```

The setup command will:

- let you choose an enbedding model from the available models.
- creates the vector embeddings for `help-docs`

## 8. Attach embedding to the project

Attach an existing embedding collection to the project so RAG nodes can use it at runtime. This command registers the embedding name with the project's configuration — it does not (re)build vector data, so make sure you've already run `genos embedding build help-docs` if needed.

Use the `-e, --embedding <name>` flag to specify the collection:

```bash
genos project add help-bot -e help-docs
```

## 9. Configure the Workflow Graph

Open the project config:

```bash
genos project open help-bot   
```

Verify the embedding is listed and that your RAG node references `embedding: help-docs`.

Update the graph to connect:

- user input
- embedding retrieval (RAG)
- language model response
- CLI output

Example:

```yaml
entryNode: start

graph:
  nodes:
    start:
      type: input
      mode: cli
      output: user_input

    search:
      type: rag
      model: mxbai-embed-large
      embedding: help-docs
      input: user_input
      output: context

    answer:
      type: llm
      model: phi3
      context: context
      input:
        - user_input
      output: response

    output:
      type: output
      mode: cli
      input: response

  edges:
    - from: start
      to: search

    - from: search
      to: answer

    - from: answer
      to: output

    - from: output
      to: __end__
```

This workflow creates a simple conversational RAG chatbot.


## 10. Validate the Project

Validate graph structure, resources, and runtime dependencies:

```bash
genos project validate help-bot
```

## 11. Run the Project

Start the chatbot:

```bash
genos run help-bot
```

Example:

```text
> What is GenOS?

GenOS is a graph-based AI orchestration runtime that supports composable AI workflows using graphs, tools, functions, embeddings, and local language models.
```

__Note:__ Response time varies with your system resources and the chosen LLM because models run locally.

# What Just Happened?

Your workflow executed the following graph:

```text
User Input
    ↓
Embedding Search (RAG)
    ↓
LLM Response Generation
    ↓
CLI Output
```

The chatbot:
- retrieves relevant chunks from your documents
- injects them into context
- generates responses using a local language model

# Next Steps

Explore more GenOS capabilities:

- Tool orchestration
- Function nodes
- Multi-step workflows
- Research assistants
- Agent nodes (coming soon)
- Composable project graphs

## What is GenOS?

GenOS is a graph-based AI orchestration runtime for building composable AI systems.

Instead of chaining prompts together, GenOS models execution as a graph of nodes and edges.

A workflow can contain:

- LLM nodes
- Tool nodes
- Function nodes
- Embedding/RAG nodes
- Agent nodes (coming soon)
- Subgraph/project composition (planned)

GenOS combines structured orchestration with optional agentic reasoning.

## Why GenOS?

Most AI systems fall into two extremes:

### Rigid workflows
Predictable but inflexible.

### Autonomous agents
Flexible but difficult to debug and reason about.

GenOS aims to combine the best of both:

- Explicit graph-based execution
- Structured state management
- Tool orchestration
- Reusable project composition
- Optional agentic behavior

## Core Idea

GenOS works like an operating system for AI:

* **State** → memory
* **Nodes** → execution units
* **Tools** → system calls
* **Graphs** → workflows


## Core Concepts

### Projects
A project defines an executable AI workflow.

### Nodes
Nodes perform execution steps such as:
* **LLM nodes** → reasoning
* **Function nodes** → logic
* **Tool nodes** → actions
* **RAG nodes** → knowledge

### State
Execution state is shared across the graph.

### Tools
External capabilities exposed to workflows.

### Embeddings
Local RAG support using chunked vector storage.

### Functions
Custom TypeScript logic integrated into execution.

## Example Flow

```text
User Input
    ↓
LLM Node
    ↓
Tool Node (Geocode)
    ↓
Tool Node (Weather)
    ↓
Response
```


## Example Projects

### 1. Help Bot (RAG)

Basic conversational workflow with embeddings.

* Ask questions from documents
* Uses embeddings + LLM

### 2. Weather Info Bot (Tool chaining)

Tool orchestration using geocoding + weather APIs.

* Extract city → geocode → fetch weather

### 3. Research Assistant (Local automation)

Document retrieval and local file-based workflows.

* Read files → summarize → extract insights


## Debugging

If you need to troubleshoot your GenOS workspace, use the built-in health check and setup commands.

- `genos doctor`
  - Run workspace health checks and identify issues.
- `genos setup -d` (or `genos setup`)
  - Validate your runtime and restore missing dependencies. Use `-d, --default` to run setup non-interactively with the recommended models (`phi3`, `mxbai-embed-large`).

## CLI Commands

This section documents every available `genos` command and subcommand.

### Top-level commands
- `genos init`
  - Initialize a GenOS workspace.
  - Example:

    ```bash
    genos init
    ```

- `genos setup`
  - Run guided environment setup and validate dependencies. Use `-d, --default` to accept the recommended models (`phi3`, `mxbai-embed-large`) without prompting.
  - Example (interactive):

    ```bash
    genos setup
    ```
  - Example (non-interactive, accept defaults):

    ```bash
    genos setup -d
    ```

- `genos build`
  - Build and validate the workspace environment.
  - Example:

    ```bash
    genos build
    ```

- `genos doctor`
  - Run workspace health checks.
  - Example:

    ```bash
    genos doctor
    ```

### Workspace commands
- `genos workspace create <name>`
  - Create a new workspace.
  - Options: `-g, --global` to create workspace in the user home directory (default: current directory).
  - Example:

    ```bash
    genos workspace create my-workspace
    ```
  - Example with global flag:

    ```bash
    genos workspace create my-workspace --global
    ```

### Project commands
- `genos project create <name>`
  - Create a new project.
  - Example:

    ```bash
    genos project create help-bot
    ```

- `genos project validate <name>`
  - Validate a project configuration and runtime.
  - Options: `-t, --trace` for detailed execution logs.
  - Example:

    ```bash
    genos project validate help-bot
    ```
  - Example with trace:

    ```bash
    genos project validate help-bot --trace
    ```

- `genos project run <name>`
  - Run a project.
  - Options: `-t, --trace` for detailed execution logs.
  - Example:

    ```bash
    genos project run help-bot
    ```
  - Example with trace:

    ```bash
    genos project run help-bot -t
    ```

- `genos project add <project>`
  - Add resources to a project.
  - Options:
    - `-f, --function <name>` to add a function
    - `-e, --embedding <name>` to add an embedding
    - `-t, --tool <name>` to add a tool
  - Examples:

    ```bash
    genos project add help-bot -f checkExit
    genos project add help-bot -e help-docs
    genos project add help-bot -t search-tool
    ```

- `genos project open <name>`
  - Open the project configuration file in the default editor.
  - Example:

    ```bash
    genos project open help-bot
    ```

### Embedding commands
- `genos embedding create <name>`
  - Create a new embedding collection.
  - Options: `-o, --open` to open the created file in the editor.
  - Example:

    ```bash
    genos embedding create help-docs
    ```
  - Example with open flag:

    ```bash
    genos embedding create help-docs --open
    ```

- `genos embedding add <name> <fileName>`
  - Add a file to an embedding collection.
  - Example:

    ```bash
    genos embedding add help-docs docs/help.txt
    ```

- `genos embedding remove <name> <fileName>`
  - Remove a file from an embedding collection.
  - Example:

    ```bash
    genos embedding remove help-docs docs/help.txt
    ```

- `genos embedding list <name>`
  - List files in an embedding collection.
  - Example:

    ```bash
    genos embedding list help-docs
    ```

- `genos embedding inspect <name> <fileName>`
  - Inspect a file inside an embedding collection.
  - Example:

    ```bash
    genos embedding inspect help-docs docs/help.txt
    ```

- `genos embedding build <name> [model]`
  - Build the embedding collection using a model.
  - The model parameter is optional; if omitted, you will be prompted to select from configured embedding models.
  - Example:

    ```bash
    genos embedding build help-docs mxbai-embed-large
    ```
  - Example without model (interactive selection):

    ```bash
    genos embedding build help-docs
    ```

- `genos embedding delete <name>`
  - Delete an embedding collection.
  - Example:

    ```bash
    genos embedding delete help-docs
    ```

### Document commands
- `genos document create <name>`
  - Create a new document collection.
  - Example:

    ```bash
    genos document create research-docs
    ```

- `genos document add <name> <fileName>`
  - Add a file to a document collection.
  - Example:

    ```bash
    genos document add research-docs documents/paper.txt
    ```

- `genos document remove <name> <fileName>`
  - Remove a file from a document collection.
  - Example:

    ```bash
    genos document remove research-docs documents/paper.txt
    ```

- `genos document list <name>`
  - List files in a document collection.
  - Example:

    ```bash
    genos document list research-docs
    ```

- `genos document inspect <name> <fileName>`
  - Inspect a file inside a document collection.
  - Example:

    ```bash
    genos document inspect research-docs documents/paper.txt
    ```

- `genos document delete <name>`
  - Delete a document collection.
  - Example:

    ```bash
    genos document delete research-docs
    ```

### List commands
- `genos list projects`
  - List all projects.
  - Example:

    ```bash
    genos list projects
    ```

- `genos list embeddings`
  - List all embeddings.
  - Example:

    ```bash
    genos list embeddings
    ```

- `genos list models`
  - List all configured models.
  - Example:

    ```bash
    genos list models
    ```

- `genos list tools`
  - List all configured tools.
  - Example:

    ```bash
    genos list tools
    ```

## Status

GenOS is in **v0.1.x** — early but functional.


## Roadmap

- [x] Graph-based runtime
- [x] Tool system
- [x] Embeddings/RAG
- [x] Function execution
- [ ] Agent nodes
- [ ] Subgraph/project composition
- [ ] Visual graph debugger
- [ ] Interactive UI

## Philosophy

GenOS treats AI as a **system**, not a single model call.

It is designed around a simple idea:

AI systems should be composable, inspectable, and structured.

Instead of hiding orchestration inside prompts and loops, GenOS makes execution explicit through graphs and reusable runtime primitives.


## Contributing

Contributions, ideas, and discussions are welcome.

GenOS is still in its early stages and evolving rapidly.