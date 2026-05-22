import React, { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "biogen-sertao-pro-v11-state";
const THEME_KEY = "biogen-sertao-pro-v11-theme";
const SESSION_KEY = "biogen-sertao-pro-v11-session";
const ACCOUNTS_KEY = "biogen-sertao-pro-v11-accounts";
const CHAT_KEY = "biogen-sertao-pro-v11-chat";
const ANALYSIS_HISTORY_KEY = "biogen-sertao-pro-v15-analysis-history";

const speciesMeta = {
  Bovino: { short: "BOV", tone: "bovine", label: "Bovinos" },
  Ovino: { short: "OVI", tone: "ovine", label: "Ovinos" },
  Caprino: { short: "CAP", tone: "caprine", label: "Caprinos" },
};

const initialProfile = {
  userName: "Kevin Ezequiel",
  accessLevel: "Equipe técnica",
  property: "Sítio Lagoa Verde",
  city: "Crateús, CE",
  technician: "Responsável técnico",
  producer: "Produtor familiar",
  propertyCode: "BIO-CE-63700-014",
  productionFocus: "Leite, corte e reprodução adaptada ao semiárido",
};

const initialChat = [
  {
    role: "assistant",
    text: "Sou o assistente técnico do BioGen Sertão. Analiso currais, cadastros, fotos, relatórios e cruzamentos com um motor local de apoio à decisão reprodutiva.",
    time: "agora"
  }
];

const initialPens = [
  {
    id: "curral-bovino-a",
    code: "A",
    name: "Curral A",
    category: "Bovino",
    type: "Matrizes e reprodutores bovinos",
    capacity: 22,
    area: "18 x 24 m",
    humidity: 42,
    sanitation: 91,
    status: "Protocolo reprodutivo ativo",
    risk: "Baixo",
    x: 6,
    y: 10,
    w: 42,
    h: 36,
    note: "Setor principal para bovinos em avaliação genética e inseminação.",
  },
  {
    id: "aprisco-caprino-b",
    code: "B",
    name: "Aprisco B",
    category: "Caprino",
    type: "Caprinos leiteiros",
    capacity: 28,
    area: "12 x 18 m",
    humidity: 36,
    sanitation: 84,
    status: "Checagem corporal recomendada",
    risk: "Médio",
    x: 54,
    y: 10,
    w: 39,
    h: 30,
    note: "Aprisco elevado para matrizes caprinas e controle de cobertura.",
  },
  {
    id: "cercado-ovino-c",
    code: "C",
    name: "Cercado C",
    category: "Ovino",
    type: "Ovinos de corte e reprodução",
    capacity: 30,
    area: "14 x 20 m",
    humidity: 39,
    sanitation: 88,
    status: "Ultrassom de confirmação agendado",
    risk: "Baixo",
    x: 54,
    y: 49,
    w: 39,
    h: 36,
    note: "Cercado para o lote ovino com acompanhamento de prenhez.",
  },
  {
    id: "baia-tecnica-d",
    code: "D",
    name: "Baia Técnica",
    category: "Misto",
    type: "Observação, triagem e quarentena",
    capacity: 8,
    area: "8 x 10 m",
    humidity: 47,
    sanitation: 74,
    status: "Animais com alerta técnico",
    risk: "Alto",
    x: 6,
    y: 55,
    w: 42,
    h: 30,
    note: "Área para animais com dados incompletos, risco sanitário ou avaliação pendente.",
  },
];

const initialAnimals = [
  {
    id: "BOV-184",
    name: "Aurora 184",
    species: "Bovino",
    sex: "Fêmea",
    role: "Matriz",
    breed: "Girolando 3/4",
    lineage: "Linha Leite Sertão A",
    penId: "curral-bovino-a",
    ageMonths: 48,
    weight: 506,
    geneticIndex: 88,
    fertility: 91,
    pregnancyRate: 86,
    productivity: 92,
    heatTolerance: 84,
    health: 94,
    bodyScore: 4.0,
    inbreedingBase: 4,
    dataQuality: 94,
    lastInsemination: "2026-04-28",
    status: "Janela fértil em 6 dias",
    outcomes: [1, 1, 0, 1, 1],
    missingData: [],
    records: ["2 prenhezes confirmadas", "produção média: 17,8 L/dia", "sem histórico de distocia"],
    photo: "",
  },
  {
    id: "BOV-227",
    name: "Serena 227",
    species: "Bovino",
    sex: "Fêmea",
    role: "Matriz",
    breed: "Sindi x Holandês",
    lineage: "Linha Leite Sertão B",
    penId: "curral-bovino-a",
    ageMonths: 39,
    weight: 462,
    geneticIndex: 82,
    fertility: 84,
    pregnancyRate: 79,
    productivity: 88,
    heatTolerance: 91,
    health: 89,
    bodyScore: 3.5,
    inbreedingBase: 5,
    dataQuality: 86,
    lastInsemination: "2026-05-12",
    status: "Acompanhar retorno ao cio",
    outcomes: [1, 0, 1, 1],
    missingData: [],
    records: ["1 prenhez confirmada", "boa adaptação ao calor", "queda leve de consumo em estiagem"],
    photo: "",
  },
  {
    id: "BOV-301",
    name: "Atlas 301",
    species: "Bovino",
    sex: "Macho",
    role: "Reprodutor",
    breed: "Nelore PO",
    lineage: "Linha Corte Norte",
    penId: "curral-bovino-a",
    ageMonths: 42,
    weight: 684,
    geneticIndex: 91,
    fertility: 88,
    pregnancyRate: 83,
    productivity: 86,
    heatTolerance: 93,
    health: 92,
    bodyScore: 4.2,
    inbreedingBase: 3,
    dataQuality: 91,
    lastInsemination: "",
    status: "Reprodutor apto",
    outcomes: [1, 1, 1, 0, 1, 1],
    missingData: [],
    records: ["alta rusticidade", "ganho médio de descendentes: 0,91 kg/dia", "linhagem sem parentesco crítico"],
    photo: "",
  },
  {
    id: "BOV-355",
    name: "Nordeste 355",
    species: "Bovino",
    sex: "Macho",
    role: "Reprodutor",
    breed: "Gir Leiteiro",
    lineage: "Linha Leite Sertão A",
    penId: "baia-tecnica-d",
    ageMonths: 55,
    weight: 642,
    geneticIndex: 85,
    fertility: 79,
    pregnancyRate: 74,
    productivity: 93,
    heatTolerance: 88,
    health: 86,
    bodyScore: 3.4,
    inbreedingBase: 7,
    dataQuality: 88,
    lastInsemination: "",
    status: "Evitar matrizes da mesma linha",
    outcomes: [1, 0, 0, 1, 0],
    missingData: [],
    records: ["alto potencial leiteiro", "fertilidade abaixo do lote", "parentesco recorrente com Linha A"],
    photo: "",
  },
  {
    id: "CAP-041",
    name: "Dália 041",
    species: "Caprino",
    sex: "Fêmea",
    role: "Matriz",
    breed: "Saanen",
    lineage: "Cabra Leite A",
    penId: "aprisco-caprino-b",
    ageMonths: 28,
    weight: 54,
    geneticIndex: 81,
    fertility: 86,
    pregnancyRate: 78,
    productivity: 89,
    heatTolerance: 76,
    health: 90,
    bodyScore: 3.1,
    inbreedingBase: 6,
    dataQuality: 81,
    lastInsemination: "2026-05-03",
    status: "Apta para protocolo",
    outcomes: [1, 1, 0, 1],
    missingData: [],
    records: ["linhagem leiteira", "boa produção", "exige controle térmico"],
    photo: "",
  },
  {
    id: "CAP-078",
    name: "Mandacaru 078",
    species: "Caprino",
    sex: "Macho",
    role: "Reprodutor",
    breed: "Boer",
    lineage: "Carne Semiárido",
    penId: "aprisco-caprino-b",
    ageMonths: 31,
    weight: 82,
    geneticIndex: 87,
    fertility: 83,
    pregnancyRate: 76,
    productivity: 86,
    heatTolerance: 89,
    health: 87,
    bodyScore: 3.8,
    inbreedingBase: 3,
    dataQuality: 84,
    lastInsemination: "",
    status: "Reprodutor apto",
    outcomes: [1, 1, 1, 0],
    missingData: ["exame andrológico atualizado"],
    records: ["boa conversão alimentar", "sem parentesco no lote caprino"],
    photo: "",
  },
  {
    id: "OVI-112",
    name: "Caatinga 112",
    species: "Ovino",
    sex: "Fêmea",
    role: "Matriz",
    breed: "Santa Inês",
    lineage: "Ovino Corte A",
    penId: "cercado-ovino-c",
    ageMonths: 34,
    weight: 62,
    geneticIndex: 79,
    fertility: 82,
    pregnancyRate: 75,
    productivity: 82,
    heatTolerance: 92,
    health: 88,
    bodyScore: 3.3,
    inbreedingBase: 4,
    dataQuality: 77,
    lastInsemination: "2026-04-17",
    status: "Aguardando confirmação",
    outcomes: [1, 0, 1],
    missingData: ["genealogia da avó materna"],
    records: ["alta rusticidade", "bom desempenho em estiagem"],
    photo: "",
  },
  {
    id: "OVI-190",
    name: "Cariri 190",
    species: "Ovino",
    sex: "Macho",
    role: "Reprodutor",
    breed: "Dorper",
    lineage: "Ovino Corte B",
    penId: "cercado-ovino-c",
    ageMonths: 27,
    weight: 76,
    geneticIndex: 90,
    fertility: 86,
    pregnancyRate: 81,
    productivity: 91,
    heatTolerance: 82,
    health: 91,
    bodyScore: 4.1,
    inbreedingBase: 3,
    dataQuality: 89,
    lastInsemination: "",
    status: "Reprodutor prioritário",
    outcomes: [1, 1, 1, 1, 0],
    missingData: [],
    records: ["descendentes com bom ganho de peso", "risco genético baixo"],
    photo: "",
  },
];

function clamp(n, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(n)));
}

