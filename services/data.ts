import { Timestamp } from 'firebase/firestore';

export function formatRelativeTimeFromFirebaseTimestamp(timestampStr: string): string {
  if (!timestampStr) return '-';

  const match = timestampStr.match(/Timestamp\(seconds=(\d+), nanoseconds=(\d+)\)/);
  if (!match) return '-';

  const seconds = parseInt(match[1], 10);
  const nanoseconds = parseInt(match[2], 10);
  const timestamp = new Timestamp(seconds, nanoseconds);
  const date = timestamp.toDate();

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `há ${diffInSeconds} segundo${diffInSeconds !== 1 ? 's' : ''}`;
  }

  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) {
    return `há ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `há ${hours} hora${hours !== 1 ? 's' : ''}`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `há ${days} dia${days !== 1 ? 's' : ''}`;
  }

  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return `há ${weeks} semana${weeks !== 1 ? 's' : ''}`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `há ${months} mês${months !== 1 ? 'es' : ''}`;
  }

  const years = Math.floor(days / 365);
  return `há ${years} ano${years !== 1 ? 's' : ''}`;
}
