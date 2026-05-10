export type CalendarTheme = {
  colors: {
    // Core
    background: string;
    foreground: string;
    border: string;

    // Interactive states
    primary: string;
    primaryForeground: string;
    selected: string;
    selectedForeground: string;

    // Day states
    today: string;
    todayForeground: string;
    disabled: string;
    weekend: string;
    overflow: string;

    // Interaction
    hover: string;
    pressed: string;
  };

  spacing: {
    cellSize: number;
    cellGap: number;
    padding: number;
    headerSpacing: number;
  };

  borderRadius: {
    cell: number;
    container: number;
  };

  fontSize: {
    day: number;
    weekday: number;
    header: number;
  };

  fontWeight: {
    regular: '400' | '500' | '600';
    bold: '600' | '700' | '800';
  };
};