function getHistoricalRate(animal) {
  if (!animal.outcomes?.length) return animal.pregnancyRate || 70;
  return Math.round((animal.outcomes.filter(Boolean).length / animal.outcomes.length) * 100);
}

function compatibilityEngine(female, male) {
  if (!female || !male) return null;
  if (female.species !== male.species) {
    return {
      score: 0,
      confidence: 0,
      decision: "Bloqueado",
      tone: "danger",
      pregnancyForecast: 0,
      inbreedingRisk: 100,
      economicImpact: 0,
      offspring: null,
      reasons: ["Espécies diferentes não podem ser combinadas no protocolo de inseminação."],
    };
  }

  const historyFemale = getHistoricalRate(female);
  const historyMale = getHistoricalRate(male);
  const sameLineage = female.lineage === male.lineage;
  const missingPenalty = ((female.missingData?.length || 0) + (male.missingData?.length || 0)) * 4;
  const inbreedingRisk = clamp((female.inbreedingBase + male.inbreedingBase) * 4 + (sameLineage ? 34 : 0) + missingPenalty, 0, 98);
  const dataConfidence = clamp((female.dataQuality + male.dataQuality) / 2 - missingPenalty - (sameLineage ? 7 : 0), 35, 98);
  const adaptiveHistory = (historyFemale * 0.16 + historyMale * 0.14);
  const reproductiveCore = female.fertility * 0.18 + male.fertility * 0.14 + adaptiveHistory;
  const geneticCore = female.geneticIndex * 0.12 + male.geneticIndex * 0.12;
  const adaptationCore = female.heatTolerance * 0.07 + male.heatTolerance * 0.07 + female.health * 0.06 + male.health * 0.05;
  const productivityCore = female.productivity * 0.06 + male.productivity * 0.06;
  const rawScore = reproductiveCore + geneticCore + adaptationCore + productivityCore - inbreedingRisk * 0.32;
  const score = clamp(rawScore, 0, 99);
  const pregnancyForecast = clamp((female.pregnancyRate * 0.36 + male.pregnancyRate * 0.24 + score * 0.30 + dataConfidence * 0.10) - inbreedingRisk * 0.13, 0, 97);
  const economicImpact = Math.max(0, Math.round((pregnancyForecast - 62) * 42 + (score - 70) * 28));

  let decision = "Recomendado";
  let tone = "success";
  if (score < 45 || inbreedingRisk > 72) { decision = "Não recomendado"; tone = "danger"; }
  else if (score < 70 || dataConfidence < 70 || inbreedingRisk > 48) { decision = "Revisar com técnico"; tone = "warning"; }
  else if (score >= 86 && pregnancyForecast >= 82) { decision = "Prioritário"; tone = "success"; }

  const reasons = [];
  if (sameLineage) reasons.push("Há repetição de linhagem. O sistema elevou o risco de consanguinidade e reduziu a recomendação.");
  if (dataConfidence < 75) reasons.push("A confiança foi reduzida por lacunas cadastrais ou qualidade insuficiente dos dados.");
  if (pregnancyForecast >= 82) reasons.push("Histórico reprodutivo e fertilidade indicam alta chance de prenhez.");
  if (female.heatTolerance + male.heatTolerance > 175) reasons.push("O cruzamento mantém boa adaptação ao calor, fator crítico para o semiárido.");
  if (economicImpact > 500) reasons.push("A combinação tem potencial de reduzir perdas por falha reprodutiva e melhorar retorno do lote.");
  if (!reasons.length) reasons.push("Combinação tecnicamente possível, mas sem vantagem expressiva frente a outras opções do lote.");

  const offspring = {
    geneticIndex: clamp((female.geneticIndex + male.geneticIndex) / 2 + (sameLineage ? -4 : 3)),
    fertility: clamp((female.fertility + male.fertility) / 2 + (sameLineage ? -5 : 2)),
    productivity: clamp((female.productivity + male.productivity) / 2 + (female.species === "Bovino" ? 2 : 1)),
    heatTolerance: clamp((female.heatTolerance + male.heatTolerance) / 2 + 2),
    risk: inbreedingRisk > 55 ? "Alto" : inbreedingRisk > 34 ? "Moderado" : "Baixo",
  };

  return { score, confidence: dataConfidence, decision, tone, pregnancyForecast, inbreedingRisk, economicImpact, offspring, reasons };
}

