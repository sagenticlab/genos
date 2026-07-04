# Changelog

All notable changes to GenOS are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), with version numbers following Semantic Versioning.

---

## [0.4.0] - 2026-07-04

### Added

#### Tool System

- Added reusable workspace tools.
- Added HTTP tool support.
- Added built-in tools.
- Added tool creation via the CLI (`genos tool create`).
- Added tool validation.
- Added generic tool execution.

#### Runtime

- Added capability abstraction.
- Added capability registry.
- Added generic input mapping and merging.
- Added runtime resolution of `{{ }}` state expressions.

#### Documentation

- Added tool documentation.
- Updated the README with tool usage and concepts.
- Added CLI documentation for tool commands.

### Changed

- Tools are now first-class workspace resources.
- Projects can invoke reusable tools through Tool Nodes.
- Built-in runtime functionality is exposed as built-in tools.