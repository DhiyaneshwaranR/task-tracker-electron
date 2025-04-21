export function generateMonthView(year: number, month: number) {
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);

    const startDay = startOfMonth.getDay(); // Sunday = 0
    const daysInMonth = endOfMonth.getDate();

    const days: { date: Date; isCurrentMonth: boolean }[] = [];

    // Fill previous month's trailing days
    for (let i = startDay - 1; i >= 0; i--) {
        const prevDate = new Date(year, month, -i);
        days.push({ date: prevDate, isCurrentMonth: false });
    }

    // Fill current month
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    // Fill next month's leading days
    while (days.length % 7 !== 0) {
        const nextDate = new Date(year, month + 1, days.length - daysInMonth - startDay + 1);
        days.push({ date: nextDate, isCurrentMonth: false });
    }

    return days;
}