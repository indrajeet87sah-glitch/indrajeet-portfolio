// src/components/ContactForm.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });

  const [status, setStatus] = useState({
    submitting: false,
    submitted: false,
    error: false
  });

  // TODO: Yahan apna Formspree endpoint URL daalein (jaise https://formspree.io/f/mqkenwop)
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xkjobrvw";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, submitted: false, error: false });

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          ...formData,
          _subject: `New Portfolio Message from ${formData.name || "Visitor"}`
        })
      });

      if (response.ok) {
        setStatus({ submitting: false, submitted: true, error: false });
        setFormData({ name: "", phone: "", email: "", message: "" });
        // 5 second baad green message apne aap gayab ho jayega
        setTimeout(() => {
          setStatus((prev) => ({ ...prev, submitted: false }));
        }, 5000);
      } else {
        setStatus({ submitting: false, submitted: false, error: true });
      }
    } catch (err) {
      setStatus({ submitting: false, submitted: false, error: true });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="w-full lg:w-[48%] rounded-[32px] bg-[#121724] border border-white/5 p-7 sm:p-9 shadow-2xl flex flex-col"
    >
      <form onSubmit={handleSubmit} className="flex flex-col space-y-6">

        {/* Row: Name and Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[12px] font-semibold text-slate-300">
              Your Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-3.5 rounded-xl bg-[#1e2538] text-white placeholder-slate-500 text-sm outline-none border border-transparent focus:border-[#72bbf6]/50 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[12px] font-semibold text-slate-300">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3.5 rounded-xl bg-[#1e2538] text-white placeholder-slate-500 text-sm outline-none border border-transparent focus:border-[#72bbf6]/50 transition-colors"
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="space-y-2">
          <label className="text-[12px] font-semibold text-slate-300">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="john@company.com"
            className="w-full px-4 py-3.5 rounded-xl bg-[#1e2538] text-white placeholder-slate-500 text-sm outline-none border border-transparent focus:border-[#72bbf6]/50 transition-colors"
          />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label className="text-[12px] font-semibold text-slate-300">
            Message *
          </label>
          <textarea
            name="message"
            rows="5"
            required
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell me about your project scope, timeline, and goals..."
            className="w-full px-4 py-3.5 rounded-xl bg-[#1e2538] text-white placeholder-slate-500 text-sm outline-none border border-transparent focus:border-[#72bbf6]/50 transition-colors resize-none"
          ></textarea>
        </div>

        {/* Status Alerts */}
        {status.submitted && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm text-center font-medium">
            Message sent successfully! I will get back to you shortly.
          </div>
        )}

        {status.error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs sm:text-sm text-center font-medium">
            Something went wrong. Please try again or email directly.
          </div>
        )}

        {/* Solid Blue Send Message Button */}
        <button
          type="submit"
          disabled={status.submitting}
          className="w-full py-4 rounded-xl bg-[#72bbf6] hover:bg-[#5caeeb] active:scale-[0.99] disabled:opacity-60 text-[#090d16] font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(114,187,246,0.35)] cursor-pointer"
        >
          <span>{status.submitting ? "Sending..." : "Send Message"}</span>
          <span className="material-symbols-outlined text-[20px]">send</span>
        </button>

      </form>
    </motion.div>
  );
}