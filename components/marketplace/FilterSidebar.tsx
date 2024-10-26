'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, Search, Save, RotateCcw, Star } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import type { FilterState, Category, FilterCategories } from '@/types/marketplace';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClose: () => void;
  showSidebar: boolean;
}

const filterCategories: FilterCategories = {
  voiceTraits: {
    label: 'Voice Traits',
    sections: {
      pitch: {
        label: 'Pitch',
        options: ['Bass', 'Baritone', 'Tenor', 'Alto', 'Soprano', 'Mezzo-Soprano', 'Falsetto', 'Contralto', 'Lyric-Tenor', 'Dramatic-Soprano']
      },
      texture: {
        label: 'Texture',
        options: ['Smooth', 'Raspy', 'Breathy', 'Clear', 'Husky', 'Gravelly', 'Silky', 'Smoky', 'Crisp', 'Metallic']
      },
      volume: {
        label: 'Volume Range',
        options: ['Whisper', 'Soft', 'Moderate', 'Loud', 'Projection', 'Controlled Crescendos', 'Stage-ready', 'Theater-level', 'Amplified', 'Power Belt']
      },
      versatility: {
        label: 'Versatility',
        options: ['Single-style', 'Multi-style', 'Impersonation', 'Singing', 'Voice Acting', 'Narration', 'Multi-accent', 'Range Flexibility', 'Emotional Range', 'Tone Shifts']
      }
    }
  },
  locationLanguage: {
    label: 'Location & Language',
    sections: {
      language: {
        label: 'Primary Language',
        options: ['English', 'Spanish', 'Mandarin', 'French', 'Arabic', 'German', 'Japanese', 'Russian', 'Portuguese', 'Hindi']
      },
      secondaryLanguages: {
        label: 'Secondary Languages',
        options: ['Fluent', 'Conversational', 'Beginner', 'Multilingual', 'Code-switching', 'Pidgin Use', 'Creole Influence', 'Translation Ability', 'Bilingual', 'Native-level Fluency']
      },
      regionalDialect: {
        label: 'Regional Dialect',
        options: ['Southern US - Deep South', 'Southern US - Appalachian', 'New York - Brooklyn', 'New York - Manhattan', 'Midwestern - Chicago', 'Midwestern - Minnesota', 'West Coast - Los Angeles', 'West Coast - San Francisco', 'Texan - East Texas', 'Texan - West Texas', 'Bostonian', 'New Orleans - Yat', 'Philadelphia - Delco', 'African American Vernacular English (AAVE)', 'Chicano English - California', 'Chicano English - Texas', 'Valley Girl - San Fernando', 'California Surfer', 'Hawaiian Pidgin', 'General American (GA)', 'British RP', 'Cockney', 'Australian', 'Scottish', 'Jamaican Patois', 'Quebec French', 'Mexican Spanish', 'Middle Eastern Arabic']
      },
      timeZone: {
        label: 'Time Zone',
        options: ['GMT', 'EST', 'PST', 'CST', 'IST', 'CET', 'AEST', 'JST', 'SAST', 'UTC']
      },
      studioAvailability: {
        label: 'Remote/Studio Availability',
        options: ['Remote-only', 'Studio-required', 'Hybrid', 'Remote Live Direction', 'Asynchronous', 'Limited Studio Access', 'In-person Session', 'On-call Availability', 'Travel-ready', 'Mobile Recording Studio']
      }
    }
  },
  styleTone: {
    label: 'Style & Tone',
    sections: {
      commercial: {
        label: 'Commercial',
        options: ['Upbeat', 'Call-to-action', 'Promotional', 'Luxury', 'Friendly', 'Professional', 'Fun', 'Energetic', 'Relaxed', 'Direct']
      },
      narration: {
        label: 'Narration',
        options: ['Fiction', 'Non-fiction', 'Memoirs', 'First-person', 'Third-person', 'Instructional', 'Historical', 'Documentaries', 'Guided Tours', 'Meditation']
      },
      character: {
        label: 'Character/Animation',
        options: ['Hero', 'Villain', 'Sidekick', 'Animal-like', 'Fantasy', 'Sci-fi', 'Children\'s Content', 'Mythical Creatures', 'Comedy', 'Horror']
      },
      corporate: {
        label: 'Corporate',
        options: ['Motivational', 'Informative', 'Leadership', 'Coaching', 'Training Modules', 'Presentation', 'Instructional Videos', 'B2B Communication', 'Onboarding', 'Compliance']
      }
    }
  },
  technical: {
    label: 'Technical Specifications',
    sections: {
      audioQuality: {
        label: 'Audio Quality',
        options: ['16-bit', '24-bit', '32-bit', 'Mono', 'Stereo', 'Lossless', 'Compressed', 'WAV', 'FLAC', 'MP3']
      },
      sampleRate: {
        label: 'Sample Rate',
        options: ['44.1kHz', '48kHz', '96kHz', '192kHz', '22kHz', 'CD-quality', 'Streaming-quality', 'High-fidelity', 'Adaptive Bit Rate', 'Studio Grade']
      },
      equipment: {
        label: 'Equipment',
        options: ['Condenser Mic', 'Dynamic Mic', 'Preamp', 'Mixer', 'Interface', 'Pop Filter', 'Headphones', 'DAW', 'Soundproofing', 'Portable Recording Gear']
      },
      postProduction: {
        label: 'Post-production Capabilities',
        options: ['EQ', 'Compression', 'De-essing', 'Reverb', 'Noise Removal', 'Mastering', 'Sound Design', 'Normalization', 'Multi-track Editing', 'Sync with Video']
      }
    }
  },
  productionQuality: {
    label: 'Production Quality',
    sections: {
      broadcast: {
        label: 'Broadcast Ready',
        options: ['Mastered', 'Optimized for TV', 'Optimized for Streaming', 'Compressed for Radio', 'Ready for Submission', 'Vetted', 'Polished', 'Final Mix', 'Checked for Compliance', 'FM/AM Quality']
      },
      professional: {
        label: 'Professional Grade',
        options: ['High-quality', 'Studio Grade', 'Full Mastering', 'Optimized for Podcasts', 'Voice-over Approved', 'Media-ready', 'Portfolio-level', 'Consistent', 'Reliable', 'Marketable']
      }
    }
  },
  experience: {
    label: 'Experience Level',
    sections: {
      novice: {
        label: 'Novice (<2 years)',
        options: ['Training Stage', 'Entry-level', 'First Projects', 'Exploring', 'Passionate', 'Learning Curve', 'Self-taught', 'Early Portfolio', 'New Talent', 'Developmental Phase']
      },
      expert: {
        label: 'Expert (10+ years)',
        options: ['Industry-recognized', 'Mentor-level', 'Specializations', 'Award-winning', 'High-demand', 'Master-level', 'Sought-after', 'Published', 'Featured Work', 'Industry Awards']
      }
    }
  }
};

