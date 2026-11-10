import Image from 'next/image';
import { Patrick_Hand } from 'next/font/google';
import { pageMetadata } from '../../lib/seo';
import { SiteHeader } from '../../components/SiteChrome';
import MotionToggle from '../../components/MotionToggle';
import BetaButton from './BetaButton';
import TwoDoFooter from './TwoDoFooter';
import { testflightLink } from './facts';
import './2do.css';

const marker = Patrick_Hand({ weight: '400', subsets: ['latin'] });

export const metadata = pageMetadata(
  '2DO — a whiteboard for your tasks, with Marky',
  'Write it down, check it off, and Marky cheers you on. 2DO for iPhone is free with ads, has no account, and keeps your tasks on your phone.',
  '/2do',
  '2d0',
);

const tasks = [
  ['take out the recycling', true],
  ['water the plants', false],
  ['book the dentist', false],
] as const;

export default function TwoDo() {
  return (
    <>
      <SiteHeader nav={false} />
      <MotionToggle className="background-pause" />
      <main id="main" className="twodo">
        <section className="twodo-hero">
          <div className="twodo-marky">
            <Image
              src="/2do/marky.png"
              alt="Marky, the marker mascot from 2DO"
              width={512}
              height={640}
              unoptimized
            />
            <Image
              className="twodo-blink"
              src="/2do/marky-blink.png"
              alt=""
              aria-hidden="true"
              width={512}
              height={640}
              unoptimized
            />
          </div>
          <div className="twodo-copy">
            <p className="twodo-eyebrow">2DO for iPhone</p>
            <h1>get more done. get off your phone.</h1>
            <p className="twodo-lede">
              2DO is a whiteboard for your tasks. write it down, check it off,
              and Marky cheers you on.
            </p>
            <BetaButton href={testflightLink()} />
            <p className="twodo-note">
              free with ads · no account · your tasks stay on your iPhone
            </p>
          </div>
        </section>
        <section className="twodo-board" aria-label="A 2DO board">
          <ul className={marker.className}>
            {tasks.map(([task, done]) => (
              <li key={task} className={done ? 'done' : undefined}>
                <span className="twodo-check" aria-hidden="true" />
                <span>
                  {task}
                  {done && <span className="sr-only"> (done)</span>}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <TwoDoFooter />
    </>
  );
}
