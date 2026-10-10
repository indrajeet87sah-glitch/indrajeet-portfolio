// src/components/Contact.jsx
import React from "react";
import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <section className="w-full py-24 relative bg-[#090d16] border-b border-white/5 overflow-hidden" id="contact">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-8">
        <ContactInfo />
        <ContactForm />
      </div>
    </section>
  );
}