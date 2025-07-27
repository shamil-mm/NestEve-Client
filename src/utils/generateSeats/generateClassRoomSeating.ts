export function generateClassroomSeating(
  layoutConfig: any,
  currentCategory: string,
  takenseats: string[]
) {
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

  layoutConfig.categories.forEach((category: any) => {
    if (category.name !== currentCategory) return;
    const rowLetters = category.rowRange.flatMap(getRowLetters);

    rowLetters.forEach((row: string) => {
      const seats = [];
      for (let i = 1; i <= layoutConfig.columns; i++) {
        const seatId = `${row}${i}`;
        seats.push({
          id: seatId,
          status: takenseats.includes(seatId) ? "taken" : "available",
          category: category.name,
          price: category.price,
          isVisible: true,
        });
      }

      rows.push({ id: row, category: category.name, seats });
    });
  });

  return { rows };
}
