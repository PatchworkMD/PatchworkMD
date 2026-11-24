import { supportEmail } from './facts';

export default function SupportEmail() {
  return <a href={`mailto:${supportEmail}`}>{supportEmail}</a>;
}
