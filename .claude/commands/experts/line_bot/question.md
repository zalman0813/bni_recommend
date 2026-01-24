---
allowed-tools: Bash, Read, Grep, Glob, TodoWrite
description: Answer questions about LINE Bot SDK, webhooks, and messaging API without coding
argument-hint: [question]
---

# LINE Bot Expert - Question Mode

Answer the user's question by analyzing the LINE Bot implementation, SDK usage, webhook handling, and message types in this project. This prompt is designed to provide information about the LINE integration without making any code changes.

## Variables

USER_QUESTION: $1
EXPERTISE_PATH: .claude/commands/line_bot_expert/expertise.yaml
AI_DOCS_PATH: ai_docs/

## Instructions

- IMPORTANT: This is a question-answering task only - DO NOT write, edit, or create any files
- Focus on LINE Bot SDK v3, webhook events, message types, Flex Messages, and API patterns
- If the question requires implementation changes, explain the approach conceptually without implementing
- With your expert knowledge, validate the information from `EXPERTISE_PATH` against the codebase before answering

## Workflow

- Read the `EXPERTISE_PATH` file to understand LINE Bot architecture and patterns
- Review relevant ai_docs files for detailed LINE API documentation
- Review, validate, and confirm information from `EXPERTISE_PATH` against the codebase
- Respond based on the `Report` section below

## Report

- Direct answer to the `USER_QUESTION`
- Supporting evidence from `EXPERTISE_PATH` and the codebase
- References to the exact files and lines of code that support the answer
- High-mid level conceptual explanations of LINE Bot patterns
- Include code snippets or JSON examples where appropriate to streamline communication
