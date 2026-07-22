// Freelance career start date -- used to auto-compute "years of
// professional design experience" wherever it appears, so it never goes
// stale. Anniversary is July 22; the count only ticks up once that date
// has passed each year.
const CAREER_START = { year: 2015, month: 7, day: 22 };

export function yearsOfExperience(): number {
  const now = new Date();
  const year = now.getFullYear();
  const anniversaryPassed =
    now.getMonth() + 1 > CAREER_START.month ||
    (now.getMonth() + 1 === CAREER_START.month &&
      now.getDate() >= CAREER_START.day);
  return year - CAREER_START.year + (anniversaryPassed ? 0 : -1);
}
