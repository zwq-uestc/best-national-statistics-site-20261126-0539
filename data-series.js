// National time series, headline figures and world comparison data for
// "America in Numbers". Each series is a list of [year, value] pairs with its
// publisher and unit; the Methods page documents definitions and caveats.

window.AIN = window.AIN || {};

// The numbers on the front page. value is display-ready; note carries the
// reference period; source names the publisher.
AIN.HEADLINE = [
  { label: 'Population', value: '341.8 million', note: 'July 1, 2025 estimate', source: 'U.S. Census Bureau', spark: 'population' },
  { label: 'Gross domestic product', value: '$30.8 trillion', note: '2025, current dollars', source: 'Bureau of Economic Analysis', spark: 'gdpPerCapita' },
  { label: 'GDP per capita', value: '$90,027', note: '2025, current dollars', source: 'Bureau of Economic Analysis', spark: 'gdpPerCapita' },
  { label: 'Unemployment rate', value: '4.1%', note: 'October 2026, seasonally adjusted', source: 'Bureau of Labor Statistics', spark: 'unemployment' },
  { label: 'Median household income', value: '$87,460', note: '2025, highest on record', source: 'Census Bureau, CPS ASEC', spark: 'householdIncome' },
  { label: 'Life expectancy at birth', value: '79.0 years', note: '2024', source: 'CDC National Center for Health Statistics', spark: 'lifeExpectancy' },
  { label: 'Median age', value: '38.9 years', note: '2024', source: 'U.S. Census Bureau', spark: null },
  { label: 'Homeownership rate', value: '65.0%', note: 'Second quarter 2026', source: 'Census Bureau, Housing Vacancies survey', spark: 'homeownership' },
];

// Long-run national series for the Trends explorer.
AIN.SERIES = [
  {
    key: 'population', label: 'Population', unit: 'millions of people',
    source: 'U.S. Census Bureau, decennial censuses and Vintage 2025 estimates',
    blurb: 'From 3.9 million at the first census in 1790 to 341.8 million in 2025 \u2014 an 87-fold increase.',
    points: [[1790, 3.93], [1800, 5.31], [1810, 7.24], [1820, 9.64], [1830, 12.87], [1840, 17.07], [1850, 23.19], [1860, 31.44], [1870, 39.54], [1880, 50.16], [1890, 62.98], [1900, 76.21], [1910, 92.23], [1920, 106.02], [1930, 123.20], [1940, 132.16], [1950, 151.33], [1960, 180.67], [1970, 205.05], [1980, 227.73], [1990, 250.13], [2000, 282.16], [2010, 309.33], [2020, 331.45], [2025, 341.78]],
  },
  {
    key: 'gdpPerCapita', label: 'Real GDP per capita', unit: 'thousands of 2017 US$',
    source: 'Bureau of Economic Analysis, national income and product accounts',
    blurb: 'Output per person after removing inflation: roughly four times its 1947 level.',
    points: [[1947, 15.9], [1950, 17.2], [1960, 19.8], [1970, 24.3], [1980, 28.9], [1990, 36.1], [2000, 44.8], [2007, 48.9], [2009, 46.0], [2010, 46.9], [2015, 51.9], [2019, 56.8], [2020, 54.6], [2021, 58.9], [2022, 59.9], [2023, 61.5], [2024, 63.3], [2025, 64.6]],
  },
  {
    key: 'unemployment', label: 'Unemployment rate', unit: '% of labour force, annual average',
    source: 'Bureau of Labor Statistics, Current Population Survey',
    blurb: 'Peaked at 9.7% in 1982 and 9.6% in 2010; the shaded bands mark NBER recessions.',
    points: [[1948, 3.8], [1950, 5.3], [1953, 2.9], [1958, 6.8], [1960, 5.5], [1965, 4.5], [1969, 3.5], [1971, 5.9], [1975, 8.5], [1979, 5.8], [1980, 7.2], [1982, 9.7], [1984, 7.5], [1989, 5.3], [1992, 7.5], [1995, 5.6], [2000, 4.0], [2003, 6.0], [2007, 4.6], [2009, 9.3], [2010, 9.6], [2012, 8.1], [2015, 5.3], [2018, 3.9], [2019, 3.7], [2020, 8.1], [2021, 5.4], [2022, 3.6], [2023, 3.6], [2024, 4.0], [2025, 4.2], [2026, 4.1]],
  },
  {
    key: 'lifeExpectancy', label: 'Life expectancy at birth', unit: 'years',
    source: 'CDC National Center for Health Statistics, national vital statistics',
    blurb: 'Gained almost 32 years since 1900, dipped sharply in 2020\u201321, and reached 79.0 in 2024.',
    points: [[1900, 47.3], [1910, 50.0], [1920, 54.1], [1930, 59.7], [1940, 62.9], [1950, 68.2], [1960, 69.7], [1970, 70.8], [1980, 73.7], [1990, 75.4], [2000, 76.8], [2010, 78.7], [2014, 78.9], [2017, 78.6], [2019, 78.8], [2020, 77.0], [2021, 76.4], [2022, 77.5], [2023, 78.5], [2024, 79.0]],
  },
  {
    key: 'inflation', label: 'Consumer price inflation', unit: '% change, annual average',
    source: 'Bureau of Labor Statistics, Consumer Price Index',
    blurb: 'Double digits in 1974, 1979 and 1980; 8.0% in 2022 was the highest since 1981.',
    points: [[1947, 14.4], [1950, 1.3], [1951, 7.9], [1960, 1.6], [1966, 2.9], [1970, 5.8], [1974, 11.0], [1979, 11.3], [1980, 13.5], [1982, 6.2], [1986, 1.9], [1990, 5.4], [1995, 2.8], [2000, 3.4], [2005, 3.4], [2008, 3.8], [2009, -0.4], [2011, 3.2], [2015, 0.1], [2019, 1.8], [2020, 1.2], [2021, 4.7], [2022, 8.0], [2023, 4.1], [2024, 2.9], [2025, 2.7]],
  },
  {
    key: 'householdIncome', label: 'Median household income', unit: 'thousands of 2024 US$',
    source: 'Census Bureau, Current Population Survey ASEC, adjusted to 2024 dollars',
    blurb: 'Nearly doubled in real terms since 1967, with setbacks after 2007 and a record high in the mid-2020s.',
    points: [[1967, 43.4], [1970, 46.5], [1980, 48.9], [1990, 55.4], [2000, 62.9], [2007, 64.8], [2011, 57.9], [2015, 63.0], [2019, 70.7], [2020, 68.5], [2021, 70.8], [2022, 72.6], [2023, 77.7], [2024, 80.7]],
  },
  {
    key: 'homeownership', label: 'Homeownership rate', unit: '% of households',
    source: 'Census Bureau, Housing Vacancies and Homeownership survey',
    blurb: 'Peaked at 69.2% in 2004, fell for a decade after the housing crash, and has steadied near 65%.',
    points: [[1965, 63.3], [1970, 62.9], [1980, 65.6], [1990, 64.2], [2000, 67.4], [2004, 69.2], [2010, 66.9], [2015, 63.7], [2019, 65.1], [2020, 65.8], [2023, 65.9], [2025, 65.0]],
  },
  {
    key: 'povertyRate', label: 'Poverty rate', unit: '% of population',
    source: 'Census Bureau, Current Population Survey ASEC (official poverty measure)',
    blurb: 'Fell from 22.4% in 1959 to about 11% in the 1970s; the official measure has moved in a narrow band since.',
    points: [[1959, 22.4], [1965, 17.3], [1970, 12.6], [1980, 13.0], [1990, 13.5], [1993, 15.1], [2000, 11.3], [2007, 12.5], [2010, 15.1], [2014, 14.8], [2019, 10.5], [2020, 11.4], [2021, 11.6], [2022, 11.5], [2023, 11.1], [2024, 10.6]],
  },
];

