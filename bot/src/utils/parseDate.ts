export const parseDate = (value: string): Date | null => {
    const match = /^(?<day>\d{2})\/(?<month>\d{2})\/(?<year>\d{4}) (?<hour>\d{2}):(?<minute>\d{2})$/.exec(value);

    if (!match?.groups) {
        return null;
    }

    const {
        day,
        month,
        year,
        hour,
        minute,
    } = match.groups;

    const date = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
    );

    return date ;
};