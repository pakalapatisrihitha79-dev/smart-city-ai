import React, { useState, useEffect } from "react";
import { useCity } from "../context/CityContext";
import {
  User,
  Lock,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Car,
  Bell,
  X,
  Check,
  LogOut,
  Save,
  ShieldCheck,
  Award,
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    login,
    register,
    logout,
    updateProfile,
    allZones,
    primaryAreaId,
    setPrimaryAreaId,
  } = useCity();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [occupation, setOccupation] = useState("Resident Citizen");
  const [city, setCity] = useState("NovaCity");
  const [district, setDistrict] = useState("Central District");
  const [preferredArea, setPreferredArea] = useState<string>(primaryAreaId);
  const [preferredTransport, setPreferredTransport] = useState("Public Transit / Metro");
  const [bio, setBio] = useState("");

  const [notificationPrefs, setNotificationPrefs] = useState({
    traffic: true,
    weather: true,
    pollution: true,
    water: true,
    electricity: true,
    civic: true,
    emergency: true,
  });

  // Populate local form state when currentUser changes or modal opens
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setEmail(currentUser.email || "");
      setPhone(currentUser.phone || "");
      setOccupation(currentUser.occupation || "Resident Citizen");
      setCity(currentUser.city || "NovaCity");
      setDistrict(currentUser.district || "Central District");
      setPreferredArea(currentUser.preferredArea || primaryAreaId);
      setPreferredTransport(currentUser.preferredTransport || "Public Transit / Metro");
      setBio(currentUser.bio || "");
      if (currentUser.notificationPrefs) {
        setNotificationPrefs(currentUser.notificationPrefs);
      }
    } else {
      setEmail("");
      setPassword("");
      setName("");
      setPhone("");
    }
  }, [currentUser, isOpen, primaryAreaId]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    if (isRegisterMode) {
      register(
        {
          name: name.trim() || email.split("@")[0],
          email: email.trim(),
          phone: phone.trim(),
          occupation,
          city: city.trim() || "NovaCity",
          district: district.trim(),
          preferredArea,
          preferredTransport,
          bio,
          notificationPrefs,
        },
        email.trim(),
        preferredArea
      );
    } else {
      login(email.trim(), password.trim());
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    updateProfile({
      name: name.trim() || currentUser.name,
      email: email.trim() || currentUser.email,
      phone: phone.trim(),
      occupation,
      city: city.trim() || "NovaCity",
      district: district.trim(),
      preferredArea,
      preferredTransport,
      bio,
      notificationPrefs,
    });

    if (preferredArea !== primaryAreaId) {
      setPrimaryAreaId(preferredArea);
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md text-xs">
      <div className="bg-[#0D1117] border border-slate-800 w-full max-w-lg rounded-2xl p-5 shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-teal-500/10 border border-teal-500/30 rounded-lg">
              <User className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <span className="font-extrabold text-white text-sm block uppercase tracking-wider">
                {currentUser ? "CITIZEN PROFILE & PREFERENCES" : isRegisterMode ? "CREATE CITYMIND ACCOUNT" : "SIGN IN WITH EMAIL"}
              </span>
              <span className="text-[10px] text-slate-400">
                {currentUser ? "Manage your account details and alerts" : "Access live city telemetry and AI features"}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Saved Toast Banner */}
        {saveSuccess && (
          <div className="my-2 p-2.5 bg-teal-500/20 border border-teal-500/40 rounded-xl text-teal-300 font-bold flex items-center gap-2 text-xs">
            <Check className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Profile details saved and synchronized successfully!</span>
          </div>
        )}

        {/* Body Content */}
        <div className="overflow-y-auto py-3 space-y-4 pr-1">
          {currentUser ? (
            /* Logged In - Edit Profile Form */
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              {/* Account Stats Header */}
              <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 font-black text-sm">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm block">{currentUser.name}</span>
                    <span className="text-slate-400 text-[11px] font-mono">{currentUser.email}</span>
                  </div>
                </div>

                <div className="bg-teal-950/60 border border-teal-500/30 px-3 py-1.5 rounded-xl text-right">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-teal-400">
                    <Award className="w-3 h-3 text-teal-400" />
                    <span>GREEN SCORE</span>
                  </div>
                  <span className="text-xs font-black text-teal-200">{currentUser.greenCitizenScore} PTS</span>
                </div>
              </div>

              {/* Personal Details Section */}
              <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                <h4 className="text-[11px] font-extrabold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>Personal Citizen Details</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">FULL NAME *</label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">EMAIL ADDRESS *</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">PHONE NUMBER</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-1234"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">ROLE / OCCUPATION</label>
                    <div className="relative">
                      <Briefcase className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                      <input
                        type="text"
                        placeholder="e.g. Urban Planner, Student, Engineer"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500 text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">CITY / REGION</label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                      <input
                        type="text"
                        placeholder="e.g. Hyderabad / NovaCity"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">PRIMARY MONITORED ZONE</label>
                    <select
                      value={preferredArea}
                      onChange={(e) => setPreferredArea(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500 text-xs"
                    >
                      {allZones.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.name} ({z.type})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">PREFERRED COMMUTE MODE</label>
                  <div className="relative">
                    <Car className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                    <select
                      value={preferredTransport}
                      onChange={(e) => setPreferredTransport(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500 text-xs"
                    >
                      <option value="Public Transit / Metro">Metro & Public Transit</option>
                      <option value="Electric Vehicle (EV)">Electric Vehicle (EV)</option>
                      <option value="Walking & Cycling">Walking & Active Mobility</option>
                      <option value="Personal Gasoline Vehicle">Personal Automobile</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notification Preferences Section */}
              <div className="space-y-2 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                <h4 className="text-[11px] font-extrabold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-teal-400" />
                  <span>Notification & Telemetry Subscriptions</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                  {[
                    { key: "traffic", label: "Traffic Alerts" },
                    { key: "pollution", label: "AQI & Pollution" },
                    { key: "weather", label: "Heavy Rain / Flood" },
                    { key: "water", label: "Water Grid Anomaly" },
                    { key: "electricity", label: "Power Surge Alerts" },
                    { key: "civic", label: "Civic Issue Updates" },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center gap-2 p-2 bg-slate-900/80 rounded-lg border border-slate-800 cursor-pointer hover:bg-slate-800/80 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={(notificationPrefs as any)[item.key]}
                        onChange={(e) =>
                          setNotificationPrefs((prev) => ({
                            ...prev,
                            [item.key]: e.target.checked,
                          }))
                        }
                        className="rounded bg-slate-800 border-slate-700 text-teal-500 focus:ring-0"
                      />
                      <span className="text-[11px] font-medium text-slate-300">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 hover:bg-teal-500 text-white font-bold py-2.5 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <Save className="w-4 h-4 text-teal-200" />
                  <span>SAVE CITIZEN DETAILS</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/80 font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  title="Sign out of your account"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">SIGN OUT</span>
                </button>
              </div>
            </form>
          ) : (
            /* Login / Register Form */
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              {isRegisterMode && (
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">FULL NAME *</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Chen"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500 text-xs"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">EMAIL ADDRESS *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">PASSWORD *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500 text-xs"
                  />
                </div>
              </div>

              {isRegisterMode && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">PHONE NUMBER</label>
                      <input
                        type="tel"
                        placeholder="+1 555-0192"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">ROLE / OCCUPATION</label>
                      <input
                        type="text"
                        placeholder="Resident Citizen"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">PRIMARY CITY ZONE</label>
                    <select
                      value={preferredArea}
                      onChange={(e) => setPreferredArea(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500 text-xs"
                    >
                      {allZones.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.name} ({z.type})
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-2.5 rounded-xl shadow-lg transition-colors mt-2 uppercase tracking-wider text-xs"
              >
                {isRegisterMode ? "REGISTER CITIZEN ACCOUNT" : "SIGN IN WITH EMAIL"}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(!isRegisterMode)}
                  className="text-teal-400 hover:underline text-[11px] font-semibold"
                >
                  {isRegisterMode ? "Already registered? Sign In with Email" : "New to CityMind? Register Account"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

