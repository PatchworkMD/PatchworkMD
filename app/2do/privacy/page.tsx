import Link from 'next/link';
import { pageMetadata } from '../../../lib/seo';
import { SiteFooter, SiteHeader } from '../../../components/SiteChrome';
import SupportEmail from '../SupportEmail';
import { prices } from '../facts';

export const metadata = pageMetadata(
  '2DO privacy policy',
  'What 2DO collects: tasks stay on your device, there is no account, and analytics are anonymized.',
  '/2do/privacy',
  '2d0',
);

export default function TwoDoPrivacy() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="site-information">
        <section className="intro">
          <div>
            <p className="eyebrow">2DO</p>
            <h1>Privacy policy</h1>
            <p className="bio">
              I make 2DO. This page says what the app collects and who handles
              it.
            </p>
          </div>
        </section>
        <section>
          <h2>The short version</h2>
          <p>
            Your tasks stay on your device. There is no account, so there is
            nothing to sign up for and no profile of you on a server.
          </p>
        </section>
        <section>
          <h2>Your tasks</h2>
          <p>
            Tasks and settings are stored on your device. I do not receive them.
          </p>
        </section>
        <section>
          <h2>Analytics</h2>
          <p>
            2DO uses TelemetryDeck to count anonymized usage signals, such as
            which features get used. These signals carry no personal data and
            there is no cross-app tracking. TelemetryDeck handles them under its{' '}
            <a href="https://telemetrydeck.com/privacy/">privacy policy</a>.
          </p>
        </section>
        <section id="ads">
          <h2>Ads</h2>
          <p>
            2DO is free with ads. The ad provider and the exact data it collects
            are listed here once the provider is chosen.
          </p>
          <p>
            <strong>[AD SDK]</strong> Provider name, data types collected,
            purpose, and a link to its privacy policy.
          </p>
        </section>
        <section>
          <h2>Purchases</h2>
          <p>
            Everything in 2DO is optional to buy: a one-time Remove Ads purchase
            ({prices.removeAds}), and the 2DO Plus subscription at{' '}
            {prices.plusMonthly} or {prices.plusYearly} with a {prices.trial}.
            2DO Plus is also available as a one-time lifetime purchase (
            {prices.plusLifetime}).
          </p>
          <p>
            Apple processes every purchase. I do not receive your payment
            details. Apple tells the app which purchases are active so it can
            unlock them. Apple handles that information under its{' '}
            <a href="https://www.apple.com/legal/privacy/">privacy policy</a>.
          </p>
        </section>
        <section>
          <h2>Contact</h2>
          <p>
            For privacy questions, email <SupportEmail />. For help with the
            app, see <Link href="/2do/support">2DO support</Link>.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
