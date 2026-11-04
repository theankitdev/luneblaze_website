"use client";

import { useState } from "react";
import Link from "next/link";

export default function BookingForm() {
  const [cm, setCm] = useState(0);
  const [cd, setCd] = useState(null);
  const [ct, setCt] = useState(null);
  const [cs, setCs] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Calendar generation logic
  const now = new Date();
  const base = new Date(now.getFullYear(), now.getMonth() + cm, 1);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  const lead = (base.getDay() + 6) % 7;
  const dim = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const days = [];
  for (let k = 0; k < lead; k++) days.push({ n: "", off: true });
  for (let d = 1; d <= dim; d++) {
    const dt = new Date(base.getFullYear(), base.getMonth(), d);
    const ok = dt > today && dt.getDay() !== 0;
    const sel = cd && cd.getTime() === dt.getTime();
    days.push({ n: d, off: !ok, dt, sel });
  }

  const dateLabel = cd ? `${dayNames[cd.getDay()]}, ${cd.getDate()} ${monthNames[cd.getMonth()]} ${cd.getFullYear()}` : "";
  const pickedLabel = cd ? `${dateLabel}${ct ? ' · ' + ct : ''}` : "";

  const times = ['10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','2:00 PM','2:30 PM','3:00 PM','4:00 PM','5:00 PM'];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isSubmitted) {
    return (
      <div style={{ maxWidth: 640, margin: "clamp(10px,2vw,30px) auto", textAlign: "center", background: "#fff", border: "1px solid #DCEAEC", borderRadius: 26, padding: "clamp(28px,3.4vw,48px)", boxShadow: "0 2px 4px rgba(23,35,38,.03),0 34px 66px -40px rgba(15,60,66,.5)" }}>
        <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 68, height: 68, borderRadius: "50%", boxShadow: "0 0 0 9px #E8F7EF66", background: "#E8F7EF", color: "#0E9F6E" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        </span>
        <h2 style={{ margin: "22px 0 0", fontSize: "clamp(23px,2.6vw,32px)", fontWeight: 800, letterSpacing: "-.03em", color: "#152A2E" }}>Thanks for filling this in</h2>
        <p style={{ margin: "13px auto 0", maxWidth: "44ch", fontSize: "clamp(14.5px,1.15vw,16.5px)", lineHeight: 1.66, color: "#5F7175" }}>We will get in touch with you shortly. A confirmation mail has been sent to your email address with the details of your request.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginTop: 26 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "#17AEB9", color: "#fff", borderRadius: 10, padding: "13px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>Back to homepage</Link>
          <Link href="/blogs" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "#fff", color: "#152A2E", border: "1px solid #DCEAEC", borderRadius: 10, padding: "12px 21px", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>Read our insights</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "clamp(24px,3vw,40px)" }}>
        <h1 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(30px,3.6vw,48px)", lineHeight: 1.1, letterSpacing: "-.03em", color: "#152A2E" }}>Ready to simplify <span style={{ color: "#17AEB9" }}>accreditation?</span></h1>
        <p style={{ margin: "12px 0 0", fontSize: 17, color: "#4C6165" }}>Book your demo now — pick a date and time that suits you.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,.85fr) minmax(0,1.4fr)", background: "#fff", border: "1px solid #C9D9DC", boxShadow: "0 40px 80px -52px rgba(15,60,66,.5)" }} className="lf-cal">
        {/* Left Side - Info */}
        <div style={{ padding: "clamp(22px,3vw,36px)", borderRight: "1px solid #D6E3E5", background: "#F7FBFB", display: "flex", flexDirection: "column", gap: 18 }}>
          <img src="/assets/luneblaze-logo.png" alt="Luneblaze" style={{ height: 38, width: "auto", alignSelf: "flex-start" }} />
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(20px,1.9vw,24px)", lineHeight: 1.3, letterSpacing: "-.02em", color: "#152A2E" }}>How can Luneblaze streamline the accreditation process of your institution?</h2>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "#4C6165" }}>Explore our AI-powered, end-to-end solution that simplifies every stage of the accreditation process — from documentation and audits to training and expert support.</p>
          <div style={{ display: "grid", gap: 10, paddingTop: 16, borderTop: "1px solid #E1ECEE", fontSize: 14.5, fontWeight: 600, color: "#244247" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}><span style={{ width: 30, height: 30, display: "grid", placeItems: "center", background: "#E3F4F5", color: "#0E7A83" }}>◷</span>30 minutes</div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}><span style={{ width: 30, height: 30, display: "grid", placeItems: "center", background: "#E3F4F5", color: "#0E7A83" }}>▶</span>Google Meet</div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}><span style={{ width: 30, height: 30, display: "grid", placeItems: "center", background: "#E3F4F5", color: "#0E7A83" }}>◍</span>Asia/Kolkata (IST)</div>
          </div>
          {cd && (
            <div style={{ padding: "14px 16px", background: "#fff", border: "1px solid #BEE2E6", borderLeft: "3px solid #17AEB9" }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: "#0E7A83" }}>Your slot</div>
              <div style={{ marginTop: 4, fontWeight: 800, fontSize: 15.5, color: "#152A2E" }}>{pickedLabel}</div>
            </div>
          )}
        </div>

        {/* Right Side - Interactive Form */}
        <div style={{ padding: "clamp(20px,3vw,36px)", minWidth: 0 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
            {['Date', 'Time', 'Details'].map((label, i) => (
              <div key={label} style={{ flex: 1, minWidth: 0 }}>
                <div style={{ height: 4, background: i + 1 <= cs ? "#17AEB9" : "#E1ECEE", transition: "background .3s" }}></div>
                <div style={{ marginTop: 7, fontSize: 12, fontWeight: 700, color: i + 1 <= cs ? "#0E7A83" : "#8A9A9E", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{i + 1}. {label}</div>
              </div>
            ))}
          </div>

          {cs === 1 && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <h3 style={{ margin: 0, fontWeight: 800, fontSize: 20, color: "#152A2E" }}>Select a date</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button type="button" onClick={() => cm > 0 && setCm(cm - 1)} disabled={cm === 0} style={{ width: 38, height: 38, border: "1px solid #C9D9DC", background: "#fff", cursor: cm > 0 ? "pointer" : "default", fontSize: 16, color: "#152A2E", opacity: cm > 0 ? 1 : 0.35 }}>‹</button>
                  <span style={{ minWidth: 130, textAlign: "center", fontWeight: 800, fontSize: 15 }}>{monthNames[base.getMonth()]} {base.getFullYear()}</span>
                  <button type="button" onClick={() => setCm(cm + 1)} style={{ width: 38, height: 38, border: "1px solid #C9D9DC", background: "#fff", cursor: "pointer", fontSize: 16, color: "#152A2E" }}>›</button>
                </div>
              </div>
              <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(7,minmax(0,1fr))", gap: 6 }}>
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <div key={d} style={{ textAlign: "center", fontSize: 12, fontWeight: 800, letterSpacing: ".06em", color: "#6A7C80", padding: "4px 0" }}>{d}</div>)}
                {days.map((d, i) => (
                  <button key={i} type="button" onClick={() => { if (!d.off) { setCd(d.dt); setCt(null); setCs(2); } }} disabled={d.off} style={{ aspectRatio: 1, maxHeight: 54, width: "100%", border: `1px solid ${d.sel ? '#17AEB9' : d.off ? '#EEF3F4' : '#BEE2E6'}`, background: d.sel ? '#17AEB9' : d.off ? '#fff' : '#EDF7F8', color: d.sel ? '#fff' : d.off ? '#B7C3C5' : '#0E5F66', font: "inherit", fontWeight: 700, fontSize: 15, cursor: d.off ? "default" : "pointer", transition: "all .2s" }}>
                    {d.n}
                  </button>
                ))}
              </div>
              <p style={{ margin: "14px 0 0", fontSize: 13, color: "#6A7C80" }}>Demos run Monday to Saturday. Available dates are highlighted.</p>
            </div>
          )}

          {cs === 2 && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <h3 style={{ margin: 0, fontWeight: 800, fontSize: 20, color: "#152A2E" }}>{dateLabel}</h3>
                <button type="button" onClick={() => setCs(1)} style={{ border: 0, background: "none", color: "#0E8B95", font: "inherit", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>← Change date</button>
              </div>
              <p style={{ margin: "6px 0 0", fontSize: 14, color: "#5F7175" }}>Select a time (IST)</p>
              <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", gap: 10 }}>
                {times.map(t => (
                  <button key={t} type="button" onClick={() => { setCt(t); setCs(3); }} style={{ padding: "14px 10px", border: "1px solid #17AEB9", background: "#fff", color: "#0E7A83", font: "inherit", fontWeight: 800, fontSize: 15, cursor: "pointer", transition: "all .2s" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#17AEB9"; e.currentTarget.style.color = "#fff"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#0E7A83"; }}>{t}</button>
                ))}
              </div>
            </div>
          )}

          {cs === 3 && (
            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <h3 style={{ margin: 0, fontWeight: 800, fontSize: 20, color: "#152A2E" }}>Enter your details</h3>
                <button type="button" onClick={() => setCs(2)} style={{ border: 0, background: "none", color: "#0E8B95", font: "inherit", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>← Change time</button>
              </div>
              <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 14 }} className="lf-calf">
                <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 700, color: "#244247" }}>Full name<input required type="text" placeholder="Your full name" style={{ padding: "13px 14px", border: "1px solid #C9D9DC", background: "#fff", font: "inherit", fontSize: 15, color: "#152A2E", outline: "none" }} /></label>
                <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 700, color: "#244247" }}>Email<input required type="email" placeholder="you@institution.edu" style={{ padding: "13px 14px", border: "1px solid #C9D9DC", background: "#fff", font: "inherit", fontSize: 15, color: "#152A2E", outline: "none" }} /></label>
                <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 700, color: "#244247" }}>Phone<input required type="tel" placeholder="+91 98765 43210" style={{ padding: "13px 14px", border: "1px solid #C9D9DC", background: "#fff", font: "inherit", fontSize: 15, color: "#152A2E", outline: "none" }} /></label>
                <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 700, color: "#244247" }}>Institution<input required type="text" placeholder="School / college name" style={{ padding: "13px 14px", border: "1px solid #C9D9DC", background: "#fff", font: "inherit", fontSize: 15, color: "#152A2E", outline: "none" }} /></label>
                <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 700, color: "#244247" }}>Designation<input required type="text" placeholder="Principal, IQAC coordinator…" style={{ padding: "13px 14px", border: "1px solid #C9D9DC", background: "#fff", font: "inherit", fontSize: 15, color: "#152A2E", outline: "none" }} /></label>
                <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 700, color: "#244247" }}>Accreditation type
                  <select required style={{ padding: "13px 14px", border: "1px solid #C9D9DC", background: "#fff", font: "inherit", fontSize: 15, color: "#152A2E" }}>
                    <option value="">Select…</option><option>SQAAF</option><option>NABET</option><option>NAAC</option><option>NBA</option><option>NIRF</option><option>Group of Schools</option><option>Group of Colleges</option>
                  </select>
                </label>
              </div>
              <label style={{ marginTop: 14, display: "grid", gap: 6, fontSize: 13, fontWeight: 700, color: "#244247" }}>Anything we should know? (optional)<textarea rows="3" style={{ padding: "13px 14px", border: "1px solid #C9D9DC", font: "inherit", fontSize: 15, resize: "vertical" }}></textarea></label>
              <button type="submit" style={{ marginTop: 18, width: "100%", padding: 16, border: 0, background: "#17AEB9", color: "#fff", font: "inherit", fontWeight: 800, fontSize: 16, cursor: "pointer", boxShadow: "0 14px 30px -14px rgba(23,174,185,.85)" }}>Schedule demo · {pickedLabel}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}