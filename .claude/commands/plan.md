---
allowed-tools: Task, TaskOutput, Read, Grep, Glob, TodoWrite, AskUserQuestion
description: Create implementation plan with expert consultation (project)
argument-hint: [planning_request]
---

# Universal Planning Command

Create an implementation plan for the user's request. Automatically consults domain experts (LINE Bot, Shioaji) when the request involves their areas.

## Variables

USER_PROMPT: $1
PLAN_OUTPUT_DIRECTORY: `specs/`

## Instructions

- Analyze USER_PROMPT to determine if it involves LINE Bot or Shioaji domains
- If domain expertise is needed, spawn subagent to consult the appropriate expert FIRST
- Explore the codebase to understand existing patterns and architecture
- Create a concrete implementation plan with specific file paths and steps
- If anything is unclear, use AskUserQuestion to clarify with the user

## Workflow

### Step 1: Domain Detection

Analyze USER_PROMPT for domain keywords:

**LINE Bot indicators**: line, bot, webhook, messaging, flex message, reply, push, template, quick reply, rich menu, LINE SDK

**Shioaji indicators**: shioaji, 永豐, 股票, 交易, order, 證券, 期貨, 選擇權, tick, kbar, quote, 下單

### Step 2: Expert Consultation (if applicable)

**IMPORTANT**: If both domains are involved, spawn BOTH subagents IN PARALLEL (single message with multiple Task tool calls).

If LINE Bot related, spawn subagent:
```
Task(
  subagent_type: "general-purpose",
  prompt: "Run SlashCommand('/line_bot_expert:question [relevant aspect of USER_PROMPT]'). Return the answer with key insights for implementation."
)
```

If Shioaji related, spawn subagent:
```
Task(
  subagent_type: "general-purpose",
  prompt: "Run SlashCommand('/shioaji_expert:question [relevant aspect of USER_PROMPT]'). Return the answer with key insights for implementation."
)
```

Use TaskOutput to retrieve expert insights before proceeding. If both experts were consulted, integrate their insights.

### Step 3: Codebase Exploration

- Use Glob to find relevant files
- Use Grep to search for existing patterns
- Use Read to understand current implementation

### Step 4: Create Plan

Compile findings into a structured implementation plan.

### Step 5: Clarification (if needed)

If any aspect is unclear or has multiple valid approaches, use AskUserQuestion to verify with the user.

## Plan Format

Follow this format when creating implementation plans:

```md
# Plan: <task name>

## Task Description
<describe the task in detail based on the prompt>

## Objective
<clearly state what will be accomplished when this plan is complete>

<if task_type is feature or complexity is medium/complex, include these sections:>
## Problem Statement
<clearly define the specific problem or opportunity this task addresses>

## Solution Approach
<describe the proposed solution approach and how it addresses the objective>
</if>

## Relevant Files
Use these files to complete the task:

<list files relevant to the task with bullet points explaining why. Include new files to be created under an h3 'New Files' section if needed>

<if complexity is medium/complex, include this section:>
## Implementation Phases
### Phase 1: Foundation
<describe any foundational work needed>

### Phase 2: Core Implementation
<describe the main implementation work>

### Phase 3: Integration & Polish
<describe integration, testing, and final touches>
</if>

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

<list step by step tasks as h3 headers with bullet points. Start with foundational changes then move to specific changes. Last step should validate the work>

### 1. <First Task Name>
- <specific action>
- <specific action>

### 2. <Second Task Name>
- <specific action>
- <specific action>

<continue with additional tasks as needed>

<if task_type is feature or complexity is medium/complex, include this section:>
## Testing Strategy
<describe testing approach, including unit tests and edge cases as applicable>
</if>

## Acceptance Criteria
<list specific, measurable criteria that must be met for the task to be considered complete>

## Validation Commands
Execute these commands to validate the task is complete:

<list specific commands to validate the work. Be precise about what to run>
- Example: `uv run python -m py_compile apps/*.py` - Test to ensure the code compiles

## Notes
<optional additional context, considerations, or dependencies. If new libraries are needed, specify using `uv add`>
```

## Report

After creating and saving the implementation plan, provide a concise report with the following format:

```
✅ Implementation Plan Created

File: PLAN_OUTPUT_DIRECTORY/<filename>.md
Topic: <brief description of what the plan covers>
Key Components:
- <main component 1>
- <main component 2>
- <main component 3>
```
