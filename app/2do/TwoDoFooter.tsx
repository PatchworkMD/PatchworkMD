import Link from 'next/link';
import { SiteFooter } from '../../components/SiteChrome';

export default function TwoDoFooter() {
  return (
    <SiteFooter>
      <Link href="/2do/privacy">2DO privacy</Link>
      <Link href="/2do/support">2DO support</Link>
    </SiteFooter>
  );
}
