export interface PrincipalCompany {
  id: number;
  name: string;
  segments: string[];
  product: string;
  country: string;
  city: string;
  address: string;
  website: string;
  lat: number;
  lng: number;
  mapsUrl: string;
  notes?: string;
  // Texture UV coordinates (equirectangular)
  u: number;
  v: number;
  vThree?: number;
}

export const PRINCIPALS_DATA: PrincipalCompany[] = [
  {
    "id": 1,
    "name": "ACSYS Lasertechnik GmbH",
    "segments": [
      "Mint"
    ],
    "product": "Laser Engraving Systems for Mints",
    "country": "Germany",
    "city": "Kornwestheim",
    "address": "Leibnizstrasse 9, 70806 Kornwestheim, Germany",
    "website": "https://www.acsys.de/",
    "lat": 48.8691247,
    "lng": 9.1993914,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=48.8691247,9.1993914",
    "notes": "",
    "u": 0.525554,
    "v": 0.771495
  },
  {
    "id": 2,
    "name": "BW Converting GmbH (formerly W+D)",
    "segments": [
      "Security"
    ],
    "product": "Envelope Making Machines for Security Printing Industry",
    "country": "Germany",
    "city": "Neuwied",
    "address": "Sohler Weg 65, 56564 Neuwied, Germany",
    "website": "https://www.bwconverting.com/",
    "lat": 50.4337726,
    "lng": 7.4798967,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=50.4337726,7.4798967",
    "notes": "",
    "u": 0.520777,
    "v": 0.780188
  },
  {
    "id": 3,
    "name": "BW Papersystems Stuttgart GmbH",
    "segments": [
      "Security",
      "Paper Mill"
    ],
    "product": "Kugler Womako Passport Making Machines (Security); Bielomatik Banknote Sheeters (Paper Mill)",
    "country": "Germany",
    "city": "Nuertingen",
    "address": "Schlosserstrasse 15, 72622 Nuertingen, Germany",
    "website": "https://www.bwpapersystems.com/",
    "lat": 48.6389846,
    "lng": 9.3417186,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=48.6389846,9.3417186",
    "notes": "",
    "u": 0.525949,
    "v": 0.770217
  },
  {
    "id": 4,
    "name": "GTS GmbH",
    "segments": [
      "Currency",
      "Security",
      "Paper Mill"
    ],
    "product": "Counting Machines & Allied Systems for Banknotes, Security Documents and Security Paper Mills",
    "country": "Germany",
    "city": "Heilbronn",
    "address": "Boellinger Str. 61, 74078 Heilbronn, Germany",
    "website": "https://gts-countmaster.com/en/products/",
    "lat": 49.175969,
    "lng": 9.198693,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=49.175969,9.198693",
    "notes": "",
    "u": 0.525552,
    "v": 0.7732
  },
  {
    "id": 5,
    "name": "I.T.G. GmbH Graphic Products",
    "segments": [
      "Currency"
    ],
    "product": "Currency Printing Blankets & Allied Products",
    "country": "Germany",
    "city": "Munich",
    "address": "Dachauer Str. 201, 80637 Munich, Germany",
    "website": "https://www.itg-graph.com/",
    "lat": 48.161145,
    "lng": 11.5445446,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=48.161145,11.5445446",
    "notes": "",
    "u": 0.532068,
    "v": 0.767562
  },
  {
    "id": 6,
    "name": "MABEG Systems GmbH",
    "segments": [
      "Currency",
      "Security",
      "Paper Mill"
    ],
    "product": "Sheet Feeders, Stackers & Transportation Systems for Currency & Security Printing Industry",
    "country": "Germany",
    "city": "Moerfelden-Walldorf",
    "address": "Opelstrasse 17-19, 64546 Moerfelden-Walldorf, Germany",
    "website": "https://www.mabeg.de/",
    "lat": 49.9667569,
    "lng": 8.5614041,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=49.9667569,8.5614041",
    "notes": "",
    "u": 0.523782,
    "v": 0.777593
  },
  {
    "id": 7,
    "name": "Melzer Maschinenbau GmbH",
    "segments": [
      "Security"
    ],
    "product": "Automatic Card Production Lines, Inlay Production Lines, Smart Card & RFID Converting Machines",
    "country": "Germany",
    "city": "Schwelm",
    "address": "Ruhrstrasse 51, 58332 Schwelm, Germany",
    "website": "https://www.melzergmbh.com/",
    "lat": 51.2896221,
    "lng": 7.2719127,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=51.2896221,7.2719127",
    "notes": "",
    "u": 0.5202,
    "v": 0.784942
  },
  {
    "id": 8,
    "name": "Micro Laser Technology GmbH",
    "segments": [
      "Security"
    ],
    "product": "Laser Micro Perforation on Security Documents",
    "country": "Germany",
    "city": "Kirchheim bei Munich",
    "address": "Benzstrasse 5B, 85551 Kirchheim bei Muenchen, Germany",
    "website": "https://www.mlt-gmbh.com/",
    "lat": 48.17772,
    "lng": 11.76761,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=48.17772,11.76761",
    "notes": "",
    "u": 0.532688,
    "v": 0.767654
  },
  {
    "id": 9,
    "name": "Paul Leibinger GmbH & Co. KG",
    "segments": [
      "Currency",
      "Security"
    ],
    "product": "Numbering Systems for Banknotes, Passports and Security Documents",
    "country": "Germany",
    "city": "Tuttlingen",
    "address": "Daimlerstrasse 14, 78532 Tuttlingen, Germany",
    "website": "https://leibinger-group.com/",
    "lat": 47.9923744,
    "lng": 8.8256998,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=47.9923744,8.8256998",
    "notes": "",
    "u": 0.524516,
    "v": 0.766624
  },
  {
    "id": 10,
    "name": "WISTA GmbH",
    "segments": [
      "Security"
    ],
    "product": "Stamp Perforating Machines",
    "country": "Germany",
    "city": "Bad Rappenau",
    "address": "Buchaeckerring 27, 74906 Bad Rappenau, Germany",
    "website": "https://www.wista-gmbh.de/",
    "lat": 49.215344,
    "lng": 9.0666682,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=49.215344,9.0666682",
    "notes": "",
    "u": 0.525185,
    "v": 0.773419
  },
  {
    "id": 11,
    "name": "ACIGRAF Graphic Equipments S.r.l.",
    "segments": [
      "Security"
    ],
    "product": "Pre-press Equipment for Gravure Cylinders",
    "country": "Italy",
    "city": "Ornago, MB",
    "address": "Via E. Fermi 10, 20876 Ornago MB, Italy",
    "website": "https://www.acigraf.com/",
    "lat": 45.6032377,
    "lng": 9.4141371,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=45.6032377,9.4141371",
    "notes": "",
    "u": 0.52615,
    "v": 0.753351
  },
  {
    "id": 12,
    "name": "Locatelli Meccanica S.r.l.",
    "segments": [
      "Mint"
    ],
    "product": "Hydraulic Medal Press for Mints",
    "country": "Italy",
    "city": "Subbiano, AR",
    "address": "Via Signorini 5, 52010 Subbiano AR, Italy",
    "website": "https://www.locatellimeccanica.com/",
    "lat": 43.5816465,
    "lng": 11.8707078,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=43.5816465,11.8707078",
    "notes": "",
    "u": 0.532974,
    "v": 0.74212
  },
  {
    "id": 13,
    "name": "PARVIS Systems and Services S.p.A.",
    "segments": [
      "Currency"
    ],
    "product": "Track & Trace System for Banknote Presses",
    "country": "Italy",
    "city": "Milan",
    "address": "Via Clemente Prudenzio 16, 20138 Milan, Italy",
    "website": "https://www.parvis.it/",
    "lat": 45.4489555,
    "lng": 9.2443037,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=45.4489555,9.2443037",
    "notes": "",
    "u": 0.525679,
    "v": 0.752494
  },
  {
    "id": 14,
    "name": "Tecnoprint S.r.l.",
    "segments": [
      "Security"
    ],
    "product": "Web-Fed Photogravure Printing Machines for Postage Stamps",
    "country": "Italy",
    "city": "Ceprano, FR",
    "address": "Via Pennea 10, 03024 Ceprano FR, Italy",
    "website": "https://www.tecnoprintsrl.io/",
    "lat": 41.5291215,
    "lng": 13.5030324,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=41.5291215,13.5030324",
    "notes": "",
    "u": 0.537508,
    "v": 0.730717
  },
  {
    "id": 15,
    "name": "IN-CORE Systemes",
    "segments": [
      "Paper Mill"
    ],
    "product": "Inspection Systems for Security Paper Mills",
    "country": "France",
    "city": "Chassieu",
    "address": "10 Rue Ampere, 69680 Chassieu, France",
    "website": "https://www.in-core.com/",
    "lat": 45.7306506,
    "lng": 4.9747613,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=45.7306506,4.9747613",
    "notes": "",
    "u": 0.513819,
    "v": 0.754059
  },
  {
    "id": 16,
    "name": "PRODITEC",
    "segments": [
      "Mint"
    ],
    "product": "Inspection Systems for Mint Industry",
    "country": "France",
    "city": "Pessac",
    "address": "3 Rue Eugene Chevreul, 33600 Pessac, France",
    "website": "https://www.proditec.com/",
    "lat": 44.7779761,
    "lng": -0.6646108,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=44.7779761,-0.6646108",
    "notes": "",
    "u": 0.498154,
    "v": 0.748767
  },
  {
    "id": 17,
    "name": "CONDOT Systems Pvt. Ltd.",
    "segments": [
      "Security",
      "Paper Mill"
    ],
    "product": "Inkjet Systems for Security Printers; Track & Trace Solution for Paper Mills",
    "country": "India",
    "city": "Mumbai",
    "address": "Condot House, Plot F, Wicel Rd, opp. SEEPZ, Marol MIDC, Andheri East, Mumbai 400093, India",
    "website": "https://www.condotsystems.com/",
    "lat": 19.1246527,
    "lng": 72.871866,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=19.1246527,72.871866",
    "notes": "",
    "u": 0.702422,
    "v": 0.606248
  },
  {
    "id": 18,
    "name": "Syntegon Technology India Private Limited",
    "segments": [
      "Mint"
    ],
    "product": "Coin Sachet Packaging Systems",
    "country": "India",
    "city": "Verna, Goa",
    "address": "Phase IV, Verna Industrial Estate, Verna, Goa 403722, India",
    "website": "https://www.syntegon.com/",
    "lat": 15.359887,
    "lng": 73.9548242,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=15.359887,73.9548242",
    "notes": "",
    "u": 0.70543,
    "v": 0.585333
  },
  {
    "id": 19,
    "name": "ENTRUST Corporation",
    "segments": [
      "Security"
    ],
    "product": "Smart Card Personalization Machines",
    "country": "USA",
    "city": "Shakopee, MN",
    "address": "1187 Park Pl, Shakopee, MN 55379, USA",
    "website": "https://www.entrust.com/",
    "lat": 44.7867819,
    "lng": -93.4571122,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=44.7867819,-93.4571122",
    "notes": "",
    "u": 0.240397,
    "v": 0.748815
  },
  {
    "id": 20,
    "name": "Universal Machine Company",
    "segments": [
      "Mint"
    ],
    "product": "Coin Counting Machines for Mints",
    "country": "USA",
    "city": "Pottstown, PA",
    "address": "645 Old Reading Pike, Pottstown, PA 19464, USA",
    "website": "https://universalmachine.com/",
    "lat": 40.2443428,
    "lng": -75.6923904,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=40.2443428,-75.6923904",
    "notes": "",
    "u": 0.289743,
    "v": 0.72358
  },
  {
    "id": 21,
    "name": "KOVALUS Separation Solutions",
    "segments": [
      "Currency"
    ],
    "product": "UF Membranes for WSRTP",
    "country": "USA / India",
    "city": "Wilmington, MA",
    "address": "850 Main St, Wilmington, MA 01887, USA",
    "website": "https://www.kovalus.com/",
    "lat": 42.5295638,
    "lng": -71.157643,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=42.5295638,-71.157643",
    "notes": "Source doc listed the GTS URL by mistake. Coordinates are the US HQ; India office address not in source doc.",
    "u": 0.30234,
    "v": 0.736275
  },
  {
    "id": 22,
    "name": "GWT GmbH",
    "segments": [
      "Currency"
    ],
    "product": "Wiping Solution Recovery and Treatment Plant (WSRTP) for Banknote Printing",
    "country": "Austria",
    "city": "Leobersdorf",
    "address": "Hirtenberger Str. 1, 2544 Leobersdorf, Austria",
    "website": "https://www.gwt.at/",
    "lat": 47.9358865,
    "lng": 16.2266286,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=47.9358865,16.2266286",
    "notes": "",
    "u": 0.545074,
    "v": 0.76631
  },
  {
    "id": 23,
    "name": "ROTATEK Printing and Packaging Technologies S.L.",
    "segments": [
      "Security"
    ],
    "product": "Web-Fed Offset Printing Machines for Security Printing",
    "country": "Spain",
    "city": "Martorelles, Barcelona",
    "address": "Carrer de Sant Marti 65, nau 12-13, 08107 Martorelles, Barcelona, Spain",
    "website": "https://www.rotatek.com/",
    "lat": 41.5345696,
    "lng": 2.2310929,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=41.5345696,2.2310929",
    "notes": "",
    "u": 0.506197,
    "v": 0.730748
  },
  {
    "id": 24,
    "name": "APS Engineering Ltd",
    "segments": [
      "Security"
    ],
    "product": "Inline Rotary Perforation System for Postage Stamps",
    "country": "UK",
    "city": "High Wycombe",
    "address": "Mountford House, 4 Grafton St, High Wycombe HP12 3AJ, UK",
    "website": "http://www.apseng.co.uk/",
    "lat": 51.6351346,
    "lng": -0.773433,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=51.6351346,-0.773433",
    "notes": "",
    "u": 0.497852,
    "v": 0.786862
  }
];

export const SEGMENTS = ['All', 'Currency', 'Security', 'Mint', 'Paper Mill'] as const;
export type SegmentType = (typeof SEGMENTS)[number];
