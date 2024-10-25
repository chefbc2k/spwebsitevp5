'use client';

import { useState, useEffect } from 'react';
import { useContent } from '@/hooks/useContent';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Search } from 'lucide-react';

interface FAQEntry {
  id: string;
  question: string;
  answer: string;
  tags: string[];
}

interface FAQCategory {
  [key: string]: FAQEntry[];
}

export default function FAQSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [faqData, setFaqData] = useState<FAQCategory | null>(null);
  const [filteredData, setFilteredData] = useState<FAQCategory | null>(null);
  const { fetchContent, isLoading } = useContent();

  useEffect(() => {
    const loadFAQs = async () => {
      const data = await fetchContent({ type: 'faq' });
      setFaqData(data);
      setFilteredData(data);
    };

    loadFAQs();
  }, [fetchContent]);

  useEffect(() => {
    if (!faqData) return;

    if (!searchTerm.trim()) {
      setFilteredData(faqData);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered: FAQCategory = {};

    Object.entries(faqData).forEach(([category, entries]) => {
      const matchedEntries = entries.filter(
        entry =>
          entry.question.toLowerCase().includes(searchLower) ||
          entry.answer.toLowerCase().includes(searchLower) ||
          entry.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );

      if (matchedEntries.length > 0) {
        filtered[category] = matchedEntries;
      }
    });

    setFilteredData(filtered);
  }, [searchTerm, faqData]);

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search FAQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      {filteredData && Object.entries(filteredData).length > 0 ? (
        Object.entries(filteredData).map(([category, entries]) => (
          <div key={category} className="space-y-4">
            <h2 className="text-xl font-semibold capitalize">{category}</h2>
            <Accordion type="single" collapsible className="w-full">
              {entries.map((entry) => (
                <AccordionItem key={entry.id} value={entry.id}>
                  <AccordionTrigger>{entry.question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">{entry.answer}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {entry.tags.map((tag) => (
                        <Button
                          key={tag}
                          variant="outline"
                          size="sm"
                          onClick={() => setSearchTerm(tag)}
                        >
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No FAQs found matching your search.</p>
        </div>
      )}
    </div>
  );
}