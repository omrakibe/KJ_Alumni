import { useEffect, useState } from "react";
import { BellRing, Megaphone } from "lucide-react";
import { getAlumniAnnouncements } from "../../services/announcementService";
import "./AlumniAnnouncements.css";

export default function AlumniAnnouncements() {
  const [announcements, setAnnouncements] = useState([]); const [error, setError] = useState("");
  useEffect(() => { getAlumniAnnouncements({ page: 0, size: 50 }).then((response) => setAnnouncements(response.data?.data?.content || [])).catch((e) => setError(e.response?.data?.message || "Could not load announcements.")); }, []);
  return <main className="alumni-announcements-page"><header><div><p>Stay connected</p><h1>Announcements</h1><span>Important news and updates from KJCOEMR Connect.</span></div><div className="alumni-announcement-icon"><BellRing size={27} /></div></header>{error && <div className="alumni-announcement-error">{error}</div>}<section className="alumni-announcement-feed">{announcements.length ? announcements.map((item) => <article className={`alumni-announcement priority-${item.priority?.toLowerCase()}`} key={item.id}><div className="alumni-announcement-meta"><span className="alumni-priority">{item.priority === "NORMAL" ? "Update" : item.priority}</span><span>{item.visibility === "ALL" ? "KJCOEMR community" : `${item.branch} community`}</span></div><h2>{item.title}</h2><p>{item.message}</p><footer>{item.createdAt && new Date(item.createdAt).toLocaleString()}</footer></article>) : <div className="alumni-announcement-empty"><Megaphone size={28} /><h2>No announcements yet</h2><p>Updates from your alumni community will appear here.</p></div>}</section></main>;
}
