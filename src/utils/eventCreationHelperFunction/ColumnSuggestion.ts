export function generateBalancedLayouts(totalSeats: number): { rows: number, columns: number }[] {
  const suggestions: { rows: number, columns: number }[] = [];

  for (let rows = 1; rows <= totalSeats; rows++) {
    if (totalSeats % rows === 0) {
      const columns = totalSeats / rows;
      suggestions.push({ rows, columns });
    }
  }

  suggestions.sort((a, b) => Math.abs(a.rows - a.columns) - Math.abs(b.rows - b.columns));
  return suggestions

}


export function getRowCountFromRange(range: string): number | null {
  const regex = /^[A-Z]-[A-Z]$/;
  if (!regex.test(range)) return null;

  const [start, end] = range.split('-');
  const startIndex = start.charCodeAt(0);
  const endIndex = end.charCodeAt(0);

  const count = Math.abs(endIndex - startIndex) + 1;
  return count;
}
