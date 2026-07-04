export const BOUNDS = {
  north: 37.67,
  south: 37.51,
  west: -77.65,
  east: -77.39,
};

export type Business = {
  name: string;
  address: string;
  lat: number;
  lng: number;
};

export const BUSINESSES: Business[] = [
  // Downtown / The Fan
  {
    name: "Lemaire",
    address: "101 W Franklin St, Richmond, VA",
    lat: 37.5408,
    lng: -77.4406,
  },
  {
    name: "Perly's",
    address: "111 E Grace St, Richmond, VA",
    lat: 37.5413,
    lng: -77.4365,
  },
  {
    name: "Mongrel",
    address: "626 N 2nd St, Richmond, VA",
    lat: 37.5449,
    lng: -77.4328,
  },
  {
    name: "Garnett's Cafe",
    address: "2001 Park Ave, Richmond, VA",
    lat: 37.5495,
    lng: -77.4679,
  },
  {
    name: "Elwood Thompson's",
    address: "4 N Thompson St, Richmond, VA",
    lat: 37.5517,
    lng: -77.4712,
  },
  {
    name: "Stella's Grocery",
    address: "1012 Nansemond St, Richmond, VA",
    lat: 37.5489,
    lng: -77.4873,
  },
  // Scott's Addition
  {
    name: "Ardent Craft Ales",
    address: "3200 W Leigh St, Richmond, VA",
    lat: 37.5558,
    lng: -77.4865,
  },
  {
    name: "The Veil Brewing Co.",
    address: "1301 Roseneath Rd, Richmond, VA",
    lat: 37.5602,
    lng: -77.4712,
  },
  {
    name: "Isley Brewing Company",
    address: "1715 Summit Ave, Richmond, VA",
    lat: 37.5621,
    lng: -77.4798,
  },
  {
    name: "Brenner Pass",
    address: "3215 W Leigh St, Richmond, VA",
    lat: 37.5561,
    lng: -77.4871,
  },
  {
    name: "Whole Foods Market",
    address: "2024 W Broad St, Richmond, VA",
    lat: 37.5563,
    lng: -77.4689,
  },
  {
    name: "Francine",
    address: "1640 W Broad St, Richmond, VA",
    lat: 37.5548,
    lng: -77.4651,
  },
  // Museum District / Boulevard
  {
    name: "Virginia Museum of Fine Arts",
    address: "200 N Boulevard, Richmond, VA",
    lat: 37.5539,
    lng: -77.4651,
  },
  {
    name: "The Diamond",
    address: "3001 N Arthur Ashe Blvd, Richmond, VA",
    lat: 37.5661,
    lng: -77.4692,
  },
  {
    name: "CarMax Park",
    address: "2929 N Arthur Ashe Blvd, Richmond, VA",
    lat: 37.5648,
    lng: -77.4698,
  },
  {
    name: "Science Museum of Virginia",
    address: "2500 W Broad St, Richmond, VA",
    lat: 37.5579,
    lng: -77.4762,
  },
  // Carytown
  {
    name: "Criterion Cinemas",
    address: "3519 W Cary St, Richmond, VA",
    lat: 37.5513,
    lng: -77.4893,
  },
  {
    name: "World of Mirth",
    address: "3005 W Cary St, Richmond, VA",
    lat: 37.5516,
    lng: -77.4833,
  },
  {
    name: "Can Can Brasserie",
    address: "3120 W Cary St, Richmond, VA",
    lat: 37.5514,
    lng: -77.4848,
  },
  {
    name: "Carytown Burgers & Fries",
    address: "3500 W Cary St, Richmond, VA",
    lat: 37.5512,
    lng: -77.4889,
  },
  {
    name: "The Byrd Theatre",
    address: "2908 W Cary St, Richmond, VA",
    lat: 37.5515,
    lng: -77.4817,
  },
  // Church Hill / East End
  {
    name: "The Roosevelt",
    address: "623 N 25th St, Richmond, VA",
    lat: 37.5468,
    lng: -77.4102,
  },
  {
    name: "Proper Pie Co.",
    address: "2505 E Broad St, Richmond, VA",
    lat: 37.5476,
    lng: -77.4145,
  },
  {
    name: "St. John's Church",
    address: "2401 E Broad St, Richmond, VA",
    lat: 37.5475,
    lng: -77.4157,
  },
  {
    name: "Liberty Public House",
    address: "418A N 25th St, Richmond, VA",
    lat: 37.5471,
    lng: -77.4108,
  },
  // Manchester / South Side
  {
    name: "Legends Brewing Company",
    address: "321 W 7th St, Richmond, VA",
    lat: 37.5268,
    lng: -77.4432,
  },
  {
    name: "The Hatch Local",
    address: "113 W 7th St, Richmond, VA",
    lat: 37.5265,
    lng: -77.4409,
  },
  {
    name: "Southbound",
    address: "201 W 7th St, Richmond, VA",
    lat: 37.5267,
    lng: -77.4421,
  },
  {
    name: "The Kickstand",
    address: "3011 Water St, Richmond, VA",
    lat: 37.5221,
    lng: -77.3981,
  },
  {
    name: "Costco (Manchester)",
    address: "4251 Carmia Dr, Richmond, VA",
    lat: 37.5087,
    lng: -77.4689,
  },
  // Near West / Libbie & Grove
  {
    name: "Libbie Market",
    address: "5800 Grove Ave, Richmond, VA",
    lat: 37.5681,
    lng: -77.5089,
  },
  {
    name: "Willow Lawn",
    address: "4900 W Broad St, Richmond, VA",
    lat: 37.5712,
    lng: -77.5089,
  },
  // Parks / Landmarks
  {
    name: "Brown's Island",
    address: "301 Virginia St, Richmond, VA",
    lat: 37.5321,
    lng: -77.4431,
  },
  {
    name: "Maymont Park",
    address: "1700 Hampton St, Richmond, VA",
    lat: 37.5432,
    lng: -77.4889,
  },
  {
    name: "Bryan Park",
    address: "4308 Hermitage Rd, Richmond, VA",
    lat: 37.5961,
    lng: -77.4612,
  },
  {
    name: "Byrd Park",
    address: "600 S Boulevard, Richmond, VA",
    lat: 37.5398,
    lng: -77.4681,
  },
  {
    name: "Richmond Raceway",
    address: "2318 Front Stretch Rd, Richmond, VA",
    lat: 37.5948,
    lng: -77.4198,
  },
  // Short Pump / Glen Allen
  {
    name: "Short Pump Town Center",
    address: "11800 W Broad St, Richmond, VA",
    lat: 37.6508,
    lng: -77.6081,
  },
  {
    name: "West Broad Village",
    address: "2955 Old Brick Rd, Glen Allen, VA",
    lat: 37.6487,
    lng: -77.5841,
  },
  {
    name: "Costco (Short Pump)",
    address: "11501 W Broad St, Glen Allen, VA",
    lat: 37.6521,
    lng: -77.6134,
  },
  // VCU Main Campus
  {
    name: "VCU Shafer Court",
    address: "910 W Franklin St, Richmond, VA",
    lat: 37.5487,
    lng: -77.4534,
  },
  {
    name: "VCU Cabell Library",
    address: "901 Park Ave, Richmond, VA",
    lat: 37.5476,
    lng: -77.4523,
  },
  {
    name: "VCU Hibbs Hall",
    address: "900 Park Ave, Richmond, VA",
    lat: 37.5474,
    lng: -77.4521,
  },
  // VCU Engineering
  {
    name: "VCU Engineering Research Building",
    address: "601 W Main St, Richmond, VA",
    lat: 37.5498,
    lng: -77.4489,
  },
  // VCUarts
  {
    name: "VCU Singleton Center",
    address: "922 Park Ave, Richmond, VA",
    lat: 37.5478,
    lng: -77.4528,
  },
  {
    name: "VCU Institute for Contemporary Art",
    address: "601 W Broad St, Richmond, VA",
    lat: 37.5512,
    lng: -77.4498,
  },
  // MCV Campus
  {
    name: "VCU Medical Center",
    address: "1250 E Marshall St, Richmond, VA",
    lat: 37.5398,
    lng: -77.4289,
  },
  // Rec
  {
    name: "VCU Cary Street Gym",
    address: "100 S Linden St, Richmond, VA",
    lat: 37.5469,
    lng: -77.4512,
  },
];

export function darkMapStyles(): google.maps.MapTypeStyle[] {
  return [
    { elementType: "geometry", stylers: [{ color: "#1a1a1c" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#7a7870" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#0e0e0f" }] },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#2e2e32" }],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [{ color: "#383840" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#484850" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#0e0e0f" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#0e1a2a" }],
    },
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
  ];
}
