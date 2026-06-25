// ── Backend URL ────────────────────────────────────────────────────────────
export const API_BASE = "http://localhost:8000";

// ── Constants ──────────────────────────────────────────────────────────────
export const THEME_TAGS = ["food", "host", "location", "cleanliness", "value", "experience"];

export const SENTIMENT_STYLE = {
  positive: { bg: "#E6F4EE", text: "#0F5C3F", border: "#0F7A52", dot: "#0F7A52", label: "Positive" },
  neutral:  { bg: "#F3EFE3", text: "#7A5C1E", border: "#B98B2E", dot: "#C99A3A", label: "Neutral"  },
  negative: { bg: "#FBEDE5", text: "#8C3811", border: "#B8460E", dot: "#B8460E", label: "Negative" },
};

export const THEME_STYLE = {
  food:        { bg: "#E8EFFA", text: "#1E4C84", label: "Food"        },
  host:        { bg: "#ECEAFB", text: "#4338A6", label: "Host"        },
  location:    { bg: "#E3F3EC", text: "#0E5C45", label: "Location"    },
  cleanliness: { bg: "#FBEEE5", text: "#7A3D17", label: "Cleanliness" },
  value:       { bg: "#F3EFE3", text: "#7A5C1E", label: "Value"       },
  experience:  { bg: "#FAEAF1", text: "#85265A", label: "Experience"  },
};

export const SAMPLE_REVIEWS = [
  "The host Meena was incredibly warm and helpful. She cooked us a traditional Garhwali breakfast that was absolutely outstanding. Would come back just for the food!",
  "The location is stunning — panoramic Himalayan views from every window. However, the 4km road to the property is in terrible shape and needs serious work.",
  "Mattresses were old and uncomfortable. The room had a persistent musty smell throughout our stay. Would not recommend for the price being charged.",
  "Absolutely loved our stay! Spotlessly clean rooms, wholesome food, and the valley views are worth every rupee. Our best homestay experience in Uttarakhand.",
  "Decent place. Nothing extraordinary but served its purpose for a one-night halt on the way to Chopta. Staff was polite and check-in was smooth.",
  "The host went out of his way to arrange a local guide for us at short notice. Truly exceptional hospitality that made our trip memorable.",
  "Bathroom cleanliness was disappointing for the price. Tiles were stained and the hot water supply was inconsistent in the mornings.",
  "Incredible value for money. Three meals included in the tariff and the portions were generous. Far better than staying at a hotel in town.",
  "Beautiful property but quite remote — no mobile signal. Bring downloaded maps and entertainment. The silence at night is something else though.",
  "Food was mediocre and repetitive — same dal and roti both days. Would be great if they offered more variety or local specialities.",
].join("\n");

// Shared button style helper used across pages
export const btnStyle = (active) => ({
  fontSize: 12, fontWeight: 600, padding: "5px 12px", cursor: "pointer",
  border: active ? "1px solid #4F46B8" : "1px solid #e8e6e1", borderRadius: 7,
  background: active ? "#4F46B8" : "#fff",
  color: active ? "#fff" : "#1c1b1f",
  transition: "background 0.15s ease, border-color 0.15s ease",
});