// NBER recession years, used to shade the unemployment and GDP charts.
AIN.RECESSIONS = [[1948, 1949], [1953, 1954], [1957, 1958], [1960, 1961], [1969, 1970], [1973, 1975], [1980, 1980], [1981, 1982], [1990, 1991], [2001, 2001], [2008, 2009], [2020, 2020]];

// The United States among twenty large economies (World Bank WDI, 2024/25).
AIN.WORLD = [
  { country: 'United States', pop: 341.8, gdpPc: 90027, lifeExp: 78.9, us: true },
  { country: 'China', pop: 1408.0, gdpPc: 13445, lifeExp: 78.0 },
  { country: 'India', pop: 1451.0, gdpPc: 2695, lifeExp: 72.0 },
  { country: 'Japan', pop: 124.0, gdpPc: 33834, lifeExp: 84.1 },
  { country: 'Germany', pop: 84.5, gdpPc: 54820, lifeExp: 81.2 },
  { country: 'United Kingdom', pop: 69.2, gdpPc: 48875, lifeExp: 81.2 },
  { country: 'France', pop: 68.4, gdpPc: 46143, lifeExp: 82.9 },
  { country: 'Brazil', pop: 216.0, gdpPc: 10301, lifeExp: 75.8 },
  { country: 'Canada', pop: 41.3, gdpPc: 55386, lifeExp: 81.3 },
  { country: 'Australia', pop: 27.2, gdpPc: 65431, lifeExp: 83.2 },
  { country: 'South Korea', pop: 51.7, gdpPc: 36239, lifeExp: 83.4 },
  { country: 'Mexico', pop: 130.0, gdpPc: 14034, lifeExp: 75.5 },
  { country: 'Spain', pop: 48.8, gdpPc: 33197, lifeExp: 83.2 },
  { country: 'Italy', pop: 58.9, gdpPc: 39452, lifeExp: 83.7 },
  { country: 'Netherlands', pop: 18.0, gdpPc: 72342, lifeExp: 81.7 },
  { country: 'Switzerland', pop: 8.9, gdpPc: 102865, lifeExp: 83.9 },
  { country: 'Sweden', pop: 10.6, gdpPc: 56988, lifeExp: 83.1 },
  { country: 'Norway', pop: 5.6, gdpPc: 90174, lifeExp: 83.2 },
  { country: 'Singapore', pop: 6.0, gdpPc: 90674, lifeExp: 83.5 },
  { country: 'South Africa', pop: 63.0, gdpPc: 6253, lifeExp: 66.0 },
];

AIN.seriesByKey = function (key) {
  for (const s of AIN.SERIES) if (s.key === key) return s;
  return null;
};
