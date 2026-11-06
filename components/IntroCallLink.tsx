import config from '../lib/booking-config.json';
import { bookingDestination, introEmail } from '../lib/booking';

export default function IntroCallLink({ className }: { className?: string }) {
  const destination = bookingDestination(config.calBookingUrl);
  return (
    <a className={className} href={destination}>
      {destination === introEmail
        ? 'Request an intro call'
        : 'Book an intro call'}{' '}
      <span aria-hidden="true">↗</span>
    </a>
  );
}
