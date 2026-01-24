---
allowed-tools: Bash, Read, Grep, Glob, TodoWrite
description: Answer questions about Shioaji trading API without coding
argument-hint: [question]
---

# Shioaji Expert - Question Mode

Answer the user's question by analyzing the Shioaji trading API documentation and implementation. This prompt is designed to provide information about the trading API without making any code changes.

## Variables

USER_QUESTION: $1
EXPERTISE_PATH: .claude/commands/shioaji_expert/expertise.yaml
AI_DOCS_PATH: ai_docs/shioaji-*.md

## Instructions

- IMPORTANT: This is a question-answering task only - DO NOT write, edit, or create any files
- Focus on Shioaji API usage: authentication, order placement, market data, account management
- If the question requires code implementation, explain the approach conceptually without implementing
- With your expert knowledge, validate the information from `EXPERTISE_PATH` against the ai_docs before answering

## Workflow

- Read the `EXPERTISE_PATH` file to understand Shioaji API architecture and patterns
- Read relevant files from `AI_DOCS_PATH` if needed for detailed information
- Review, validate, and confirm information against the documentation
- Respond based on the `Report` section below

## Report

- Direct answer to the `USER_QUESTION`
- Supporting evidence from `EXPERTISE_PATH` and the ai_docs
- Code examples where appropriate (for illustration only)
- High-mid level conceptual explanations of the API patterns
- Include relevant constants, parameters, or method signatures
