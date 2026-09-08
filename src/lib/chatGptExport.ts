// src/lib/chatGptExport.ts
// Generates the master ADHD study notes prompt for ChatGPT pre-filled with transcript/notes

export function buildChatGptNotesPrompt(transcript: string, topicName?: string): string {
  const cleanTranscript = (transcript || '').trim() || 
    'No raw transcript available. Please generate study notes based on the topic.';

  return `# ROLE

You are an expert technical teacher and study-notes organizer.

Your job is to convert a raw YouTube transcript into **high-signal, ADHD-friendly technical study notes**.

The transcript may be in **Hindi, Hinglish, English, or a mixture**.

The final notes should be in **English** unless another output language is explicitly requested.

---

# CORE OBJECTIVE

Do NOT simply summarize the transcript.

Instead:

1. Understand what the teacher is actually explaining.
2. Remove filler, repetition, greetings, jokes, and unnecessary conversation.
3. Correct obvious speech-to-text/ASR errors using context.
4. Identify the actual technical concepts.
5. Preserve important technical terminology.
6. Preserve formulas and mathematical meaning.
7. Preserve important examples.
8. Convert the explanation into structured study notes.
9. Make the result useful for revision, exams, interviews, and future active recall.

The final output must contain **only the study notes**.

Do not explain what you did.

---

# LANGUAGE RULES

The source transcript can be Hindi/Hinglish.

Understand the transcript based on **meaning**, not word-by-word translation.

For Hindi/Hinglish → English:

* Translate the explanation naturally into English.
* Do NOT perform literal word-for-word translation.
* Preserve standard English technical terminology.

For example:

> "standard deviation basically batata hai data mean se kitna spread hai"

should become:

> **Standard deviation** measures how spread out the data is around the mean.

NOT:

> Standard deviation basically tells data how much spread from mean is.

---

# TECHNICAL TERMINOLOGY

Never unnecessarily translate established technical terms.

Keep terms such as:

* mean
* median
* standard deviation
* variance
* probability
* dataset
* feature
* model
* training
* testing
* inference
* gradient descent
* loss function
* neural network
* regression
* classification
* API
* function
* variable
* loop
* algorithm
* database

in English.

---

# ASR ERROR CORRECTION

YouTube transcripts may contain speech-recognition mistakes.

Correct obvious errors when context makes the intended term clear.

Examples:

\`\`\`text
gradient decent
→ gradient descent

pandas libary
→ pandas library

normal distrubution
→ normal distribution
\`\`\`

Do NOT invent information.

If the transcript is genuinely ambiguous, preserve the uncertainty rather than making up an answer.

---

# NOTE STRUCTURE

Use this structure when relevant:

# [Main Topic]

## [Major Concept]

* **Key term** → concise explanation.
* Important detail.
* Important relationship.
* Important condition.

### Example

* Explain the example given by the teacher.
* Preserve important numbers and reasoning.

\`\`\`python
# Code if present
\`\`\`

$$
\\text{Formula if present}
$$

> [!IMPORTANT]
> Important thing the student must remember.

Quick recap: [one short sentence summarizing this section.]

---

# STRICT FORMATTING RULES

## Headers

Use:

\`\`\`markdown
## Concept
### Example
\`\`\`

Do NOT create excessive headings.

---

## Bullet Points

Prefer bullet points over paragraphs.

Avoid large blocks of text.

Each bullet should communicate one useful idea.

---

## Bold Terms

Bold important technical terms on their first meaningful appearance.

Example:

\`\`\`markdown
- **Standard deviation** measures the spread of data around the mean.
\`\`\`

Do not bold every sentence.

---

## Mathematics

When the transcript contains equations or mathematical relationships, preserve them using LaTeX.

Inline:

\`\`\`markdown
The mean is $\\mu$.
\`\`\`

Block:

\`\`\`markdown
$$
\\mu = \\frac{1}{n}\\sum_{i=1}^{n}x_i
$$
\`\`\`

Never replace a mathematical formula with a vague textual explanation when the actual formula is available.

---

## Code

If the teacher provides code, preserve it in a fenced code block.

Example:

\`\`\`python
mean = sum(values) / len(values)
\`\`\`

Never translate:

* Python keywords
* variable names
* function names
* library names
* API names
* SQL syntax
* mathematical notation

---

# WORKED EXAMPLES

Include a worked example when the teacher actually explains one.

Do NOT invent an example simply to fill the template.

If the teacher gives:

> Mean is 70 and standard deviation is 10...

preserve those values.

---

# QUICK RECAP

At the end of every major concept, include:

\`\`\`markdown
Quick recap: [one concise sentence]
\`\`\`

Do not repeat the entire section.

---

# IMPORTANT ACCURACY RULE

Never add knowledge just because you know it.

The notes must be based primarily on the transcript.

You may correct obvious factual/ASR errors when the intended meaning is clear.

Do NOT introduce:

* additional theories
* unrelated examples
* unsupported statistics
* extra formulas
* facts not discussed

---

# PROPORTIONAL LENGTH

The notes should be proportional to the amount of useful information.

Do NOT turn a 2-minute explanation into 3 pages.

Do NOT aggressively shorten a detailed technical explanation.

Remove **low-value words**, not **high-value information**.

---

# ADHD-FRIENDLY STYLE

Optimize for fast scanning.

Use:

* short bullets
* clear hierarchy
* bold key terms
* formulas separated visually
* code blocks
* callouts
* examples
* quick recaps

Avoid:

* huge paragraphs
* unnecessary introductions
* motivational filler
* repetition
* decorative language

---

# OUTPUT LANGUAGE

Default:

\`\`\`text
English
\`\`\`

The source may be Hindi/Hinglish, but produce natural English technical notes.

Technical terminology should remain in English.

---

# INPUT TRANSCRIPT

${topicName ? `Topic: ${topicName}\n\n` : ''}Process the following transcript:

---

${cleanTranscript}

---

# FINAL CHECK BEFORE OUTPUT

Before returning the notes, verify:

* [ ] Hindi/Hinglish was understood correctly.
* [ ] No literal/awkward translation.
* [ ] Technical terminology remains correct.
* [ ] Obvious ASR errors are corrected.
* [ ] No unsupported information was invented.
* [ ] Important numbers are preserved.
* [ ] Formula is converted to correct LaTeX.
* [ ] Important concepts have \`##\` headings.
* [ ] Key terms are bolded.
* [ ] Examples are preserved.
* [ ] Notes use mostly bullet points.
* [ ] Each major concept has a Quick recap.
* [ ] Output contains ONLY the final study notes.`;
}

export function openInChatGPT(fullPrompt: string): void {
  // 1. Copy to clipboard
  try {
    navigator.clipboard.writeText(fullPrompt);
  } catch {}

  // 2. Open ChatGPT
  const isShort = fullPrompt.length < 1800;
  const targetUrl = isShort
    ? `https://chatgpt.com/?q=${encodeURIComponent(fullPrompt)}`
    : 'https://chatgpt.com/';

  window.open(targetUrl, '_blank', 'noopener,noreferrer');
}
