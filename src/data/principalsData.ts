export interface PrincipalCompany {
  id: number;
  name: string;
  shortName?: string;
  logo?: string;
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
    "shortName": "ACSYS",
    "logo": "/JUI Logos/1.png",
    "segments": [
      "Mint"
    ],
    "product": "Laser Engraving Systems for Mints",
    "country": "Germany",
    "city": "Kornwestheim",
    "address": "Leibnizstrasse 9, 70806 Kornwestheim, Germany",
    "website": "https://acsyslaser.com/en/industries/mint-print/",
    "lat": 48.8691247,
    "lng": 9.1993914,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=48.8691247,9.1993914",
    "notes": "",
    "u": 0.525554,
    "v": 0.771495,
    "vThree": 0.228505
  },
  {
    "id": 2,
    "name": "BW Converting GmbH (formerly W+D)",
    "shortName": "BW Converting",
    "logo": "/JUI Logos/2.png",
    "segments": [
      "Security"
    ],
    "product": "Envelope Making Machines for Security Printing Industry",
    "country": "Germany",
    "city": "Neuwied",
    "address": "Sohler Weg 65, 56564 Neuwied, Germany",
    "website": "https://www.bwconverting.com/brand/w-d",
    "lat": 50.4337726,
    "lng": 7.4798967,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=50.4337726,7.4798967",
    "notes": "",
    "u": 0.520777,
    "v": 0.780188,
    "vThree": 0.219812
  },
  {
    "id": 3,
    "name": "BW Papersystems Stuttgart GmbH",
    "shortName": "BW Papersystems",
    "logo": "/JUI Logos/3.png",
    "segments": [
      "Security",
      "Paper Mill"
    ],
    "product": "Kugler Womako Passport Making Machines (Security); Bielomatik Banknote Sheeters (Paper Mill)",
    "country": "Germany",
    "city": "Nuertingen",
    "address": "Schlosserstrasse 15, 72622 Nuertingen, Germany",
    "website": "https://www.bwpapersystems.com/products/banknote-production",
    "lat": 48.6389846,
    "lng": 9.3417186,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=48.6389846,9.3417186",
    "notes": "",
    "u": 0.525949,
    "v": 0.770217,
    "vThree": 0.229783
  },
  {
    "id": 4,
    "name": "GTS GmbH",
    "shortName": "GTS",
    "logo": "/Currency/GTS GmbH.png",
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
    "v": 0.7732,
    "vThree": 0.2268
  },
  {
    "id": 5,
    "name": "I.T.G. GmbH Graphic Products",
    "shortName": "I.T.G.",
    "logo": "/Currency/I.T.G. GmbH Graphic Products.png",
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
    "v": 0.767562,
    "vThree": 0.232438
  },
  {
    "id": 6,
    "name": "MABEG Systems GmbH",
    "shortName": "MABEG",
    "logo": "/Currency/MABEG Systems GmbH.png",
    "segments": [
      "Currency",
      "Security",
      "Paper Mill"
    ],
    "product": "Sheet Feeders, Stackers & Transportation Systems for Currency & Security Printing Industry",
    "country": "Germany",
    "city": "Moerfelden-Walldorf",
    "address": "Opelstrasse 17-19, 64546 Moerfelden-Walldorf, Germany",
    "website": "https://www.mabegsystems.com/en/",
    "lat": 49.9667569,
    "lng": 8.5614041,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=49.9667569,8.5614041",
    "notes": "",
    "u": 0.523782,
    "v": 0.777593,
    "vThree": 0.222407
  },
  {
    "id": 7,
    "name": "Melzer Maschinenbau GmbH",
    "shortName": "Melzer",
    "logo": "/JUI Logos/7.png",
    "segments": [
      "Security"
    ],
    "product": "Automatic Card Production Lines, Inlay Production Lines, Smart Card & RFID Converting Machines",
    "country": "Germany",
    "city": "Schwelm",
    "address": "Ruhrstrasse 51, 58332 Schwelm, Germany",
    "website": "https://www.melzermaschinenbau.de/en/",
    "lat": 51.2896221,
    "lng": 7.2719127,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=51.2896221,7.2719127",
    "notes": "",
    "u": 0.5202,
    "v": 0.784942,
    "vThree": 0.215058
  },
  {
    "id": 8,
    "name": "Micro Laser Technology GmbH",
    "shortName": "Micro Laser Technology",
    "logo": "/JUI Logos/8.png",
    "segments": [
      "Security"
    ],
    "product": "Laser Micro Perforation on Security Documents",
    "country": "Germany",
    "city": "Kirchheim bei Munich",
    "address": "Benzstrasse 5B, 85551 Kirchheim bei Muenchen, Germany",
    "website": "https://www.microlasertech.com/en/industries/laser-system-currency-identity/",
    "lat": 48.17772,
    "lng": 11.76761,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=48.17772,11.76761",
    "notes": "",
    "u": 0.532688,
    "v": 0.767654,
    "vThree": 0.232346
  },
  {
    "id": 9,
    "name": "Paul Leibinger GmbH & Co. KG",
    "shortName": "Leibinger",
    "logo": "/Currency/Paul Leibinger GmbH & Co. KG.png",
    "segments": [
      "Currency",
      "Security"
    ],
    "product": "Numbering Systems for Banknotes, Passports and Security Documents",
    "country": "Germany",
    "city": "Tuttlingen",
    "address": "Daimlerstrasse 14, 78532 Tuttlingen, Germany",
    "website": "https://leibinger-group.com/numbering_machines",
    "lat": 47.9923744,
    "lng": 8.8256998,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=47.9923744,8.8256998",
    "notes": "",
    "u": 0.524516,
    "v": 0.766624,
    "vThree": 0.233376
  },
  {
    "id": 10,
    "name": "WISTA GmbH",
    "shortName": "WISTA",
    "logo": "/JUI Logos/9.png",
    "segments": [
      "Security"
    ],
    "product": "Stamp Perforating Machines",
    "country": "Germany",
    "city": "Bad Rappenau",
    "address": "Buchaeckerring 27, 74906 Bad Rappenau, Germany",
    "website": "https://wista.com/en/",
    "lat": 49.215344,
    "lng": 9.0666682,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=49.215344,9.0666682",
    "notes": "",
    "u": 0.525185,
    "v": 0.773419,
    "vThree": 0.226581
  },
  {
    "id": 11,
    "name": "ACIGRAF Graphic Equipments S.r.l.",
    "shortName": "ACIGRAF",
    "logo": "/JUI Logos/12.png",
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
    "v": 0.753351,
    "vThree": 0.246649
  },
  {
    "id": 12,
    "name": "Locatelli Meccanica S.r.l.",
    "shortName": "Locatelli",
    "logo": "/JUI Logos/13.png",
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
    "v": 0.74212,
    "vThree": 0.25788
  },
  {
    "id": 13,
    "name": "PARVIS Systems and Services S.p.A.",
    "shortName": "PARVIS",
    "logo": "/Currency/PARVIS Systems and Services S.p.A.png",
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
    "v": 0.752494,
    "vThree": 0.247506
  },
  {
    "id": 14,
    "name": "Tecnoprint S.r.l.",
    "shortName": "Tecnoprint",
    "logo": "/JUI Logos/15.png",
    "segments": [
      "Security"
    ],
    "product": "Web-Fed Photogravure Printing Machines for Postage Stamps",
    "country": "Italy",
    "city": "Ceprano, FR",
    "address": "Via Pennea 10, 03024 Ceprano FR, Italy",
    "website": "http://www.tecno-print.com/en/index/home-4.html",
    "lat": 41.5291215,
    "lng": 13.5030324,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=41.5291215,13.5030324",
    "notes": "",
    "u": 0.537508,
    "v": 0.730717,
    "vThree": 0.269283
  },
  {
    "id": 15,
    "name": "IN-CORE Systemes",
    "shortName": "IN-CORE",
    "logo": "/JUI Logos/16.png",
    "segments": [
      "Paper Mill"
    ],
    "product": "Inspection Systems for Security Paper Mills",
    "country": "France",
    "city": "Chassieu",
    "address": "10 Rue Ampere, 69680 Chassieu, France",
    "website": "https://www.incore-systemes.com/",
    "lat": 45.7306506,
    "lng": 4.9747613,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=45.7306506,4.9747613",
    "notes": "",
    "u": 0.513819,
    "v": 0.754059,
    "vThree": 0.245941
  },
  {
    "id": 16,
    "name": "PRODITEC",
    "shortName": "PRODITEC",
    "logo": "/JUI Logos/17.png",
    "segments": [
      "Mint"
    ],
    "product": "Inspection Systems for Mint Industry",
    "country": "France",
    "city": "Pessac",
    "address": "3 Rue Eugene Chevreul, 33600 Pessac, France",
    "website": "https://proditec.com/minting-solutions/",
    "lat": 44.7779761,
    "lng": -0.6646108,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=44.7779761,-0.6646108",
    "notes": "",
    "u": 0.498154,
    "v": 0.748767,
    "vThree": 0.251233
  },
  {
    "id": 17,
    "name": "CONDOT Systems Pvt. Ltd.",
    "shortName": "CONDOT",
    "logo": "/JUI Logos/18.png",
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
    "v": 0.606248,
    "vThree": 0.393752
  },
  {
    "id": 18,
    "name": "Syntegon Technology India Private Limited",
    "shortName": "Syntegon",
    "logo": "/JUI Logos/19.png",
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
    "v": 0.585333,
    "vThree": 0.414667
  },
  {
    "id": 19,
    "name": "ENTRUST Corporation",
    "shortName": "ENTRUST",
    "logo": "/JUI Logos/20.png",
    "segments": [
      "Security"
    ],
    "product": "Smart Card Personalization Machines",
    "country": "USA",
    "city": "Shakopee, MN",
    "address": "1187 Park Pl, Shakopee, MN 55379, USA",
    "website": "https://www.entrust.com/products/issuance-systems/central?_gl=1*p046vw*_up*MQ..*_ga*Mzk2NzAzMzAyLjE3ODgzNDY1OTY.*_ga_LRSG0BP0M6*czE3ODgzNDY1OTUkbzEkZzAkdDE3ODgzNDY1OTUkajYwJGwwJGgwJGRFQ1NMQlpxVHBVQW05MDFXVC0zTWUyMHZiT3NnS1hjcDV3*_ga_6QRW66BW5T*czE3ODgzNDY1OTUkbzEkZzAkdDE3ODgzNDY1OTUkajYwJGwwJGgwJGRzWnJQYW5LaWZBTEhhbWd0M2F1enE1ZzJMUkhiX1N0cmhR",
    "lat": 44.7867819,
    "lng": -93.4571122,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=44.7867819,-93.4571122",
    "notes": "",
    "u": 0.240397,
    "v": 0.748815,
    "vThree": 0.251185
  },
  {
    "id": 20,
    "name": "Universal Machine Company",
    "shortName": "Universal Machine",
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
    "v": 0.72358,
    "vThree": 0.27642
  },
  {
    "id": 21,
    "name": "KOVALUS Separation Solutions",
    "shortName": "KOVALUS",
    "logo": "/Currency/KOVALUS Separation Solutions.png",
    "segments": [
      "Currency"
    ],
    "product": "UF Membranes for WSRTP",
    "country": "USA / India",
    "city": "Wilmington, MA",
    "address": "850 Main St, Wilmington, MA 01887, USA",
    "website": "https://www.kovalus.com/technologies/membrane-filtration/feg-plus-modules/",
    "lat": 42.5295638,
    "lng": -71.157643,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=42.5295638,-71.157643",
    "notes": "Source doc listed the GTS URL by mistake. Coordinates are the US HQ; India office address not in source doc.",
    "u": 0.30234,
    "v": 0.736275,
    "vThree": 0.263725
  },
  {
    "id": 22,
    "name": "GWT GmbH",
    "shortName": "GWT",
    "logo": "/Currency/GWT GmbH.png",
    "segments": [
      "Currency"
    ],
    "product": "Wiping Solution Recovery and Treatment Plant (WSRTP) for Banknote Printing",
    "country": "Austria",
    "city": "Leobersdorf",
    "address": "Hirtenberger Str. 1, 2544 Leobersdorf, Austria",
    "website": "https://www.gwt.at/wasser-und-waermetechnik/en/taetigkeitsbereiche/wischlaugenaufbereitung/",
    "lat": 47.9358865,
    "lng": 16.2266286,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=47.9358865,16.2266286",
    "notes": "",
    "u": 0.545074,
    "v": 0.76631,
    "vThree": 0.23369
  },
  {
    "id": 23,
    "name": "ROTATEK Printing and Packaging Technologies S.L.",
    "shortName": "Rotec",
    "logo": "/JUI Logos/23.png",
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
    "v": 0.730748,
    "vThree": 0.269252
  },
  {
    "id": 24,
    "name": "APS Engineering Ltd",
    "shortName": "APS Engineering",
    "logo": "/JUI Logos/24.png",
    "segments": [
      "Security"
    ],
    "product": "Inline Rotary Perforation System for Postage Stamps",
    "country": "UK",
    "city": "High Wycombe",
    "address": "Mountford House, 4 Grafton St, High Wycombe HP12 3AJ, UK",
    "website": "https://www.apsworldwide.com/",
    "lat": 51.6351346,
    "lng": -0.773433,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=51.6351346,-0.773433",
    "notes": "",
    "u": 0.497852,
    "v": 0.786862,
    "vThree": 0.213138
  },
  {
    "id": 25,
    "name": "Niemann",
    "shortName": "Niemann",
    "logo": "/niemann-logo.svg",
    "segments": [
      "Paints"
    ],
    "product": "Dispersing , Mixing , Fine Grinding",
    "country": "Germany",
    "city": "Neuenkirchen Melle",
    "address": "Nordlandstra\u00dfe 16, 9326 Melle-Neuenkirchen, Germany",
    "website": "https://www.niemann.in/en/",
    "lat": 52.142082,
    "lng": 8.400285,
    "mapsUrl": "https://www.google.com/maps/place//data=!4m2!3m1!1s0x47ba1ea6a1f6c96f:0x4eea2fee13bcd6eb?entry=gemini&utm_source=gemini&utm_campaign=gem-default",
    "notes": "",
    "u": 0.523334,
    "v": 0.789678,
    "vThree": 0.210322
  },
  {
    "id": 26,
    "name": "Renzmann",
    "shortName": "Renzmann",
    "logo": "/renzmann-logo.svg",
    "segments": [
      "Paints"
    ],
    "product": "Industrial Washing machines",
    "country": "Germany",
    "city": "Monzingen",
    "address": "Industriestrasse 1, 55569 Monzingen",
    "website": "https://www.renzmann.com/en/",
    "lat": 49.792648,
    "lng": 7.590033,
    "mapsUrl": "https://www.google.com/maps/place//data=!4m2!3m1!1s0x47be004a27134659:0xec1aaa506183d473?entry=gemini&utm_source=gemini&utm_campaign=gem-default",
    "notes": "",
    "u": 0.521083,
    "v": 0.776626,
    "vThree": 0.223374
  },
  {
    "id": 27,
    "name": "Tullis Russell",
    "shortName": "Tullis Russell",
    "logo": "/JUI Logos/25.png",
    "segments": [
      "Security"
    ],
    "product": "Coated and Gummed paper for stamps",
    "country": "UK",
    "city": "Bollington",
    "address": "Church Street, Bollington, Macclesfield, Cheshire SK10 5QF, United Kingdom",
    "website": "https://www.tullisrussell.com/",
    "lat": 53.296955,
    "lng": -2.09313,
    "mapsUrl": "https://www.google.com/maps/place//data=!4m2!3m1!1s0x487a4bd29f1268b1:0x8b26da33224307ce?entry=gemini&utm_source=gemini&utm_campaign=gem-default",
    "notes": "",
    "u": 0.494186,
    "v": 0.796094,
    "vThree": 0.203906
  },
  {
    "id": 28,
    "name": "DMA Innotec international ,Ltd",
    "shortName": "DMA Innotec",
    "logo": "/JUI Logos/26.png",
    "segments": [
      "Security"
    ],
    "product": "Electro-Mechanical Engraving machine for Gravure Cylinders",
    "country": "Taiwan",
    "city": "Changhua County",
    "address": "Building D, No. 35, Xinggong Rd., Shengang Twp., Changhua Cnty., 50971 Taiwan",
    "website": "https://dma-innotec.com/",
    "lat": 24.1465,
    "lng": 120.4878,
    "mapsUrl": "https://www.google.com/maps/place//data=!4m2!3m1!1s0x346940e18059c4b3:0x2a68944fe27c788b?entry=gemini&utm_source=gemini&utm_campaign=gem-default",
    "notes": "",
    "u": 0.834688,
    "v": 0.634147,
    "vThree": 0.365853
  },
  {
    "id": 29,
    "name": "Gietz",
    "shortName": "Gietz",
    "logo": "/JUI Logos/27.png",
    "segments": [
      "Security"
    ],
    "product": "Hologram application machine",
    "country": "Switzerland",
    "city": "Gossau SG",
    "address": "Mooswiesstrasse 20 , 9200 Gossau SG, Switzerland",
    "website": "https://www.gietz.ch/en/",
    "lat": 47.413129,
    "lng": 9.257551,
    "mapsUrl": "https://maps.app.goo.gl/N3PwkWgj7Eo8eRgX9",
    "notes": "",
    "u": 0.525715,
    "v": 0.763406,
    "vThree": 0.236594
  },
  {
    "id": 30,
    "name": "SPGPrints",
    "shortName": "SPGPrints",
    "logo": "/JUI Logos/28.png",
    "segments": [
      "Security"
    ],
    "product": "DLE machines",
    "country": "Netherlands",
    "city": "Boxmeer",
    "address": "Raamstraat 3, 5831 AT Boxmeer, Netherlands",
    "website": "https://www.spgprints.com/industrial-printing-label-screen-printing",
    "lat": 51.638657,
    "lng": 5.941729,
    "mapsUrl": "https://maps.app.goo.gl/MGwqFHtQrW7gnupZ6",
    "notes": "",
    "u": 0.516505,
    "v": 0.786881,
    "vThree": 0.213119
  }
];

export function getShortCompanyName(company: PrincipalCompany | null | undefined): string {
  if (!company) return '';
  if (company.shortName) return company.shortName;
  return company.name
    .replace(/\s+(GmbH|S\.r\.l\.|S\.p\.A\.|Pvt\.\s*Ltd\.|Ltd|Corporation|Inc\.|Co\.\s*KG).*$/i, '')
    .trim();
}

export const SEGMENTS = ['All', 'Currency', 'Security', 'Mint', 'Paper Mill', 'Paints'] as const;
export type SegmentType = (typeof SEGMENTS)[number];
