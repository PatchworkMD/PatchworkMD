export default function BetaButton({
  href,
  storeHref = null,
}: {
  href: string | null;
  storeHref?: string | null;
}) {
  // Once 2DO is on the App Store, the store page replaces the beta link.
  if (storeHref) {
    return (
      <a className="twodo-beta" href={storeHref}>
        Get 2DO on the App Store
      </a>
    );
  }
  return href ? (
    <a className="twodo-beta" href={href}>
      Join the TestFlight beta
    </a>
  ) : (
    <button className="twodo-beta" type="button" disabled>
      beta opens soon
    </button>
  );
}
