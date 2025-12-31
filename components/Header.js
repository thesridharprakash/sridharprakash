"use client";

import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="font-bold text-lg text-orange-600">
          Sridhar Prakash
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-700">
          <a href="/" className="hover:text-orange-600">Home</a>
          <a href="#about" className="hover:text-orange-600">About</a>
          <a href="#vision" className="hover:text-orange-600">Vision</a>
          <a href="/volunteer" className="hover:text-orange-600">Volunteer</a>
          <a href="/events" className="hover:text-orange-600">Events</a>
          <a href="/media" className="hover:text-orange-600">Media</a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div className="md:hidden px-6 pb-4 space-y-3 text-sm font-medium text-gray-700">
          <a href="/" className="block">Home</a>
          <a href="#about" className="block">About</a>
          <a href="#vision" className="block">Vision</a>
          <a href="/volunteer" className="block">Volunteer</a>
          <a href="/events" className="block">Events</a>
          <a href="/media" className="block">Media</a>
        </div>
      )}
    </header>
  );
}
