import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Database,
  FileText,
  Filter,
  GitBranch,
  Inbox,
  Layers3,
  LayoutDashboard,
  LifeBuoy,
  MoreHorizontal,
  PanelLeft,
  Plus,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

type Ticket = {
  id: string;
  title: string;
  requester: string;
  category: "Benefits" | "Leave" | "Payroll" | "Onboarding";
  priority: "Normal" | "At risk" | "Sensitive";
  status: "Needs review" | "Clarification" | "In progress";
  queue: string;
  age: string;
  source: string;
  sourceState: "current" | "outdated" | "missing";
  summary: string;
};

const tickets: Ticket[] = [
  {
    id: "TKT-2026-004281",
    title: "Parental leave balance after role change",
    requester: "Maya Chen · Engineering",
    category: "Leave",
    priority: "At risk",
    status: "Needs review",
    queue: "HR partners",
    age: "3h 18m",
    source: "POL-HR-2026-014 · v03",
    sourceState: "current",
    summary: "Employee moved from contractor to full-time on 04 Nov and needs the effective leave balance confirmed before payroll closes.",
  },
  {
    id: "TKT-2026-004279",
    title: "Dependent care reimbursement limit",
    requester: "Jon Bell · Sales",
    category: "Benefits",
    priority: "Normal",
    status: "Clarification",
    queue: "Benefits desk",
    age: "5h 02m",
    source: "No effective source linked",
    sourceState: "missing",
    summary: "The question references a regional exception but does not include the employee's work location or plan year.",
  },
  {
    id: "TKT-2026-004274",
    title: "Final pay timing for departing employee",
    requester: "Nora Patel · Manager",
    category: "Payroll",
    priority: "Sensitive",
    status: "In progress",
    queue: "Payroll operations",
    age: "7h 41m",
    source: "POL-HR-2026-021 · v01",
    sourceState: "outdated",
    summary: "The linked answer cites a superseded policy version. Route to payroll operations before any response is sent.",
  },
  {
    id: "TKT-2026-004268",
    title: "Laptop and badge for first day",
    requester: "Alina Ross · New hire",
    category: "Onboarding",
    priority: "Normal",
    status: "Needs review",
    queue: "IT / operations",
    age: "9h 12m",
    source: "POL-HR-2026-006 · v02",
    sourceState: "current",
    summary: "A new hire needs a confirmed pickup window and a backup contact for the first-day equipment handoff.",
  },
  {
    id: "TKT-2026-004263",
    title: "Open enrollment window for a new state",
    requester: "Rafael Singh · People ops",
    category: "Benefits",
    priority: "Normal",
    status: "In progress",
    queue: "Benefits desk",
    age: "11h 04m",
    source: "POL-HR-2026-014 · v03",
    sourceState: "current",
    summary: "The policy answer is grounded, but a state-specific article still needs to be linked before resolution.",
  },
];

const queues = [
  { label: "All open", count: 128 },
  { label: "Needs review", count: 24 },
  { label: "At risk today", count: 8 },
  { label: "Sensitive cases", count: 5 },
];

const sourceRows = [
  { label: "Current policy", count: 96, tone: "blue", width: "75%" },
  { label: "Clarification needed", count: 18, tone: "amber", width: "42%" },
  { label: "Outdated source", count: 9, tone: "coral", width: "28%" },
  { label: "No source linked", count: 5, tone: "slate", width: "18%" },
];

function NavItem({
  icon: Icon,
  label,
  active,
  count,
  onClick,
}: {
  icon: typeof LayoutDashboard;
  label: string;
  active?: boolean;
  count?: string;
  onClick?: () => void;
}) {
  return (
    <button className={`nav-item ${active ? "is-active" : ""}`} onClick={onClick}>
      <Icon size={17} strokeWidth={1.8} />
      <span>{label}</span>
      {count ? <em>{count}</em> : null}
    </button>
  );
}

function StatusPill({ children, tone }: { children: React.ReactNode; tone: string }) {
  return <span className={`status-pill ${tone}`}>{children}</span>;
}

function SourceBadge({ state }: { state: Ticket["sourceState"] }) {
  if (state === "current") {
    return (
      <span className="source-badge source-current">
        <Check size={12} /> Current source
      </span>
    );
  }
  if (state === "outdated") {
    return (
      <span className="source-badge source-outdated">
        <AlertTriangle size={12} /> Outdated source
      </span>
    );
  }
  return (
    <span className="source-badge source-missing">
      <AlertTriangle size={12} /> Source needed
    </span>
  );
}

