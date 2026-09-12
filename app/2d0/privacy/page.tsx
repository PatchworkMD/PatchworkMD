import Link from 'next/link';
export const metadata = {
  title: '2D0 privacy draft — PatchworkMD',
  robots: { index: false, follow: false },
};
const sections = [
  [
    'About this draft',
    'This notice describes the current development build for private testing on Mac and iPhone. It is not a claim that the app is ready for public distribution. The legal publisher is Austin Wise. PatchworkMD is a brand name, not a registered business entity. The effective date will be the actual publication date and remains pending while unpublished. Final text and release-specific build review remain pending.',
  ],
  [
    'Local storage',
    'Task data is stored on the device. On Mac the app uses ~/Library/Application Support/2DO/ and may mirror task state to configured local files for Obsidian, agent workflows and WidgetKit. On iPhone it uses the app container and an optional App Group container for widget snapshots. Appearance, onboarding, sound and haptic choices are stored in device preferences; they are not advertising segments.',
  ],
  [
    'Current data handling',
    'The development policy states that the app does not intentionally upload tasks to a hosted service, collect analytics, track usage, store credentials, sell data, read unrelated Apple Notes, broadly scan an Obsidian vault, or automatically upload bug reports. This statement must be checked against the exact distributed build.',
  ],
  [
    'Notes and Obsidian',
    'Mac Notes synchronization is user-directed and uses macOS automation permission. The app searches for the configured note title without displaying the note list. Obsidian synchronization uses the configured Markdown mirror path, rather than indexing the entire vault.',
  ],
  [
    'Notifications and the development LAN bridge',
    'The standalone iPhone app can schedule local notifications with permission. Task text may appear on the lock screen according to system settings. Optional Mac import uses local network discovery. The Mac LAN bridge is off by default and separately enabled in Settings. The current development bridge is unencrypted and unauthenticated: reachable devices can read or change tasks while it is enabled. Disabling it closes the listener and active connections. Secure pairing is not implemented; this integration is not ready for public release.',
  ],
  [
    'Agent bridge',
    'Agents can write supported task actions to a configured input JSON file. The app processes those actions and resets the input file afterward.',
  ],
  [
    'Bug reports',
    'The Report a Bug action copies a summary of counts and status. The source policy says it excludes task text, note contents, screenshots, Apple IDs, device serial numbers and private file paths. Review any screenshots or logs you attach manually.',
  ],
  [
    'Deletion and recovery',
    'Archived tasks remain visible when archive display is enabled. Deleted notes are retained in deleted-notes.json for recovery instead of being immediately destroyed.',
  ],
  [
    'Private testing and planned features',
    'Friends-only builds are for invited testers. They do not include hosted accounts, cloud sync, analytics or remote support collection. Friends, referral rewards and sponsored focus are planned features, not active data flows. Policies and consent flows must be updated before those features are activated.',
  ],
];
export default function Page() {
  return (
    <>
      <header>
        <Link className="wordmark" href="/">
          PatchworkMD
        </Link>
        <Link href="/2d0">2D0</Link>
      </header>
      <main>
        <section className="intro">
          <div className="intro-copy">
            <p className="eyebrow">Unpublished review draft</p>
            <h1>2D0 privacy notice</h1>
          </div>
        </section>
        {sections.map(([a, b]) => (
          <section className="skills" key={a}>
            <h2>{a}</h2>
            <p className="detail">{b}</p>
          </section>
        ))}
        <section className="contact">
          <h2>Contact</h2>
          <div>
            <a href="mailto:hello@patchworkmd.dev">hello@patchworkmd.dev</a>
            <p>
              For questions about this draft. Do not send credentials or private
              task content.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
