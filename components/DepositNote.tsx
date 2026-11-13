import { bookingDestination, introEmail } from '../lib/booking';
import { opsPricing, usd } from '../lib/ops-pricing';

export default function DepositNote({ bookingUrl }: { bookingUrl: string }) {
  if (bookingDestination(bookingUrl) === introEmail) return null;
  return (
    <p className="ops-deposit">
      {`Deposit: ${usd(opsPricing.deposit)}, taken by Cal.com at booking`}
    </p>
  );
}