function uid(prefix) {
  return `${prefix}-${Math.floor(Date.now() / 1000).toString(36)}-${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return saved || { profile: initialProfile, pens: initialPens, animals: initialAnimals };
  } catch {
    return { profile: initialProfile, pens: initialPens, animals: initialAnimals };
  }
}

function loadChat() {
  try {
    return JSON.parse(localStorage.getItem(CHAT_KEY) || "null") || initialChat;
  } catch {
    return initialChat;
  }
}


function loadAnalysisHistory() {
  try {
    return JSON.parse(localStorage.getItem(ANALYSIS_HISTORY_KEY) || "null") || [];
  } catch {
    return [];
  }
}

function saveAccount(profile, email) {
  try {
    const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "[]");
    const next = [{ email, profile, createdAt: new Date().toISOString() }, ...accounts.filter(a => a.email !== email)].slice(0, 8);
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(next));
  } catch {
    // protótipo local: falha silenciosa mantém o fluxo da demonstração
  }
}

function Icon({ name }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    dashboard: <><path d="M4 13h6V4H4v9Z"/><path d="M14 20h6V4h-6v16Z"/><path d="M4 20h6v-3H4v3Z"/></>,
    dna: <><path d="M7 3c6 4 4 14 10 18"/><path d="M17 3C11 7 13 17 7 21"/><path d="M8.5 7h7"/><path d="M8 12h8"/><path d="M8.5 17h7"/></>,
    barn: <><path d="M4 21V10l8-6 8 6v11"/><path d="M9 21v-7h6v7"/><path d="M4 10h16"/></>,
    herd: <><path d="M7 18c-2.5 0-4-1.3-4-3.4 0-2 1.5-3.6 4-3.6s4 1.6 4 3.6C11 16.7 9.5 18 7 18Z"/><path d="M17 18c-2.5 0-4-1.3-4-3.4 0-2 1.5-3.6 4-3.6s4 1.6 4 3.6c0 2.1-1.5 3.4-4 3.4Z"/><path d="M9 10c.4-2.4 1.4-4 3-4s2.6 1.6 3 4"/></>,
    report: <><path d="M6 3h9l3 3v15H6V3Z"/><path d="M14 3v4h4"/><path d="M9 14h6"/><path d="M9 17h6"/><path d="M9 10h3"/></>,
    user: <><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></>,
    moon: <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3 7 7 0 1 0 21 14.5Z"/>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></>,
    camera: <><path d="M4 8h4l2-3h4l2 3h4v11H4V8Z"/><circle cx="12" cy="13" r="3"/></>,
    chat: <><path d="M21 12a8 8 0 0 1-8 8H7l-4 3 1.2-5.2A8 8 0 1 1 21 12Z"/><path d="M8 11h8"/><path d="M8 15h5"/></>,
    lock: <><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    close: <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function App() {
  const [state, setState] = useState(loadState);
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || "light");
  const [logged, setLogged] = useState(() => localStorage.getItem(SESSION_KEY) === "true");
  const [active, setActive] = useState("dashboard");
  const [selectedPenId, setSelectedPenId] = useState("curral-bovino-a");
  const [selectedAnimalId, setSelectedAnimalId] = useState("BOV-184");
  const [femaleId, setFemaleId] = useState("BOV-184");
  const [maleId, setMaleId] = useState("BOV-301");
  const [animalModal, setAnimalModal] = useState(null);
  const [chat, setChat] = useState(loadChat);
  const [analysisHistory, setAnalysisHistory] = useState(loadAnalysisHistory);

  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem(THEME_KEY, theme); }, [theme]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [state]);
  useEffect(() => { localStorage.setItem(CHAT_KEY, JSON.stringify(chat)); }, [chat]);
  useEffect(() => { localStorage.setItem(ANALYSIS_HISTORY_KEY, JSON.stringify(analysisHistory)); }, [analysisHistory]);

  const { profile, pens, animals } = state;
  const selectedPen = pens.find(p => p.id === selectedPenId) || pens[0];
  const selectedAnimal = animals.find(a => a.id === selectedAnimalId) || animals[0];
  const penAnimals = animals.filter(a => a.penId === selectedPen?.id);
  const females = animals.filter(a => a.sex === "Fêmea");
  const males = animals.filter(a => a.sex === "Macho");
  const female = animals.find(a => a.id === femaleId) || females[0];
  const male = animals.find(a => a.id === maleId) || males[0];
  const analysis = compatibilityEngine(female, male);

  useEffect(() => {
    if (female && male && female.species !== male.species) {
      const compatibleMale = males.find(m => m.species === female.species);
      if (compatibleMale) setMaleId(compatibleMale.id);
    }
  }, [femaleId]);

  const stats = useMemo(() => {
    const avg = key => Math.round(animals.reduce((s, a) => s + (a[key] || 0), 0) / Math.max(animals.length, 1));
    const alerts = animals.filter(a => a.missingData?.length || a.status.toLowerCase().includes("evitar") || a.health < 87).length;
    return { total: animals.length, avgGenetic: avg("geneticIndex"), avgFertility: avg("fertility"), alerts };
  }, [animals]);

  function login(payload) {
    const nextProfile = {
      ...profile,
      userName: payload.userName || profile.userName,
      property: payload.property || profile.property,
      city: payload.city || profile.city,
      accessLevel: payload.accessLevel || profile.accessLevel,
      producer: payload.producer || profile.producer,
    };
    setState(s => ({ ...s, profile: nextProfile }));
    saveAccount(nextProfile, payload.email || "demo@biogen.local");
    localStorage.setItem(SESSION_KEY, "true");
    setLogged(true);
  }

  function updateProfile(next) {
    setState(s => ({ ...s, profile: { ...s.profile, ...next } }));
  }

  function addAnimal(newAnimal) {
    setState(s => ({ ...s, animals: [newAnimal, ...s.animals] }));
    setSelectedAnimalId(newAnimal.id);
    setSelectedPenId(newAnimal.penId);
    setActive("curral");
  }

  function updateAnimal(updatedAnimal) {
    setState(s => ({ ...s, animals: s.animals.map(a => a.id === updatedAnimal.id ? updatedAnimal : a) }));
    setSelectedAnimalId(updatedAnimal.id);
    setSelectedPenId(updatedAnimal.penId);
    setActive("curral");
  }

  function updateAnimalPhoto(id, photo) {
    setState(s => ({ ...s, animals: s.animals.map(a => a.id === id ? { ...a, photo } : a) }));
  }

  function saveAnalysis(record) {
    setAnalysisHistory(history => {
      const exists = history.some(item => item.femaleId === record.femaleId && item.maleId === record.maleId && item.score === record.score && item.createdAt === record.createdAt);
      if (exists) return history;
      return [record, ...history].slice(0, 12);
    });
  }

  function clearAnalysisHistory() {
    setAnalysisHistory([]);
  }

  if (!logged) return <LoginScreen profile={profile} onLogin={login} theme={theme} setTheme={setTheme} />;

  const nav = [
    ["dashboard", "Painel executivo", "dashboard"],
    ["ia", "IA genética", "dna"],
    ["curral", "Curral visual", "barn"],
    ["rebanho", "Rebanho", "herd"],
    ["assistente", "Assistente IA", "chat"],
    ["relatorios", "Relatórios", "report"],
    ["perfil", "Perfil", "user"],
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark">BG</div>
          <div><strong>BioGen Sertão</strong><span>Decisão genética rural</span></div>
        </div>
        <nav>{nav.map(([id, label, icon]) => <button key={id} onClick={() => setActive(id)} className={active === id ? "active" : ""}><Icon name={icon}/><span>{label}</span></button>)}</nav>
        <div className="side-status"><span>Propriedade ativa</span><strong>{profile.property}</strong><small>{profile.city}</small></div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div><span className="eyebrow">{profile.propertyCode}</span><h2>{titleFor(active)}</h2></div>
          <div className="topbar-actions">
            <button className="icon-action" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}><Icon name={theme === "dark" ? "sun" : "moon"}/><span>{theme === "dark" ? "Claro" : "Escuro"}</span></button>
            <button className="primary-action" onClick={() => setAnimalModal({ mode: "create", animal: null })}><Icon name="plus"/>Cadastrar animal</button>
            <div className="user-chip"><div className="avatar">{profile.userName.slice(0,1)}</div><div><strong>{profile.userName}</strong><span>{profile.accessLevel}</span></div></div>
          </div>
        </header>

        {active === "dashboard" && <Dashboard stats={stats} analysis={analysis} animals={animals} pens={pens} setActive={setActive} setSelectedPenId={setSelectedPenId} />}
        {active === "ia" && <GeneticAI animals={animals} females={females} males={males} femaleId={femaleId} maleId={maleId} setFemaleId={setFemaleId} setMaleId={setMaleId} analysis={analysis} analysisHistory={analysisHistory} onSaveAnalysis={saveAnalysis} onClearHistory={clearAnalysisHistory} />}
        {active === "curral" && <CurralView pens={pens} animals={animals} selectedPen={selectedPen} setSelectedPenId={setSelectedPenId} penAnimals={penAnimals} selectedAnimalId={selectedAnimalId} setSelectedAnimalId={setSelectedAnimalId} updateAnimalPhoto={updateAnimalPhoto} openAnimalEditor={(animal) => setAnimalModal({ mode: "edit", animal })} />}
        {active === "rebanho" && <HerdView animals={animals} selectedAnimal={selectedAnimal} setSelectedAnimalId={setSelectedAnimalId} updateAnimalPhoto={updateAnimalPhoto} openAnimalEditor={(animal) => setAnimalModal({ mode: "edit", animal })} />}
        {active === "assistente" && <AssistantAI state={state} chat={chat} setChat={setChat} analysis={analysis} setActive={setActive} />}
        {active === "relatorios" && <Reports animals={animals} analysis={analysis} pens={pens} />}
        {active === "perfil" && <Profile profile={profile} updateProfile={updateProfile} setLogged={setLogged} />}
      </main>

      {animalModal && <AnimalModal pens={pens} animal={animalModal.animal} onClose={() => setAnimalModal(null)} onSave={(animal) => { animalModal.mode === "edit" ? updateAnimal(animal) : addAnimal(animal); setAnimalModal(null); }} />}
    </div>
  );
}

function titleFor(active) {
  return ({ dashboard: "Painel executivo", ia: "Motor de recomendação genética", curral: "Mapa operacional do curral", rebanho: "Gestão individual do rebanho", assistente: "Assistente técnico com IA", relatorios: "Relatórios e evidências", perfil: "Perfil da propriedade" })[active] || "BioGen Sertão";
}

function LoginScreen({ profile, onLogin, theme, setTheme }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    userName: profile.userName,
    email: "equipe@biogen.local",
    property: profile.property,
    city: profile.city,
    producer: profile.producer,
    accessLevel: "Equipe técnica",
  });
  function submit(e) {
    e.preventDefault();
    onLogin(form);
  }
  return <div className="auth-shell">
    <div className="auth-bg-grid" />
    <header className="auth-header">
      <div className="brand-lockup large"><div className="brand-mark">BG</div><div><strong>BioGen Sertão</strong><span>Inteligência genética para o semiárido</span></div></div>
      <button className="icon-action" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}><Icon name={theme === "dark" ? "sun" : "moon"}/><span>{theme === "dark" ? "Modo claro" : "Modo escuro"}</span></button>
    </header>
    <main className="auth-main">
      <section className="auth-copy">
        <span className="eyebrow">Hackathon Expoagro Crateús 2026</span>
        <h1>Da linhagem ao nascimento, decisões reprodutivas com evidência.</h1>
        <p>Uma plataforma para técnicos e produtores registrarem animais, organizarem currais, analisarem cruzamentos e conversarem com uma IA de apoio à inseminação artificial.</p>
        <div className="auth-proof">
          <Metric value="3" label="espécies" />
          <Metric value="IA" label="recomendação" />
          <Metric value="Local" label="dados salvos" />
        </div>
      </section>
      <section className="auth-card">
        <div className="auth-tabs">
          <button type="button" className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Entrar</button>
          <button type="button" className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>Criar conta</button>
        </div>
        <div className="auth-card-title">
          <Icon name="lock"/>
          <div><h2>{mode === "login" ? "Acesso da equipe" : "Nova propriedade"}</h2><p>{mode === "login" ? "Entre na demonstração com os dados da equipe." : "Cadastre uma propriedade para iniciar o protótipo."}</p></div>
        </div>
        <form onSubmit={submit} className="login-form">
          <label>Nome do usuário<input value={form.userName} onChange={e => setForm({...form, userName:e.target.value})}/></label>
          <label>E-mail<input type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})}/></label>
          {mode === "register" && <>
            <label>Propriedade<input value={form.property} onChange={e => setForm({...form, property:e.target.value})}/></label>
            <label>Cidade<input value={form.city} onChange={e => setForm({...form, city:e.target.value})}/></label>
            <label>Produtor responsável<input value={form.producer} onChange={e => setForm({...form, producer:e.target.value})}/></label>
          </>}
          <label>Tipo de acesso<select value={form.accessLevel} onChange={e => setForm({...form, accessLevel:e.target.value})}><option>Equipe técnica</option><option>Veterinário</option><option>Produtor</option><option>Gestor público</option></select></label>
          <button className="primary-action full">{mode === "login" ? "Entrar no painel" : "Criar e acessar"}</button>
        </form>
        <p className="auth-note">Protótipo: contas, cadastros, fotos e conversa ficam salvos no navegador via localStorage.</p>
      </section>
    </main>
  </div>;
}

function Metric({ value, label }) { return <div className="metric"><strong>{value}</strong><span>{label}</span></div>; }

function Dashboard({ stats, analysis, animals, pens, setActive, setSelectedPenId }) {
  const penWithAlert = pens.find(p => p.risk === "Alto") || pens[0];
  return <div className="content-grid">
    <section className="hero panel">
      <div><span className="eyebrow">Visão operacional</span><h1>Do curral à inseminação: decisões genéticas com evidência de campo.</h1><p>Organize lotes reais da propriedade, registre fotos e histórico, simule cruzamentos e gere relatórios prontos para impressão ou compartilhamento.</p><div className="hero-actions"><button className="primary-action" onClick={() => setActive("ia")}>Ver recomendação genética</button><button className="secondary-action" onClick={() => { setSelectedPenId(penWithAlert.id); setActive("curral"); }}>Abrir curral com alerta</button><button className="secondary-action" onClick={() => setActive("assistente")}>Conversar com a IA</button></div></div>
      <DecisionCard analysis={analysis}/>
    </section>
    <section className="kpi-grid"><Kpi label="Animais monitorados" value={stats.total}/><Kpi label="Índice genético médio" value={`${stats.avgGenetic}%`}/><Kpi label="Fertilidade média" value={`${stats.avgFertility}%`}/><Kpi label="Alertas técnicos" value={stats.alerts} tone="warning"/></section>
    <section className="two-columns"><PenSummary pens={pens} animals={animals} setActive={setActive} setSelectedPenId={setSelectedPenId}/><OperationalAlerts animals={animals}/></section>
  </div>;
}

function DecisionCard({ analysis }) {
  return <div className={`decision-card ${analysis?.tone}`}><span>Recomendação atual</span><strong>{analysis?.decision}</strong><CircularScore value={analysis?.score || 0}/><p>{analysis?.reasons?.[0]}</p></div>;
}

function Kpi({ label, value, tone }) { return <div className={`kpi-card ${tone || ""}`}><span>{label}</span><strong>{value}</strong></div>; }

function PenSummary({ pens, animals, setActive, setSelectedPenId }) {
  return <section className="panel"><div className="section-title"><span className="eyebrow">Mapa rápido</span><h2>Setores da propriedade</h2></div><div className="pen-list">{pens.map(p => { const count = animals.filter(a => a.penId === p.id).length; return <button key={p.id} className="pen-row" onClick={() => { setSelectedPenId(p.id); setActive("curral"); }}><div><strong>{p.name}</strong><span>{p.type}</span></div><b>{count}/{p.capacity}</b><small className={`risk ${p.risk.toLowerCase()}`}>{p.risk}</small></button>; })}</div></section>;
}

function OperationalAlerts({ animals }) {
  const alerts = animals.filter(a => a.missingData?.length || a.status.toLowerCase().includes("evitar") || a.health < 87).slice(0,4);
  return <section className="panel"><div className="section-title"><span className="eyebrow">Campo</span><h2>Alertas técnicos</h2></div><div className="alert-list">{alerts.map(a => <div className="alert-row" key={a.id}><strong>{a.name}</strong><span>{a.status}</span><small>{a.missingData?.[0] || "Revisar histórico e protocolo"}</small></div>)}</div></section>;
}

function GeneticAI({ animals, females, males, femaleId, maleId, setFemaleId, setMaleId, analysis, analysisHistory, onSaveAnalysis, onClearHistory }) {
  const female = animals.find(a => a.id === femaleId) || females[0];
  const compatibleMales = males.filter(m => !female || m.species === female.species);
  const currentMale = compatibleMales.find(a => a.id === maleId) || compatibleMales[0] || males[0];
  const safeAnalysis = currentMale?.id === maleId ? analysis : compatibilityEngine(female, currentMale);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const timersRef = useRef([]);

  const processingSteps = [
    "Mapeando marcadores genéticos e linhagem...",
    "Cruzando índices de fertilidade, sanidade e tolerância ao calor...",
    "Calculando probabilidade de prenhez com Motor Adaptativo Local..."
  ];

  function clearProcessingTimers() {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
  }

  useEffect(() => {
    clearProcessingTimers();
    setIsAnalyzing(false);
    setHasAnalyzed(false);
    setProcessingStep(0);
    return clearProcessingTimers;
  }, [femaleId, maleId]);

  function handleFemaleChange(id) {
    const nextFemale = animals.find(a => a.id === id);
    setFemaleId(id);
    const nextCompatibleMale = males.find(m => m.species === nextFemale?.species);
    if (nextCompatibleMale) setMaleId(nextCompatibleMale.id);
  }

  function handleMaleChange(id) {
    setMaleId(id);
  }

  function executeAnalysis() {
    if (!female || !currentMale) return;
    clearProcessingTimers();
    setIsAnalyzing(true);
    setHasAnalyzed(false);
    setProcessingStep(0);
    timersRef.current = [
      setTimeout(() => setProcessingStep(1), 780),
      setTimeout(() => setProcessingStep(2), 1580),
      setTimeout(() => {
        const finalAnalysis = compatibilityEngine(female, currentMale);
        onSaveAnalysis?.({
          id: uid("ANA"),
          createdAt: new Date().toISOString(),
          femaleId: female.id,
          maleId: currentMale.id,
          femaleName: female.name,
          maleName: currentMale.name,
          species: female.species,
          decision: finalAnalysis.decision,
          score: finalAnalysis.score,
          pregnancyForecast: finalAnalysis.pregnancyForecast,
          inbreedingRisk: finalAnalysis.inbreedingRisk,
          confidence: finalAnalysis.confidence,
          economicImpact: finalAnalysis.economicImpact,
          tone: finalAnalysis.tone,
          summary: finalAnalysis.reasons?.[0] || "Análise registrada no histórico local."
        });
        setIsAnalyzing(false);
        setHasAnalyzed(true);
      }, 2550),
    ];
  }

  return <div className="content-grid genetic-ritual-page">
    <section className="panel section-head-panel compact-ai-head">
      <span className="eyebrow">Motor de inteligência adaptativa local</span>
      <h1>Análise combinatória para decisões de inseminação no campo.</h1>
      <p>Escolha uma matriz e um reprodutor, execute a análise local e revele apenas o resultado final: compatibilidade, prenhez prevista, risco genético, confiança dos dados e previsão de descendência.</p>
    </section>

    {!isAnalyzing && <section className="ritual-shell panel">
      <div className="compact-title">
        <div><span className="eyebrow">Passo 1</span><h2>Escolha do par reprodutivo</h2></div>
        <span className="status-pill">Sem internet obrigatória</span>
      </div>
      <div className="ritual-selectors">
        <div className="selector-card clean-selector">
          <label>Matriz<select value={female?.id || ""} onChange={e => handleFemaleChange(e.target.value)}>{females.map(a => <option key={a.id} value={a.id}>{a.name} · {a.species} · {a.breed}</option>)}</select></label>
          <AnimalMini animal={female}/>
        </div>
        <div className="pair-bridge" aria-hidden="true"><Icon name="dna"/><span>par genético</span></div>
        <div className="selector-card clean-selector">
          <label>Reprodutor<select value={currentMale?.id || ""} onChange={e => handleMaleChange(e.target.value)}>{compatibleMales.map(a => <option key={a.id} value={a.id}>{a.name} · {a.species} · {a.breed}</option>)}</select></label>
          <AnimalMini animal={currentMale}/>
          <small className="selector-note">Lista filtrada para {female?.species || "espécie selecionada"}.</small>
        </div>
      </div>
      <div className="analysis-trigger-card">
        <p>O resultado não aparece automaticamente. O sistema aguarda a execução para simular o fluxo técnico do motor local.</p>
        <button className="primary-action analysis-trigger" onClick={executeAnalysis} disabled={!female || !currentMale}><Icon name="dna"/>Executar Análise Combinatória Local</button>
      </div>
    </section>}

    {isAnalyzing && <section className="analysis-runner panel" aria-live="polite">
      <div className="dna-spinner"><Icon name="dna"/></div>
      <span className="eyebrow">Passo 2 · Processamento local</span>
      <h2>{processingSteps[processingStep]}</h2>
      <p>O protótipo processa os dados no próprio dispositivo, estratégia adequada para propriedades com internet instável no sertão.</p>
      <div className="processing-steps">
        {processingSteps.map((step, index) => <div key={step} className={index <= processingStep ? "active" : ""}><span>{String(index + 1).padStart(2,"0")}</span><small>{step}</small></div>)}
      </div>
    </section>}

    {hasAnalyzed && <section className={`result-reveal ${safeAnalysis?.tone || ""}`}>
      <section className="result-verdict panel">
        <div>
          <span className="eyebrow">Passo 3 · Veredito técnico</span>
          <h2>{safeAnalysis?.decision || "Resultado indisponível"}</h2>
          <p>{safeAnalysis?.score >= 86 ? "Combinação prioritária para protocolo de inseminação." : safeAnalysis?.score >= 70 ? "Combinação viável, com pontos técnicos a validar." : "Combinação exige revisão antes de qualquer protocolo."}</p>
        </div>
        <CircularScore value={safeAnalysis?.score || 0}/>
      </section>

      <section className="three-columns result-metrics">
        <Insight title="Prenhez prevista" value={`${safeAnalysis?.pregnancyForecast || 0}%`} text="Estimativa baseada no histórico do lote e qualidade dos registros."/>
        <Insight title="Risco genético" value={`${safeAnalysis?.inbreedingRisk || 0}%`} text="Risco aumentado por repetição de linhagem, lacunas cadastrais ou histórico limitado."/>
        <Insight title="Confiança dos dados" value={`${safeAnalysis?.confidence || 0}%`} text="Quanto maior a qualidade do cadastro, mais confiável é a recomendação."/>
      </section>

      <section className="two-columns result-details">
        <div className="panel"><div className="section-title"><span className="eyebrow">Parecer técnico</span><h2>Justificativa do motor local</h2></div><div className="reason-list">{(safeAnalysis?.reasons || ["Selecione uma matriz e um reprodutor compatíveis para iniciar a análise."]).map((r, i) => <div key={i} className="reason-item"><span>{String(i+1).padStart(2,"0")}</span><p>{r}</p></div>)}</div></div>
        <OffspringCard offspring={safeAnalysis?.offspring}/>
      </section>

      <section className="panel impact-strip">
        <div><span className="eyebrow">Impacto estimado</span><strong>R$ {safeAnalysis?.economicImpact || 0}</strong><p>Estimativa de ganho potencial por redução de falha reprodutiva e seleção mais precisa.</p></div>
        <button className="secondary-action" onClick={() => { setHasAnalyzed(false); setIsAnalyzing(false); }}>Nova análise</button>
      </section>
    </section>}

    <AnalysisHistory
      history={analysisHistory}
      animals={animals}
      onClear={onClearHistory}
      onOpen={(record) => {
        setFemaleId(record.femaleId);
        setMaleId(record.maleId);
        setIsAnalyzing(false);
        setHasAnalyzed(true);
      }}
    />
  </div>;
}

function AnalysisHistory({ history = [], animals, onOpen, onClear }) {
  const printableDate = value => new Date(value).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  return <section className="panel analysis-history-panel">
    <div className="compact-title">
      <div><span className="eyebrow">Memória local</span><h2>Histórico de análises</h2></div>
      {history.length > 0 && <button className="ghost-action" type="button" onClick={onClear}>Limpar histórico</button>}
    </div>
    <p className="muted">As combinações executadas ficam salvas no navegador para o produtor consultar depois sem repetir o teste.</p>
    {history.length === 0 ? <div className="empty-history">Nenhuma análise salva ainda. Execute uma combinação para registrar o resultado.</div> : <div className="analysis-history-list">
      {history.map(record => {
        const femaleExists = animals.some(a => a.id === record.femaleId);
        const maleExists = animals.some(a => a.id === record.maleId);
        return <button key={record.id} type="button" className={`history-card ${record.tone || ""}`} onClick={() => femaleExists && maleExists && onOpen?.(record)} disabled={!femaleExists || !maleExists}>
          <div className="history-main">
            <span>{printableDate(record.createdAt)} · {record.species}</span>
            <strong>{record.femaleName} × {record.maleName}</strong>
            <small>{record.summary}</small>
          </div>
          <div className="history-score">
            <b>{record.score}%</b>
            <span>{record.decision}</span>
          </div>
          <div className="history-meta">
            <span>Prenhez {record.pregnancyForecast}%</span>
            <span>Risco {record.inbreedingRisk}%</span>
            <span>Confiança {record.confidence}%</span>
          </div>
        </button>;
      })}
    </div>}
  </section>;
}

function AnimalMini({ animal }) { if (!animal) return null; return <div className="animal-mini"><AnimalPhoto animal={animal}/><div><strong>{animal.name}</strong><span>{animal.breed}</span><small>{animal.lineage}</small></div></div>; }

function CircularScore({ value }) {
  const v = clamp(value);
  return <div className="score-ring" style={{ "--score": v }}><svg viewBox="0 0 120 120"><circle className="ring-bg" cx="60" cy="60" r="52"/><circle className="ring-progress" cx="60" cy="60" r="52" pathLength="100"/></svg><div><strong>{v}%</strong><span>compatibilidade</span></div></div>;
}

function Insight({ title, value, text }) { return <div className="insight-card"><span>{title}</span><strong>{value}</strong><p>{text}</p></div>; }

function OffspringCard({ offspring }) {
  if (!offspring) {
    return <section className="panel"><div className="section-title"><span className="eyebrow">Simulação de descendência</span><h2>Aguardando par compatível</h2></div><p className="muted">Escolha matriz e reprodutor da mesma espécie para gerar uma previsão de descendência sem risco de travamento.</p></section>;
  }
  return <section className="panel"><div className="section-title"><span className="eyebrow">Simulação de descendência</span><h2>Potencial previsto</h2></div><div className="bars">{Object.entries({ "Índice genético": offspring.geneticIndex, "Fertilidade": offspring.fertility, "Produtividade": offspring.productivity, "Adaptação térmica": offspring.heatTolerance }).map(([k,v]) => <div className="bar" key={k}><div><span>{k}</span><b>{v}%</b></div><i style={{ width: `${v}%` }}/></div>)}</div><div className="offspring-risk"><span>Risco hereditário</span><strong>{offspring.risk}</strong></div></section>;
}

function CurralView({ pens, animals, selectedPen, setSelectedPenId, penAnimals, selectedAnimalId, setSelectedAnimalId, updateAnimalPhoto, openAnimalEditor }) {
  const selectedAnimal = animals.find(a => a.id === selectedAnimalId) || penAnimals[0];
  return <div className="content-grid">
    <section className="panel section-head-panel"><span className="eyebrow">Curral visual</span><h1>Clique em um setor para abrir o lote real daquele espaço.</h1><p>O mapa funciona como planta operacional da propriedade. Cada curral abre uma área própria com animais, fotos, indicadores e alertas do lote.</p></section>
    <section className="two-columns map-layout"><div className="panel"><div className="compact-title"><div><span className="eyebrow">Planta 2.5D</span><h2>Mapa da propriedade</h2></div><span className="status-pill">{pens.length} setores</span></div><div className="farm-map">{pens.map(p => <button key={p.id} className={`map-pen ${p.id === selectedPen.id ? "selected" : ""} ${p.category.toLowerCase()}`} style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%`, height: `${p.h}%` }} onClick={() => setSelectedPenId(p.id)}><strong>{p.name}</strong><span>{p.category}</span><small>{animals.filter(a => a.penId === p.id).length}/{p.capacity}</small></button>)}<div className="map-road"/><div className="map-label">Área de manejo e inseminação</div></div></div><PenDetail selectedPen={selectedPen} penAnimals={penAnimals}/></section>
    <section className="pen-stage panel"><div className="compact-title"><div><span className="eyebrow">{selectedPen.name}</span><h2>{selectedPen.type}</h2></div><span className={`risk ${selectedPen.risk.toLowerCase()}`}>{selectedPen.risk}</span></div><div className={`animal-yard ${selectedPen.category.toLowerCase()}`}>{penAnimals.length ? penAnimals.map(a => <button key={a.id} className={`yard-animal ${selectedAnimalId === a.id ? "active" : ""}`} onClick={() => setSelectedAnimalId(a.id)}><AnimalPhoto animal={a}/><strong>{a.name}</strong><span>{a.role}</span></button>) : <div className="empty-yard">Nenhum animal cadastrado neste setor.</div>}</div></section>
    {selectedAnimal && <AnimalProfile animal={selectedAnimal} updateAnimalPhoto={updateAnimalPhoto} openAnimalEditor={openAnimalEditor}/>} 
  </div>;
}

