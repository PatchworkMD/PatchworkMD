export default function BetaButton({ href }: { href: string | null }) {
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
