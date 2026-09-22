export type PricingTier = {
  name: "Basic" | "Standard" | "Premium";
  price: string;
  turnaround: string;
  features: string[];
};

export type Genre = {
  id: string;
  title: string;
  description: string;
  tiers: PricingTier[];
};

export const genres: Genre[] = [
  {
    id: "youtube",
    title: "YouTube / Vlogs",
    description:
      "Long-form talking head or vlog style. Pacing and retention matter more than polish.",
    tiers: [
      {
        name: "Basic",
        price: "$250-450",
        turnaround: "3-4 business days",
        features: [
          "Clean assembly, jump cuts",
          "Basic color correction",
          "Licensed music bed, captions",
          "1 round of revisions",
        ],
      },
      {
        name: "Standard",
        price: "$500-900",
        turnaround: "4-6 business days",
        features: [
          "Everything in Basic",
          "Retention-focused pacing",
          "Sound design, animated lower-thirds",
          "1 vertical Shorts cutdown",
          "2 rounds of revisions",
        ],
      },
      {
        name: "Premium",
        price: "$1,000-1,800",
        turnaround: "7-10 business days",
        features: [
          "Everything in Standard",
          "Full color grade",
          "Custom motion graphics",
          "2-3 short-form cutdowns",
          "3 rounds of revisions",
        ],
      },
    ],
  },
  {
    id: "podcasts",
    title: "Podcasts",
    description:
      "Multi-cam or single-cam interviews. Clean audio and clips that actually get watched.",
    tiers: [
      {
        name: "Basic",
        price: "$250-400",
        turnaround: "3-4 days",
        features: [
          "Single or two-cam edit",
          "Audio leveling and noise cleanup",
          "Chapter markers",
          "1 round of revisions",
        ],
      },
      {
        name: "Standard",
        price: "$500-900",
        turnaround: "4-6 days",
        features: [
          "Multi-cam sync",
          "Full audio mix",
          "3-5 social clips from the episode",
          "2 rounds of revisions",
        ],
      },
      {
        name: "Premium",
        price: "$1,000-1,800",
        turnaround: "7-10 days",
        features: [
          "Everything in Standard",
          "Custom show graphics",
          "6-10 short-form clips with captions",
          "Thumbnail options",
          "3 rounds of revisions",
        ],
      },
    ],
  },
  {
    id: "social-shorts",
    title: "Social Shorts (TikTok/Reels)",
    description:
      "Hook-first, built for the scroll. Priced per clip, bundles of 8-12 get a discount.",
    tiers: [
      {
        name: "Basic",
        price: "$75-125 / clip",
        turnaround: "1-2 day turnaround",
        features: [
          "Hook-first cut",
          "Captions burned in",
          "Trending audio sync",
          "1 round of revisions",
        ],
      },
      {
        name: "Standard",
        price: "$150-250 / clip",
        turnaround: "2-3 day turnaround",
        features: [
          "Everything in Basic",
          "Animated captions",
          "Sound design and B-roll overlays",
          "Multi-platform export",
          "2 rounds of revisions",
        ],
      },
      {
        name: "Premium",
        price: "$300-500 / clip",
        turnaround: "2-3 day turnaround",
        features: [
          "Custom motion graphics",
          "Advanced retention structuring",
          "Multiple hook variants for testing",
          "2 rounds of revisions",
        ],
      },
    ],
  },
  {
    id: "documentary",
    title: "Documentary / Long-form",
    description:
      "Story-first work. Interview selects, structure, and pacing across a real runtime, priced by finished minute or by week.",
    tiers: [
      {
        name: "Basic",
        price: "$100-150 / min",
        turnaround: "phase-based, 2-3 weeks",
        features: [
          "Assembly / rough cut",
          "Interview selects and paper edit",
          "1-2 rounds of notes",
        ],
      },
      {
        name: "Standard",
        price: "$150-250 / min",
        turnaround: "phase-based, 3-5 weeks",
        features: [
          "Full story structure fine cut",
          "Color correction, temp mix",
          "2 rounds of notes",
        ],
      },
      {
        name: "Premium",
        price: "$300-500 / min",
        turnaround: "phase-based, 5-8 weeks",
        features: [
          "Picture lock",
          "Full color grade, final sound mix",
          "Graphics and titles package",
          "Delivery masters, all formats",
        ],
      },
    ],
  },
  {
    id: "corporate",
    title: "Corporate / Brand",
    description:
      "Polished and on-message. Built to represent the company, with fast turnarounds.",
    tiers: [
      {
        name: "Basic",
        price: "$600-1,200",
        turnaround: "5-7 business days",
        features: [
          "Single cut, one aspect ratio",
          "Brand template applied",
          "2 rounds of revisions",
        ],
      },
      {
        name: "Standard",
        price: "$1,500-3,500",
        turnaround: "1-2 weeks",
        features: [
          "Multi-source edit",
          "Motion graphics package",
          "2-3 aspect ratios delivered",
          "2-3 rounds of revisions",
        ],
      },
      {
        name: "Premium",
        price: "$4,000-8,000+",
        turnaround: "2-3 weeks",
        features: [
          "Full campaign set: web, social, internal",
          "Custom animation, full sound mix",
          "Multiple deliverables",
          "Dedicated revision window",
        ],
      },
    ],
  },
  {
    id: "comedy",
    title: "Comedy",
    description:
      "Timing is the whole job. Cutting for the laugh, not just the line.",
    tiers: [
      {
        name: "Basic",
        price: "$200-400",
        turnaround: "3-5 business days",
        features: [
          "Straight edit, dead air trimmed",
          "Basic audio cleanup",
          "1 round of revisions",
        ],
      },
      {
        name: "Standard",
        price: "$500-1,200",
        turnaround: "5-7 business days",
        features: [
          "Multicam sketch or short-set edit",
          "Sound design for punchlines",
          "Reaction and cutaway inserts",
          "2 rounds of revisions",
        ],
      },
      {
        name: "Premium",
        price: "$2,000-5,000",
        turnaround: "2-4 weeks",
        features: [
          "Full stand-up special edit",
          "Color grade, audience sound balancing",
          "Motion graphics titles",
          "Full revision cycle",
        ],
      },
    ],
  },
];