function PenDetail({ selectedPen, penAnimals }) {
  const occupancy = clamp((penAnimals.length / selectedPen.capacity) * 100);
  return <section className="panel"><div className="section-title"><span className="eyebrow">Setor selecionado</span><h2>{selectedPen.name}</h2></div><p className="muted">{selectedPen.note}</p><div className="detail-grid"><Insight title="Lotação" value={`${occupancy}%`} text={`${penAnimals.length} animais de ${selectedPen.capacity} vagas.`}/><Insight title="Sanidade" value={`${selectedPen.sanitation}%`} text="Condição geral do setor."/><Insight title="Umidade" value={`${selectedPen.humidity}%`} text="Monitoramento ambiental estimado."/></div></section>;
}

function HerdView({ animals, selectedAnimal, setSelectedAnimalId, updateAnimalPhoto, openAnimalEditor }) {
  const [filter, setFilter] = useState("Todos");
  const list = filter === "Todos" ? animals : animals.filter(a => a.species === filter);
  return <div className="two-columns herd-layout"><section className="panel"><div className="compact-title"><div><span className="eyebrow">Rebanho</span><h2>Animais cadastrados</h2></div><select value={filter} onChange={e => setFilter(e.target.value)}><option>Todos</option><option>Bovino</option><option>Ovino</option><option>Caprino</option></select></div><div className="animal-list">{list.map(a => <button key={a.id} className={`animal-row ${selectedAnimal?.id === a.id ? "active" : ""}`} onClick={() => setSelectedAnimalId(a.id)}><AnimalPhoto animal={a}/><div><strong>{a.name}</strong><span>{a.species} · {a.breed}</span></div><b>{a.geneticIndex}%</b></button>)}</div></section>{selectedAnimal && <AnimalProfile animal={selectedAnimal} updateAnimalPhoto={updateAnimalPhoto} openAnimalEditor={openAnimalEditor}/>}</div>;
}

