import { ArrowRight, Award, BriefcaseBusiness, CalendarDays, Globe2, GraduationCap, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import campusImage from "../../assets/kjcoemr.webp";
import collegeLogo from "../../assets/kjcoemr-logo.png";
import { getPublicEvents } from "../../services/eventService";
import "./Home.css";
import "./PublicEvents.css";
import "./PublicEventsError.css";
import "./PublicBrandLogo.css";

function Home() {
  const [events, setEvents] = useState([]);
  const [eventsError, setEventsError] = useState("");
  useEffect(() => { getPublicEvents({ page: 0, size: 3 }).then(({ data }) => setEvents(data.data?.content || [])).catch(() => setEventsError("Upcoming events could not be loaded. Please try again shortly.")); }, []);
  return <div className="home">
    <nav className="public-nav"><div className="container public-nav-inner"><Link to="/" className="public-brand"><span className="public-brand-mark"><img src={collegeLogo} alt="KJCOEMR" /></span><span>KJCOEMR <small>Alumni Network</small></span></Link><div className="public-nav-links"><a href="#community">Community</a><a href="#events">Events</a><Link to="/login">Sign in</Link><Link to="/register" className="public-nav-cta">Join the network <ArrowRight size={16} /></Link></div></div></nav>

    <main>
      <section className="public-hero"><img src={campusImage} alt="KJCOEMR campus" className="public-hero-image" /><div className="public-hero-overlay" /><div className="container public-hero-content"><div className="public-hero-copy"><p className="public-eyebrow"><Sparkles size={14} /> KJCOEMR Alumni Association</p><h1>Stay connected to the people who shaped your journey.</h1><p>One trusted place for KJCOEMR alumni to reconnect, share opportunities and celebrate what comes next.</p><div className="public-hero-actions"><Link to="/register" className="public-button public-button-primary">Join alumni network <ArrowRight size={18} /></Link><Link to="/login" className="public-button public-button-secondary">Alumni sign in</Link></div></div><aside className="public-upcoming-panel"><div className="public-upcoming-title"><span><CalendarDays size={15} /> Upcoming events</span><a href="#events">View all</a></div>{events.length ? <div className="public-upcoming-list">{events.slice(0, 3).map((event) => <article key={event.id}><p>{new Date(event.eventDateTime).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</p><div><strong>{event.title}</strong><small>{new Date(event.eventDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · {event.venue}</small></div></article>)}</div> : <><strong>No upcoming events</strong><small>New college and branch events will appear here.</small></>}</aside></div></section>

      <section className="public-trust-bar" id="community"><div className="container public-trust-grid"><Trust icon={<Globe2 size={21} />} title="Meaningful connections" text="Meet fellow alumni across branches and graduating batches." /><Trust icon={<BriefcaseBusiness size={21} />} title="Career momentum" text="Share opportunities, advice and professional wins." /><Trust icon={<CalendarDays size={21} />} title="Campus community" text="Keep up with reunions and college-led initiatives." /></div></section>

      <section className="public-story" id="why-join"><div className="container public-story-grid"><div><p className="public-section-label">More than a directory</p><h2>Your KJCOEMR connection continues long after graduation.</h2></div><div><p>The alumni portal brings the college community together through shared experiences, professional support and opportunities to give back.</p><Link to="/register" className="public-text-link">Create your alumni profile <ArrowRight size={16} /></Link></div></div></section>

      <section className="public-events" id="events"><div className="container"><div className="public-events-heading"><div><p className="public-section-label">Campus calendar</p><h2>Upcoming college events</h2><p>Join the KJCOEMR alumni network to RSVP and stay connected.</p></div><Link to="/login" className="public-text-link">Sign in to RSVP <ArrowRight size={16} /></Link></div><div className="public-events-grid">{eventsError ? <div className="public-events-empty public-events-error">{eventsError}</div> : events.length ? events.map((event) => <article key={event.id}><div className="public-event-icon"><CalendarDays size={20} /></div><p>{new Date(event.eventDateTime).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</p><h3>{event.title}</h3><span>{new Date(event.eventDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · {event.venue}</span><small>{event.description}</small></article>) : <div className="public-events-empty">No college-wide events are scheduled right now. Please check back soon.</div>}</div></div></section>

      {/*<section className="public-cta"><div className="container public-cta-inner"><div><p className="public-eyebrow"><Award size={14} /> KJCOEMR alumni network</p><h2>Ready to be part of the next chapter?</h2><p>Register your profile and join the growing alumni community.</p></div><Link to="/register" className="public-button public-button-light">Register now <ArrowRight size={18} /></Link></div></section>*/}
    </main>

    <footer className="public-footer"><div className="container public-footer-inner"><div className="public-brand"><span className="public-brand-mark"><img src={collegeLogo} alt="KJCOEMR" /></span><span>KJCOEMR <small>Alumni Network</small></span></div><p>Love from Sejal, Prathmesh, Viraj, Om</p><p>© 2026 KJCOEMR Alumni Association</p></div></footer>
  </div>;
}

function Trust({ icon, title, text }) { return <article className="public-trust-card"><div>{icon}</div><h3>{title}</h3><p>{text}</p></article>; }

export default Home;
