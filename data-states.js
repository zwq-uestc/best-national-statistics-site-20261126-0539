// State-level dataset for "America in Numbers": the 50 states plus the
// District of Columbia, twelve indicators each. Every indicator carries its
// publisher and reference year in INDICATORS below; the Methods page repeats
// them with definitions and caveats. Figures are the latest published
// estimates compiled from the named sources (see #/methods).

window.AIN = window.AIN || {};

AIN.REGIONS = ['Northeast', 'South', 'Midwest', 'West'];

// Indicator metadata: key, label, unit, publisher, reference year, decimals,
// "higher is better" (for ranking colours), and a one-line definition.
AIN.INDICATORS = [
  { key: 'pop',       label: 'Population',            unit: 'people',  source: 'U.S. Census Bureau, Vintage 2024 estimates', year: 2024, dec: 0, higherBetter: null,
    blurb: 'Estimated resident population on July 1, 2024.' },
  { key: 'gdpPc',     label: 'GDP per capita',        unit: 'US$',     source: 'Bureau of Economic Analysis, state GDP',     year: 2024, dec: 0, higherBetter: true,
    blurb: 'Nominal gross domestic product divided by resident population.' },
  { key: 'income',    label: 'Median household income', unit: 'US$',   source: 'Census Bureau, American Community Survey',   year: 2023, dec: 0, higherBetter: true,
    blurb: 'Income of the household in the middle: half of households earn more, half less.' },
  { key: 'unemp',     label: 'Unemployment rate',     unit: '%',       source: 'Bureau of Labor Statistics, LAUS',           year: 2025, dec: 1, higherBetter: false,
    blurb: 'Share of the labour force without a job but actively looking for one.' },
  { key: 'lifeExp',   label: 'Life expectancy',       unit: 'years',   source: 'CDC National Center for Health Statistics',  year: 2022, dec: 1, higherBetter: true,
    blurb: 'Average years a newborn would live if current death rates stayed unchanged.' },
  { key: 'edu',       label: "Bachelor's degree or higher", unit: '%', source: 'Census Bureau, American Community Survey',   year: 2023, dec: 1, higherBetter: true,
    blurb: 'Share of residents aged 25 and over holding at least a bachelor\u2019s degree.' },
  { key: 'poverty',   label: 'Poverty rate',          unit: '%',       source: 'Census Bureau, American Community Survey',   year: 2023, dec: 1, higherBetter: false,
    blurb: 'Share of residents living in households below the federal poverty threshold.' },
  { key: 'homePrice', label: 'Median home price',     unit: 'US$',     source: 'Federal Housing Finance Agency / Zillow ZHVI', year: 2024, dec: 0, higherBetter: null,
    blurb: 'Median value of owner-occupied homes; half of homes are worth more, half less.' },
  { key: 'crime',     label: 'Violent crime rate',    unit: 'per 100k', source: 'FBI Crime Data Explorer',                   year: 2023, dec: 0, higherBetter: false,
    blurb: 'Murder, rape, robbery and aggravated assault reported per 100,000 residents.' },
  { key: 'density',   label: 'Population density',    unit: 'per sq mi', source: 'Census Bureau, land area & estimates',    year: 2024, dec: 0, higherBetter: null,
    blurb: 'Residents per square mile of land area.' },
  { key: 'medianAge', label: 'Median age',            unit: 'years',   source: 'Census Bureau, American Community Survey',   year: 2023, dec: 1, higherBetter: null,
    blurb: 'Age of the resident in the middle: half the population is younger, half older.' },
  { key: 'growth',    label: 'Population growth 2020\u201324', unit: '%', source: 'Census Bureau, 2020 Census & Vintage 2024', year: 2024, dec: 1, higherBetter: null,
    blurb: 'Percentage change in resident population between the 2020 Census and July 1, 2024.' },
];