function AnimalProfile({ animal, updateAnimalPhoto, openAnimalEditor }) {
  return <section className="panel animal-profile">
    <div className="profile-head">
      <AnimalPhoto animal={animal} large/>
      <div>
        <span className="eyebrow">{animal.id}</span>
        <h2>{animal.name}</h2>
        <p>{animal.species} · {animal.breed} · {animal.role}</p>
      </div>
      <div className="profile-actions">
        <button type="button" className="secondary-action" onClick={() => openAnimalEditor?.(animal)}>Editar cadastro</button>
        <PhotoInput onPhoto={photo => updateAnimalPhoto(animal.id, photo)}/>
      </div>
    </div>
    <div className="detail-grid">
      <Insight title="Índice genético" value={`${animal.geneticIndex}%`} text={animal.lineage}/>
      <Insight title="Fertilidade" value={`${animal.fertility}%`} text={`Histórico: ${getHistoricalRate(animal)}%`}/>
      <Insight title="Qualidade dos dados" value={`${animal.dataQuality}%`} text={animal.missingData?.length ? animal.missingData.join(", ") : "Cadastro consistente"}/>
    </div>
    <div className="record-list">{animal.records.map((r,i)=><span key={i}>{r}</span>)}</div>
  </section>;
}

function AnimalPhoto({ animal, large }) {
  if (animal?.photo) return <img className={`animal-photo ${large ? "large" : ""}`} src={animal.photo} alt={animal.name}/>;
  return <div className={`animal-photo placeholder ${large ? "large" : ""} ${animal?.species?.toLowerCase() || ""}`}><span>{speciesMeta[animal?.species]?.short || "BIO"}</span></div>;
}

