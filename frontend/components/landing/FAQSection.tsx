"use client";

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQSectionProps {
  className?: string;
}

const faqData = [
  {
    question: "What is AutoSight?",
    answer: "AutoSight is an AI-powered monitoring platform that automatically detects events and generates structured reports in real time."
  },
  {
    question: "Do I need special cameras?",
    answer: "No. AutoSight integrates with existing CCTV systems."
  },
  {
    question: "Is it scalable?",
    answer: "Yes. The cloud-based architecture supports small deployments to enterprise-level monitoring."
  },
  {
    question: "Is the data secure?",
    answer: "Yes. We use encrypted storage with optional blockchain audit logging for tamper-proof records."
  },
  {
    question: "Does it require constant supervision?",
    answer: "No. AutoSight operates autonomously in the background."
  }
];

export const FAQSection: React.FC<FAQSectionProps> = ({ className = '' }) => {
  return (
    <div className={`w-full py-12 md:py-20 relative ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-3 md:mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Everything you need to know about AutoSight
          </p>
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="w-full">
          {faqData.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-border/50">
              <AccordionTrigger className="text-left text-base sm:text-lg font-medium py-4 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base text-muted-foreground leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