const categories: Category[] = [
  {
    name: "Entertainment & Media",
    subcategories: ["Animation", "Film/TV", "Radio", "Games", "Audiobooks"]
  },
  {
    name: "Advertising & Marketing",
    subcategories: ["TV Commercials", "Online Ads", "Corporate Presentations"]
  },
  {
    name: "E-learning & Education",
    subcategories: ["Online Courses", "Training Videos", "Educational Apps"]
  },
  {
    name: "Technology & Telecom",
    subcategories: ["IVR Systems", "Virtual Assistants", "Text-to-Speech"]
  },
  {
    name: "Corporate & Business",
    subcategories: ["Training Videos", "Internal Communications", "Brand Messaging"]
  },
  {
    name: "Healthcare",
    subcategories: ["Medical E-learning", "Telemedicine"]
  },
  {
    name: "Government Services",
    subcategories: ["PSAs", "Training Materials", "Information Systems"]
  },
  {
    name: "Transportation",
    subcategories: ["Transit Announcements", "Navigation Systems"]
  },
  {
    name: "Hospitality & Tourism",
    subcategories: ["Guided Tours", "Travel Ads"]
  },
  {
    name: "Retail",
    subcategories: ["Store Announcements", "E-commerce"]
  },
  {
    name: "Religious Content",
    subcategories: ["Religious Media", "Audio Bibles"]
  },
  {
    name: "Real Estate",
    subcategories: ["Virtual Tours"]
  },
  {
    name: "Event Hosting",
    subcategories: ["Voice of God", "Event Marketing"]
  },
  {
    name: "Podcasts",
    subcategories: ["Narration", "Educational"]
  },
  {
    name: "Legal",
    subcategories: ["Court Transcripts", "Legal Reviews"]
  },
  {
    name: "Finance",
    subcategories: ["Financial Training", "Investor Presentations"]
  },
  {
    name: "Contract Types",
    subcategories: ["Royalty", "Movie", "Music", "Podcast"]
  },
  {
    name: "Pricing Models",
    subcategories: [
      "Getty Images",
      "AP News",
      "SoundCloud",
      "NPR",
      "Dynamic Pricing",
      "Banking CD",
      "Mexican Sharing",
      "Micro Loan"
    ]
  }
];

