import Link from 'next/link';
import { pageMetadata } from '../../../lib/seo';
import { SiteFooter, SiteHeader } from '../../../components/SiteChrome';
import SupportEmail from '../SupportEmail';
import { appleCancelUrl, appleRefundUrl, prices } from '../facts';

export const metadata = pageMetadata(
  '2DO support',
  'Answers about 2DO, restoring purchases, cancelling 2DO Plus, and how to get in touch.',
  '/2do/support',
  '2d0',
);

const questions = [
  [
    'Do I need an account?',
    'No. 2DO has no account. Your tasks stay on your device.',
  ],
  [
    'What does Remove Ads do?',
    `It is a one-time ${prices.removeAds} purchase that removes ads from 2DO.`,
  ],
  [
    'What does 2DO Plus cost?',
    `${prices.plusMonthly} or ${prices.plusYearly}, with a ${prices.trial}. There is also a one-time lifetime option for ${prices.plusLifetime}. Apple shows the price in your currency before you buy.`,
  ],
  [
    'When does a subscription renew?',
    'It renews automatically through Apple unless you cancel at least 24 hours before the current period ends.',
  ],
  [
    'Does 2DO track me?',
    'No cross-app tracking. Anonymized usage signals go to TelemetryDeck without personal data. The privacy policy has the details.',
  ],
] as const;

export default function TwoDoSupport() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="site-information">
        <section className="intro">
          <div>
            <p className="eyebrow">2DO</p>
            <h1>Support</h1>
            <p className="bio">Answers, purchases, and how to reach me.</p>
          </div>
        </section>
        <section id="faq">
          <h2>Questions and answers</h2>
          {questions.map(([question, answer]) => (
            <details className="faq-entry" key={question}>
              <summary>
                <span className="faq-question">{question}</span>
                <span className="plus" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="detail">{answer}</p>
            </details>
          ))}
        </section>
        <section id="restore">
          <h2>Restore purchases</h2>
          <p>
            On a new or reset device, open 2DO and tap Restore Purchases. Use
            the same Apple Account you bought with. Remove Ads and 2DO Plus come
            back at no charge.
          </p>
        </section>
        <section id="cancel">
          <h2>Cancel 2DO Plus</h2>
          <p>
            Apple manages subscriptions, so you cancel in your Apple Account
            settings, not in 2DO. Apple explains how:{' '}
            <a href={appleCancelUrl}>cancel a subscription from Apple</a>.
            Refunds also go through Apple:{' '}
            <a href={appleRefundUrl}>request a refund</a>.
          </p>
        </section>
        <section id="contact">
          <h2>Contact</h2>
          <p>
            Email <SupportEmail />. Say which device you use and what happened.
            Please do not send passwords or payment details. See the{' '}
            <Link href="/2do/privacy">2DO privacy policy</Link> for what the app
            collects.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