function MetricCard({
  eyebrow,
  value,
  detail,
  trend,
  icon: Icon,
  tone = "blue",
}: {
  eyebrow: string;
  value: string;
  detail: string;
  trend: string;
  icon: typeof Activity;
  tone?: string;
}) {
  return (
    <article className="metric-card">
      <div className="metric-topline">
        <span>{eyebrow}</span>
        <span className={`metric-icon ${tone}`}><Icon size={15} /></span>
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-detail"><strong className={tone}>{trend}</strong> {detail}</div>
    </article>
  );
}

export default function Home() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [activeQueue, setActiveQueue] = useState("All open");
  const [query, setQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(tickets[0]);
  const [showExceptions, setShowExceptions] = useState(false);

  const filteredTickets = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    return tickets.filter((ticket) => {
      const queueMatches =
        activeQueue === "All open" ||
        (activeQueue === "At risk today" && ticket.priority === "At risk") ||
        (activeQueue === "Sensitive cases" && ticket.priority === "Sensitive") ||
        (activeQueue === "Needs review" && ticket.status === "Needs review");
      const searchMatches = !normalized || `${ticket.id} ${ticket.title} ${ticket.requester} ${ticket.category}`.toLowerCase().includes(normalized);
      const exceptionMatches = !showExceptions || ticket.sourceState !== "current";
      return queueMatches && searchMatches && exceptionMatches;
    });
  }, [activeQueue, query, showExceptions]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true"><span /></div>
          <div>
            <div className="brand-name">policyflow</div>
            <div className="brand-caption">people operations</div>
          </div>
        </div>

        <div className="workspace-switcher">
          <div className="workspace-avatar">OP</div>
          <div className="workspace-copy">
            <strong>Operations desk</strong>
            <span>Northstar · internal</span>
          </div>
          <ChevronDown size={14} />
        </div>

        <div className="nav-section">
          <span className="nav-label">Workspace</span>
          <NavItem icon={LayoutDashboard} label="Overview" active={activeNav === "Overview"} onClick={() => setActiveNav("Overview")} />
          <NavItem icon={Inbox} label="Ticket queue" count="128" active={activeNav === "Ticket queue"} onClick={() => setActiveNav("Ticket queue")} />
          <NavItem icon={BookOpen} label="Policy library" count="150" active={activeNav === "Policy library"} onClick={() => setActiveNav("Policy library")} />
          <NavItem icon={GitBranch} label="Routing rules" active={activeNav === "Routing rules"} onClick={() => setActiveNav("Routing rules")} />
        </div>

        <div className="nav-section nav-section-lower">
          <span className="nav-label">Controls</span>
          <NavItem icon={ShieldAlert} label="Exception review" count="9" active={activeNav === "Exception review"} onClick={() => { setActiveNav("Exception review"); setShowExceptions(true); }} />
          <NavItem icon={Database} label="Dataset health" active={activeNav === "Dataset health"} onClick={() => setActiveNav("Dataset health")} />
          <NavItem icon={SlidersHorizontal} label="Workspace settings" active={activeNav === "Workspace settings"} onClick={() => setActiveNav("Workspace settings")} />
        </div>

        <div className="sidebar-foot">
          <div className="sync-note"><span className="live-dot" /> Last synced 4 min ago</div>
          <button className="support-link"><LifeBuoy size={15} /> Need help?</button>
          <div className="user-chip"><div className="user-avatar">AS</div><div><strong>Alex Stone</strong><span>HR partner</span></div><MoreHorizontal size={16} /></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb"><span>Operations</span><span className="crumb-slash">/</span><strong>{activeNav}</strong></div>
          <div className="topbar-actions">
            <div className="seed-badge"><span className="seed-dot" /> Seed 20261022 <span className="seed-divider" /> Reproducible</div>
            <button className="icon-button" aria-label="Toggle navigation"><PanelLeft size={17} /></button>
            <button className="avatar-button">AS</button>
          </div>
        </header>

        <div className="content-wrap">
          <section className="page-intro">
            <div>
              <div className="overline">Thursday, 12 November 2026 · 09:42 UTC</div>
              <h1>Good morning, Alex.</h1>
              <p>Review what needs a human decision before the next SLA window closes.</p>
            </div>
            <div className="intro-actions">
              <button className="secondary-button"><FileText size={15} /> Export view</button>
              <button className="primary-button"><Plus size={16} /> New ticket</button>
            </div>
          </section>

          <section className="metric-grid" aria-label="Service metrics">
            <MetricCard eyebrow="Open tickets" value="128" trend="−12%" detail="vs. last Monday" icon={Inbox} />
            <MetricCard eyebrow="Within SLA" value="91.4%" trend="+3.1 pts" detail="this week" icon={Clock3} tone="mint" />
            <MetricCard eyebrow="Awaiting decision" value="24" trend="8 at risk" detail="before 14:00" icon={AlertTriangle} tone="amber" />
            <MetricCard eyebrow="Source coverage" value="96.2%" trend="+1.8 pts" detail="effective policy linked" icon={Layers3} tone="ink" />
          </section>

          <section className="signal-strip">
            <div className="signal-icon"><Activity size={17} /></div>
            <div className="signal-copy"><strong>Queue health is steady.</strong><span>Three cases need a policy source check before they can be resolved.</span></div>
            <button onClick={() => { setActiveQueue("Needs review"); setShowExceptions(false); }}>Review queue <ArrowUpRight size={14} /></button>
          </section>

          <section className="workspace-grid">
            <div className="primary-column">
              <div className="section-heading">
                <div><span className="section-kicker">Triage</span><h2>{showExceptions ? "Exception review" : "Ticket queue"}</h2></div>
                <div className="heading-actions"><button className={`quiet-button ${showExceptions ? "is-selected" : ""}`} onClick={() => setShowExceptions(!showExceptions)}><Filter size={14} /> {showExceptions ? "All tickets" : "Exceptions"}</button><button className="quiet-button">View all <ArrowUpRight size={14} /></button></div>
              </div>

              <div className="queue-tabs">
                {queues.map((queue) => <button key={queue.label} className={activeQueue === queue.label ? "is-active" : ""} onClick={() => setActiveQueue(queue.label)}>{queue.label}<span>{queue.count}</span></button>)}
              </div>

              <div className="ticket-panel">
                <div className="ticket-toolbar">
                  <div className="search-field"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by ticket, title, or requester" /></div>
                  <button className="toolbar-button"><SlidersHorizontal size={14} /> Filters <ChevronDown size={13} /></button>
                </div>
                <div className="ticket-list">
                  {filteredTickets.map((ticket) => (
                    <button key={ticket.id} className={`ticket-row ${selectedTicket?.id === ticket.id ? "is-selected" : ""}`} onClick={() => setSelectedTicket(ticket)}>
                      <div className="ticket-main">
                        <div className="ticket-id-line"><span className="ticket-id">{ticket.id}</span><span className={`priority-dot ${ticket.priority.toLowerCase().replace(" ", "-")}`} /></div>
                        <strong>{ticket.title}</strong>
                        <span className="requester">{ticket.requester}</span>
                      </div>
                      <div className="ticket-meta"><StatusPill tone={ticket.status === "Needs review" ? "pill-blue" : ticket.status === "Clarification" ? "pill-amber" : "pill-mint"}>{ticket.status}</StatusPill><span className="category-label">{ticket.category}</span></div>
                      <div className="ticket-source"><SourceBadge state={ticket.sourceState} /><span>{ticket.age}</span></div>
                      <ArrowUpRight className="row-arrow" size={16} />
                    </button>
                  ))}
                  {!filteredTickets.length ? <div className="empty-state"><Search size={18} /><strong>No matching tickets</strong><span>Try a different queue or search term.</span></div> : null}
                </div>
                <div className="list-footer"><span>Showing {filteredTickets.length} of 128 open tickets</span><button>Load more <ArrowUpRight size={13} /></button></div>
              </div>
            </div>

            <aside className="secondary-column">
              <div className="section-heading compact"><div><span className="section-kicker">Evidence</span><h2>Policy lineage</h2></div><button className="dots-button"><MoreHorizontal size={16} /></button></div>
              <div className="evidence-card">
                <div className="evidence-card-head"><div className="policy-symbol"><BookOpen size={16} /></div><div><strong>Most used sources</strong><span>Last 7 days · 128 tickets</span></div></div>
                <div className="source-bars">{sourceRows.map((row) => <div className="source-row" key={row.label}><div className="source-label"><span>{row.label}</span><strong>{row.count}</strong></div><div className="bar-track"><span className={`bar-fill ${row.tone}`} style={{ width: row.width }} /></div></div>)}</div>
                <div className="evidence-footer"><span><span className="mini-check"><Check size={11} /></span> 123 linked to effective versions</span><button>Open library <ArrowUpRight size={13} /></button></div>
              </div>

              <div className="section-heading compact sla-heading"><div><span className="section-kicker">Service level</span><h2>SLA watch</h2></div><span className="date-chip">This week <ChevronDown size={12} /></span></div>
              <div className="sla-card">
                <div className="sla-score"><div className="score-ring"><div><strong>91</strong><span>%</span></div></div><div><strong>Within target</strong><span>Target is 90%</span></div></div>
                <div className="sla-days"><div><span>Mon</span><i style={{ height: "58%" }} /></div><div><span>Tue</span><i style={{ height: "76%" }} /></div><div><span>Wed</span><i style={{ height: "69%" }} /></div><div><span>Thu</span><i className="today" style={{ height: "86%" }} /></div><div><span>Fri</span><i style={{ height: "38%" }} /></div></div>
                <div className="sla-caption"><span><i className="legend-dot blue" /> Resolved within target</span><span><i className="legend-dot pale" /> In progress</span></div>
              </div>

              <div className="validation-card"><div className="validation-header"><div><span className="section-kicker">Dataset health</span><h3>Baseline checks passed</h3></div><CheckCircle2 size={19} /></div><div className="validation-stats"><div><strong>5,000</strong><span>tickets</span></div><div><strong>150</strong><span>articles</span></div><div><strong>20k</strong><span>messages</span></div></div><div className="validation-line"><span><Check size={12} /> PK / FK integrity</span><span><Check size={12} /> Reproducible</span></div><button>View validation summary <ArrowUpRight size={13} /></button></div>
            </aside>
          </section>

          <section className="bottom-note"><div className="bottom-note-icon"><ShieldAlert size={16} /></div><div><strong>9 labeled exceptions are held out of the live queue.</strong><span>Ground truth stays separate from input features so review outcomes remain measurable.</span></div><button onClick={() => { setActiveNav("Exception review"); setShowExceptions(true); }}>Open exception review <ArrowUpRight size={14} /></button></section>
        </div>
      </main>

      {selectedTicket ? <aside className="detail-drawer"><div className="drawer-top"><span className="section-kicker">Ticket detail</span><button onClick={() => setSelectedTicket(null)}><X size={18} /></button></div><div className="drawer-id">{selectedTicket.id}</div><h2>{selectedTicket.title}</h2><div className="drawer-requester"><div className="small-avatar">{selectedTicket.requester.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div><div><strong>{selectedTicket.requester}</strong><span>{selectedTicket.queue}</span></div></div><div className="drawer-tags"><StatusPill tone={selectedTicket.priority === "Sensitive" ? "pill-coral" : selectedTicket.priority === "At risk" ? "pill-amber" : "pill-blue"}>{selectedTicket.priority}</StatusPill><StatusPill tone="pill-neutral">{selectedTicket.category}</StatusPill></div><div className="drawer-section"><span className="drawer-label">Working summary</span><p>{selectedTicket.summary}</p></div><div className="drawer-section source-section"><span className="drawer-label">Linked source</span><div className="linked-source"><div className={`source-pin ${selectedTicket.sourceState}`}><BookOpen size={15} /></div><div><strong>{selectedTicket.source}</strong><span>{selectedTicket.sourceState === "current" ? "Effective 01 Oct 2026 · Employee audience" : selectedTicket.sourceState === "outdated" ? "Superseded 01 Sep 2026 · Review required" : "Add a policy version before responding"}</span></div><ArrowUpRight size={14} /></div></div><div className="drawer-section"><span className="drawer-label">Decision trail</span><div className="timeline"><div><span className="timeline-dot done"><Check size={10} /></span><p><strong>Ticket received</strong><span>Today, 06:24 · intake form</span></p></div><div><span className="timeline-dot done"><Check size={10} /></span><p><strong>Category assigned</strong><span>Today, 06:28 · {selectedTicket.category}</span></p></div><div><span className="timeline-dot current"><Clock3 size={10} /></span><p><strong>Human decision needed</strong><span>Next action · verify source and route</span></p></div></div></div><button className="drawer-primary">Open full case <ArrowUpRight size={15} /></button><button className="drawer-secondary">Assign to me</button></aside> : null}
    </div>
  );
}
