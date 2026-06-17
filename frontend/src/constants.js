// ── Backend URL ────────────────────────────────────────────────────────────
export const API_BASE = "http://localhost:5000";

// ── Constants ──────────────────────────────────────────────────────────────
export const THEME_TAGS = ["food", "host", "location", "cleanliness", "value", "experience"];

export const SENTIMENT_STYLE = {
  positive: { bg: "#EAF3DE", text: "#27500A", border: "#639922", dot: "#639922", label: "Positive" },
  neutral:  { bg: "#FAEEDA", text: "#633806", border: "#BA7517", dot: "#EF9F27", label: "Neutral"  },
  negative: { bg: "#FCEBEB", text: "#791F1F", border: "#E24B4A", dot: "#E24B4A", label: "Negative" },
};

export const THEME_STYLE = {
  food:        { bg: "#E6F1FB", text: "#0C447C", label: "Food"        },
  host:        { bg: "#EEEDFE", text: "#3C3489", label: "Host"        },
  location:    { bg: "#E1F5EE", text: "#085041", label: "Location"    },
  cleanliness: { bg: "#FAECE7", text: "#712B13", label: "Cleanliness" },
  value:       { bg: "#FAEEDA", text: "#633806", label: "Value"       },
  experience:  { bg: "#FBEAF0", text: "#72243E", label: "Experience"  },
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
  fontSize: 12, padding: "4px 10px", cursor: "pointer",
  border: "1px solid #e5e4dc", borderRadius: 6,
  background: active ? "#534AB7" : "#fff",
  color: active ? "#fff" : "#1a1a18",
});
