import Link from 'next/link';
import { pageMetadata } from '../../../lib/seo';
import { SiteHeader } from '../../../components/SiteChrome';
import TwoDoFooter from '../TwoDoFooter';
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
            nothing to sign up for and no profile of you on a server. The free
            version shows one small ad. 2DO asks once whether that ad may be
            picked for you, and it works the same if you say no.
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
            The free version of 2DO shows one small banner ad on the task list
            screen. Google AdMob provides the ads.
          </p>
          <p>
            2DO asks once whether the ad may be picked for you, with Apple’s App
            Tracking Transparency prompt. It asks after you have finished a task
            and opened the app again, never at first launch. If you allow it,
            Google may use your device’s advertising identifier (IDFA) and data
            from other companies’ apps and websites to pick the ad. Apple calls
            this tracking.
          </p>
          <p>
            If you say no, or before you are asked, I request non-personalized
            ads only and the advertising identifier is not used. You can change
            your answer at any time in the iPhone’s Settings, under Privacy
            &amp; Security, then Tracking.
          </p>
          <p>
            Your tasks, list names, and anything else you type in 2DO stay on
            your device. They are never sent to Google or used to choose an ad.
          </p>
          <p>
            To load and show an ad, prevent fraud, limit how often an ad is
            shown, and count impressions, Google’s SDK may collect:
          </p>
          <ul>
            <li>
              Coarse location: your device’s IP address and the approximate
              location it implies
            </li>
            <li>Device ID: a device identifier</li>
            <li>Advertising data: the ads shown and taps on them</li>
            <li>Product interaction: other product interactions</li>
            <li>Performance data: diagnostic performance information</li>
            <li>Crash data: crash logs not tied to you</li>
          </ul>
          <p>
            Google describes how it uses this data in{' '}
            <a href="https://policies.google.com/privacy">
              Google’s privacy policy
            </a>
            .
          </p>
          <p>
            If you are in the European Economic Area, the United Kingdom, or
            Switzerland, 2DO asks for your consent before loading any ad. You
            can change your choice at any time in Settings.
          </p>
          <p>
            Ads are off for anyone with Remove Ads or 2DO Plus: 2DO does not
            load the ad SDK and makes no ad requests.
          </p>
          <p>
            2DO is not directed to children, and I do not knowingly show ads to
            children. You can report an inappropriate ad from Settings.
          </p>
        </section>
        <section>
          <h2>Purchases</h2>
          <p>
            Everything in 2DO is optional to buy: a one-time Remove Ads purchase
            ({prices.removeAds}), and the 2DO Plus subscription at{' '}
            {prices.plusMonthly} with a {prices.trial}. 2DO Plus is also
            available as a one-time lifetime purchase ({prices.plusLifetime}).
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
      <TwoDoFooter />
    </>
  );
}
