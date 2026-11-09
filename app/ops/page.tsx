import { pageMetadata } from '../../lib/seo';
import { SiteFooter, SiteHeader } from '../../components/SiteChrome';
import IntroCallLink from '../../components/IntroCallLink';
import DepositNote from '../../components/DepositNote';
import config from '../../lib/booking-config.json';
import { balanceOnDelivery, opsPricing, usd } from '../../lib/ops-pricing';
import './ops.css';

export const metadata = pageMetadata(
  'PatchworkMD Ops — admin automation for small businesses',
  `A ${usd(opsPricing.pilot)} pilot that automates the admin work slowing your business down, then ${usd(opsPricing.care)} a month for ongoing care if you choose it.`,
  '/ops',
  'patchwork',
);

export default function Ops() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="site-information ops">
        <section className="intro">
          <div>
            <p className="eyebrow">PatchworkMD Ops</p>
            <h1>Less admin, done for you.</h1>
            <p className="bio">
              I set up automation for the admin work that slows a small business
              down: intake, scheduling, follow-ups, document handling, and inbox
              triage.
            </p>
          </div>
        </section>
        <section>
          <h2>How it works</h2>
          <p>
            We start with a pilot. Before I begin, we agree in writing on the
            exact work it covers. After the pilot, you can keep me on for
            ongoing care.
          </p>
        </section>
        <section className="ops-pricing" aria-labelledby="ops-pricing-title">
          <h2 id="ops-pricing-title">Pricing</h2>
          <dl>
            <div>
              <dt>Pilot</dt>
              <dd className="ops-price">{usd(opsPricing.pilot)}</dd>
              <dd>
                {`${usd(opsPricing.deposit)} to book: the deposit is paid when you book, and the other ${usd(balanceOnDelivery)} is due on delivery.`}
              </dd>
            </div>
            <div>
              <dt>Care</dt>
              <dd className="ops-price">{`${usd(opsPricing.care)} a month`}</dd>
              <dd>Ongoing care after the pilot, if you choose it.</dd>
            </div>
          </dl>
          <DepositNote bookingUrl={config.calBookingUrl} />
          <IntroCallLink className="intro-call-button" />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
