import { ILayoutConfig } from "../../interfaces/IEvent";
export function generateTheaterSeating(
  layoutConfig: ILayoutConfig,
  currentCategory: string,
  takenseats: string[]
): { rows: any[] } {
  console.log(layoutConfig , 'from generate seats function layoutConfig');
  console.log(currentCategory , 'from generate seats function currrent category');

  const getRowLetters = (range: string) => {
    const [start, end] = range.split("-");
    const startCode = start.charCodeAt(0);
    const endCode = end.charCodeAt(0);
    const rows: string[] = [];

    for (let i = startCode; i <= endCode; i++) {
      rows.push(String.fromCharCode(i));
    }
    return rows;
  };

  const rows: any[] = [];
  const verticalAisles: number[] = layoutConfig.passageColumns  || [];
  const horizontalAisles: number[] = layoutConfig.passageRows  || [];

  layoutConfig.categories.forEach(
    (category: { rowRange: string[]; name: any; price: any }) => {
      if (category.name !== currentCategory) return;

      const rowLetters = category.rowRange.flatMap(getRowLetters);

      rowLetters.forEach((row) => {
        const rowIndex=row.charCodeAt(0) - 65
        if (horizontalAisles.includes(rowIndex)) return;

        const seats = [];
        for (let i = 1; i <= layoutConfig.columns; i++) {
          const isVisible = !verticalAisles.includes(i);
          const seatId = `${row}${i}`;

          seats.push({
            id: seatId,
            status: takenseats.includes(seatId) ? "taken" : "available",
            category: category.name,
            price: category.price,
            isVisible,
          });
        }

        rows.push({
          id: row,
          category: category.name,
          seats,
        });
      });
    }
  );

  console.log(rows)
  return { rows };
}
