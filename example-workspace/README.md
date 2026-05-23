# Example Workspace

The repository includes complete reference workspaces demonstrating different GenOS capabilities.

This workspace contains:
- projects
- embeddings
- functions
- configuration
- generated workflows

## Purpose

Use this example workspace to:

- verify Genos workspace loading and configuration behavior
- experiment with local/open-source model settings
- test document/embedding/project workflows

## Example Projects

### 1. Help Bot (RAG)

Basic conversational workflow with embeddings.

* Ask questions from documents
* Uses embeddings + LLM

```text
input → rag → llm → output
```

### 2. Weather Info Bot (Tool chaining)

Tool orchestration using geocoding + weather APIs.

* Extract city → geocode → fetch weather

```text
input → geocode → weather → llm → output
```

### 3. Research Assistant (Local automation)

Document retrieval and local file-based workflows.

* Read files → summarize → extract insights

```text
input → document search → llm → output
```

## How to use

Clone the repository and open the workspace.

This workspace can be explored, modified, and executed directly using GenOS commands.

```bash
cd example-workspace
genos setup -d
genos doctor
genos run help-bot
```

## Notes

- The workspace is intentionally minimal and designed for experimentation.
- It includes sample documents, embeddings, and project scaffolding for quick validation.
