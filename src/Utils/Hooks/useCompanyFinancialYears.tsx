export const useCompanyFinancialYears = (isoDate?: string) => {
  if (!isoDate) return [];
  const createdDate = new Date(isoDate);
  const today = new Date();

  const getFYStartYear = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth(); // Jan = 0, Apr = 3
    return month < 3 ? year - 0 : year;
  };

  // FY where company was created
  const creationFY = getFYStartYear(createdDate);

  // Start from ONE year before creation FY
  const startFY = creationFY - 1;

  // Current running FY
  const currentFY = getFYStartYear(today);

  const buildRange = (startYear: number) => {
    const start = new Date(Date.UTC(startYear, 3, 1)); // 1 April
    const end = new Date(Date.UTC(startYear + 1, 2, 31, 23, 59, 59, 999)); // 31 March

    return {
      label: `${startYear} - ${startYear + 1}`,
      value: `${start.toISOString()} - ${end.toISOString()}`,
    };
  };

  const years = [];

  for (let fy = startFY; fy <= currentFY; fy++) {
    years.push(buildRange(fy));
  }

  return years;
};
