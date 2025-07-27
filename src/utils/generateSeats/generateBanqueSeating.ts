import { ILayoutConfig } from "../../interfaces/IEvent";

export function generateBanquetSeating(layoutConfig: ILayoutConfig, category: string, takenSeats: string[]) {
  const rows: any[] = [];
  const getRowLetters = (range: string) => {
    const [start, end] = range.split("-");
    const startCode = start.charCodeAt(0);
    const endCode = end.charCodeAt(0);
    const letters = [];
    for (let i = startCode; i <= endCode; i++) letters.push(String.fromCharCode(i));
    return letters;
  };

  layoutConfig.categories.forEach(cat => {
    if (cat.name !== category) return;
    const rowLetters = cat.rowRange.flatMap(getRowLetters);

    rowLetters.forEach(row => {
      const seats = [];
      for (let col = 1; col <= layoutConfig.columns; col++) {
        const seatId = `${row}${col}`;
        seats.push({
          id: seatId,
          status: takenSeats.includes(seatId) ? "taken" : "available",
          category: cat.name,
          price: cat.price,
          isVisible: true,
        });
      }
      rows.push({ id: row, category: cat.name, seats });
    });
  });

  return { rows };
}
