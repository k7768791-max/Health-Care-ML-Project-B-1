import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc,
} from "firebase/firestore";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  FaRegClock, FaCheckCircle, FaTrash, FaInbox,
  FaEye, FaEyeSlash, FaBell, FaChartBar, FaSearch,
  FaUsers, FaFileMedical,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

/* ─────────── helpers ─────────── */
function groupByDay(queries) {
  const map = {};
  queries.forEach((q) => {
    if (!q.timestamp) return;
    const d = new Date(q.timestamp.toDate()).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    map[d] = (map[d] || 0) + 1;
  });
  return Object.entries(map).slice(-7).map(([date, count]) => ({ date, count }));
}

function groupByReadStatus(queries) {
  const read = queries.filter((q) => q.read).length;
  return [{ name: "Read", value: read }, { name: "Unread", value: queries.length - read }];
}

function groupByHour(queries) {
  const hours = Array.from({ length: 24 }, (_, i) => ({ hour: `${i}h`, count: 0 }));
  queries.forEach((q) => {
    if (!q.timestamp) return;
    hours[new Date(q.timestamp.toDate()).getHours()].count++;
  });
  return hours.filter((h) => h.count > 0 || parseInt(h.hour) % 4 === 0);
}

/* ─────────── stat card ─────────── */
function StatCard({ icon: Icon, label, value, sub, color, delay }) {
  return (
    <div className="stat-card" style={{ "--accent": color, animationDelay: delay }}>
      <div className="stat-glow" />
      <div className="stat-icon-wrap"><Icon /></div>
      <div className="stat-body">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
        {sub && <span className="stat-sub">{sub}</span>}
      </div>
    </div>
  );
}

/* ─────────── custom tooltip ─────────── */
const CustomTooltip = ({ active, payload, label }) =>
  active && payload?.length ? (
    <div className="custom-tooltip">
      <p className="tooltip-label">{label}</p>
      <p className="tooltip-value">{payload[0].value}</p>
    </div>
  ) : null;

