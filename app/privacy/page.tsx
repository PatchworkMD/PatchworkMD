import { pageMetadata } from '../../lib/seo';
import { SiteFooter, SiteHeader } from '../../components/SiteChrome';
export const metadata = pageMetadata('Privacy & site information | patchwork.md', 'How patchwork.md handles website visits, hosting, and contact information.', '/privacy');
export default function Privacy() {
  return <>
    <SiteHeader />
    <main id="main" className="site-information">
      <section className="intro"><div><p className="eyebrow">This website</p><h1>Privacy &amp;<br />site information</h1><p className="bio">PatchworkMD is an independent software portfolio.</p></div></section>
      <section><h2>Browsing</h2><p>This site does not provide accounts, uploads, comments, payment forms, or other visitor submission forms. The site code does not add advertising trackers or analytics, or save visitor information in browser storage.</p><p>ChatGPT Sites hosts this website. OpenAI may process technical information to deliver, secure, and operate the site. See <a href="https://openai.com/policies/privacy-policy/">OpenAI’s privacy policy</a> for its practices.</p></section>
      <section><h2>Email</h2><p>Contact links open your email application. If you email PatchworkMD, your address and message are received through email, outside this site. Send only the information needed for your question. Do not send passwords, payment-card details, medical records, or private campaign or client data.</p></section>
      <section><h2>Product links</h2><p>Links to GitHub and product websites take you to separate services. Their own terms and privacy practices apply. This notice describes the portfolio website, not every app listed here.</p></section>
      <section><h2>Images and release status</h2><p>The studio image and App Design Research artwork are illustrations. Product screenshots are identified as such. Development and preview labels describe availability; a project listing does not mean an app is publicly released.</p></section>
      <section><h2>Questions or concerns</h2><p>For privacy questions, incorrect information, or concerns about content on this website, email <a href="mailto:hello@patchworkmd.dev">hello@patchworkmd.dev</a>.</p></section>
    </main>
    <SiteFooter />
  </>;
}