export default function FilterSidebar({
  filters,
  onFilterChange,
  onClose,
  showSidebar
}: FilterSidebarProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const [recentFilters, setRecentFilters] = useState<string[]>([]);
  const [savedPresets, setSavedPresets] = useState<{ name: string; filters: FilterState }[]>([]);

  useEffect(() => {
    const count = Object.entries(localFilters).reduce((acc, [_, category]) => {
      if (category && typeof category === 'object') {
        return acc + Object.values(category).reduce((subAcc, section) => {
          if (section && typeof section === 'object') {
            return subAcc + Object.values(section).filter(Boolean).length;
          }
          return subAcc;
        }, 0);
      }
      return acc;
    }, 0);
    setActiveFilterCount(count);
  }, [localFilters]);

  const handleFilterChange = (category: string, section: string, value: string, checked: boolean) => {
    setLocalFilters((prev: FilterState) => {
      const categoryFilters = prev[category] || {};
      const sectionFilters = categoryFilters[section] || {};
      
      const updatedFilters: FilterState = {
        ...prev,
        [category]: {
          ...categoryFilters,
          [section]: {
            ...sectionFilters,
            [value]: checked
          }
        }
      };

      if (checked && !recentFilters.includes(`${category}:${section}:${value}`)) {
        setRecentFilters(prev => [
          `${category}:${section}:${value}`,
          ...prev.slice(0, 4)
        ]);
      }

      onFilterChange(updatedFilters);
      return updatedFilters;
    });
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {};
    Object.keys(filterCategories).forEach(category => {
      clearedFilters[category] = {};
      Object.keys(filterCategories[category].sections).forEach(section => {
        clearedFilters[category]![section] = {};
      });
    });

    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const savePreset = () => {
    const presetName = `Preset ${savedPresets.length + 1}`;
    setSavedPresets(prev => [...prev, { name: presetName, filters: localFilters }]);
  };

  const loadPreset = (preset: { name: string; filters: FilterState }) => {
    setLocalFilters(preset.filters);
    onFilterChange(preset.filters);
  };

  const getFilteredCategories = (): FilterCategories => {
    if (!searchTerm) {
      return filterCategories;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered: FilterCategories = {};

    Object.entries(filterCategories).forEach(([key, category]) => {
      const filteredSections: typeof category.sections = {};
      
      Object.entries(category.sections).forEach(([secKey, section]) => {
        const filteredOptions = section.options.filter((opt: string) => 
          opt.toLowerCase().includes(searchLower)
        );
        
        if (filteredOptions.length > 0) {
          filteredSections[secKey] = {
            ...section,
            options: filteredOptions
          };
        }
      });

      if (Object.keys(filteredSections).length > 0) {
        filtered[key] = {
          ...category,
          sections: filteredSections
        };
      }
    });

    return filtered;
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 w-80 bg-blue-950 dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out ${
        showSidebar ? 'translate-x-0' : '-translate-x-full'
      } z-50`}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Filters</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search filters..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <div className="px-4 py-2 border-b dark:border-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}
              </span>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        )}

        {/* Scrollable Filters */}
        <ScrollArea className="flex-1 px-4">
          {/* Recent Filters */}
          {recentFilters.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Recent Filters</h4>
              <div className="flex flex-wrap gap-2">
                {recentFilters.map((filter, index) => {
                  const [category, section, value] = filter.split(':');
                  return (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleFilterChange(category, section, value, true)}
                    >
                      {value}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Accordion for Filter Categories */}
          <Accordion type="multiple" className="space-y-4">
            {Object.entries(getFilteredCategories()).map(([categoryKey, category]) => (
              <AccordionItem key={categoryKey} value={categoryKey}>
                <AccordionTrigger className="text-sm font-medium">
                  {category.label}
                </AccordionTrigger>
                <AccordionContent>
                  {Object.entries(category.sections).map(([sectionKey, section]) => (
                    <div key={sectionKey} className="mb-4">
                      <Label className="text-sm font-medium mb-2">{section.label}</Label>
                      <div className="space-y-2">
                        {section.options.map((option: string) => (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${categoryKey}-${sectionKey}-${option}`}
                              checked={localFilters[categoryKey]?.[sectionKey]?.[option] || false}
                              onCheckedChange={(checked: boolean) => 
                                handleFilterChange(categoryKey, sectionKey, option, checked)
                              }
                            />
                            <Label
                              htmlFor={`${categoryKey}-${sectionKey}-${option}`}
                              className="text-sm font-normal"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>

        {/* Footer with Save Preset and Save Filters */}
        <div className="p-4 border-t dark:border-gray-800">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={savePreset}
            >
              <Save className="h-4 w-4 mr-1" />
              Save Preset
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.setItem('marketplaceFilters', JSON.stringify(localFilters));
                }
              }}
            >
              <Star className="h-4 w-4 mr-1" />
              Save Filters
            </Button>
          </div>
          {/* Optional: Display Saved Presets */}
          {savedPresets.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Saved Presets</h4>
              <ul>
                {savedPresets.map((preset, idx) => (
                  <li key={idx} className="mb-1">
                    <Button variant="link" onClick={() => loadPreset(preset)}>
                      {preset.name}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
