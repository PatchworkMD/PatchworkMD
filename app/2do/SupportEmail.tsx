import { supportEmail } from './facts';

export default function SupportEmail() {
  return supportEmail.includes('@') ? (
    <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
  ) : (
    <strong>{supportEmail}</strong>
  );
}