/* ─────────── main ─────────── */
export default function Admin() {
  const [queries, setQueries] = useState([]);
  const [users,   setUsers]   = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("all");
  const [search,  setSearch]  = useState("");

  useEffect(() => {
    const unsubQ = onSnapshot(
      query(collection(db, "contact_queries"), orderBy("timestamp", "desc")),
      (snap) => { setQueries(snap.docs.map((d) => ({ id: d.id, ...d.data() }))); setLoading(false); }
    );
    const unsubU = onSnapshot(collection(db, "users"),           (snap) => setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    const unsubR = onSnapshot(collection(db, "patient_records"), (snap) => setRecords(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return () => { unsubQ(); unsubU(); unsubR(); };
  }, []);

  const markAsRead  = async (id, cur) => await updateDoc(doc(db, "contact_queries", id), { read: !cur });
  const deleteQuery = async (id) => { if (window.confirm("Delete this message?")) await deleteDoc(doc(db, "contact_queries", id)); };

  const filtered = queries
    .filter((q) => filter === "all" || (filter === "unread" ? !q.read : q.read))
    .filter((q) => search
      ? `${q.firstName} ${q.lastName} ${q.email} ${q.message}`.toLowerCase().includes(search.toLowerCase())
      : true);

  const dayData  = groupByDay(queries);
  const pieData  = groupByReadStatus(queries);
  const hourData = groupByHour(queries);
  const readRate = queries.length
    ? Math.round((queries.filter((q) => q.read).length / queries.length) * 100) : 0;

  const thisMonth = new Date(); thisMonth.setDate(1); thisMonth.setHours(0, 0, 0, 0);
  const newUsersThisMonth = users.filter((u) => {
    const ts = u.createdAt;
    if (!ts) return false;
    return new Date(ts.toDate?.() ?? ts) >= thisMonth;
  }).length;
  const predsThisMonth = records.filter((r) => {
    const ts = r.createdAt;
    if (!ts) return false;
    return new Date(ts.toDate?.() ?? ts) >= thisMonth;
  }).length;

  const PIE_COLORS = ["#22d3ee", "#f43f5e"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg:#030712; --surface:rgba(255,255,255,0.03); --border:rgba(255,255,255,0.07);
          --border-h:rgba(255,255,255,0.15); --text:#f8fafc; --muted:#64748b;
          --cyan:#22d3ee; --rose:#f43f5e; --amber:#fbbf24; --emerald:#34d399;
          --violet:#a78bfa; --sky:#38bdf8;
          --fd:'Syne',sans-serif; --fm:'DM Mono',monospace;
        }
        body { background:var(--bg); color:var(--text); font-family:var(--fd); }

        .admin-root {
          min-height:100vh; background:var(--bg); padding-top:80px;
          background-image:
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(34,211,238,0.09) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 90% 80%, rgba(167,139,250,0.07) 0%, transparent 60%);
        }
        .admin-main { max-width:1400px; margin:0 auto; padding:2.5rem 2rem 4rem; }

        /* header */
        .dash-header {
          display:flex; align-items:flex-end; justify-content:space-between;
          flex-wrap:wrap; gap:1.5rem; margin-bottom:2.5rem;
          animation:fadeUp 0.5s ease both;
        }
        .dash-title-row { display:flex; align-items:center; gap:0.75rem; }
        .dash-sparkle { color:var(--cyan); font-size:1.4rem; }
        .dash-title {
          font-size:clamp(1.8rem,4vw,2.6rem); font-weight:800; letter-spacing:-0.03em;
          background:linear-gradient(135deg,#fff 30%,var(--cyan));
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        }
        .dash-sub { color:var(--muted); font-family:var(--fm); font-size:0.78rem; margin-top:0.25rem; }
        .live-badge {
          display:flex; align-items:center; gap:0.5rem;
          background:rgba(34,211,238,0.07); border:1px solid rgba(34,211,238,0.2);
          border-radius:99px; padding:0.4rem 1rem;
          font-family:var(--fm); font-size:0.7rem; color:var(--cyan);
        }
        .live-dot { width:7px;height:7px;border-radius:50%;background:var(--cyan);animation:pulse 2s infinite; }

        /* stats */
        .stats-grid {
          display:grid; grid-template-columns:repeat(5,1fr); gap:1rem; margin-bottom:2rem;
        }
        @media(max-width:1100px){ .stats-grid{ grid-template-columns:repeat(3,1fr); } }
        @media(max-width:640px) { .stats-grid{ grid-template-columns:repeat(2,1fr); } }

        .stat-card {
          position:relative; background:var(--surface); border:1px solid var(--border);
          border-radius:18px; padding:1.4rem 1.2rem;
          display:flex; align-items:flex-start; gap:1rem; overflow:hidden;
          animation:fadeUp 0.5s ease both;
          transition:border-color 0.3s,transform 0.3s,box-shadow 0.3s;
        }
        .stat-card:hover {
          border-color:var(--accent,var(--cyan)); transform:translateY(-4px);
          box-shadow:0 12px 40px rgba(0,0,0,0.4);
        }
        .stat-glow {
          position:absolute;inset:0;
          background:radial-gradient(circle at 10% 30%,var(--accent,var(--cyan)),transparent 65%);
          opacity:0.07; pointer-events:none;
        }
        .stat-icon-wrap {
          width:42px;height:42px;border-radius:12px;
          background:rgba(255,255,255,0.04);border:1px solid var(--border);
          display:flex;align-items:center;justify-content:center;
          font-size:1rem;color:var(--accent,var(--cyan));flex-shrink:0;margin-top:2px;
        }
        .stat-body { flex:1;min-width:0; }
        .stat-value { display:block;font-size:2rem;font-weight:800;line-height:1;color:var(--text);font-feature-settings:"tnum"; }
        .stat-label { display:block;font-family:var(--fm);font-size:0.63rem;color:var(--muted);text-transform:uppercase;letter-spacing:0.1em;margin-top:0.35rem; }
        .stat-sub {
          display:inline-block;margin-top:0.5rem;font-family:var(--fm);font-size:0.63rem;
          background:rgba(255,255,255,0.04);border:1px solid var(--border);
          border-radius:99px;padding:0.12rem 0.55rem;color:var(--muted);
        }

        /* section label */
        .section-label {
          font-family:var(--fm);font-size:0.7rem;text-transform:uppercase;
          letter-spacing:0.14em;color:var(--muted);
          margin-bottom:1rem;display:flex;align-items:center;gap:0.6rem;
        }
        .section-label::after { content:'';flex:1;height:1px;background:var(--border); }

        /* summary bar */
        .summary-bar {
          display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));
          gap:0.75rem;margin-bottom:2rem;
        }
        .summary-item {
          background:var(--surface);border:1px solid var(--border);border-radius:14px;
          padding:1rem 1.2rem;display:flex;align-items:center;gap:0.9rem;
          animation:fadeUp 0.5s ease both;transition:border-color 0.25s;
        }
        .summary-item:hover { border-color:var(--border-h); }
        .summary-dot { width:10px;height:10px;border-radius:50%;flex-shrink:0; }
        .summary-val { font-size:1.15rem;font-weight:700;color:var(--text); }
        .summary-key { font-family:var(--fm);font-size:0.63rem;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em; }

        /* charts */
        .charts-grid { display:grid;grid-template-columns:2fr 1fr;gap:1.25rem;margin-bottom:2rem; }
        @media(max-width:900px){ .charts-grid{ grid-template-columns:1fr; } }
        .chart-card {
          background:var(--surface);border:1px solid var(--border);
          border-radius:18px;padding:1.5rem;animation:fadeUp 0.6s ease both;
        }
        .chart-title {
          font-family:var(--fm);font-size:0.7rem;color:var(--muted);
          text-transform:uppercase;letter-spacing:0.12em;margin-bottom:1.2rem;
          display:flex;align-items:center;gap:0.5rem;
        }
        .chart-title::before { content:'';display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--cyan); }
        .bar-full { grid-column:1/-1; }
        .pie-legend { display:flex;flex-direction:column;gap:0.6rem;margin-top:1rem; }
        .pie-legend-item { display:flex;align-items:center;gap:0.6rem;font-family:var(--fm);font-size:0.73rem;color:var(--muted); }
        .pie-dot { width:9px;height:9px;border-radius:50%;flex-shrink:0; }
        .pie-val { margin-left:auto;color:var(--text);font-weight:600; }
        .rate-wrap { display:flex;flex-direction:column;align-items:center;margin-top:1.2rem;gap:0.4rem; }
        .rate-ring-outer { position:relative;width:100px;height:100px; }
        .rate-ring-svg { transform:rotate(-90deg); }
        .rate-ring-track { fill:none;stroke:rgba(255,255,255,0.05);stroke-width:8; }
        .rate-ring-fill {
          fill:none;stroke:var(--emerald);stroke-width:8;stroke-linecap:round;
          stroke-dasharray:283;stroke-dashoffset:calc(283 - (283 * var(--pct)) / 100);
          transition:stroke-dashoffset 1.2s ease;filter:drop-shadow(0 0 6px var(--emerald));
        }
        .rate-ring-label { position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:1.4rem;font-weight:800;color:var(--text); }
        .rate-ring-sub { font-family:var(--fm);font-size:0.63rem;color:var(--muted);text-transform:uppercase;letter-spacing:0.1em; }

        /* messages */
        .list-controls { display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;margin-bottom:1.25rem; }
        .search-wrap { position:relative;flex:1;min-width:200px; }
        .s-icon { position:absolute;left:1rem;top:50%;transform:translateY(-50%);color:var(--muted);font-size:0.82rem;pointer-events:none; }
        .search-input {
          width:100%;background:var(--surface);border:1px solid var(--border);
          border-radius:10px;padding:0.65rem 1rem 0.65rem 2.6rem;
          color:var(--text);font-family:var(--fm);font-size:0.8rem;outline:none;transition:border-color 0.2s;
        }
        .search-input:focus { border-color:var(--cyan); }
        .search-input::placeholder { color:var(--muted); }
        .filter-tabs {
          display:flex;gap:0.35rem;background:var(--surface);
          border:1px solid var(--border);border-radius:10px;padding:0.25rem;
        }
        .filter-tab { padding:0.38rem 0.9rem;border-radius:7px;font-family:var(--fm);font-size:0.72rem;color:var(--muted);cursor:pointer;border:none;background:none;transition:all 0.2s; }
        .filter-tab.active { background:rgba(34,211,238,0.12);color:var(--cyan); }

        .msg-list { display:grid;gap:0.85rem; }
        .msg-card {
          background:var(--surface);border:1px solid var(--border);
          border-radius:16px;padding:1.4rem;position:relative;overflow:hidden;
          animation:fadeUp 0.4s ease both;
          transition:border-color 0.25s,transform 0.25s;
        }
        .msg-card::before {
          content:'';position:absolute;left:0;top:0;bottom:0;width:3px;
          background:linear-gradient(to bottom,var(--cyan),var(--violet));opacity:0;transition:opacity 0.3s;
        }
        .msg-card:hover { border-color:var(--border-h);transform:translateX(4px); }
        .msg-card:hover::before { opacity:1; }
        .msg-card.unread { border-color:rgba(34,211,238,0.18); }
        .msg-header { display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;margin-bottom:0.85rem; }
        .msg-row { display:flex;align-items:center;gap:0.75rem; }
        .msg-avatar {
          width:40px;height:40px;border-radius:12px;
          background:linear-gradient(135deg,var(--cyan),var(--violet));
          display:flex;align-items:center;justify-content:center;
          font-weight:800;font-size:0.9rem;color:#000;flex-shrink:0;
        }
        .msg-name { font-size:1rem;font-weight:700;color:var(--text); }
        .msg-email { font-family:var(--fm);font-size:0.7rem;color:var(--muted); }
        .msg-meta { display:flex;flex-direction:column;align-items:flex-end;gap:0.3rem;flex-shrink:0; }
        .msg-time { font-family:var(--fm);font-size:0.67rem;color:var(--muted);display:flex;align-items:center;gap:0.35rem; }
        .unread-badge { background:var(--cyan);color:#000;font-family:var(--fm);font-size:0.58rem;font-weight:700;padding:0.15rem 0.5rem;border-radius:99px;text-transform:uppercase;letter-spacing:0.08em; }
        .msg-body { font-size:0.86rem;color:#94a3b8;line-height:1.65;margin-bottom:1rem; }
        .msg-actions { display:flex;justify-content:flex-end;gap:0.6rem; }
        .action-btn { display:flex;align-items:center;gap:0.4rem;padding:0.38rem 0.85rem;border-radius:8px;font-family:var(--fm);font-size:0.7rem;cursor:pointer;border:1px solid transparent;transition:all 0.2s;background:rgba(255,255,255,0.03); }
        .action-btn.read-btn { color:var(--emerald);border-color:rgba(52,211,153,0.2); }
        .action-btn.read-btn:hover { background:rgba(52,211,153,0.1); }
        .action-btn.del-btn { color:var(--rose);border-color:rgba(244,63,94,0.2); }
        .action-btn.del-btn:hover { background:rgba(244,63,94,0.1); }

        .custom-tooltip { background:rgba(15,23,42,0.95);border:1px solid var(--border-h);border-radius:10px;padding:0.6rem 1rem;font-family:var(--fm);backdrop-filter:blur(12px); }
        .tooltip-label { font-size:0.68rem;color:var(--muted);margin-bottom:0.2rem; }
        .tooltip-value { font-size:0.9rem;color:var(--cyan);font-weight:600; }
        .state-msg { text-align:center;padding:4rem 0;color:var(--muted);font-family:var(--fm);font-size:0.85rem; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>

      <div className="admin-root">
        <Navbar />
        <main className="admin-main">

          {/* ── Header ── */}
          <div className="dash-header">
            <div>
              <div className="dash-title-row">
                <HiSparkles className="dash-sparkle" />
                <h1 className="dash-title">Command Center</h1>
              </div>
              <p className="dash-sub">// admin.dashboard — real-time overview</p>
            </div>
            <div className="live-badge">
              <span className="live-dot" />
              Live · Firestore
            </div>
          </div>

          {/* ── 5 Stat Cards ── */}
          <div className="stats-grid">
            <StatCard
              icon={FaUsers}       label="Total Users"       value={users.length}
              sub={newUsersThisMonth ? `+${newUsersThisMonth} this month` : "—"}
              color="var(--cyan)"    delay="0ms"
            />
            <StatCard
              icon={FaInbox}       label="Total Messages"    value={queries.length}
              sub={`${queries.filter(q => !q.read).length} unread`}
              color="var(--rose)"    delay="70ms"
            />
            <StatCard
              icon={FaFileMedical} label="Patient Records"   value={records.length}
              sub={predsThisMonth ? `+${predsThisMonth} this month` : "—"}
              color="var(--violet)"  delay="140ms"
            />
            <StatCard
              icon={FaChartBar}    label="Predictions Run"   value={records.length}
              sub="all time"
              color="var(--emerald)" delay="210ms"
            />
            <StatCard
              icon={FaBell}        label="Unread Messages"   value={queries.filter(q => !q.read).length}
              sub={`${readRate}% read rate`}
              color="var(--amber)"   delay="280ms"
            />
          </div>

          {/* ── Quick Snapshot ── */}
          <div className="section-label">Quick Snapshot</div>
          <div className="summary-bar">
            {[
              { key: "Registered Users",    val: users.length,                               color: "var(--cyan)"    },
              { key: "New Users / Month",   val: newUsersThisMonth,                          color: "var(--sky)"     },
              { key: "Contact Messages",    val: queries.length,                             color: "var(--rose)"    },
              { key: "Read Messages",       val: queries.filter(q => q.read).length,         color: "var(--emerald)" },
              { key: "Unread Messages",     val: queries.filter(q => !q.read).length,        color: "var(--amber)"   },
              { key: "Records This Month",  val: predsThisMonth,                             color: "var(--violet)"  },
            ].map((item, i) => (
              <div className="summary-item" key={i} style={{ animationDelay: `${i * 50}ms` }}>
                <span className="summary-dot" style={{ background: item.color }} />
                <div>
                  <div className="summary-val">{item.val}</div>
                  <div className="summary-key">{item.key}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Charts ── */}
          <div className="section-label">Analytics</div>
          <div className="charts-grid">

            {/* Area — messages per day */}
            <div className="chart-card" style={{ animationDelay: "0.1s" }}>
              <div className="chart-title">Messages — Last 7 Days</div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={dayData} margin={{ top:5, right:10, left:-20, bottom:0 }}>
                  <defs>
                    <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#22d3ee" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill:"#64748b", fontSize:10, fontFamily:"DM Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill:"#64748b", fontSize:10, fontFamily:"DM Mono" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="count" stroke="#22d3ee" strokeWidth={2} fill="url(#ag)"
                    dot={{ r:3, fill:"#22d3ee", strokeWidth:0 }} activeDot={{ r:5, fill:"#22d3ee" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Pie + read-rate ring */}
            <div className="chart-card" style={{ animationDelay: "0.17s" }}>
              <div className="chart-title">Read vs Unread</div>
              <ResponsiveContainer width="100%" height={130}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={3} dataKey="value" stroke="none">
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background:"rgba(15,23,42,0.95)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, fontFamily:"DM Mono", fontSize:12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-legend">
                {pieData.map((item, i) => (
                  <div key={i} className="pie-legend-item">
                    <span className="pie-dot" style={{ background: PIE_COLORS[i] }} />
                    {item.name}
                    <span className="pie-val">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="rate-wrap">
                <div className="rate-ring-outer">
                  <svg className="rate-ring-svg" width="100" height="100" viewBox="0 0 100 100">
                    <circle className="rate-ring-track" cx="50" cy="50" r="45" />
                    <circle className="rate-ring-fill"  cx="50" cy="50" r="45" style={{ "--pct": readRate }} />
                  </svg>
                  <div className="rate-ring-label">{readRate}%</div>
                </div>
                <span className="rate-ring-sub">Read Rate</span>
              </div>
            </div>

            {/* Bar — messages by hour */}
            <div className="chart-card bar-full" style={{ animationDelay: "0.24s" }}>
              <div className="chart-title">Message Activity by Hour</div>
              <ResponsiveContainer width="100%" height={170}>
                <BarChart data={hourData} margin={{ top:5, right:10, left:-20, bottom:0 }} barSize={13}>
                  <defs>
                    <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#a78bfa" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="hour" tick={{ fill:"#64748b", fontSize:9, fontFamily:"DM Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill:"#64748b", fontSize:10, fontFamily:"DM Mono" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="url(#bg2)" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Contact Messages ── */}
          <div className="section-label" style={{ marginTop: "2rem" }}>Contact Messages</div>
          <div className="list-controls">
            <div className="search-wrap">
              <FaSearch className="s-icon" />
              <input
                className="search-input"
                placeholder="Search name, email, message…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="filter-tabs">
              {["all","unread","read"].map((f) => (
                <button key={f} className={`filter-tab${filter===f?" active":""}`} onClick={() => setFilter(f)}>{f}</button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="state-msg">Loading messages…</div>
          ) : filtered.length === 0 ? (
            <div className="state-msg">No messages found.</div>
          ) : (
            <div className="msg-list">
              {filtered.map((q, idx) => (
                <div key={q.id} className={`msg-card${!q.read?" unread":""}`} style={{ animationDelay:`${idx*40}ms` }}>
                  <div className="msg-header">
                    <div className="msg-row">
                      <div className="msg-avatar">{(q.firstName?.[0]||"?").toUpperCase()}</div>
                      <div>
                        <div className="msg-name">{q.firstName} {q.lastName}</div>
                        <div className="msg-email">{q.email}</div>
                      </div>
                    </div>
                    <div className="msg-meta">
                      {q.timestamp && (
                        <span className="msg-time">
                          <FaRegClock />
                          {new Date(q.timestamp.toDate()).toLocaleString("en-US",{ month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" })}
                        </span>
                      )}
                      {!q.read && <span className="unread-badge">New</span>}
                    </div>
                  </div>
                  <div className="msg-body">{q.message}</div>
                  <div className="msg-actions">
                    <button className="action-btn read-btn" onClick={() => markAsRead(q.id, q.read)}>
                      {q.read ? <FaEyeSlash /> : <FaEye />} {q.read ? "Mark Unread" : "Mark Read"}
                    </button>
                    <button className="action-btn del-btn" onClick={() => deleteQuery(q.id)}>
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}