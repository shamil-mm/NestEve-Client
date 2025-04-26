export function generateTheaterSeating(layoutConfig: any ,currentCategory:string) {

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
  
    layoutConfig.categories.forEach((category: { rowRange: string[]; name: any; price: any; }, _catIdx: any) => {
      if (category.name !== currentCategory) return;
      const rowLetters = category.rowRange.flatMap(getRowLetters);
      
      rowLetters.forEach(row => {
        const seats = [];
        for (let i = 1; i <= layoutConfig.columns; i++) {
          const seatId=`${row}${i}`
      


          seats.push({
            id:seatId ,
            status:"available" ,
            category: category.name,
            price: category.price
          });
        }
  
        rows.push({
          id: row,
          category: category.name,
          seats
        });
      });
    });
  
    return { rows };
  }
  