function PhotoInput({ onPhoto }) {
  const ref = useRef(null);
  function handle(e) { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => onPhoto(String(reader.result)); reader.readAsDataURL(file); }
  return <><input ref={ref} type="file" accept="image/*" capture="environment" onChange={handle} hidden/><button className="secondary-action" onClick={() => ref.current?.click()}><Icon name="camera"/>Foto</button></>;
}

function AssistantAI({ state, chat, setChat, analysis, setActive }) {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const fileRef = useRef(null);
  const { animals, pens } = state;

  function pushConversation(question, attachedImage = "") {
    const cleanQuestion = question.trim() || (attachedImage ? "Analise esta foto do animal/lote" : "");
    if (!cleanQuestion) return;
    const userMsg = { role: "user", text: cleanQuestion, image: attachedImage, time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) };
    const answer = attachedImage ? generatePhotoInspection(cleanQuestion, state, analysis) : generateAssistantReply(cleanQuestion, state, analysis);
    const botMsg = { role: "assistant", text: answer, time: "agora" };
    setChat(prev => [...prev, userMsg, botMsg]);
    setText("");
    setImagePreview("");
  }

  function send(e) {
    e.preventDefault();
    pushConversation(text, imagePreview);
  }

  function handleImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(String(reader.result));
    reader.readAsDataURL(file);
  }

  const suggestions = [
    "Faça um diagnóstico geral da propriedade",
    "Qual curral eu mostro primeiro no vídeo?",
    "Explique a recomendação genética atual",
    "Monte uma fala forte para a banca",
    "Quais animais estão com dados incompletos?",
    "Como reduzir risco de consanguinidade?"
  ];

  return <div className="assistant-layout">
    <section className="panel chat-panel">
      <div className="compact-title"><div><span className="eyebrow">Assistente BioGen</span><h2>Chat técnico com foto e contexto do rebanho</h2></div><span className="status-pill">salvo localmente</span></div>
      <div className="chat-window">{chat.map((m, i) => <div key={i} className={`chat-msg ${m.role}`}>{m.image && <img className="chat-image" src={m.image} alt="Imagem enviada para análise"/>}<p>{m.text}</p><span>{m.time}</span></div>)}</div>
      {imagePreview && <div className="image-preview"><img src={imagePreview} alt="Prévia"/><div><strong>Imagem anexada</strong><span>A IA vai gerar uma leitura técnica demonstrativa para foto de animal, curral ou lote.</span></div><button type="button" className="ghost-action" onClick={() => setImagePreview("")}>Remover</button></div>}
      <form className="chat-form" onSubmit={send}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Pergunte sobre currais, cruzamentos, alertas, foto ou vídeo..."/>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleImage} hidden/>
        <button type="button" className="secondary-action" onClick={() => fileRef.current?.click()}><Icon name="camera"/>Foto</button>
        <button className="primary-action">Enviar</button>
      </form>
    </section>
    <aside className="panel assistant-side">
      <div className="section-title"><span className="eyebrow">Atalhos inteligentes</span><h2>Perguntas prontas para demo</h2></div>
      <div className="suggestion-list">{suggestions.map(s => <button key={s} onClick={() => setText(s)}>{s}</button>)}</div>
      <div className="assistant-summary">
        <Insight title="Animais" value={animals.length} text="Registros disponíveis para análise."/>
        <Insight title="Currais" value={pens.length} text="Setores operacionais cadastrados."/>
        <Insight title="Decisão IA" value={analysis.decision} text={`${analysis.score}% de compatibilidade atual.`}/>
      </div>
      <button className="secondary-action full" onClick={() => setActive("ia")}>Abrir motor genético</button>
    </aside>
  </div>;
}

function summarizeContext(state) {
  const { animals, pens } = state;
  const alerts = animals.filter(a => a.missingData?.length || a.status.toLowerCase().includes("evitar") || a.health < 87);
  const bySpecies = ["Bovino", "Caprino", "Ovino"].map(sp => `${sp}: ${animals.filter(a => a.species === sp).length}`).join(", ");
  const riskPen = pens.find(p => p.risk === "Alto") || pens.find(p => p.risk === "Médio") || pens[0];
  return { alerts, bySpecies, riskPen };
}

