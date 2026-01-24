---
allowed-tools: Read, Grep, Glob, Bash, Edit, Write, TodoWrite
description: Self-improve Shioaji expertise by validating against documentation
argument-hint: [focus_area (optional)]
---

# Purpose

You maintain the Shioaji expert system's expertise accuracy by comparing the existing expertise file against the actual documentation. Follow the `Workflow` section to detect and remedy any differences, missing pieces, or outdated information, ensuring the expertise file remains a powerful **mental model** and accurate memory reference for Shioaji-related tasks.

## Variables

FOCUS_AREA: $1 default to empty string
EXPERTISE_FILE: .claude/commands/shioaji_expert/expertise.yaml
AI_DOCS_PATH: ai_docs/shioaji-*.md
MAX_LINES: 500

## Instructions

- This is a self-improvement workflow to keep Shioaji expertise synchronized with the documentation
- Think of the expertise file as your **mental model** and memory reference for all Shioaji API functionality
- Always validate expertise against real documentation, not assumptions
- Focus exclusively on Shioaji-related functionality (Authentication, Orders, Market Data, Account)
- If FOCUS_AREA is provided, prioritize validation and updates for that specific area
- Maintain the YAML structure of the expertise file
- Enforce strict line limit of 500 lines maximum
- Prioritize actionable, high-value expertise over verbose documentation
- When trimming, remove least critical information that won't impact expert performance
- Write clearly and concisely for future reference

## Workflow

1. **Read Current Expertise**
   - Read the entire EXPERTISE_FILE to understand current documented expertise
   - Identify key sections: overview, authentication, order_placement, market_data, etc.
   - Note any areas that seem outdated or incomplete

2. **Read AI Docs**
   - Read all files matching AI_DOCS_PATH pattern
   - Identify key information about Shioaji API

3. **Validate Against Documentation**
   - Compare documented expertise against actual documentation:
     - API methods and parameters
     - Constants and enums
     - Data structures
     - Usage patterns
   - If FOCUS_AREA is provided, prioritize validation of that specific area

4. **Identify Discrepancies**
   - List all differences found:
     - Missing API methods
     - Outdated parameter definitions
     - Changed data structures
     - New features not documented
     - Removed features still documented

5. **Update Expertise File**
   - Remedy all identified discrepancies by updating EXPERTISE_FILE
   - Add missing information
   - Update outdated information
   - Remove obsolete information
   - Maintain YAML structure and formatting

6. **Enforce Line Limit**
   - Run: `wc -l .claude/commands/shioaji_expert/expertise.yaml`
   - Check if line count exceeds MAX_LINES (500)
   - If line count > MAX_LINES:
     - Identify least important sections
     - Trim identified sections
     - REPEAT until line count <= MAX_LINES

7. **Validation Check**
   - Read the updated EXPERTISE_FILE
   - Verify all critical Shioaji information is present
   - Validate YAML syntax:
     - Run: `python3 -c "import yaml; yaml.safe_load(open('EXPERTISE_FILE'))"`

## Report

Provide a structured report:

### Summary
- Focus area (if any)
- Total discrepancies found and remedied
- Final line count vs MAX_LINES

### Discrepancies Found
- List each discrepancy identified
- Where the correct information was found
- How it was remedied

### Updates Made
- Added sections/information
- Updated sections/information
- Removed sections/information

### Validation Results
- Confirm all critical Shioaji expertise is present
- Confirm line count is within limit
- YAML syntax validation result
