const CalculationUtils = {
  calculateMilliseconds: (value: number, unit: string): number => {
    const lowerCaseUnit = unit.toLowerCase();
    switch (lowerCaseUnit) {
      case 'millisecond':
      case 'milliseconds':
        return value;
      case 'second':
      case 'seconds':
        return value * 1000;
      case 'minute':
      case 'minutes':
        return value * 60 * 1000;
      case 'hour':
      case 'hours':
        return value * 60 * 60 * 1000;
      case 'day':
      case 'days':
        return value * 24 * 60 * 60 * 1000;
      default:
        return NaN;
    }
  },
};

export default CalculationUtils;
