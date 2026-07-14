# PROMPTS.md — AI Prompt Engineering Log

## Overview

The AI feature in TrishulReviews uses the Groq API (`llama-3.3-70b-versatile`) to classify guest reviews by sentiment and theme, and generate a suggested management response. Three prompt variations were tested before settling on the final version.

---

## System Prompt Used

```
You are a hospitality review analyst for Trishul Eco-Homestays.
Classify the given guest review and respond only in valid JSON.
```

---

## Prompt Variation 1 — Simple Instruction

**Prompt:**
```
Classify this review:
"{review_text}"

Return JSON with: sentiment (positive/neutral/negative), theme (food/host/location/cleanliness/value/experience), response (suggested reply).
```

**Example Input:**
```
The food was amazing and the host was very welcoming. Loved every bit of it.
```

**Example Output:**
```json
{
  "sentiment": "positive",
  "theme": "food",
  "response": "Thank you for your kind words! We're thrilled you enjoyed the food and hospitality."
}
```

**Result:** Worked for simple reviews but failed on multi-topic or ambiguous reviews — sometimes returned invalid JSON or skipped fields.

---

## Prompt Variation 2 — Structured with Examples

**Prompt:**
```
You are a hospitality review analyst. Given the guest review below, return a JSON object with exactly three fields:
- sentiment: one of "positive", "neutral", "negative"
- theme: one of "food", "host", "location", "cleanliness", "value", "experience"
- response: a professional 1-2 sentence reply from the management

Review: "{review_text}"

Respond only with the JSON object. No explanation, no markdown.
```

**Example Input:**
```
The room was okay but the mattress was uncomfortable and the bathroom needed cleaning.
```

**Example Output:**
```json
{
  "sentiment": "negative",
  "theme": "cleanliness",
  "response": "We apologize for the inconvenience. We will ensure the room is thoroughly inspected and the mattress replaced before your next visit."
}
```

**Result:** Much more consistent. JSON was valid in most cases but occasionally the model added extra fields or wrapped output in markdown code fences.

---

## Prompt Variation 3 — Strict JSON with Fence Stripping (Final Version)

**Prompt:**
```
You are a hospitality review analyst for Trishul Eco-Homestays. Analyze the guest review and return ONLY a valid JSON object with these exact fields:
- "sentiment": must be exactly one of: "positive", "neutral", "negative"
- "theme": must be exactly one of: "food", "host", "location", "cleanliness", "value", "experience"
- "response": a professional 1-2 sentence management reply

Do not include any explanation, preamble, or markdown formatting. Return only the JSON object.

Review: "{review_text}"
```

**Post-processing added:**
```python
text = text.strip().strip("```json").strip("```").strip()
result = json.loads(text)
```

**Example Input:**
```
Stayed for two nights. The location is beautiful and peaceful but the wifi was very slow and the water was cold in the morning.
```

**Example Output:**
```json
{
  "sentiment": "neutral",
  "theme": "location",
  "response": "Thank you for your feedback. We are working to improve our wifi connectivity and hot water availability to ensure a more comfortable stay."
}
```

**Result:** Most reliable. The fence-stripping post-processing handled edge cases where the model wrapped output in markdown, making the pipeline fully robust.

---

## Which Prompt Worked Best and Why

**Variation 3** performed best. The explicit instruction to return *only* a JSON object with no markdown, combined with strict enumeration of allowed values for each field, significantly reduced hallucinations and format errors. The addition of post-processing to strip markdown code fences handled the remaining edge cases where the model still wrapped its output. Compared to Variation 1, which lacked structure, and Variation 2, which was mostly reliable but prone to occasional formatting issues, Variation 3 produced consistent, parseable output across all test inputs including multi-topic and ambiguous reviews.
