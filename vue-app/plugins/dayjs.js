import dayjs from "dayjs";
import objectSupport from "dayjs/plugin/objectSupport";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";

dayjs.locale("fr");
dayjs.extend(objectSupport);
dayjs.extend(relativeTime);

export default dayjs;
