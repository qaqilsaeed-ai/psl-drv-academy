import { format, addHours, parseISO } from 'date-fns';

export interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  startDate: Date;
  durationInHours: number;
}

export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const start = format(event.startDate, "yyyyMMdd'T'HHmmss'Z'");
  const end = format(addHours(event.startDate, event.durationInHours), "yyyyMMdd'T'HHmmss'Z'");
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    details: event.description,
    location: event.location,
    dates: `${start}/${end}`,
  });

  return `https://www.google.com/calendar/render?${params.toString()}`;
}

export function generateOutlookCalendarUrl(event: CalendarEvent): string {
  const start = format(event.startDate, "yyyy-MM-dd'T'HH:mm:ss");
  const end = format(addHours(event.startDate, event.durationInHours), "yyyy-MM-dd'T'HH:mm:ss");

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    body: event.description,
    location: event.location,
    startdt: start,
    enddt: end,
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export function generateIcsFile(event: CalendarEvent): string {
  const start = format(event.startDate, "yyyyMMdd'T'HHmmss'Z'");
  const end = format(addHours(event.startDate, event.durationInHours), "yyyyMMdd'T'HHmmss'Z'");

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PROID:-//PSL Driving Academy//NONSGML v1.0//EN',
    'BEGIN:VEVENT',
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;
}