// One object per state: code, name, capital, region, then the twelve
// indicators above in the same order.
AIN.STATES = [
  { code: 'AL', name: 'Alabama',        capital: 'Montgomery',   region: 'South',     pop: 5157699,  gdpPc: 61846,  income: 59609,  unemp: 3.0, lifeExp: 73.4, edu: 26.2, poverty: 15.3, homePrice: 220000, crime: 510,  density: 99,   medianAge: 39.0, growth: 1.2 },
  { code: 'AK', name: 'Alaska',         capital: 'Juneau',       region: 'West',      pop: 740133,   gdpPc: 95147,  income: 88121,  unemp: 4.7, lifeExp: 75.1, edu: 30.9, poverty: 10.8, homePrice: 380000, crime: 760,  density: 1,    medianAge: 35.2, growth: 0.3 },
  { code: 'AZ', name: 'Arizona',        capital: 'Phoenix',      region: 'West',      pop: 7582384,  gdpPc: 73203,  income: 74568,  unemp: 4.5, lifeExp: 76.1, edu: 31.4, poverty: 12.5, homePrice: 430000, crime: 490,  density: 64,   medianAge: 38.3, growth: 3.3 },
  { code: 'AR', name: 'Arkansas',       capital: 'Little Rock',  region: 'South',     pop: 3088354,  gdpPc: 60276,  income: 56335,  unemp: 3.4, lifeExp: 74.1, edu: 24.3, poverty: 15.7, homePrice: 220000, crime: 620,  density: 59,   medianAge: 38.5, growth: 1.6 },
  { code: 'CA', name: 'California',     capital: 'Sacramento',   region: 'West',      pop: 39431263, gdpPc: 104916, income: 95521,  unemp: 5.3, lifeExp: 78.6, edu: 36.6, poverty: 12.5, homePrice: 790000, crime: 500,  density: 253,  medianAge: 37.0, growth: -0.2 },
  { code: 'CO', name: 'Colorado',       capital: 'Denver',       region: 'West',      pop: 5957493,  gdpPc: 86000,  income: 92911,  unemp: 4.3, lifeExp: 78.3, edu: 44.6, poverty: 9.3,  homePrice: 560000, crime: 480,  density: 58,   medianAge: 37.5, growth: 2.4 },
  { code: 'CT', name: 'Connecticut',    capital: 'Hartford',     region: 'Northeast', pop: 3675069,  gdpPc: 97000,  income: 91665,  unemp: 3.6, lifeExp: 79.0, edu: 42.4, poverty: 9.8,  homePrice: 420000, crime: 200,  density: 745,  medianAge: 41.1, growth: 0.8 },
  { code: 'DE', name: 'Delaware',       capital: 'Dover',        region: 'South',     pop: 1051917,  gdpPc: 92000,  income: 82174,  unemp: 4.0, lifeExp: 76.8, edu: 34.5, poverty: 9.7,  homePrice: 390000, crime: 430,  density: 508,  medianAge: 41.0, growth: 3.4 },
  { code: 'DC', name: 'District of Columbia', capital: 'Washington', region: 'South',   pop: 702250,   gdpPc: 268000, income: 108210, unemp: 5.4, lifeExp: 77.0, edu: 65.5, poverty: 14.9, homePrice: 650000, crime: 850,  density: 11300, medianAge: 34.5, growth: 1.4 },
  { code: 'FL', name: 'Florida',        capital: 'Tallahassee',  region: 'South',     pop: 23372215, gdpPc: 66000,  income: 71711,  unemp: 3.7, lifeExp: 77.2, edu: 31.7, poverty: 12.3, homePrice: 410000, crime: 380,  density: 384,  medianAge: 42.2, growth: 5.0 },
  { code: 'GA', name: 'Georgia',        capital: 'Atlanta',      region: 'South',     pop: 11180878, gdpPc: 78754,  income: 74664,  unemp: 3.6, lifeExp: 76.3, edu: 33.7, poverty: 12.5, homePrice: 330000, crime: 400,  density: 187,  medianAge: 37.5, growth: 2.9 },
  { code: 'HI', name: 'Hawaii',         capital: 'Honolulu',     region: 'West',      pop: 1446862,  gdpPc: 80325,  income: 95322,  unemp: 3.0, lifeExp: 80.0, edu: 34.1, poverty: 9.3,  homePrice: 850000, crime: 250,  density: 224,  medianAge: 40.2, growth: -0.5 },
  { code: 'ID', name: 'Idaho',          capital: 'Boise',        region: 'West',      pop: 2029733,  gdpPc: 63991,  income: 74942,  unemp: 3.7, lifeExp: 77.4, edu: 30.4, poverty: 10.5, homePrice: 460000, crime: 240,  density: 22,   medianAge: 36.9, growth: 4.6 },
  { code: 'IL', name: 'Illinois',       capital: 'Springfield',  region: 'Midwest',   pop: 12710158, gdpPc: 82000,  income: 81702,  unemp: 4.9, lifeExp: 77.6, edu: 36.2, poverty: 11.6, homePrice: 290000, crime: 430,  density: 231,  medianAge: 38.6, growth: -0.4 },
  { code: 'IN', name: 'Indiana',        capital: 'Indianapolis', region: 'Midwest',   pop: 6924275,  gdpPc: 67000,  income: 69477,  unemp: 3.8, lifeExp: 75.7, edu: 28.6, poverty: 12.3, homePrice: 260000, crime: 380,  density: 189,  medianAge: 38.2, growth: 1.0 },
  { code: 'IA', name: 'Iowa',           capital: 'Des Moines',   region: 'Midwest',   pop: 3241488,  gdpPc: 64000,  income: 71433,  unemp: 3.3, lifeExp: 77.1, edu: 29.8, poverty: 11.0, homePrice: 240000, crime: 280,  density: 57,   medianAge: 38.3, growth: 0.3 },
  { code: 'KS', name: 'Kansas',         capital: 'Topeka',       region: 'Midwest',   pop: 2970606,  gdpPc: 69000,  income: 71988,  unemp: 3.8, lifeExp: 75.4, edu: 34.0, poverty: 11.7, homePrice: 270000, crime: 450,  density: 36,   medianAge: 37.2, growth: 0.6 },
  { code: 'KY', name: 'Kentucky',       capital: 'Frankfort',    region: 'South',     pop: 4588372,  gdpPc: 64110,  income: 61564,  unemp: 4.3, lifeExp: 74.3, edu: 26.4, poverty: 15.4, homePrice: 230000, crime: 230,  density: 112,  medianAge: 38.9, growth: 0.4 },
  { code: 'LA', name: 'Louisiana',      capital: 'Baton Rouge',  region: 'South',     pop: 4597740,  gdpPc: 62000,  income: 57852,  unemp: 4.4, lifeExp: 73.6, edu: 24.6, poverty: 17.3, homePrice: 220000, crime: 640,  density: 107,  medianAge: 36.5, growth: -0.9 },
  { code: 'ME', name: 'Maine',          capital: 'Augusta',      region: 'Northeast', pop: 1405012,  gdpPc: 58000,  income: 70571,  unemp: 3.3, lifeExp: 76.7, edu: 32.4, poverty: 10.6, homePrice: 390000, crime: 110,  density: 44,   medianAge: 44.8, growth: 1.5 },
  { code: 'MD', name: 'Maryland',       capital: 'Annapolis',    region: 'South',     pop: 6263220,  gdpPc: 76000,  income: 98461,  unemp: 3.4, lifeExp: 77.9, edu: 43.9, poverty: 9.1,  homePrice: 430000, crime: 430,  density: 636,  medianAge: 38.9, growth: 0.4 },
  { code: 'MA', name: 'Massachusetts',  capital: 'Boston',       region: 'Northeast', pop: 7136171,  gdpPc: 109000, income: 96505,  unemp: 4.2, lifeExp: 79.6, edu: 47.6, poverty: 9.3,  homePrice: 610000, crime: 270,  density: 901,  medianAge: 39.4, growth: 0.9 },
  { code: 'MI', name: 'Michigan',       capital: 'Lansing',      region: 'Midwest',   pop: 10140459, gdpPc: 64000,  income: 71149,  unemp: 4.8, lifeExp: 76.0, edu: 30.3, poverty: 13.1, homePrice: 260000, crime: 480,  density: 177,  medianAge: 39.8, growth: 0.1 },
  { code: 'MN', name: 'Minnesota',      capital: 'Saint Paul',   region: 'Midwest',   pop: 5793151,  gdpPc: 84000,  income: 88870,  unemp: 3.6, lifeExp: 79.1, edu: 38.3, poverty: 9.0,  homePrice: 340000, crime: 280,  density: 72,   medianAge: 38.4, growth: 0.9 },
  { code: 'MS', name: 'Mississippi',    capital: 'Jackson',      region: 'South',     pop: 2938928,  gdpPc: 53000,  income: 54203,  unemp: 3.7, lifeExp: 73.1, edu: 23.2, poverty: 18.0, homePrice: 190000, crime: 320,  density: 63,   medianAge: 38.4, growth: -0.6 },
  { code: 'MO', name: 'Missouri',       capital: 'Jefferson City', region: 'Midwest', pop: 6245466,  gdpPc: 65000,  income: 68545,  unemp: 3.9, lifeExp: 75.5, edu: 29.9, poverty: 12.1, homePrice: 270000, crime: 550,  density: 89,   medianAge: 38.6, growth: 0.7 },
  { code: 'MT', name: 'Montana',        capital: 'Helena',       region: 'West',      pop: 1137233,  gdpPc: 64000,  income: 70804,  unemp: 3.2, lifeExp: 77.0, edu: 33.5, poverty: 11.2, homePrice: 460000, crime: 420,  density: 7,    medianAge: 40.5, growth: 3.8 },
  { code: 'NE', name: 'Nebraska',       capital: 'Lincoln',      region: 'Midwest',   pop: 2034000,  gdpPc: 80000,  income: 74590,  unemp: 3.0, lifeExp: 77.5, edu: 33.1, poverty: 9.9,  homePrice: 280000, crime: 300,  density: 26,   medianAge: 36.8, growth: 1.2 },
  { code: 'NV', name: 'Nevada',         capital: 'Carson City',  region: 'West',      pop: 3267557,  gdpPc: 69000,  income: 71646,  unemp: 5.6, lifeExp: 75.8, edu: 26.5, poverty: 12.6, homePrice: 420000, crime: 490,  density: 28,   medianAge: 38.4, growth: 2.6 },
  { code: 'NH', name: 'New Hampshire',  capital: 'Concord',      region: 'Northeast', pop: 1409032,  gdpPc: 77000,  income: 95628,  unemp: 2.7, lifeExp: 78.7, edu: 39.4, poverty: 7.2,  homePrice: 470000, crime: 140,  density: 153,  medianAge: 43.2, growth: 1.6 },
  { code: 'NJ', name: 'New Jersey',     capital: 'Trenton',      region: 'Northeast', pop: 9500851,  gdpPc: 88000,  income: 97126,  unemp: 4.8, lifeExp: 78.9, edu: 42.2, poverty: 9.4,  homePrice: 540000, crime: 230,  density: 1263, medianAge: 39.9, growth: 0.6 },
  { code: 'NM', name: 'New Mexico',     capital: 'Santa Fe',     region: 'West',      pop: 2130256,  gdpPc: 58000,  income: 58722,  unemp: 4.3, lifeExp: 73.9, edu: 29.2, poverty: 17.4, homePrice: 330000, crime: 780,  density: 17,   medianAge: 38.6, growth: -0.3 },
  { code: 'NY', name: 'New York',       capital: 'Albany',       region: 'Northeast', pop: 19867248, gdpPc: 117500, income: 82095,  unemp: 4.3, lifeExp: 78.4, edu: 37.5, poverty: 13.4, homePrice: 480000, crime: 430,  density: 429,  medianAge: 39.2, growth: -0.3 },
  { code: 'NC', name: 'North Carolina', capital: 'Raleigh',      region: 'South',     pop: 11046024, gdpPc: 71000,  income: 71735,  unemp: 3.9, lifeExp: 76.5, edu: 33.6, poverty: 12.8, homePrice: 350000, crime: 400,  density: 218,  medianAge: 38.8, growth: 4.0 },
  { code: 'ND', name: 'North Dakota',   capital: 'Bismarck',     region: 'Midwest',   pop: 796568,   gdpPc: 98000,  income: 80160,  unemp: 2.5, lifeExp: 77.3, edu: 32.8, poverty: 10.4, homePrice: 290000, crime: 320,  density: 11,   medianAge: 35.4, growth: 2.2 },
  { code: 'OH', name: 'Ohio',           capital: 'Columbus',     region: 'Midwest',   pop: 11883304, gdpPc: 67000,  income: 69680,  unemp: 4.4, lifeExp: 75.9, edu: 30.0, poverty: 13.0, homePrice: 260000, crime: 300,  density: 289,  medianAge: 39.6, growth: 0.2 },
  { code: 'OK', name: 'Oklahoma',       capital: 'Oklahoma City', region: 'South',    pop: 4095393,  gdpPc: 59000,  income: 63603,  unemp: 3.3, lifeExp: 74.6, edu: 27.0, poverty: 14.3, homePrice: 240000, crime: 460,  density: 58,   medianAge: 36.7, growth: 2.0 },
  { code: 'OR', name: 'Oregon',         capital: 'Salem',        region: 'West',      pop: 4363085,  gdpPc: 72000,  income: 82893,  unemp: 4.7, lifeExp: 78.1, edu: 36.4, poverty: 11.9, homePrice: 500000, crime: 420,  density: 45,   medianAge: 39.7, growth: 1.1 },
  { code: 'PA', name: 'Pennsylvania',   capital: 'Harrisburg',   region: 'Northeast', pop: 13059327, gdpPc: 74000,  income: 76081,  unemp: 3.9, lifeExp: 76.9, edu: 33.8, poverty: 11.5, homePrice: 280000, crime: 290,  density: 291,  medianAge: 40.9, growth: -0.1 },
  { code: 'RI', name: 'Rhode Island',   capital: 'Providence',   region: 'Northeast', pop: 1112308,  gdpPc: 68000,  income: 81370,  unemp: 4.2, lifeExp: 78.0, edu: 36.6, poverty: 10.8, homePrice: 470000, crime: 240,  density: 1061, medianAge: 39.7, growth: 0.2 },
  { code: 'SC', name: 'South Carolina', capital: 'Columbia',     region: 'South',     pop: 5478831,  gdpPc: 60000,  income: 66818,  unemp: 3.8, lifeExp: 75.2, edu: 29.8, poverty: 13.8, homePrice: 320000, crime: 570,  density: 170,  medianAge: 39.4, growth: 5.3 },
  { code: 'SD', name: 'South Dakota',   capital: 'Pierre',       region: 'Midwest',   pop: 924669,   gdpPc: 70000,  income: 69457,  unemp: 2.0, lifeExp: 77.2, edu: 30.6, poverty: 11.3, homePrice: 310000, crime: 380,  density: 12,   medianAge: 36.9, growth: 3.5 },
  { code: 'TN', name: 'Tennessee',      capital: 'Nashville',    region: 'South',     pop: 7227750,  gdpPc: 70000,  income: 67631,  unemp: 3.5, lifeExp: 74.8, edu: 28.5, poverty: 13.3, homePrice: 330000, crime: 600,  density: 170,  medianAge: 38.7, growth: 3.4 },
  { code: 'TX', name: 'Texas',          capital: 'Austin',       region: 'South',     pop: 31290831, gdpPc: 81000,  income: 75780,  unemp: 4.2, lifeExp: 76.2, edu: 31.5, poverty: 13.7, homePrice: 340000, crime: 430,  density: 116,  medianAge: 35.5, growth: 4.3 },
  { code: 'UT', name: 'Utah',           capital: 'Salt Lake City', region: 'West',    pop: 3503613,  gdpPc: 75000,  income: 95767,  unemp: 3.3, lifeExp: 78.2, edu: 36.0, poverty: 8.8,  homePrice: 510000, crime: 240,  density: 41,   medianAge: 31.9, growth: 4.2 },
  { code: 'VT', name: 'Vermont',        capital: 'Montpelier',   region: 'Northeast', pop: 648493,   gdpPc: 57000,  income: 74000,  unemp: 2.4, lifeExp: 78.8, edu: 43.5, poverty: 9.6,  homePrice: 440000, crime: 230,  density: 68,   medianAge: 43.5, growth: 0.3 },
  { code: 'VA', name: 'Virginia',       capital: 'Richmond',     region: 'South',     pop: 8811195,  gdpPc: 79000,  income: 89931,  unemp: 3.3, lifeExp: 77.8, edu: 42.0, poverty: 10.2, homePrice: 410000, crime: 240,  density: 218,  medianAge: 38.4, growth: 1.7 },
  { code: 'WA', name: 'Washington',     capital: 'Olympia',      region: 'West',      pop: 7958418,  gdpPc: 106500, income: 94605,  unemp: 4.6, lifeExp: 78.7, edu: 39.8, poverty: 9.6,  homePrice: 590000, crime: 380,  density: 119,  medianAge: 37.9, growth: 1.8 },
  { code: 'WV', name: 'West Virginia',  capital: 'Charleston',   region: 'South',     pop: 1769979,  gdpPc: 58000,  income: 55948,  unemp: 4.3, lifeExp: 72.2, edu: 21.8, poverty: 16.7, homePrice: 160000, crime: 320,  density: 75,   medianAge: 43.1, growth: -1.2 },
  { code: 'WI', name: 'Wisconsin',      capital: 'Madison',      region: 'Midwest',   pop: 5960975,  gdpPc: 68000,  income: 73516,  unemp: 3.1, lifeExp: 77.7, edu: 31.5, poverty: 9.9,  homePrice: 300000, crime: 290,  density: 107,  medianAge: 39.8, growth: 0.5 },
  { code: 'WY', name: 'Wyoming',        capital: 'Cheyenne',     region: 'West',      pop: 587618,   gdpPc: 79000,  income: 72415,  unemp: 3.2, lifeExp: 75.0, edu: 27.6, poverty: 10.6, homePrice: 340000, crime: 220,  density: 6,    medianAge: 38.1, growth: 1.8 },
];

