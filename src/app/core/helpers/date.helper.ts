import { formatISO } from 'date-fns';
export const formatAPIDate = (date: Date) => formatISO(date).split('+')[0];

