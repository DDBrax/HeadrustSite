import { useState, FormEvent } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<string>("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      message: String(formData.get("details") || "").trim(),
      inquiryType: 'general'
    };

    // quick front-end check
    if (!payload.name || !payload.email || !payload.message) {
      setStatus("Please fill out all fields.");
      return;
    }
    if (payload.name.length < 2 || payload.message.length < 10) {
      setStatus("Please enter your name and at least 10 characters of detail.");
      return;
    }

    setStatus("Sending...");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        form.reset();
        setStatus("Thanks! Your request was sent.");
      } else {
        const text = await res.text();
        setStatus("Error: " + text);
      }
    } catch {
      setStatus("Network error. Please try again.");
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ marginBottom: 16 }}>Contact / Order Request</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          name="name"
          placeholder="Your name"
          required
          minLength={2}
          maxLength={100}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <input
          name="email"
          type="email"
          placeholder="Your email"
          required
          maxLength={254}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <textarea
          name="details"
          placeholder="What would you like to order?"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
          }}
        >
          Send
        </button>
        <p style={{ minHeight: 20 }}>{status}</p>
      </form>
    </div>
  );
}
