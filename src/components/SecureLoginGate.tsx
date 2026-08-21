import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Key,
  ShieldAlert,
  Fingerprint,
  Radio,
  FileCheck,
  UserPlus,
  Compass,
  Phone,
  Briefcase,
  MapPin,
  HelpCircle,
} from "lucide-react";

export const SecureLoginGate: React.FC = () => {
  const {
    login,
    registerAuthorizedUser,
    authorizedRegistry,
    allZones,
  } = useCity();

  const [mode, setMode] = useState<"login" | "register" | "directory">("login");
  const [emailInput, setEmailInput] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attemptedUnauthorizedEmail, setAttemptedUnauthorizedEmail] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Registration Form State
  const [regName, setRegName] = useState<string>("");
  const [regEmail, setRegEmail] = useState<string>("");
  const [regRole, setRegRole] = useState<"citizen" | "authority">("citizen");
  const [regAuthLevel, setRegAuthLevel] = useState<
    "Lead Administrator" | "Municipal Authority" | "Urban Planner" | "Verified Resident"
  >("Verified Resident");
  const [regDepartment, setRegDepartment] = useState<string>("Urban Planning & Resident Services");
  const [regArea, setRegArea] = useState<string>("Central District");
  const [regPhone, setRegPhone] = useState<string>("");
  const [regOccupation, setRegOccupation] = useState<string>("Resident Citizen");
  const [regSuccessMessage, setRegSuccessMessage] = useState<string | null>(null);

  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = emailInput.trim();
    if (!cleanEmail) {
      setErrorMessage("Please enter a valid registered email ID.");
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);
    setAttemptedUnauthorizedEmail(null);

    setTimeout(() => {
      const res = login(cleanEmail);
      setIsVerifying(false);

      if (!res.success) {
        setErrorMessage(res.error || "Unauthorized or unregistered email ID.");
        setAttemptedUnauthorizedEmail(cleanEmail);
      }
    }, 450);
  };

  const handleQuickLogin = (email: string) => {
    setEmailInput(email);
    setIsVerifying(true);
    setErrorMessage(null);
    setAttemptedUnauthorizedEmail(null);

    setTimeout(() => {
      const res = login(email);
      setIsVerifying(false);
      if (!res.success) {
        setErrorMessage(res.error || "Unauthorized email ID.");
      }
    }, 300);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = regEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!regName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);

    setTimeout(() => {
      const res = registerAuthorizedUser({
        email: cleanEmail,
        name: regName.trim(),
        role: regRole,
        authorizationLevel:
          regRole === "authority"
            ? regAuthLevel === "Lead Administrator"
              ? "Lead Administrator"
              : "Municipal Authority"
            : "Verified Resident",
        department: regDepartment.trim() || (regRole === "authority" ? "Municipal Operations" : "Resident Community"),
        preferredArea: regArea,
        phone: regPhone.trim(),
        occupation: regOccupation.trim() || (regRole === "authority" ? "Municipal Officer" : "Resident Citizen"),
        status: "Active",
        registeredAt: new Date().toISOString(),
      });

      setIsVerifying(false);
      if (res.success) {
        setRegSuccessMessage(`Email "${cleanEmail}" successfully registered and authorized.`);
      } else {
        setErrorMessage(res.error || "Registration failed. Please verify your details.");
      }
    }, 400);
  };

  const startRegistrationForEmail = (email: string) => {
    setRegEmail(email);
    setRegName(email.split("@")[0].replace(/[._]/g, " "));
    setMode("register");
    setErrorMessage(null);
    setAttemptedUnauthorizedEmail(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#070A10] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-teal-500 selection:text-black">
      {/* Dynamic Background Mesh & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(20,184,166,0.18),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Header */}
      <header className="relative z-10 w-full border-b border-white/10 bg-[#0D1117]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.3)]">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white font-display uppercase">
                NovaCity <span className="text-teal-400 font-mono">OS</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-950 text-teal-300 border border-teal-500/40">
                v4.8 SECURE
              </span>
            </div>
            <p className="text-xs text-white/50 font-mono">
              Urban Intelligence & Digital Twin Command System
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <div className="px-3 py-1 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2 text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Zero-Trust Identity Protocol Active</span>
          </div>
        </div>
      </header>

      {/* Main Authentication Card Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-xl bg-[#0D1117]/95 border border-white/15 rounded-3xl shadow-2xl backdrop-blur-2xl p-6 sm:p-8 space-y-6">
          {/* Header & Mode Switcher */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold font-mono uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5" />
                <span>Authorized Access Gate</span>
              </div>
              <span className="text-[11px] font-mono text-white/40">
                {authorizedRegistry.length} Registered Accounts
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
              {mode === "login"
                ? "Enter Registered Email"
                : mode === "register"
                ? "Register New User ID"
                : "Authorized Accounts Directory"}
            </h2>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              {mode === "login"
                ? "NovaCity requires verified email authentication. Only registered and authorized emails can access, monitor, or manage city data."
                : mode === "register"
                ? "Register your email address to obtain immediate authorized credentials for NovaCity Digital Twin & municipal tools."
                : "Select an existing verified profile from the municipal directory for instant 1-click authorization."}
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-3 gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-white/10 text-xs font-bold">
            <button
              onClick={() => {
                setMode("login");
                setErrorMessage(null);
              }}
              className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mode === "login"
                  ? "bg-teal-500 text-black font-extrabold shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>

            <button
              onClick={() => {
                setMode("register");
                setErrorMessage(null);
              }}
              className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mode === "register"
                  ? "bg-teal-500 text-black font-extrabold shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>

            <button
              onClick={() => {
                setMode("directory");
                setErrorMessage(null);
              }}
              className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mode === "directory"
                  ? "bg-teal-500 text-black font-extrabold shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Directory</span>
            </button>
          </div>

          {/* MODE 1: LOGIN FORM */}
          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold text-teal-300 uppercase tracking-wider">
                  Registered Email Address <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="e.g. pakalapatisrihitha928@gmail.com"
                    autoFocus
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-black/60 border border-white/20 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 rounded-2xl text-sm font-medium text-white placeholder-white/30 transition-all outline-none"
                  />
                </div>
                <p className="text-[11px] text-white/40 font-mono">
                  Enter the email associated with your municipal authorization or resident ID.
                </p>
              </div>

              {/* Error / Unauthorized Alert Box */}
              {errorMessage && (
                <div className="p-4 bg-rose-950/60 border border-rose-500/50 rounded-2xl text-xs text-rose-200 space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-rose-300 uppercase font-mono tracking-wide">
                        Access Restricted: Unauthorized Email
                      </h4>
                      <p className="text-xs text-rose-200/90 leading-relaxed mt-1">
                        {errorMessage}
                      </p>
                    </div>
                  </div>

                  {attemptedUnauthorizedEmail && (
                    <div className="pt-2 border-t border-rose-500/30 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startRegistrationForEmail(attemptedUnauthorizedEmail)}
                        className="px-3 py-1.5 bg-rose-500 hover:bg-rose-400 text-black font-extrabold rounded-xl text-xs transition-all shadow-md"
                      >
                        Register "{attemptedUnauthorizedEmail}" Now
                      </button>
                      <button
                        type="button"
                        onClick={() => setMode("directory")}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-all"
                      >
                        View Authorized Accounts
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-black font-black text-sm uppercase tracking-wider rounded-2xl transition-all shadow-[0_0_25px_rgba(20,184,166,0.35)] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <Radio className="w-4 h-4 animate-spin" />
                    <span>Verifying Authorization Credentials...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize & Enter NovaCity</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick Preset Selector for Easy Testing */}
              <div className="pt-3 border-t border-white/10 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-white/50">
                  <span>Authorized Master Accounts:</span>
                  <button
                    type="button"
                    onClick={() => setMode("directory")}
                    className="text-teal-400 hover:underline font-bold"
                  >
                    View All ({authorizedRegistry.length})
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Primary Highlight Account */}
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("pakalapatisrihitha928@gmail.com")}
                    className="p-2.5 bg-teal-950/40 hover:bg-teal-900/60 border border-teal-500/40 hover:border-teal-400 rounded-xl text-left transition-all flex items-center gap-2.5 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold font-mono text-xs shrink-0 group-hover:scale-105 transition-transform">
                      SP
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-teal-300 truncate">
                        Srihitha Pakalapati
                      </div>
                      <div className="text-[10px] text-white/60 font-mono truncate">
                        pakalapatisrihitha928@gmail.com
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin("admin@novacity.gov")}
                    className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-left transition-all flex items-center gap-2.5 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold font-mono text-xs shrink-0 group-hover:scale-105 transition-transform">
                      MV
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-200 truncate">
                        Dr. Marcus Vance (Authority)
                      </div>
                      <div className="text-[10px] text-white/50 font-mono truncate">
                        admin@novacity.gov
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* MODE 2: REGISTRATION FORM */}
          {mode === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold text-teal-300 uppercase">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Srihitha Pakalapati"
                    required
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/20 focus:border-teal-400 rounded-xl text-sm font-medium text-white placeholder-white/30 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold text-teal-300 uppercase">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. yourname@domain.com"
                    required
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/20 focus:border-teal-400 rounded-xl text-sm font-medium text-white placeholder-white/30 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold text-teal-300 uppercase">
                    Account Role
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => {
                      const role = e.target.value as "citizen" | "authority";
                      setRegRole(role);
                      if (role === "authority") {
                        setRegAuthLevel("Municipal Authority");
                        setRegDepartment("City Operations Command");
                        setRegOccupation("Municipal Director");
                      } else {
                        setRegAuthLevel("Verified Resident");
                        setRegDepartment("Resident Community");
                        setRegOccupation("Resident Citizen");
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/20 focus:border-teal-400 rounded-xl text-sm font-medium text-white outline-none"
                  >
                    <option value="citizen">Resident Citizen (Civic & Life)</option>
                    <option value="authority">Municipal Authority (Command & Planning)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold text-teal-300 uppercase">
                    Assigned District / Zone
                  </label>
                  <select
                    value={regArea}
                    onChange={(e) => setRegArea(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/20 focus:border-teal-400 rounded-xl text-sm font-medium text-white outline-none"
                  >
                    {allZones.map((z) => (
                      <option key={z.id} value={z.name}>
                        {z.name} ({z.type})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold text-teal-300 uppercase">
                    Department / Organization
                  </label>
                  <input
                    type="text"
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    placeholder="e.g. Smart City Infrastructure"
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/20 focus:border-teal-400 rounded-xl text-sm font-medium text-white placeholder-white/30 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold text-teal-300 uppercase">
                    Phone Contact (Optional)
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/20 focus:border-teal-400 rounded-xl text-sm font-medium text-white placeholder-white/30 outline-none"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-950/60 border border-rose-500/50 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {regSuccessMessage && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{regSuccessMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-black font-black text-sm uppercase tracking-wider rounded-2xl transition-all shadow-[0_0_25px_rgba(20,184,166,0.35)] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register Email & Authorize Access</span>
              </button>
            </form>
          )}

          {/* MODE 3: DIRECTORY OF AUTHORIZED ACCOUNTS */}
          {mode === "directory" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>Verified Personnel Directory</span>
                <span className="font-mono text-teal-400">Click account to log in</span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1 no-scrollbar">
                {authorizedRegistry.map((item) => (
                  <div
                    key={item.email}
                    onClick={() => handleQuickLogin(item.email)}
                    className="p-3 bg-black/50 hover:bg-teal-950/30 border border-white/10 hover:border-teal-500/50 rounded-2xl transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                          item.role === "authority"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            : "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                        }`}
                      >
                        {item.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white group-hover:text-teal-300 transition-colors">
                            {item.name}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
                              item.role === "authority"
                                ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                                : "bg-teal-950 text-teal-300 border border-teal-500/40"
                            }`}
                          >
                            {item.authorizationLevel}
                          </span>
                        </div>
                        <div className="text-xs text-white/50 font-mono">
                          {item.email}
                        </div>
                        <div className="text-[10px] text-white/40">
                          {item.department} • {item.preferredArea}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl bg-white/5 group-hover:bg-teal-500 group-hover:text-black text-white/70 font-bold text-xs font-mono uppercase tracking-wider transition-all"
                    >
                      Authorize &rarr;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Guarantee Footnote */}
          <div className="pt-4 border-t border-white/10 flex items-start gap-2.5 text-[11px] text-white/50 leading-relaxed font-mono">
            <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <p>
              <strong>Security Protocol Notice:</strong> Unauthorized or unregistered email IDs are blocked from making civic reports, altering digital twin parameters, simulating budget distributions, or accessing municipal records.
            </p>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="relative z-10 w-full text-center py-4 text-xs text-white/40 font-mono border-t border-white/5">
        NovaCity Digital Twin & AI Intelligence Grid • Powered by Municipal AI Engine
      </footer>
    </div>
  );
};