function generatePhotoInspection(question, state, analysis) {
  const { animals } = state;
  const { alerts, riskPen } = summarizeContext(state);
  const focusAnimal = animals.find(a => question.toLowerCase().includes(a.name.toLowerCase().split(" ")[0])) || alerts[0] || animals[0];
  const tips = [
    `Associaria a foto ao registro de ${focusAnimal.name} ou ao setor ${riskPen.name} para manter rastreabilidade visual.`,
    `Pela lógica da demonstração, eu verificaria escore corporal, aprumos, condição de pelagem, presença de ferimentos, limpeza do piso e disponibilidade de sombra/água.`,
    `Se for foto de matriz, o próximo passo é cruzar imagem + histórico: fertilidade ${focusAnimal.fertility}%, qualidade dos dados ${focusAnimal.dataQuality}% e status "${focusAnimal.status}".`,
    `Para a banca, diga que a foto vira evidência do manejo e ajuda o técnico a registrar observações mesmo sem internet, sincronizando depois em uma versão com backend.`
  ];
  return `Análise visual demonstrativa: ${tips.join(" ")} Recomendação prática: se houver dúvida sanitária, mover para Baia Técnica e revisar antes de inseminar. Observação: neste protótipo a leitura é simulada no navegador; a arquitetura já deixa o fluxo pronto para um modelo real de visão computacional.`;
}

function generateAssistantReply(question, state, analysis) {
  const q = question.toLowerCase();
  const { animals, pens, profile } = state;
  const { alerts, bySpecies, riskPen } = summarizeContext(state);
  const avgFertility = Math.round(animals.reduce((s,a)=>s+a.fertility,0)/Math.max(animals.length,1));
  const lowConfidence = animals.filter(a => a.dataQuality < 82 || a.missingData?.length);
  const bestPen = pens.map(p => ({...p, count: animals.filter(a=>a.penId===p.id).length})).sort((a,b)=>b.count-a.count)[0];

  if (q.includes("diagn") || q.includes("geral") || q.includes("propriedade")) {
    return `${profile.property} tem ${animals.length} animais cadastrados (${bySpecies}), ${pens.length} setores e fertilidade média de ${avgFertility}%. O ponto crítico é ${riskPen.name}, porque está com risco ${riskPen.risk.toLowerCase()} e status "${riskPen.status}". Para melhorar a nota no edital, eu mostraria primeiro o mapa de currais, depois cadastro com foto, depois IA genética e por fim relatório exportável.`;
  }
  if (q.includes("curral") || q.includes("setor") || q.includes("atenção") || q.includes("primeiro")) {
    const count = animals.filter(a => a.penId === riskPen.id).length;
    return `Mostre o ${riskPen.name} primeiro. Ele tem ${count}/${riskPen.capacity} animais, risco ${riskPen.risk.toLowerCase()} e status "${riskPen.status}". Isso deixa claro que o sistema entende o espaço físico da propriedade, não apenas uma lista de animais. Depois clique em ${bestPen.name} para mostrar o lote visual e a ficha individual com foto.`;
  }
  if (q.includes("recomend") || q.includes("cruzamento") || q.includes("genética") || q.includes("consanguinidade")) {
    return `A recomendação atual é "${analysis.decision}". O motor local encontrou ${analysis.score}% de compatibilidade, ${analysis.pregnancyForecast}% de prenhez prevista, ${analysis.inbreedingRisk}% de risco genético e ${analysis.confidence}% de confiança. Fala segura para a banca: "Neste protótipo, usamos um motor de inteligência adaptativa local que simula a etapa preditiva e funciona no próprio dispositivo; em produção, esse fluxo pode receber um modelo treinado com dados regionais."`;
  }
  if (q.includes("vídeo") || q.includes("pitch") || q.includes("banca") || q.includes("fala")) {
    return `Roteiro de 50 segundos: 1) "No sertão, uma decisão reprodutiva sem histórico pode custar uma estação inteira". 2) abrir o mapa do curral. 3) clicar em um setor e mostrar animais com foto. 4) ir para o motor de recomendação genética e explicar risco, prenhez e confiança. 5) exportar relatório. Feche com: "Do curral à inseminação, o BioGen transforma dado de campo em decisão técnica."`;
  }
  if (q.includes("falt") || q.includes("dados") || q.includes("alerta") || q.includes("incompleto")) {
    const list = lowConfidence.slice(0, 4).map(a => `${a.name}: ${a.missingData?.[0] || `${a.dataQuality}% de qualidade dos dados`}`).join("; ");
    return lowConfidence.length ? `Há ${lowConfidence.length} registros que reduzem a confiança do modelo. Principais: ${list}. Isso é importante porque mostra uma IA mais honesta: quando falta genealogia, exame ou histórico, ela não finge certeza; ela reduz confiança e pede validação técnica.` : "Os registros estão consistentes no momento. Para demonstrar realismo, cadastre um animal com genealogia pendente e mostre a confiança da IA caindo.";
  }
  if (q.includes("relatório") || q.includes("export") || q.includes("imprimir") || q.includes("compartilhar")) {
    return `Na aba Relatórios, use "Imprimir/PDF" para salvar pelo navegador ou "Compartilhar resumo" para enviar o diagnóstico. Para a banca, diga: "Os dados ficam localmente no dispositivo neste protótipo, o que reduz exposição de dados sensíveis e facilita uma implementação alinhada à LGPD."`;
  }
  if (q.includes("foto") || q.includes("imagem") || q.includes("câmera")) {
    return `Você pode anexar uma foto aqui no chat. A leitura demonstrativa gera dicas de escore corporal, condição visual, manejo do curral e próximos passos. Para o pitch, apresente como um módulo de triagem visual: hoje demonstrativo, futuramente conectado a visão computacional treinada com imagens de bovinos, ovinos e caprinos da região.`;
  }
  return `${profile.property}: eu priorizaria impacto e clareza. Mostre o fluxo completo em 4 passos: mapa do curral, cadastro com foto, motor local de recomendação genética e relatório exportável. Isso responde diretamente ao edital: IA, dados genéticos, inseminação, produtor rural e solução funcional.`;
}

