import { generateTheaterSeating } from './generateTheaterSeatring';
import { generateBanquetSeating } from "./generateBanqueSeating";
import { generateClassroomSeating } from "./generateClassRoomSeating";
import { ILayoutConfig } from "../../interfaces/IEvent";

export function generateSeating(
  layoutConfig: ILayoutConfig,
  currentCategory: string,
  takenseats: string[]
) {
  switch (layoutConfig.seatStyle) {
    case "theater":
      return generateTheaterSeating(layoutConfig, currentCategory, takenseats);
    case "banquet":
      return generateBanquetSeating(layoutConfig, currentCategory, takenseats);
    case "classroom":
      return generateClassroomSeating(layoutConfig, currentCategory, takenseats);
    default:
      return { rows: [] };
  }
}