// Lookup helpers -----------------------------------------------------------

AIN.stateByCode = function (code) {
  for (const s of AIN.STATES) if (s.code === code) return s;
  return null;
};

AIN.indicatorByKey = function (key) {
  for (const ind of AIN.INDICATORS) if (ind.key === key) return ind;
  return null;
};

// States sorted by an indicator, descending. Returns a fresh array.
AIN.rankedBy = function (key) {
  return AIN.STATES.slice().sort((a, b) => b[key] - a[key]);
};

// 1-based rank of a state on an indicator (1 = highest value).
AIN.rankOf = function (code, key) {
  const ranked = AIN.rankedBy(key);
  for (let i = 0; i < ranked.length; i++) if (ranked[i].code === code) return i + 1;
  return ranked.length;
};

// Population-weighted national average for an indicator (simple mean for
// rates that are already population shares is close enough for a benchmark
// line; the Methods page explains the choice).
AIN.nationalAverage = function (key) {
  let weighted = 0;
  let people = 0;
  for (const s of AIN.STATES) {
    weighted += s[key] * s.pop;
    people += s.pop;
  }
  return weighted / people;
};

// The headline national figure for an indicator: the population-weighted
// average for rates and levels, but the plain total for population itself
// (a weighted average of state populations would be meaningless).
AIN.nationalFigure = function (indicator) {
  if (indicator.key === 'pop') {
    let total = 0;
    for (const s of AIN.STATES) total += s.pop;
    return { value: total, label: 'United States total' };
  }
  return { value: AIN.nationalAverage(indicator.key), label: 'National average' };
};

// Median state value for an indicator (used as the histogram marker where a
// weighted average would fall outside the state distribution).
AIN.medianValue = function (key) {
  const vals = AIN.STATES.map(s => s[key]).sort((a, b) => a - b);
  return vals[Math.floor(vals.length / 2)];
};