function Reports({ animals, analysis, pens }) {
  const reportDate = new Date().toLocaleDateString("pt-BR");
  const alerts = animals.filter(a => a.missingData?.length || a.status.toLowerCase().includes("evitar") || a.health < 87);
  const speciesLine = ["Bovino", "Caprino", "Ovino"].map(sp => `${sp}: ${animals.filter(a => a.species === sp).length}`).join(" · ");
  const reportText = `BioGen Sertão - Relatório técnico (${reportDate})\nAnimais: ${animals.length}\nEspécies: ${speciesLine}\nCurrais: ${pens.length}\nRecomendação IA: ${analysis.decision} (${analysis.score}% compatibilidade)\nPrenhez prevista: ${analysis.pregnancyForecast}%\nRisco genético: ${analysis.inbreedingRisk}%\nAlertas técnicos: ${alerts.length}`;

  function printReport() {
    window.print();
  }

  async function shareReport() {
    if (navigator.share) {
      try { await navigator.share({ title: "Relatório BioGen Sertão", text: reportText }); return; } catch {}
    }
    await navigator.clipboard?.writeText(reportText);
    alert("Resumo copiado para a área de transferência.");
  }

  function exportCsv() {
    const header = "id,nome,especie,sexo,raca,linhagem,curral,indice_genetico,fertilidade,taxa_prenhez,qualidade_dados\n";
    const rows = animals.map(a => [a.id,a.name,a.species,a.sex,a.breed,a.lineage,pens.find(p=>p.id===a.penId)?.name || "",a.geneticIndex,a.fertility,a.pregnancyRate,a.dataQuality].map(v => `"${String(v).replaceAll('"','""')}"`).join(",")).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "biogen-sertao-rebanho.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return <div className="content-grid reports-page">
    <section className="panel section-head-panel no-print"><span className="eyebrow">Evidências para banca</span><h1>Relatórios prontos para imprimir, salvar em PDF ou compartilhar.</h1><p>A saída mostra desempenho genético, reprodutivo, currais, alertas, rastreabilidade e proteção local dos dados. Isso deixa o protótipo com cara de produto utilizável por técnico e produtor.</p><div className="hero-actions"><button className="primary-action" onClick={printReport}>Imprimir / Salvar PDF</button><button className="secondary-action" onClick={shareReport}>Compartilhar resumo</button><button className="secondary-action" onClick={exportCsv}>Exportar CSV</button></div></section>
    <section className="report-paper panel" id="printable-report">
      <div className="report-header"><div><span className="eyebrow">Relatório técnico</span><h2>BioGen Sertão · Desempenho genético e reprodutivo</h2><p>Gerado em {reportDate} para apresentação e acompanhamento de campo.</p></div><div className="report-seal">BIOGEN<br/>SERTÃO</div></div>
      <section className="three-columns"><Insight title="Recomendação atual" value={analysis.decision} text={`${analysis.score}% de compatibilidade · ${analysis.confidence}% de confiança.`}/><Insight title="Prenhez prevista" value={`${analysis.pregnancyForecast}%`} text="Estimativa do motor local de recomendação."/><Insight title="Risco genético" value={`${analysis.inbreedingRisk}%`} text="Considera linhagem, lacunas e histórico."/></section>
      <section className="report-table-wrap"><table className="report-table"><thead><tr><th>Animal</th><th>Espécie</th><th>Raça</th><th>Curral</th><th>Genética</th><th>Fertilidade</th><th>Dados</th></tr></thead><tbody>{animals.map(a => <tr key={a.id}><td><strong>{a.name}</strong><small>{a.id}</small></td><td>{a.species}</td><td>{a.breed}</td><td>{pens.find(p=>p.id===a.penId)?.name}</td><td>{a.geneticIndex}%</td><td>{a.fertility}%</td><td>{a.dataQuality}%</td></tr>)}</tbody></table></section>
      <section className="two-columns"><div className="panel nested"><div className="section-title"><span className="eyebrow">Alertas</span><h2>Registros que exigem revisão</h2></div>{alerts.length ? alerts.map(a => <div className="alert-row" key={a.id}><strong>{a.name}</strong><span>{a.status}</span><small>{a.missingData?.[0] || "Revisar histórico técnico"}</small></div>) : <p className="muted">Nenhum alerta crítico no momento.</p>}</div><div className="panel nested"><div className="section-title"><span className="eyebrow">LGPD e rastreabilidade</span><h2>Controle dos dados</h2></div><div className="architecture-grid compact"><div><strong>Edge</strong><span>Dados salvos localmente no dispositivo.</span></div><div><strong>Fotos</strong><span>Evidências vinculadas ao animal.</span></div><div><strong>IDs</strong><span>Rastreio por animal e curral.</span></div><div><strong>LGPD</strong><span>Protótipo reduz exposição de dados sensíveis.</span></div></div></div></section>
    </section>
  </div>;
}

function Profile({ profile, updateProfile, setLogged }) {
  return <section className="panel profile-panel"><div className="section-title"><span className="eyebrow">Configurações</span><h2>Perfil da propriedade</h2></div><div className="profile-form">{Object.entries({ userName:"Usuário", property:"Propriedade", city:"Cidade", producer:"Produtor", technician:"Responsável técnico", productionFocus:"Foco produtivo" }).map(([key,label]) => <label key={key}>{label}<input value={profile[key]} onChange={e => updateProfile({ [key]: e.target.value })}/></label>)}<button className="secondary-action" onClick={() => { localStorage.removeItem(SESSION_KEY); setLogged(false); }}>Sair</button></div></section>;
}

function AnimalModal({ pens, animal, onClose, onSave }) {
  const isEdit = Boolean(animal);
  const defaultForm = {
    name: "",
    species: "Bovino",
    sex: "Fêmea",
    role: "Matriz",
    breed: "",
    lineage: "",
    penId: pens[0]?.id || "",
    ageMonths: 24,
    weight: 430,
    bodyScore: 3.5,
    inbreedingBase: 4,
    lastInsemination: "",
    status: "Novo cadastro técnico",
    geneticIndex: 80,
    fertility: 78,
    pregnancyRate: 74,
    productivity: 76,
    heatTolerance: 82,
    health: 88,
    dataQuality: 76,
    photo: "",
    missingDataText: "validar genealogia",
  };
  const [form, setForm] = useState(() => animal ? {
    ...defaultForm,
    ...animal,
    missingDataText: (animal.missingData || []).join("; "),
  } : defaultForm);

  const compatiblePens = pens.filter(p => p.category === form.species || p.category === "Misto");

  function updateField(key, value) {
    setForm(prev => {
      const next = { ...prev, [key]: value };
      if (key === "sex") next.role = value === "Macho" ? "Reprodutor" : "Matriz";
      if (key === "species") {
        const firstPen = pens.find(p => p.category === value) || pens.find(p => p.category === "Misto") || pens[0];
        next.penId = firstPen?.id || prev.penId;
      }
      return next;
    });
  }

  function save(e) {
    e.preventDefault();
    const prefix = speciesMeta[form.species]?.short || "ANI";
    const missingData = String(form.missingDataText || "")
      .split(";")
      .map(item => item.trim())
      .filter(Boolean);
    const normalized = {
      ...(animal || {}),
      ...form,
      id: animal?.id || uid(prefix),
      role: form.sex === "Macho" ? "Reprodutor" : "Matriz",
      ageMonths: Number(form.ageMonths) || 0,
      weight: Number(form.weight) || 0,
      bodyScore: Number(form.bodyScore) || 0,
      inbreedingBase: Number(form.inbreedingBase) || 0,
      geneticIndex: Number(form.geneticIndex) || 0,
      fertility: Number(form.fertility) || 0,
      pregnancyRate: Number(form.pregnancyRate) || 0,
      productivity: Number(form.productivity) || 0,
      heatTolerance: Number(form.heatTolerance) || 0,
      health: Number(form.health) || 0,
      dataQuality: Number(form.dataQuality) || 0,
      missingData,
      outcomes: animal?.outcomes || [1, 0, 1],
      records: animal?.records || ["animal cadastrado pela equipe", "aguardando validação técnica"],
    };
    delete normalized.missingDataText;
    onSave(normalized);
  }

  return <div className="modal-backdrop">
    <form className="modal-card" onSubmit={save}>
      <div className="compact-title">
        <div>
          <span className="eyebrow">{isEdit ? "Correção de cadastro" : "Novo animal"}</span>
          <h2>{isEdit ? "Editar animal" : "Cadastrar animal"}</h2>
        </div>
        <button type="button" className="icon-action" onClick={onClose}><Icon name="close"/></button>
      </div>

      <div className="edit-photo-strip">
        <AnimalPhoto animal={form} large/>
        <div>
          <strong>{form.name || "Animal sem nome"}</strong>
          <span>{form.species} · {form.breed || "raça pendente"} · {form.role}</span>
        </div>
        <PhotoInput onPhoto={photo => updateField("photo", photo)}/>
      </div>

      <div className="form-grid compact-form">
        <label>Nome<input required value={form.name} onChange={e=>updateField("name", e.target.value)}/></label>
        <label>Espécie<select value={form.species} onChange={e=>updateField("species", e.target.value)}><option>Bovino</option><option>Ovino</option><option>Caprino</option></select></label>
        <label>Sexo<select value={form.sex} onChange={e=>updateField("sex", e.target.value)}><option>Fêmea</option><option>Macho</option></select></label>
        <label>Raça<input required value={form.breed} onChange={e=>updateField("breed", e.target.value)}/></label>
        <label>Linhagem<input required value={form.lineage} onChange={e=>updateField("lineage", e.target.value)}/></label>
        <label>Curral<select value={form.penId} onChange={e=>updateField("penId", e.target.value)}>{compatiblePens.map(p=><option key={p.id} value={p.id}>{p.name} · {p.category}</option>)}</select></label>
        <label>Idade (meses)<input type="number" min="0" value={form.ageMonths} onChange={e=>updateField("ageMonths", e.target.value)}/></label>
        <label>Peso estimado (kg)<input type="number" min="0" value={form.weight} onChange={e=>updateField("weight", e.target.value)}/></label>
        <label>Escore corporal<input type="number" min="1" max="5" step="0.1" value={form.bodyScore} onChange={e=>updateField("bodyScore", e.target.value)}/></label>
        <label>Última inseminação<input type="date" value={form.lastInsemination || ""} onChange={e=>updateField("lastInsemination", e.target.value)}/></label>
        <label className="span-2">Status técnico<input value={form.status} onChange={e=>updateField("status", e.target.value)}/></label>
        <label className="span-3">Pendências de dados <small>Separe por ponto e vírgula</small><input value={form.missingDataText} onChange={e=>updateField("missingDataText", e.target.value)} placeholder="ex.: genealogia paterna; exame andrológico"/></label>
      </div>

      <div className="slider-grid compact-sliders">{["geneticIndex","fertility","pregnancyRate","productivity","heatTolerance","health","dataQuality"].map(k => <label key={k}>{labelMetric(k)}<input type="range" min="40" max="99" value={form[k]} onChange={e=>updateField(k, Number(e.target.value))}/><span>{form[k]}%</span></label>)}</div>
      <div className="modal-actions"><button type="button" className="ghost-action" onClick={onClose}>Cancelar</button><button className="primary-action">{isEdit ? "Salvar alterações" : "Salvar cadastro"}</button></div>
    </form>
  </div>;
}

function labelMetric(k) { return ({ geneticIndex:"Índice genético", fertility:"Fertilidade", pregnancyRate:"Taxa de prenhez", productivity:"Produtividade", heatTolerance:"Adaptação ao calor", health:"Sanidade", dataQuality:"Qualidade dos dados" })[k]; }

export default App;
