---
allowed-tools: Read, Grep, Glob, Bash, Edit, Write, TodoWrite
description: Self-improve LINE Bot expertise by validating against codebase implementation
argument-hint: [check_git_diff (true/false)] [focus_area (optional)]
---

# Purpose

You maintain the LINE Bot expert system's expertise accuracy by comparing the existing expertise file against the actual codebase implementation. Follow the `Workflow` section to detect and remedy any differences, missing pieces, or outdated information, ensuring the expertise file remains a powerful **mental model** and accurate memory reference for LINE Bot related tasks.

## Variables

CHECK_GIT_DIFF: $1 default to false if not specified
FOCUS_AREA: $2 default to empty string
EXPERTISE_FILE: .claude/commands/line_bot_expert/expertise.yaml
AI_DOCS_PATH: ai_docs/
MAX_LINES: 500

## Instructions

- This is a self-improvement workflow to keep LINE Bot expertise synchronized with the actual codebase
- Think of the expertise file as your **mental model** and memory reference for all LINE Bot functionality
- Always validate expertise against real implementation, not assumptions
- Focus exclusively on LINE Bot related functionality (SDK usage, webhooks, messages, Flex, actions)
- If FOCUS_AREA is provided, prioritize validation and updates for that specific area
- Maintain the YAML structure of the expertise file
- Enforce strict line limit of 500 lines maximum
- Prioritize actionable, high-value expertise over verbose documentation
- When trimming, remove least critical information that won't impact expert performance
- Git diff checking is optional and controlled by the CHECK_GIT_DIFF variable
- Be thorough in validation but concise in documentation
- Write as a principle engineer that writes CLEARLY and CONCISELY
- Keep in mind, after your thorough search, there may be nothing to be done - this is perfectly acceptable

## Workflow

1. **Check Git Diff (Conditional)**
   - If CHECK_GIT_DIFF is "true", run `git diff` to identify recent changes to LINE Bot related files
   - If changes detected, note them for targeted validation in step 3
   - If CHECK_GIT_DIFF is "false", skip this step

2. **Read Current Expertise**
   - Read the entire EXPERTISE_FILE to understand current documented expertise
   - Identify key sections: overview, sdk_modules, webhook_handling, message_types, flex_messages, etc.
   - Note any areas that seem outdated or incomplete

3. **Validate Against Codebase**
   - Read the EXPERTISE_FILE to identify which patterns are documented
   - Search for actual LINE Bot implementation files in the codebase
   - Compare documented expertise against actual code:
     - SDK import patterns and versions
     - Webhook handler implementation
     - Message sending patterns
     - Error handling approaches
   - If FOCUS_AREA is provided, prioritize validation of that specific area
   - If git diff was checked in step 1, pay special attention to changed areas

4. **Identify Discrepancies**
   - List all differences found:
     - Missing implementation patterns
     - Outdated SDK usage
     - Changed webhook handling
     - New message types used
     - Removed features still documented
     - Incorrect API descriptions

5. **Update Expertise File**
   - Remedy all identified discrepancies by updating EXPERTISE_FILE
   - Add missing information
   - Update outdated information
   - Remove obsolete information
   - Maintain YAML structure and formatting
   - Ensure all patterns are accurate
   - Keep descriptions concise and actionable

6. **Enforce Line Limit**
   - Run: `wc -l .claude/commands/line_bot_expert/expertise.yaml`
   - Check if line count exceeds MAX_LINES (500)
   - If line count > MAX_LINES:
     - Identify least important expertise sections
     - Trim identified sections
     - Run line count check again
     - REPEAT until line count ≤ MAX_LINES
   - Document what was trimmed in the report

7. **Validation Check**
   - Read the updated EXPERTISE_FILE
   - Verify all critical LINE Bot information is present
   - Ensure line count is within limit
   - Validate YAML syntax by compiling the file:
     - Run: `python3 -c "import yaml; yaml.safe_load(open('EXPERTISE_FILE'))"`
     - Confirm no syntax errors are raised
     - If errors occur, fix the YAML structure and re-validate

## Report

Provide a structured report with the following sections:

### Summary
- Brief overview of self-improvement execution
- Whether git diff was checked
- Focus area (if any)
- Total discrepancies found and remedied
- Final line count vs MAX_LINES

### Discrepancies Found
- List each discrepancy identified:
  - What was incorrect/missing/outdated
  - Where in the codebase the correct information was found
  - How it was remedied

### Updates Made
- Concise list of all updates to EXPERTISE_FILE:
  - Added sections/information
  - Updated sections/information
  - Removed sections/information

### Line Limit Enforcement
- Initial line count
- Final line count
- If trimming was needed: what was trimmed and why

### Validation Results
- Confirm all critical LINE Bot expertise is present
- Confirm line count is within limit
- Note any areas that may need future attention

### Codebase References
- List of files validated against
- Key patterns and implementations verified
