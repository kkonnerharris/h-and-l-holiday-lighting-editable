import Image from "next/image";
import { ArrowRight, CalendarDays, Check, ChevronRight, Lightbulb, Menu, Package, Sparkles, Trees, Wrench } from "lucide-react";
import { QuoteEstimator } from "../components/quote-estimator";
import { ProjectSelectionProvider } from "../components/project-selection";
import { ProjectGallery, type ProjectPhoto } from "../components/project-gallery";
import { ScrollEffects } from "../components/scroll-effects";
import { TwinklingLights } from "../components/twinkling-lights";
import site from "../lib/site-content";
import { assetPath } from "../lib/asset-path";
const serviceIcons = { Lightbulb, Trees, Sparkles };

const services = site.services.map(service => ({ ...service, icon: serviceIcons[service.icon as keyof typeof serviceIcons] || Lightbulb }));

const allProjects: ProjectPhoto[] = site.projects.map(project => ({ ...project, image: assetPath(project.image) }));

// Services listed on the company trailer in public/images/h-and-l-facebook.jpg.
const process = site.process.map(({ number, title, description }) => [number, title, description]);

export default function Home() {
  return (
    <ProjectSelectionProvider>
    <main className="site-shell">
      <ScrollEffects />
      <header className="site-header">
        <a className="brand" href="#top" aria-label="H and L Holiday Lighting home">
          <span className="brand-mark"><Sparkles size={17} strokeWidth={1.6} /></span>
          <span><strong>{site.copy.header.text01}</strong><small>{site.copy.header.text02}</small></span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#services">{site.copy.header.text03}</a><a href="#work">{site.copy.header.text04}</a><a href="#process">{site.copy.header.text05}</a><a href="#estimate">{site.copy.header.text06}</a>
        </nav>
        <a className="header-cta" href="#estimate">{site.copy.header.text07}<ArrowRight size={15} /></a>
        <details className="mobile-menu">
          <summary aria-label="Open navigation"><Menu size={22} /></summary>
          <nav><a href="#services">{site.copy.header.text08}</a><a href="#work">{site.copy.header.text09}</a><a href="#process">{site.copy.header.text10}</a><a href="#estimate">{site.copy.header.text11}</a></nav>
        </details>
      </header>

      <section className="hero" id="top">
        <Image className="hero-image" src={assetPath(site.hero.image)} alt={site.hero.alt} fill priority sizes="100vw" />
        <div className="hero-wash" />
        <TwinklingLights />
        <div className="hero-content">
          <h1>{site.copy.top.text01}<br /><em>{site.copy.top.text02}</em></h1>
          <p>{site.copy.top.text03}</p>
          <div className="hero-actions">
            <a className="button button-gold" href="#estimate">{site.copy.top.text04}<ArrowRight size={17} /></a>
            <a className="text-link" href="#work">{site.copy.top.text05}<ChevronRight size={16} /></a>
          </div>
        </div>
        <a className="scroll-cue" href="#services"><span>{site.copy.top.text06}</span><i /></a>
      </section>

      <section className="trust-bar" aria-label="Holiday lighting services">
        <div><Lightbulb /><span><strong>{site.copy.trust_bar.text01}</strong></span></div>
        <div><Wrench /><span><strong>{site.copy.trust_bar.text02}</strong></span></div>
        <div><CalendarDays /><span><strong>{site.copy.trust_bar.text03}</strong></span></div>
        <div><Package /><span><strong>{site.copy.trust_bar.text04}</strong></span></div>
      </section>

      <section className="services section" id="services">
        <div className="section-heading" data-reveal>
          <div><p className="kicker">{site.copy.services.text01}</p><h2>{site.copy.services.text02}<br /><em>{site.copy.services.text03}</em></h2></div>
          <p>{site.copy.services.text04}</p>
        </div>
        <div className="service-grid">
          {services.map(({ number, icon: Icon, title, description, detail }) => (
            <article className="service-card" key={title} data-reveal>
              <div className="service-top"><span>{number}</span><Icon size={25} strokeWidth={1.35} /></div>
              <h3>{title}</h3><p>{description}</p>
              <div className="service-footer"><span>{detail}</span><a href="#estimate" aria-label={`Get estimate for ${title}`}><ArrowRight size={17} /></a></div>
            </article>
          ))}
        </div>
      </section>

      <section className="estimate-wrap section" id="estimate">
        <div className="estimate-intro">
          <p className="kicker light">{site.copy.estimate.text01}</p><h2>{site.copy.estimate.text02}<br /><em>{site.copy.estimate.text03}</em></h2>
          <p>{site.copy.estimate.text04}</p>
        </div>
        <QuoteEstimator />
      </section>

      <section className="portfolio section" id="work">
        <div className="section-heading portfolio-heading" data-reveal>
          <div><p className="kicker">{site.copy.work.text01}</p><h2>{site.copy.work.text02}<br /><em>{site.copy.work.text03}</em></h2></div>
          <p>{site.copy.work.text04}</p>
        </div>
        <ProjectGallery projects={allProjects} />
      </section>

      <section className="editorial-split">
        <div className="editorial-image" style={{ backgroundImage: `linear-gradient(0deg,#04101c40,#04101c05),url('${assetPath('/images/christmas-home-hero.png')}')` }} role="img" aria-label="Close detail of warmly lit holiday greenery">
          <div className="image-note"><Sparkles size={16} /><span>{site.copy.editorial_split.text01}<br /><strong>{site.copy.editorial_split.text02}</strong></span></div>
        </div>
        <div className="editorial-copy" data-reveal>
          <p className="kicker light">{site.copy.editorial_split.text03}</p>
          <h2>{site.copy.editorial_split.text04}<br /><em>{site.copy.editorial_split.text05}</em></h2>
          <p className="large-copy">{site.copy.editorial_split.text06}</p>
          <ul><li><Check />{site.copy.editorial_split.text07}</li><li><Check />{site.copy.editorial_split.text08}</li><li><Check />{site.copy.editorial_split.text09}</li><li><Check />{site.copy.editorial_split.text10}</li></ul>
          <a className="button button-outline" href="#process">{site.copy.editorial_split.text11}<ArrowRight size={17} /></a>
        </div>
      </section>

      <section className="process section" id="process">
        <div className="process-heading" data-reveal><p className="kicker">{site.copy.process.text01}</p><h2>{site.copy.process.text02}<br /><em>{site.copy.process.text03}</em></h2></div>
        <div className="process-list">
          {process.map(([number, title, description]) => <article key={number} data-reveal><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div></article>)}
        </div>
      </section>

      <section className="faq section" id="faq" aria-labelledby="faq-heading">
        <div className="section-heading" data-reveal>
          <div><p className="kicker">{site.copy.faq.text01}</p><h2 id="faq-heading">{site.copy["faq-heading"].text01}<br /><em>{site.copy["faq-heading"].text02}</em></h2></div>
          <p>{site.copy.faq.text02}</p>
        </div>
        <div className="faq-list">
          <details><summary>{site.copy.faq.text03}</summary><p>{site.copy.faq.text04}</p></details>
          <details><summary>{site.copy.faq.text05}</summary><p>{site.copy.faq.text06}</p></details>
          <details><summary>{site.copy.faq.text07}</summary><p>{site.copy.faq.text08}</p></details>
        </div>
      </section>

      <section className="testimonial" id="facebook" aria-label="Find H and L on Facebook">
        <div className="quote-mark"><Sparkles /></div>
        <h2>{site.copy.facebook.text01}</h2>
        <a className="facebook-link" href={site.contact.facebook} target="_blank" rel="noreferrer">{site.copy.facebook.text02}<ArrowRight size={15} /></a>
      </section>



      <footer>
        <div className="footer-top">
          <a className="brand footer-brand" href="#top"><span className="brand-mark"><Sparkles size={17} /></span><span><strong>{site.copy.footer.text01}</strong><small>{site.copy.footer.text02}</small></span></a>
          <p>{site.copy.footer.text03}<br />{site.copy.footer.text04}</p><a href={`tel:${site.contact.phone.replace(/[^+0-9]/g, "")}`}>{site.contact.phoneDisplay}</a>
        </div>
        <div className="neighborhoods">{site.copy.footer.text05}<span>{site.copy.footer.text06}</span><span>{site.copy.footer.text07}</span></div>
        <div className="footer-bottom"><span>{site.copy.footer.text08}</span><div><a href={site.contact.facebook} target="_blank" rel="noreferrer">{site.copy.footer.text09}</a><a href="#top">{site.copy.footer.text10}</a></div></div>
      </footer>
    </main>
    </ProjectSelectionProvider>
  );
}
