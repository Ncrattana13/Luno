import dayjs from "dayjs";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

// Status for a single day, based on what's on the watch list for it:
// - "green"  : has a movie queued and the day hasn't passed yet (or is today)
// - "red"    : the day has passed and at least one movie was never checked off
// - "gray"   : the day has passed and everything on it was watched
// - null     : nothing on the watch list for that day
function getDayStatus(day, watchList, today) {
    const dayKey = day.format("ddd, MM/DD/YYYY");
    const dayItems = watchList.filter((item) => item.date === dayKey);
    if (dayItems.length === 0) return null;

    const isPast = day.isBefore(today, "day");
    if (!isPast) return "green";

    const hasUnwatched = dayItems.some((item) => !item.watched);
    return hasUnwatched ? "red" : "gray";
}

function MiniCalendar({ selectedDate, onChangeDate, watchList }) {
    const today = dayjs();
    const monthStart = selectedDate.startOf("month");
    const gridStart = monthStart.startOf("week");
    const gridEnd = selectedDate.endOf("month").endOf("week");
    const totalDays = gridEnd.diff(gridStart, "day") + 1;

    const days = [];
    for (let i = 0; i < totalDays; i++) {
        days.push(gridStart.add(i, "day"));
    }

    return (
        <div className="mini-calendar">
            <div className="mini-calendar-header">
                <button type="button" onClick={() => onChangeDate(selectedDate.subtract(1, "month"))}>
                    ‹
                </button>
                <span>{selectedDate.format("MMM YYYY")}</span>
                <button type="button" onClick={() => onChangeDate(selectedDate.add(1, "month"))}>
                    ›
                </button>
            </div>

            <div className="mini-calendar-grid">
                {WEEKDAY_LABELS.map((label, i) => (
                    <span key={i} className="mini-calendar-weekday">{label}</span>
                ))}

                {days.map((day) => {
                    const status = getDayStatus(day, watchList, today);
                    const isToday = day.isSame(today, "day");
                    const isSelected = day.isSame(selectedDate, "day");
                    const outside = day.month() !== monthStart.month();

                    const classes = [
                        "mini-calendar-day",
                        outside && "mini-calendar-day-outside",
                        status && `mini-calendar-day-${status}`,
                        isToday && "mini-calendar-day-today",
                        isSelected && "mini-calendar-day-selected",
                    ].filter(Boolean).join(" ");

                    return (
                        <button
                            type="button"
                            key={day.format("YYYY-MM-DD")}
                            className={classes}
                            onClick={() => onChangeDate(day)}
                            title={
                                status === "green" ? "Movie to watch"
                                : status === "red" ? "Missed -- not watched"
                                : status === "gray" ? "Watched"
                                : undefined
                            }
                        >
                            {day.date()}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default MiniCalendar;
