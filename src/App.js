import React, { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from "recharts";
import {
  TrendingUp, TrendingDown, DollarSign, Activity, AlertTriangle,
  Shield, BarChart2, Users, User, Bell, BellOff,
  Power, PowerOff, Info, X, Menu
} from "lucide-react";
import "./App.css";

const ACCOUNTS = [
  {
    id: 1,
    Account_Number: "845231",
    Account_Name: "John Trader",
    Account_Balance: 12450.80,
    Account_Equity: 12891.45,
    Margin_Level: 340.25,
    Drawdown: 4.32,
    Profit_Per: 284.50,
    Profit_Amt: 2891.45,
    Floating_Profits: 440.65,
    Deposit: 10000.00,
    Withdraw: 441.05,
    Open_Positions: 3,
    Pending_Orders: 2,
    Highest_Position_Symbol: "XAUUSD",
    Highest_Position_Lot_Size: "0.50",
    Highest_Position_Signal: "Buy",
    ORDER_OPEN_TIME: "2026.05.17 14:32:00",
    Last_Week_Profit: 1247.30,
    StartTime: "2026.01.01",
    active: true,
    alert: true,
    weekly: [
      { day: "Mon", profit: 320 },
      { day: "Tue", profit: -140 },
      { day: "Wed", profit: 480 },
      { day: "Thu", profit: 210 },
      { day: "Fri", profit: 390 },
      { day: "Sat", profit: 180 },
      { day: "Sun", profit: 284 },
    ],
    equity_curve: [
      { time: "Jan", equity: 10000 },
      { time: "Feb", equity: 10480 },
      { time: "Mar", equity: 10200 },
      { time: "Apr", equity: 11340 },
      { time: "May", equity: 12891 },
    ],
  },
  {
    id: 2,
    Account_Number: "992104",
    Account_Name: "Sarah FX",
    Account_Balance: 8200.00,
    Account_Equity: 7950.30,
    Margin_Level: 210.10,
    Drawdown: 8.75,
    Profit_Per: -320.00,
    Profit_Amt: -250.00,
    Floating_Profits: -249.70,
    Deposit: 8500.00,
    Withdraw: 0,
    Open_Positions: 2,
    Pending_Orders: 1,
    Highest_Position_Symbol: "EURUSD",
    Highest_Position_Lot_Size: "0.30",
    Highest_Position_Signal: "Sell",
    ORDER_OPEN_TIME: "2026.05.17 09:15:00",
    Last_Week_Profit: -410.00,
    StartTime: "2026.02.14",
    active: true,
    alert: false,
    weekly: [
      { day: "Mon", profit: -200 },
      { day: "Tue", profit: 80 },
      { day: "Wed", profit: -310 },
      { day: "Thu", profit: 120 },
      { day: "Fri", profit: -100 },
      { day: "Sat", profit: 90 },
      { day: "Sun", profit: -320 },
    ],
    equity_curve: [
      { time: "Jan", equity: 8500 },
      { time: "Feb", equity: 8100 },
      { time: "Mar", equity: 8400 },
      { time: "Apr", equity: 8050 },
      { time: "May", equity: 7950 },
    ],
  },
  {
    id: 3,
    Account_Number: "331872",
    Account_Name: "Mike Gold",
    Account_Balance: 25000.00,
    Account_Equity: 26100.50,
    Margin_Level: 520.80,
    Drawdown: 2.10,
    Profit_Per: 1100.50,
    Profit_Amt: 6100.50,
    Floating_Profits: 1100.50,
    Deposit: 20000.00,
    Withdraw: 1000.00,
    Open_Positions: 5,
    Pending_Orders: 3,
    Highest_Position_Symbol: "BTCUSD",
    Highest_Position_Lot_Size: "0.80",
    Highest_Position_Signal: "Buy",
    ORDER_OPEN_TIME: "2026.05.16 22:00:00",
    Last_Week_Profit: 2100.00,
    StartTime: "2025.11.01",
    active: false,
    alert: true,
    weekly: [
      { day: "Mon", profit: 800 },
      { day: "Tue", profit: 420 },
      { day: "Wed", profit: 900 },
      { day: "Thu", profit: -200 },
      { day: "Fri", profit: 1100 },
      { day: "Sat", profit: 340 },
      { day: "Sun", profit: 1100 },
    ],
    equity_curve: [
      { time: "Nov", equity: 20000 },
      { time: "Dec", equity: 21500 },
      { time: "Jan", equity: 23000 },
      { time: "Feb", equity: 22400 },
      { time: "Mar", equity: 24100 },
      { time: "Apr", equity: 25200 },
      { time: "May", equity: 26100 },
    ],
  },
];

const fmt = (n) => `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const pct = (n) => `${Number(n).toFixed(2)}%`;

function StatCard({ label, value, sub, icon: Icon, color, positive }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card__icon"><Icon size={18} /></div>
      <div className="stat-card__body">
        <span className="stat-card__label">{label}</span>
        <span className="stat-card__value">{value}</span>
        {sub && <span className={`stat-card__sub ${positive === false ? "neg" : positive === true ? "pos" : ""}`}>{sub}</span>}
      </div>
    </div>
  );
}

function InstructionBanner({ onClose }) {
  return (
    <div className="instruction">
      <div className="instruction__icon"><Info size={18} /></div>
      <div className="instruction__text">
        <strong>How to connect your MT5 account:</strong>
        <span> Open MetaTrader 5 → Go to your chart → Attach the <strong>IBL EA (LiveDataV2)</strong> → Set your server URL → Enable AutoTrading. Your live data will appear here automatically.</span>
      </div>
      <button className="instruction__close" onClick={onClose}><X size={16} /></button>
    </div>
  );
}

function AccountCard({ acc, selected, onClick }) {
  const profit = acc.Profit_Per >= 0;
  return (
    <div className={`acc-card ${selected ? "acc-card--active" : ""}`} onClick={onClick}>
      <div className="acc-card__top">
        <div className="acc-card__avatar">{acc.Account_Name[0]}</div>
        <div className="acc-card__info">
          <span className="acc-card__name">{acc.Account_Name}</span>
          <span className="acc-card__num">#{acc.Account_Number}</span>
        </div>
        <div className={`acc-card__status ${acc.active ? "online" : "offline"}`}>
          {acc.active ? "● Live" : "○ Off"}
        </div>
      </div>
      <div className="acc-card__bottom">
        <span className="acc-card__bal">{fmt(acc.Account_Balance)}</span>
        <span className={profit ? "pos" : "neg"}>{profit ? "▲" : "▼"} {fmt(Math.abs(acc.Profit_Per))}</span>
      </div>
    </div>
  );
}

export default function App() {
  const [accounts, setAccounts] = useState(ACCOUNTS);
  const [selectedId, setSelectedId] = useState(1);
  const [view, setView] = useState("admin");
  const [tab, setTab] = useState("overview");
  const [time, setTime] = useState(new Date());
  const [showInstruction, setShowInstruction] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const acc = accounts.find(a => a.id === selectedId);
  const isProfit = acc.Profit_Per >= 0;
  const isFloating = acc.Floating_Profits >= 0;

  const toggleActive = (id) => setAccounts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  const toggleAlert = (id) => setAccounts(prev => prev.map(a => a.id === id ? { ...a, alert: !a.alert } : a));

  const visibleAccounts = view === "admin" ? accounts : accounts.filter(a => a.id === 1);

  return (
    <div className="app">
      <header className="header">
        <div className="header__left">
          <button className="burger" onClick={() => setSidebarOpen(o => !o)}><Menu size={20} /></button>
          <div className="header__dot" />
          <span className="header__title">IBL <span>TRADING DASHBOARD</span></span>
        </div>
        <div className="header__center">
          <button className={`view-btn ${view === "admin" ? "view-btn--active" : ""}`} onClick={() => setView("admin")}>
            <Users size={14} /> Admin
          </button>
          <button className={`view-btn ${view === "client" ? "view-btn--active" : ""}`} onClick={() => setView("client")}>
            <User size={14} /> Client
          </button>
        </div>
        <div className="header__right">
          <span className="header__clock">{time.toUTCString().slice(0, 25)}</span>
          <span className="header__live">● LIVE</span>
        </div>
      </header>

      {showInstruction && <InstructionBanner onClose={() => setShowInstruction(false)} />}

      <div className="layout">
        {sidebarOpen && (
          <aside className="sidebar">
            <div className="sidebar__header">
              {view === "admin" ? `All Accounts (${accounts.length})` : "My Account"}
            </div>
            {visibleAccounts.map(a => (
              <AccountCard key={a.id} acc={a} selected={selectedId === a.id}
                onClick={() => { setSelectedId(a.id); setTab("overview"); }} />
            ))}
            {view === "admin" && (
              <div className="sidebar__summary">
                <div className="sidebar__summary-row"><span>Total Accounts</span><strong>{accounts.length}</strong></div>
                <div className="sidebar__summary-row"><span>Live</span><strong className="pos">{accounts.filter(a => a.active).length}</strong></div>
                <div className="sidebar__summary-row"><span>Offline</span><strong className="neg">{accounts.filter(a => !a.active).length}</strong></div>
                <div className="sidebar__summary-row"><span>Total Equity</span><strong>{fmt(accounts.reduce((s, a) => s + a.Account_Equity, 0))}</strong></div>
              </div>
            )}
          </aside>
        )}

        <main className="main">
          <div className="acc-header">
            <div className="acc-header__info">
              <div className="acc-header__avatar">{acc.Account_Name[0]}</div>
              <div>
                <div className="acc-header__name">{acc.Account_Name}</div>
                <div className="acc-header__num">Account #{acc.Account_Number} · Since {acc.StartTime}</div>
              </div>
            </div>
            <div className="acc-header__actions">
              <button className={`action-btn ${acc.active ? "action-btn--green" : "action-btn--red"}`} onClick={() => toggleActive(acc.id)}>
                {acc.active ? <Power size={15} /> : <PowerOff size={15} />}
                {acc.active ? "EA Active" : "EA Off"}
              </button>
              <button className={`action-btn ${acc.alert ? "action-btn--gold" : "action-btn--dim"}`} onClick={() => toggleAlert(acc.id)}>
                {acc.alert ? <Bell size={15} /> : <BellOff size={15} />}
                {acc.alert ? "Alerts On" : "Alerts Off"}
              </button>
            </div>
          </div>

          <div className="banner">
            <div className="banner__stat"><span>Balance</span><strong>{fmt(acc.Account_Balance)}</strong></div>
            <div className="banner__divider" />
            <div className="banner__stat"><span>Equity</span><strong>{fmt(acc.Account_Equity)}</strong></div>
            <div className="banner__divider" />
            <div className="banner__stat"><span>Margin Level</span><strong className="pos">{pct(acc.Margin_Level)}</strong></div>
            <div className="banner__divider" />
            <div className="banner__stat"><span>Drawdown</span><strong className="neg">{pct(acc.Drawdown)}</strong></div>
            <div className="banner__divider" />
            <div className="banner__stat"><span>Open Positions</span><strong>{acc.Open_Positions}</strong></div>
            <div className="banner__divider" />
            <div className="banner__stat"><span>Pending Orders</span><strong>{acc.Pending_Orders}</strong></div>
          </div>

          <nav className="tabs">
            {["overview", "performance", "positions"].map(t => (
              <button key={t} className={`tab ${tab === t ? "tab--active" : ""}`} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </nav>

          {tab === "overview" && (
            <div className="content">
              <div className="grid-4">
                <StatCard label="Today's Profit" value={fmt(acc.Profit_Per)} icon={isProfit ? TrendingUp : TrendingDown} color={isProfit ? "green" : "red"} positive={isProfit} sub={isProfit ? "▲ Profitable day" : "▼ Loss day"} />
                <StatCard label="Total Profit" value={fmt(acc.Profit_Amt)} icon={DollarSign} color={acc.Profit_Amt >= 0 ? "blue" : "red"} positive={acc.Profit_Amt >= 0} sub={`Since ${acc.StartTime}`} />
                <StatCard label="Floating P/L" value={fmt(acc.Floating_Profits)} icon={Activity} color={isFloating ? "green" : "red"} positive={isFloating} sub="Open trade exposure" />
                <StatCard label="Last Week" value={fmt(acc.Last_Week_Profit)} icon={BarChart2} color={acc.Last_Week_Profit >= 0 ? "gold" : "red"} positive={acc.Last_Week_Profit >= 0} sub="Weekly result" />
              </div>
              <div className="grid-2">
                <div className="panel">
                  <div className="panel__header">Equity Curve</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={acc.equity_curve}>
                      <defs>
                        <linearGradient id="eq" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#0d2035" />
                      <XAxis dataKey="time" stroke="#4a6a80" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#4a6a80" tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: "#0a1520", border: "1px solid #0d2035", borderRadius: 8 }} />
                      <Area type="monotone" dataKey="equity" stroke="#00e5ff" fill="url(#eq)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="panel">
                  <div className="panel__header">Weekly Profit Breakdown</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={acc.weekly}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#0d2035" />
                      <XAxis dataKey="day" stroke="#4a6a80" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#4a6a80" tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: "#0a1520", border: "1px solid #0d2035", borderRadius: 8 }} />
                      <Bar dataKey="profit" radius={[4, 4, 0, 0]} fill="#00ff88" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="grid-2">
                <div className="panel">
                  <div className="panel__header">Account Summary</div>
                  <table className="table">
                    <tbody>
                      <tr><td>Total Deposit</td><td className="pos">{fmt(acc.Deposit)}</td></tr>
                      <tr><td>Total Withdrawal</td><td className="neg">{fmt(acc.Withdraw)}</td></tr>
                      <tr><td>Net Profit</td><td className={acc.Profit_Amt >= 0 ? "pos" : "neg"}>{fmt(acc.Profit_Amt)}</td></tr>
                      <tr><td>Max Drawdown</td><td className="neg">{pct(acc.Drawdown)}</td></tr>
                      <tr><td>Margin Level</td><td className="pos">{pct(acc.Margin_Level)}</td></tr>
                      <tr><td>EA Status</td><td className={acc.active ? "pos" : "neg"}>{acc.active ? "● Active" : "○ Inactive"}</td></tr>
                      <tr><td>Alerts</td><td className={acc.alert ? "pos" : "dim"}>{acc.alert ? "● Enabled" : "○ Disabled"}</td></tr>
                      <tr><td>Trading Since</td><td>{acc.StartTime}</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="panel">
                  <div className="panel__header">Live Position Snapshot</div>
                  <div className="snapshot">
                    <div className="snapshot__symbol">{acc.Highest_Position_Symbol}</div>
                    <div className={`snapshot__signal ${acc.Highest_Position_Signal === "Buy" ? "pos" : "neg"}`}>
                      {acc.Highest_Position_Signal === "Buy" ? "▲" : "▼"} {acc.Highest_Position_Signal}
                    </div>
                    <div className="snapshot__row"><span>Lot Size</span><strong>{acc.Highest_Position_Lot_Size}</strong></div>
                    <div className="snapshot__row"><span>Open Time</span><strong>{acc.ORDER_OPEN_TIME}</strong></div>
                    <div className="snapshot__row"><span>Open Positions</span><strong>{acc.Open_Positions}</strong></div>
                    <div className="snapshot__row"><span>Pending Orders</span><strong>{acc.Pending_Orders}</strong></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "performance" && (
            <div className="content">
              <div className="panel">
                <div className="panel__header">Full Equity Performance — {acc.Account_Name}</div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={acc.equity_curve}>
                    <defs>
                      <linearGradient id="eq2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#0d2035" />
                    <XAxis dataKey="time" stroke="#4a6a80" />
                    <YAxis stroke="#4a6a80" />
                    <Tooltip contentStyle={{ background: "#0a1520", border: "1px solid #0d2035", borderRadius: 8 }} />
                    <Area type="monotone" dataKey="equity" stroke="#00ff88" fill="url(#eq2)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="grid-4">
                <StatCard label="Total Return" value={pct(((acc.Profit_Amt / acc.Deposit) * 100))} icon={TrendingUp} color={acc.Profit_Amt >= 0 ? "green" : "red"} positive={acc.Profit_Amt >= 0} />
                <StatCard label="Max Drawdown" value={pct(acc.Drawdown)} icon={AlertTriangle} color="red" positive={false} />
                <StatCard label="Last Week" value={fmt(acc.Last_Week_Profit)} icon={BarChart2} color={acc.Last_Week_Profit >= 0 ? "gold" : "red"} positive={acc.Last_Week_Profit >= 0} />
                <StatCard label="Margin Safety" value={pct(acc.Margin_Level)} icon={Shield} color="blue" positive={true} />
              </div>
            </div>
          )}

          {tab === "positions" && (
            <div className="content">
              <div className="panel">
                <div className="panel__header">Active Positions — {acc.Account_Name}</div>
                <table className="table table--full">
                  <thead>
                    <tr><th>Symbol</th><th>Signal</th><th>Lot Size</th><th>Open Time</th><th>Floating P/L</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>{acc.Highest_Position_Symbol}</strong></td>
                      <td><span className={acc.Highest_Position_Signal === "Buy" ? "pos" : "neg"}>{acc.Highest_Position_Signal}</span></td>
                      <td>{acc.Highest_Position_Lot_Size}</td>
                      <td>{acc.ORDER_OPEN_TIME}</td>
                      <td className={acc.Floating_Profits >= 0 ? "pos" : "neg"}>{fmt(acc.Floating_Profits)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="panel">
                <div className="panel__header">Pending Orders ({acc.Pending_Orders})</div>
                <table className="table table--full">
                  <thead>
                    <tr><th>Symbol</th><th>Type</th><th>Lot Size</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: acc.Pending_Orders }).map((_, i) => (
                      <tr key={i}>
                        <td><strong>{["GBPUSD", "NAS100", "ETHUSD"][i] || "USDJPY"}</strong></td>
                        <td>{["Buy Limit", "Sell Stop", "Buy Stop"][i] || "Sell Limit"}</td>
                        <td>0.{(i + 1) * 10}</td>
                        <td><span className="badge">Pending</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className="footer">
        Data harnessed by <strong>IBL EA (LiveDataV2)</strong> · Attach EA to your MT5 chart to stream live data · Mock Mode — Real API active on deployment
      </footer>
    </div>
  );
}