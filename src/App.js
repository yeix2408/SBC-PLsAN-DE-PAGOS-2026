import { useState } from "react";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  Building2,
  MapPin,
  ChevronRight,
  ArrowLeft,
  Calendar,
  DollarSign,
  Star,
  Printer,
  CheckCircle,
  Clock,
  Users,
  Home,
  Layers,
  FileText,
  CreditCard,
  Zap,
  Banknote,
  Info,
  Download,
} from "lucide-react";

const rc = (n) => Math.round(Number(n) * 100) / 100;
const usd = (n) =>
  "$ " +
  rc(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const fmtExcel = (d) => {
  const dt = new Date(d);
  return `${String(dt.getDate()).padStart(2, "0")}/${String(
    dt.getMonth() + 1
  ).padStart(2, "0")}/${dt.getFullYear()}`;
};
const addDays = (d, x) => {
  const r = new Date(d);
  r.setDate(r.getDate() + x);
  return r;
};
const addMonths = (d, m) => {
  const r = new Date(d);
  r.setMonth(r.getMonth() + m);
  return r;
};
const moBtw = (d1, d2) =>
  Math.max(
    1,
    (new Date(d2).getFullYear() - new Date(d1).getFullYear()) * 12 +
      new Date(d2).getMonth() -
      new Date(d1).getMonth()
  );
const fmtD = (d) =>
  new Date(d).toLocaleDateString("es-DO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
const fmtL = (d) =>
  new Date(d).toLocaleDateString("es-DO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
const fmtM = (d) =>
  new Date(d).toLocaleDateString("es-DO", { month: "long", year: "numeric" });
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const PROJ = [
  {
    id: "sun",
    name: "Sun District",
    badge: "Proyecto Exclusivo · 5 Edificios",
    loc: "Ciudad del Sol, Bávaro · Punta Cana",
    color: "#2D7D7D",
    cL: "#F0FDFA",
    img: "https://i.imgur.com/iWcNgH0.jpeg",
    desc: "Apartamentos con concepto urbano en Bávaro – Punta Cana. Cinco edificios de cinco niveles con ascensores privados. Cocina modular, lavadora-secadora tipo torre, A/C por habitación y gas común incluido.",
    hl: "Terraza con jacuzzi disponible para cualquier unidad · Airbnb & Pet Friendly",
    fases: [
      {
        id: "f1",
        lbl: "Fase 1",
        info: "Edificios D y E",
        del: "2026-07-31",
        ok: true,
      },
      {
        id: "f2",
        lbl: "Fase 2",
        info: "Edificio A",
        del: "2026-10-31",
        ok: true,
      },
      {
        id: "f3",
        lbl: "Fase 3",
        info: "Edificios B y C",
        del: "2027-01-31",
        ok: true,
      },
    ],
    tips: [
      {
        id: "arena",
        name: "Tipología Arena",
        area: "50 m²",
        beds: "1 Hab · 1 Baño · 1 Parqueo",
        price: 76354.94,
      },
      {
        id: "mar",
        name: "Tipología Mar",
        area: "50 m²",
        beds: "1 Hab · 1 Baño · 1 Parqueo",
        price: 76354.94,
      },
      {
        id: "coral",
        name: "Tipología Coral",
        area: "60 m²",
        beds: "2 Hab · 1 Baño · 1 Parqueo",
        price: 86413.95,
      },
      {
        id: "sol",
        name: "Tipología Sol",
        area: "70 m²",
        beds: "2 Hab · 2 Baños · 1 Parqueo",
        price: 106223.92,
      },
      {
        id: "terraza",
        name: "Terraza + Jacuzzi",
        area: "Azotea",
        beds: "Add-on independiente",
        price: 17850.0,
        addon: true,
      },
    ],
  },
  {
    id: "sunset",
    name: "Sunset Gardens",
    badge: "489 Unidades · Ecofriendly",
    loc: "Ciudad del Sol, Bávaro · Punta Cana",
    color: "#16A34A",
    cL: "#F0FDF4",
    img: "https://i.imgur.com/e7Agh3Q.jpeg",
    desc: "Proyecto ecofriendly con más de 13,500 m² en áreas verdes, zona comercial al frente y supermercado La Sirena a cruzar la calle. 33% de plusvalía desde enero 2024. Airbnb & Pet Friendly.",
    hl: "33% plusvalía desde enero 2024 · 13,510 m² áreas verdes · Zona comercial incluida",
    fases: [
      {
        id: "f1",
        lbl: "Fase 1",
        info: "Entrega Inmediata",
        del: null,
        imm: true,
        ok: true,
      },
      {
        id: "f2",
        lbl: "Fase 2",
        info: "Entrega Julio 2027",
        del: "2027-07-31",
        ok: true,
      },
      {
        id: "f3",
        lbl: "Fase 3",
        info: "Entrega Abril 2028",
        del: "2028-04-30",
        ok: true,
      },
    ],
    tips: [
      {
        id: "dalia",
        name: "Villa Dalia",
        area: "66.34 m² · Solar 180 m²",
        beds: "2 Hab · 1 Baño · 2 Parqueos",
        price: 107543.69,
      },
      {
        id: "aurora",
        name: "Aurora TH",
        area: "77.59 m² · Solar 112 m²",
        beds: "2 Hab · 1.5 Baños · 2 Niv.",
        price: 110044.61,
        onlyF: ["f1"],
      },
      {
        id: "acacia",
        name: "Villa Acacia",
        area: "71.93 m² · Solar 180 m²",
        beds: "2 Hab · 2 Baños · 2 Parqueos",
        price: 120634.27,
      },
      {
        id: "palmera",
        name: "Villa Palmera",
        area: "89.33 m² · Solar 234 m²",
        beds: "3 Hab · 2 Baños · 2 Parqueos",
        price: 151791.76,
      },
      {
        id: "svilla",
        name: "Sunset Villa",
        area: "154.01 m² · Solar 270 m²",
        beds: "3 Hab · 2.5 Baños · 2 Niv.",
        price: 235999.0,
      },
    ],
  },
  {
    id: "solara",
    name: "Solara Apartments",
    badge: "540 Apartamentos · 12 Edificios",
    loc: "Ciudad del Sol, Bávaro · Punta Cana",
    color: "#E55A00",
    cL: "#FFF7ED",
    img: "https://i.imgur.com/s6psZsX.jpeg",
    desc: "12 edificios con ascensor en Bávaro-Punta Cana. 17 metros entre bloques para vistas panorámicas desde el balcón. Línea blanca incluida (estufa, nevera, lavadora-secadora). Desarrollado con fideicomiso.",
    hl: "Línea blanca incluida · Airbnb & Pet Friendly · Fideicomiso · 10% dto. Restaurante El Morro",
    fases: [
      {
        id: "f1",
        lbl: "Fase 1",
        info: "Bloques A-E · Mayo 2028",
        del: "2028-05-31",
        ok: true,
      },
      {
        id: "f2",
        lbl: "Fase 2",
        info: "Bloques F y G · Agosto 2028",
        del: "2028-08-31",
        ok: true,
      },
      {
        id: "f3",
        lbl: "Fase 3",
        info: "Próximamente",
        del: null,
        ok: false,
        soon: true,
      },
    ],
    tips: [
      {
        id: "tipa",
        name: "Tipología A",
        area: "50 m²",
        beds: "1 Hab · 1 Baño · 1 Parqueo",
        price: 77627.54,
      },
      {
        id: "tipb",
        name: "Tipología B",
        area: "60 m²",
        beds: "2 Hab · 1 Baño · 1 Parqueo",
        price: 87358.95,
      },
      {
        id: "roof",
        name: "Rooftop",
        area: "Desde 36.77 m²",
        beds: "Terraza privada",
        price: 31567.05,
        addon: true,
      },
    ],
  },
];

const PLANS = [
  { id: "10-20", lbl: "10 / 20", ip: 10, cp: 20, tag: "Recomendado" },
  { id: "5-25", lbl: "5 / 25", ip: 5, cp: 25, tag: "Mínima entrada" },
  { id: "15-15", lbl: "15 / 15", ip: 15, cp: 15, tag: "Equilibrado" },
  {
    id: "custom",
    lbl: "Personalizado",
    ip: null,
    cp: null,
    tag: "A tu medida",
  },
];

const Toggle = ({ on, onToggle, label, color = "#2D7D7D" }) => (
  <div
    onClick={onToggle}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      cursor: "pointer",
      userSelect: "none",
    }}
  >
    <div
      style={{
        width: 38,
        height: 21,
        borderRadius: 11,
        background: on ? color : "#CBD5E1",
        position: "relative",
        transition: "background .2s",
        flexShrink: 0,
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 2,
          left: on ? 19 : 2,
          width: 15,
          height: 15,
          borderRadius: "50%",
          background: "white",
          transition: "left .18s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
        }}
      />
    </div>
    {label && (
      <span style={{ fontSize: 12, color: "#475569", fontWeight: 500 }}>
        {label}
      </span>
    )}
  </div>
);

const sh = "0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.05)";
const shH = "0 8px 28px rgba(0,0,0,0.13)";
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&display=swap');
  *{box-sizing:border-box;}
  .pc{transition:transform .2s,box-shadow .2s;cursor:pointer;}
  .pc:hover{transform:translateY(-4px);box-shadow:${shH}!important;}
  .fc{transition:all .18s;cursor:pointer;}
  .fc:hover:not(.dis){transform:translateY(-3px);box-shadow:${shH}!important;}
  .tc{transition:all .15s;}
  .tc:hover:not(.bl){transform:translateY(-2px);box-shadow:${shH}!important;cursor:pointer;}
  .bt{transition:all .15s;cursor:pointer;}
  .bt:hover{filter:brightness(1.1);transform:translateY(-1px);}
  .bk{transition:all .15s;cursor:pointer;}
  .bk:hover{background:#F1F5F9!important;}
  .pl{transition:all .15s;cursor:pointer;}
  .pl:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(0,0,0,0.1)!important;}
  input:focus{border-color:#94A3B8!important;box-shadow:0 0 0 3px rgba(148,163,184,0.15)!important;outline:none;}
  @media(max-width:540px){.g2{grid-template-columns:1fr!important;}}
  @media print{.np{display:none!important;}.ss{max-height:none!important;overflow:visible!important;}}
`;

export default function App() {
  const [step, setStep] = useState("project");
  const [pId, setPId] = useState(null);
  const [fId, setFId] = useState(null);
  const [tId, setTId] = useState(null);
  const [plan, setPlan] = useState(PLANS[0]);
  const [cust, setCust] = useState(10);
  const [custUSD, setCustUSD] = useState("");
  const [client, setClient] = useState("");
  const [broker, setBroker] = useState("");
  const [unit, setUnit] = useState("");
  const [rawP, setRawP] = useState("");
  const [fechaInicio, setFechaInicio] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [reservaAmt, setReservaAmt] = useState("500");
  const [reservaOn, setReservaOn] = useState(true);
  const [useFixedMo, setUseFixedMo] = useState(false);
  const [fixedMoAmt, setFixedMoAmt] = useState("");
  const [extraMonthsList, setExtraMonthsList] = useState([11]); // 11 = Diciembre

  const resetAll = () => {
    setPId(null);
    setFId(null);
    setTId(null);
    setPlan(PLANS[0]);
    setCust(10);
    setCustUSD("");
    setClient("");
    setBroker("");
    setUnit("");
    setRawP("");
    setReservaAmt("500");
    setReservaOn(true);
    setUseFixedMo(false);
    setFixedMoAmt("");
    setExtraMonthsList([11]);
    setFechaInicio(new Date().toISOString().split("T")[0]);
    setStep("project");
  };

  const today = new Date();
  const P = PROJ.find((p) => p.id === pId);
  const F = P?.fases.find((f) => f.id === fId);
  const T = P?.tips.find((t) => t.id === tId);
  const price = rawP
    ? rc(parseFloat(rawP.replace(/[^0-9.]/g, "")))
    : T?.price || 0;
  const ip = plan.id === "custom" ? cust : plan.ip;
  const cp = plan.id === "custom" ? 30 - cust : plan.cp;
  const ipAmt =
    plan.id === "custom" && custUSD
      ? rc(parseFloat(custUSD))
      : rc((price * ip) / 100);
  const cpAmt = rc(price * 0.3 - ipAmt);
  const delivery = F?.del ? new Date(F.del) : null;
  const reservaVal = reservaOn ? rc(parseFloat(reservaAmt || "0")) : 0;

  const calcI = () => rc(ipAmt - reservaVal);
  const calcMo = (n) => rc(cpAmt / n);
  const calcComp = () => rc(rc(price * 0.3) - reservaVal);
  const bankAmt = rc(price * 0.7);

  const handleCustSlider = (v) => {
    setCust(v);
    if (price > 0) setCustUSD(((price * v) / 100).toFixed(2));
  };
  const handleCustUSD = (val) => {
    setCustUSD(val);
    if (price > 0 && val) {
      const exactPercent = (parseFloat(val) / price) * 100;
      setCust(clamp(Number(exactPercent.toFixed(2)), 1, 29));
    }
  };

  const buildSched = () => {
    if (!F || !T) return [];
    const s =
      plan.id === "custom"
        ? new Date(fechaInicio + "T00:00:00")
        : addDays(today, 30);
    const n = moBtw(s, delivery);
    const baseRows =
      reservaVal > 0
        ? [{ date: today, lbl: "Reserva", amt: reservaVal, tp: "r" }]
        : [];

    if (F.imm)
      return [
        ...baseRows,
        {
          date: addDays(today, 20),
          lbl: "Completivo del 30%",
          amt: calcComp(),
          tp: "i",
        },
        { date: addDays(today, 30), lbl: "Contra entrega", amt: null, tp: "e" },
      ];

    const inicial = {
      date: s,
      lbl: `Cuota inicial (${ip}%)`,
      amt: calcI(),
      tp: "i",
    };
    let months;

    if (useFixedMo && fixedMoAmt && parseFloat(fixedMoAmt) > 0) {
      const fmo = rc(parseFloat(fixedMoAmt));
      const totalConst = cpAmt; // usa el monto real, no el %

      // Contar ocurrencias REALES de los meses seleccionados en el período
      const extraOccurrences = Array.from({ length: n }, (_, i) => {
        const rowDate = addMonths(s, i + 1);
        return extraMonthsList.includes(rowDate.getMonth()) ? 1 : 0;
      }).reduce((a, b) => a + b, 0);

      const baseTotal = rc(fmo * n);
      const shortfall = Math.max(0, rc(totalConst - baseTotal));
      const extraAmt =
        extraOccurrences > 0 ? rc(shortfall / extraOccurrences) : 0;

      months = Array.from({ length: n }, (_, i) => {
        const rowDate = addMonths(s, i + 1);
        const isExtraMonth =
          extraMonthsList.includes(rowDate.getMonth()) && extraAmt > 0;
        return {
          date: rowDate,
          lbl:
            i === n - 1
              ? `Último pago (Cuota ${i + 1})`
              : `Cuota ${i + 1} de ${n}`,
          amt: isExtraMonth ? rc(fmo + extraAmt) : fmo,
          tp: i === n - 1 ? "u" : "c",
          extra: isExtraMonth,
        };
      });
    } else {
      // Cuotas iguales estándar
      const mo = calcMo(n);
      months = Array.from({ length: n }, (_, i) => ({
        date: addMonths(s, i + 1),
        lbl:
          i === n - 1
            ? `Último pago (Cuota ${i + 1})`
            : `Cuota ${i + 1} de ${n}`,
        amt: mo,
        tp: i === n - 1 ? "u" : "c",
      }));
    }

    return [
      ...baseRows,
      inicial,
      ...months,
      { date: delivery, lbl: "Contra entrega", amt: null, tp: "e" },
    ];
  };

  const sched = buildSched();
  const nMo = F && !F.imm && delivery ? moBtw(addDays(today, 30), delivery) : 0;

  const exportToPDF = async () => {
    const element = document.getElementById("print-area");
    if (!element) return;
    const originalWidth = element.style.width;
    const scrollableDiv = element.querySelector(".ss");
    let originalMaxHeight = "";
    let originalOverflow = "";
    element.style.width = "800px";
    if (scrollableDiv) {
      originalMaxHeight = scrollableDiv.style.maxHeight;
      originalOverflow = scrollableDiv.style.overflow;
      scrollableDiv.style.maxHeight = "none";
      scrollableDiv.style.overflow = "visible";
    }
    try {
      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: false,
        scale: 2,
        logging: false,
        windowWidth: 800,
      });
      element.style.width = originalWidth;
      if (scrollableDiv) {
        scrollableDiv.style.maxHeight = originalMaxHeight;
        scrollableDiv.style.overflow = originalOverflow;
      }
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`Plan_SBC_${client || "Cliente"}_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Hubo un detalle al encuadrar el PDF. Intenta de nuevo.");
    }
  };

  const exportToExcel = () => {
    const rows = sched.map((item) => ({
      Fecha: fmtExcel(item.date),
      Monto: item.tp === "e" ? bankAmt : rc(item.amt),
      Observación:
        item.tp === "e"
          ? "Contra entrega (70%) - Financiamiento bancario"
          : item.lbl,
    }));
    try {
      const ws = XLSX.utils.json_to_sheet(rows);
      ws["!cols"] = [{ wch: 14 }, { wch: 14 }, { wch: 44 }];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Plan de Pagos");
      XLSX.writeFile(
        wb,
        `Plan_ADM_${(P?.name || "").replace(/ /g, "_")}_${
          client || "cliente"
        }.xlsx`
      );
    } catch {
      const csv =
        "Fecha,Monto,Observación\n" +
        rows.map((r) => `${r.Fecha},${r.Monto},"${r.Observación}"`).join("\n");
      const a = Object.assign(document.createElement("a"), {
        href: URL.createObjectURL(
          new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" })
        ),
        download: "plan_pago_adm.csv",
      });
      a.click();
    }
  };

  const inp = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    border: "1.5px solid #E2E8F0",
    fontSize: 14,
    background: "white",
    color: "#0F172A",
    fontFamily: "inherit",
    transition: "border-color .15s,box-shadow .15s",
  };

  const secTitle = (icon, label) => (
    <div
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: "#64748B",
        textTransform: "uppercase",
        letterSpacing: 0.6,
        marginBottom: 12,
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      {icon}
      {label}
    </div>
  );

  const Hdr = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 20px",
        background: "white",
        borderBottom: "1px solid #F1F5F9",
        position: "sticky",
        top: 0,
        zIndex: 20,
        boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img
          src="https://i.imgur.com/PC29UvP.png"
          alt="Logo Sánchez Business"
          style={{ height: 48, width: "auto", borderRadius: 9 }}
          onError={(e) => (e.target.style.display = "none")}
        />
        <div>
          <div
            style={{
              fontFamily: "'Montserrat',sans-serif",
              fontWeight: 900,
              fontSize: 10,
              color: "#0F172A",
              letterSpacing: 0.6,
              textTransform: "uppercase",
            }}
          >
            SÁNCHEZ BUSINESS & CORP.
          </div>
          <div
            style={{
              fontFamily: "'Montserrat',sans-serif",
              fontSize: 10,
              fontWeight: 700,
              color: "#475569",
              marginTop: 2,
            }}
          >
            Generador de Planes de Pago
          </div>
        </div>
      </div>
      {P && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: P.cL,
            border: `1px solid ${P.color}33`,
            padding: "5px 12px",
            borderRadius: 20,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: P.color,
            }}
          />
          <span style={{ fontSize: 11, fontWeight: 600, color: P.color }}>
            {P.name}
          </span>
        </div>
      )}
    </div>
  );

  const Back = ({ to }) => (
    <button
      className="bk"
      onClick={() => setStep(to)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        background: "transparent",
        border: "none",
        color: "#64748B",
        fontSize: 13,
        fontWeight: 500,
        padding: "6px 10px 6px 6px",
        borderRadius: 8,
        marginBottom: 16,
        fontFamily: "inherit",
      }}
    >
      <ArrowLeft size={15} /> Volver
    </button>
  );

  const StepBar = ({ cur }) => {
    const ss = ["project", "fase", "tipologia", "config", "preview"];
    const ll = ["Proyecto", "Fase", "Tipología", "Plan", "Vista"];
    const idx = ss.indexOf(cur);
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "14px 20px",
          background: P?.cL || "#F8FAFC",
          borderBottom: `2px solid ${P?.color || "#E2E8F0"}22`,
        }}
      >
        {ss.map((s, i) => [
          <div
            key={s}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: i <= idx ? P?.color || "#6366F1" : "#E2E8F0",
                fontSize: 10,
                fontWeight: 700,
                color: i <= idx ? "white" : "#94A3B8",
                boxShadow:
                  i === idx ? `0 0 0 4px ${P?.color || "#6366F1"}22` : "none",
                transition: "all .2s",
              }}
            >
              {i < idx ? <CheckCircle size={12} /> : i + 1}
            </div>
            <span
              style={{
                fontSize: 9,
                fontWeight: i === idx ? 700 : 400,
                color: i <= idx ? P?.color || "#6366F1" : "#94A3B8",
                whiteSpace: "nowrap",
              }}
            >
              {ll[i]}
            </span>
          </div>,
          i < 4 && (
            <div
              key={`l${i}`}
              style={{
                flex: 1,
                height: 2,
                background: i < idx ? P?.color || "#6366F1" : "#E2E8F0",
                borderRadius: 1,
                marginBottom: 14,
                minWidth: 8,
                transition: "background .3s",
              }}
            />
          ),
        ])}
      </div>
    );
  };

  // ── STEP 1 ──────────────────────────────────────────
  if (step === "project")
    return (
      <div
        style={{
          fontFamily: "'Inter',-apple-system,sans-serif",
          background: "#F8FAFC",
          minHeight: "100vh",
        }}
      >
        <style>{CSS}</style>
        <Hdr />
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 16px" }}>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#0F172A",
              margin: "0 0 4px",
            }}
          >
            Selecciona el proyecto
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "#64748B",
              margin: "0 0 20px",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Building2 size={13} /> Todos dentro de Ciudad del Sol · Residencial
            privado de más de 13 años
          </p>
          <div style={{ display: "grid", gap: 18 }}>
            {PROJ.map((p) => (
              <div
                key={p.id}
                className="pc"
                onClick={() => {
                  setPId(p.id);
                  setFId(null);
                  setTId(null);
                  setPlan(PLANS[0]);
                  setStep("fase");
                }}
                style={{
                  background: "white",
                  borderRadius: 18,
                  boxShadow: sh,
                  overflow: "hidden",
                  border: "1px solid #F1F5F9",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    height: 180,
                    overflow: "hidden",
                    background: p.color,
                  }}
                >
                  <img
                    src={p.img}
                    alt={p.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(to top, ${p.color}EE 0%, transparent 60%)`,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "16px 20px",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: "white",
                        margin: "0 0 4px",
                        textShadow: "0 1px 4px rgba(0,0,0,0.3)",
                      }}
                    >
                      {p.name}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        color: "rgba(255,255,255,0.85)",
                        fontSize: 12,
                      }}
                    >
                      <MapPin size={12} />
                      {p.loc}
                    </div>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      background: "rgba(0,0,0,0.45)",
                      backdropFilter: "blur(4px)",
                      padding: "4px 10px",
                      borderRadius: 20,
                    }}
                  >
                    <span
                      style={{ fontSize: 10, fontWeight: 600, color: "white" }}
                    >
                      {p.badge}
                    </span>
                  </div>
                </div>
                <div style={{ padding: "16px 20px 20px" }}>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#475569",
                      lineHeight: 1.6,
                      margin: "0 0 12px",
                    }}
                  >
                    {p.desc}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      padding: "10px 12px",
                      background: p.cL,
                      borderRadius: 10,
                      border: `1px solid ${p.color}22`,
                      marginBottom: 14,
                    }}
                  >
                    <Star
                      size={13}
                      color={p.color}
                      style={{ flexShrink: 0, marginTop: 1 }}
                    />
                    <span
                      style={{
                        fontSize: 12,
                        color: p.color,
                        fontWeight: 500,
                        lineHeight: 1.5,
                      }}
                    >
                      {p.hl}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", gap: 6 }}>
                      {p.fases.map((f) => (
                        <span
                          key={f.id}
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            padding: "3px 8px",
                            borderRadius: 6,
                            background: f.ok ? p.color + "18" : "#F1F5F9",
                            color: f.ok ? p.color : "#94A3B8",
                          }}
                        >
                          {f.lbl}
                        </span>
                      ))}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        background: p.color,
                        color: "white",
                        padding: "8px 14px",
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      Ver fases <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  // ── STEP 2 ──────────────────────────────────────────
  if (step === "fase")
    return (
      <div
        style={{
          fontFamily: "'Inter',-apple-system,sans-serif",
          background: "#F8FAFC",
          minHeight: "100vh",
        }}
      >
        <style>{CSS}</style>
        <Hdr />
        <StepBar cur="fase" />
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 16px" }}>
          <Back to="project" />
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#0F172A",
              margin: "0 0 4px",
            }}
          >
            Selecciona la fase
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "#64748B",
              margin: "0 0 20px",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Layers size={13} /> Elige el bloque y fecha de entrega de interés
          </p>
          <div style={{ display: "grid", gap: 12 }}>
            {P.fases.map((f) => (
              <div
                key={f.id}
                className={`fc${!f.ok ? " dis" : ""}`}
                onClick={() => {
                  if (!f.ok) return;
                  setFId(f.id);
                  setStep("tipologia");
                }}
                style={{
                  background: "white",
                  borderRadius: 14,
                  boxShadow: sh,
                  border: `2px solid ${
                    !f.ok ? "#E2E8F0" : F?.id === f.id ? P.color : "#F1F5F9"
                  }`,
                  overflow: "hidden",
                  opacity: f.ok ? 1 : 0.55,
                }}
              >
                <div style={{ display: "flex", alignItems: "stretch" }}>
                  <div
                    style={{
                      width: 6,
                      background: f.ok
                        ? f.imm
                          ? "#059669"
                          : P.color
                        : "#CBD5E1",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, padding: "16px 18px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            background: f.ok
                              ? f.imm
                                ? "#059669"
                                : P.color
                              : "#6B7280",
                            color: "white",
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "3px 10px",
                            borderRadius: 20,
                          }}
                        >
                          {f.lbl}
                        </span>
                        {f.imm && (
                          <span
                            style={{
                              background: "#DCFCE7",
                              color: "#15803D",
                              fontSize: 11,
                              fontWeight: 600,
                              padding: "3px 10px",
                              borderRadius: 20,
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <Zap size={10} />
                            Entrega Inmediata
                          </span>
                        )}
                        {f.soon && (
                          <span
                            style={{
                              background: "#FEF9C3",
                              color: "#854D0E",
                              fontSize: 11,
                              fontWeight: 600,
                              padding: "3px 10px",
                              borderRadius: 20,
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <Clock size={10} />
                            Próximamente
                          </span>
                        )}
                      </div>
                      {f.ok && <ChevronRight size={16} color={P.color} />}
                    </div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 15,
                        color: "#0F172A",
                        marginBottom: 3,
                      }}
                    >
                      {f.info}
                    </div>
                    {f.del && (
                      <div
                        style={{
                          fontSize: 12,
                          color: "#64748B",
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <Calendar size={12} color={P.color} /> Entrega:{" "}
                        {fmtM(f.del)}
                      </div>
                    )}
                    {f.imm && (
                      <div
                        style={{
                          marginTop: 10,
                          padding: "10px 12px",
                          background: P.cL,
                          borderRadius: 8,
                          fontSize: 12,
                          color: P.color,
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 6,
                        }}
                      >
                        <Info
                          size={13}
                          style={{ flexShrink: 0, marginTop: 1 }}
                        />
                        ${"500.00"} reserva → Completivo 30% al día 20 → Contra
                        entrega al día 30
                      </div>
                    )}
                    {f.ok && !f.imm && f.del && (
                      <div
                        style={{ marginTop: 8, fontSize: 12, color: "#64748B" }}
                      >
                        Cuotas mensuales hasta {fmtM(f.del)} · Último pago y
                        contra entrega en el mismo mes
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  // ── STEP 3 ──────────────────────────────────────────
  if (step === "tipologia") {
    const tips = P.tips.map((t) => ({
      ...t,
      blocked: t.onlyF && !t.onlyF.includes(fId),
    }));
    return (
      <div
        style={{
          fontFamily: "'Inter',-apple-system,sans-serif",
          background: "#F8FAFC",
          minHeight: "100vh",
        }}
      >
        <style>{CSS}</style>
        <Hdr />
        <StepBar cur="tipologia" />
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 16px" }}>
          <Back to="fase" />
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#0F172A",
              margin: "0 0 4px",
            }}
          >
            Selecciona la tipología
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "#64748B",
              margin: "0 0 20px",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Home size={13} /> {F.lbl} · {F.info}
          </p>
          <div style={{ display: "grid", gap: 10 }}>
            {tips.map((t) => (
              <div
                key={t.id}
                className={`tc${t.blocked ? " bl" : ""}`}
                onClick={() => {
                  if (t.blocked) return;
                  setTId(t.id);
                  setRawP(t.price.toString());
                  setCustUSD(((t.price * cust) / 100).toFixed(2));
                  setStep("config");
                }}
                style={{
                  background: "white",
                  borderRadius: 14,
                  boxShadow: sh,
                  border: `2px solid ${
                    !t.blocked && tId === t.id ? P.color : "#F1F5F9"
                  }`,
                  display: "flex",
                  alignItems: "center",
                  overflow: "hidden",
                  opacity: t.blocked ? 0.4 : 1,
                }}
              >
                <div
                  style={{
                    width: 5,
                    background: t.blocked ? "#CBD5E1" : P.color,
                    alignSelf: "stretch",
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    padding: "14px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        marginBottom: 4,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: 14,
                          color: "#0F172A",
                        }}
                      >
                        {t.name}
                      </span>
                      {t.addon && (
                        <span
                          style={{
                            background: P.color + "18",
                            color: P.color,
                            fontSize: 10,
                            fontWeight: 600,
                            padding: "2px 8px",
                            borderRadius: 6,
                          }}
                        >
                          Add-on
                        </span>
                      )}
                      {t.blocked && (
                        <span
                          style={{
                            background: "#F1F5F9",
                            color: "#6B7280",
                            fontSize: 10,
                            fontWeight: 600,
                            padding: "2px 8px",
                            borderRadius: 6,
                          }}
                        >
                          Solo Fase 1
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: "#475569" }}>
                      {t.area}
                    </div>
                    <div
                      style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}
                    >
                      {t.beds}
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      flexShrink: 0,
                      marginLeft: 12,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 16,
                        color: t.blocked ? "#94A3B8" : P.color,
                      }}
                    >
                      {usd(t.price)}
                    </div>
                    <div style={{ fontSize: 10, color: "#94A3B8" }}>desde</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── STEP 4 ──────────────────────────────────────────
  if (step === "config") {
    const nPrev = !F.imm && delivery ? moBtw(addDays(today, 30), delivery) : 0;
    const fmo = parseFloat(fixedMoAmt) || 0;
    const totalConst = cpAmt; // usa el monto real, no el %

    // Calcular ocurrencias reales de meses seleccionados para el resumen en UI
    const s_preview =
      plan.id === "custom"
        ? new Date(fechaInicio + "T00:00:00")
        : addDays(today, 30);
    const extraOccurrencesPreview = delivery
      ? Array.from({ length: nPrev }, (_, i) => {
          const rowDate = addMonths(s_preview, i + 1);
          return extraMonthsList.includes(rowDate.getMonth()) ? 1 : 0;
        }).reduce((a, b) => a + b, 0)
      : 0;
    const baseTotalPreview = rc(fmo * nPrev);
    const shortfallPreview = Math.max(0, rc(totalConst - baseTotalPreview));
    const extraAmtPreview =
      extraOccurrencesPreview > 0
        ? rc(shortfallPreview / extraOccurrencesPreview)
        : 0;

    const custUSDDisplay =
      custUSD || (price > 0 ? ((price * cust) / 100).toFixed(2) : "");

    return (
      <div
        style={{
          fontFamily: "'Inter',-apple-system,sans-serif",
          background: "#F8FAFC",
          minHeight: "100vh",
        }}
      >
        <style>{CSS}</style>
        <Hdr />
        <StepBar cur="config" />
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 16px" }}>
          <Back to="tipologia" />
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#0F172A",
              margin: "0 0 4px",
            }}
          >
            Configura el plan de pago
          </h2>
          <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 20px" }}>
            {P.name} · {F.lbl} · {T.name}
          </p>

          {/* SECCIÓN 1: INFORMACIÓN Y PRECIO */}
          <div
            style={{
              background: "white",
              borderRadius: 14,
              boxShadow: sh,
              padding: "20px",
              marginBottom: 14,
              border: "1px solid #F1F5F9",
            }}
          >
            {secTitle(<Users size={13} />, "Información")}
            <div style={{ display: "grid", gap: 10 }}>
              <input
                style={inp}
                placeholder="Nombre del cliente"
                value={client}
                onChange={(e) => setClient(e.target.value)}
              />
              <input
                style={inp}
                placeholder="Nombre del broker"
                value={broker}
                onChange={(e) => setBroker(e.target.value)}
              />
              <input
                style={inp}
                placeholder="Número de unidad (ej: SG-127, D-1E)"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
              {pId === "sunset" && unit && (
                <div
                  style={{
                    background: "#FFFBEB",
                    border: "1.5px solid #F59E0B",
                    borderRadius: 10,
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                  }}
                >
                  <Info
                    size={15}
                    color="#D97706"
                    style={{ flexShrink: 0, marginTop: 1 }}
                  />
                  <span
                    style={{ fontSize: 12, color: "#92400E", lineHeight: 1.6 }}
                  >
                    ⚠️ Asegúrate de que el precio indicado corresponde a la
                    unidad <strong>{unit}</strong> según la disponibilidad
                    vigente.
                  </span>
                </div>
              )}
              {plan.id === "custom" && (
                <div style={{ marginTop: 5 }}>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "#64748B",
                      marginBottom: 5,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    📅 Fecha del primer pago (Solo Personalizado)
                  </label>
                  <input
                    type="date"
                    style={inp}
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                  />
                </div>
              )}
              <div>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#64748B",
                    marginBottom: 5,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <DollarSign size={12} /> Precio de la unidad (ajustable)
                </label>
                <input
                  type="number"
                  step="0.01"
                  style={inp}
                  value={rawP}
                  onChange={(e) => setRawP(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: RESERVA */}
          <div
            style={{
              background: "white",
              borderRadius: 14,
              boxShadow: sh,
              padding: "20px",
              marginBottom: 14,
              border: "1px solid #F1F5F9",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              {secTitle(<DollarSign size={13} />, "Reserva")}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: "#64748B" }}>
                  {reservaOn ? "Con reserva" : "Sin reserva"}
                </span>
                <Toggle
                  on={reservaOn}
                  onToggle={() => setReservaOn(!reservaOn)}
                  color={P.color}
                />
              </div>
            </div>
            {reservaOn ? (
              <div style={{ marginTop: 10 }}>
                <label
                  style={{
                    fontSize: 12,
                    color: "#64748B",
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  Monto de reserva (USD)
                </label>
                <input
                  type="number"
                  style={inp}
                  value={reservaAmt}
                  onChange={(e) => setReservaAmt(e.target.value)}
                  placeholder="500.00"
                />
              </div>
            ) : (
              <div
                style={{
                  background: "#FFFBEB",
                  padding: "10px",
                  borderRadius: 8,
                  border: "1px solid #FEF3C7",
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <Info size={14} color="#D97706" />
                <span style={{ fontSize: 11, color: "#92400E" }}>
                  El monto de reserva se sumará automáticamente al inicial.
                  Ideal para clientes con notas de crédito.
                </span>
              </div>
            )}
          </div>

          {/* SECCIÓN 3: PLAN DE PAGO */}
          {F.imm ? (
            <div
              style={{
                background: P.cL,
                border: `1.5px solid ${P.color}44`,
                borderRadius: 14,
                padding: "18px 20px",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 13,
                  color: P.color,
                  marginBottom: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Zap size={14} />
                Plan especial — Entrega Inmediata
              </div>
              {[
                [
                  "Reserva (hoy)",
                  reservaVal > 0 ? usd(reservaVal) : "$ 0.00 (sin reserva)",
                  "r",
                ],
                ["Completivo 30% (día 20)", usd(calcComp()), "i"],
                [
                  "Contra entrega (día 30)",
                  "70% · Financiamiento bancario",
                  "e",
                ],
              ].map(([l, v, t]) => (
                <div
                  key={l}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: "1px solid " + P.color + "18",
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      color: t === "e" ? "#64748B" : "#374151",
                    }}
                  >
                    {l}
                  </span>
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: 13,
                      color: t === "e" ? "#94A3B8" : P.color,
                    }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                background: "white",
                borderRadius: 14,
                boxShadow: sh,
                padding: "20px",
                marginBottom: 14,
                border: "1px solid #F1F5F9",
              }}
            >
              {secTitle(
                <CreditCard size={13} />,
                "Plan de pago (30% durante construcción)"
              )}
              <div
                className="g2"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                {PLANS.map((pl) => (
                  <div
                    key={pl.id}
                    className="pl"
                    onClick={() => setPlan(pl)}
                    style={{
                      padding: "14px 16px",
                      borderRadius: 12,
                      border: `2px solid ${
                        plan.id === pl.id ? P.color : "#E2E8F0"
                      }`,
                      background: plan.id === pl.id ? P.cL : "white",
                      boxShadow: sh,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 18,
                        color: plan.id === pl.id ? P.color : "#0F172A",
                      }}
                    >
                      {pl.lbl}
                    </div>
                    <div
                      style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}
                    >
                      {pl.tag}
                    </div>
                    {pl.id !== "custom" && (
                      <div
                        style={{
                          fontSize: 11,
                          color: plan.id === pl.id ? P.color : "#94A3B8",
                          marginTop: 4,
                          fontWeight: 600,
                        }}
                      >
                        {pl.ip}% inicial · {pl.cp}% construcción
                      </div>
                    )}
                    {pl.id === "custom" && (
                      <div
                        style={{ fontSize: 10, color: "#94A3B8", marginTop: 3 }}
                      >
                        Define tu % de entrada
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {plan.id === "custom" && (
                <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 14 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                      color: "#64748B",
                      marginBottom: 10,
                      fontWeight: 600,
                    }}
                  >
                    <span>
                      Inicial:{" "}
                      <strong style={{ color: P.color }}>
                        {cust}% = {usd(ipAmt)}
                      </strong>
                    </span>
                    <span>
                      Construcción:{" "}
                      <strong style={{ color: "#0F172A" }}>
                        {30 - cust}% = {usd((price * (30 - cust)) / 100)}
                      </strong>
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={29}
                    step={1}
                    value={cust}
                    onChange={(e) => handleCustSlider(Number(e.target.value))}
                    style={{ width: "100%", marginBottom: 12 }}
                  />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 10,
                    }}
                  >
                    <div>
                      <label
                        style={{
                          fontSize: 11,
                          color: "#64748B",
                          fontWeight: 500,
                          display: "block",
                          marginBottom: 5,
                        }}
                      >
                        % Inicial
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={29}
                        style={{ ...inp, background: "#F8FAFC" }}
                        value={cust}
                        onChange={(e) =>
                          handleCustSlider(clamp(Number(e.target.value), 1, 29))
                        }
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: 11,
                          color: "#64748B",
                          fontWeight: 500,
                          display: "block",
                          marginBottom: 5,
                        }}
                      >
                        Monto inicial (USD)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        style={inp}
                        value={custUSDDisplay}
                        onChange={(e) => handleCustUSD(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECCIÓN 4: CUOTAS PERSONALIZADAS CON SELECTOR DE MESES */}
          {!F.imm && (
            <div
              style={{
                background: "white",
                borderRadius: 14,
                boxShadow: sh,
                padding: "20px",
                marginBottom: 14,
                border: "1px solid #F1F5F9",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: useFixedMo ? 14 : 0,
                }}
              >
                {secTitle(<Calendar size={13} />, "Cuotas personalizadas")}
                <Toggle
                  on={useFixedMo}
                  onToggle={() => setUseFixedMo((o) => !o)}
                  color={P.color}
                />
              </div>

              {useFixedMo && (
                <>
                  {/* Cuota mínima */}
                  <div style={{ marginBottom: 16 }}>
                    <label
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: "#64748B",
                        display: "block",
                        marginBottom: 5,
                      }}
                    >
                      💵 Cuota mínima mensual (USD)
                    </label>
                    <input
                      type="number"
                      style={inp}
                      value={fixedMoAmt}
                      onChange={(e) => setFixedMoAmt(e.target.value)}
                      placeholder="ej. 300"
                    />
                  </div>

                  {/* Selector de meses extraordinarios */}
                  <div style={{ marginBottom: 14 }}>
                    <label
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: "#64748B",
                        marginBottom: 8,
                        display: "block",
                      }}
                    >
                      📅 Meses de pago extraordinario
                    </label>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: 6,
                      }}
                    >
                      {[
                        "Ene",
                        "Feb",
                        "Mar",
                        "Abr",
                        "May",
                        "Jun",
                        "Jul",
                        "Ago",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dic",
                      ].map((mes, idx) => {
                        const selected = extraMonthsList.includes(idx);
                        return (
                          <div
                            key={idx}
                            onClick={() =>
                              setExtraMonthsList((prev) =>
                                prev.includes(idx)
                                  ? prev.filter((m) => m !== idx)
                                  : [...prev, idx]
                              )
                            }
                            style={{
                              padding: "8px 4px",
                              borderRadius: 8,
                              border: `2px solid ${
                                selected ? P.color : "#E2E8F0"
                              }`,
                              background: selected ? P.cL : "white",
                              textAlign: "center",
                              fontSize: 11,
                              fontWeight: selected ? 700 : 400,
                              color: selected ? P.color : "#64748B",
                              cursor: "pointer",
                              transition: "all .15s",
                            }}
                          >
                            {mes}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Resumen del cálculo */}
                  {fixedMoAmt && price > 0 && delivery && (
                    <div
                      style={{
                        padding: "12px 14px",
                        background: P.cL,
                        borderRadius: 10,
                        border: `1px solid ${P.color}33`,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          color: "#374151",
                          lineHeight: 1.8,
                        }}
                      >
                        <div>
                          📆 Meses totales: <strong>{nPrev}</strong>
                        </div>
                        <div>
                          📌 Meses extraordinarios encontrados:{" "}
                          <strong>{extraOccurrencesPreview}</strong>
                        </div>
                        <div>
                          💰 Extra por mes seleccionado:{" "}
                          <strong>{usd(extraAmtPreview)}</strong>
                        </div>
                        <div>
                          🎯 Total a cubrir (30%):{" "}
                          <strong>{usd(totalConst)}</strong>
                        </div>
                        <div
                          style={{
                            color:
                              Math.abs(
                                rc(
                                  totalConst -
                                    rc(
                                      baseTotalPreview +
                                        extraAmtPreview *
                                          extraOccurrencesPreview
                                    )
                                )
                              ) < 0.05
                                ? "#16A34A"
                                : "#DC2626",
                            fontWeight: 700,
                          }}
                        >
                          {Math.abs(
                            rc(
                              totalConst -
                                rc(
                                  baseTotalPreview +
                                    extraAmtPreview * extraOccurrencesPreview
                                )
                            )
                          ) < 0.05
                            ? "✅ Balance exacto"
                            : `⚠️ Diferencia: ${usd(
                                Math.abs(
                                  rc(
                                    totalConst -
                                      rc(
                                        baseTotalPreview +
                                          extraAmtPreview *
                                            extraOccurrencesPreview
                                      )
                                  )
                                )
                              )}`}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {!useFixedMo && (
                <p
                  style={{ fontSize: 12, color: "#94A3B8", margin: "10px 0 0" }}
                >
                  Activa para definir una cuota mínima mensual y seleccionar
                  meses específicos para pagos extraordinarios.
                </p>
              )}
            </div>
          )}

          {/* RESUMEN */}
          {!F.imm && (
            <div
              style={{
                background: "#0F172A",
                borderRadius: 14,
                padding: "18px 20px",
                marginBottom: 20,
              }}
            >
              {secTitle(<FileText size={12} />, "Resumen del plan")}
              {[
                ["Reserva (hoy)", reservaVal > 0 ? usd(reservaVal) : "$ 0.00"],
                [`Inicial a 30 días (${ip}%)`, usd(calcI())],
                [
                  nPrev + ` cuotas mensuales (${cp}%)`,
                  useFixedMo && fixedMoAmt
                    ? usd(parseFloat(fixedMoAmt) || 0) + "/mes base"
                    : usd(calcMo(nPrev)) + "/mes",
                ],
                ["Entrega estimada", fmtM(delivery)],
              ].map(([l, v]) => (
                <div
                  key={l}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 9,
                  }}
                >
                  <span style={{ fontSize: 13, color: "#94A3B8" }}>{l}</span>
                  <span
                    style={{ fontWeight: 600, fontSize: 13, color: "white" }}
                  >
                    {v}
                  </span>
                </div>
              ))}
              <div
                style={{
                  borderTop: "1px solid #1E293B",
                  paddingTop: 10,
                  marginTop: 4,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 13, color: "#64748B" }}>
                  Precio total
                </span>
                <span style={{ fontWeight: 700, fontSize: 16, color: P.color }}>
                  {usd(price)}
                </span>
              </div>
            </div>
          )}

          <button
            className="bt"
            onClick={() => setStep("preview")}
            disabled={!price || price < 100}
            style={{
              width: "100%",
              background: P.color,
              color: "white",
              border: "none",
              borderRadius: 12,
              padding: "14px",
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: `0 4px 14px ${P.color}55`,
              opacity: !price || price < 100 ? 0.4 : 1,
            }}
          >
            <FileText size={16} /> Ver plan completo
          </button>
        </div>
      </div>
    );
  }

  // ── STEP 5: PREVIEW ──────────────────────────────────────────
  return (
    <div
      style={{
        fontFamily: "'Inter',-apple-system,sans-serif",
        background: "#F8FAFC",
        minHeight: "100vh",
      }}
    >
      <style>{CSS}</style>
      <div
        className="np"
        style={{
          background: "white",
          padding: "12px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #F1F5F9",
          position: "sticky",
          top: 0,
          zIndex: 20,
          boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
        }}
      >
        <button
          className="bt"
          onClick={resetAll}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: "#0F172A",
            color: "white",
            border: "1.5px solid #334155",
            borderRadius: 10,
            padding: "8px 14px",
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "inherit",
          }}
        >
          <Home size={13} /> Nuevo plan
        </button>
        <button
          className="bk"
          onClick={() => setStep("config")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: "transparent",
            border: "none",
            color: "#64748B",
            fontSize: 13,
            fontWeight: 500,
            padding: "6px 10px 6px 6px",
            borderRadius: 8,
            fontFamily: "inherit",
          }}
        >
          <ArrowLeft size={15} /> Editar
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: P.color,
            }}
          />
          <span style={{ fontWeight: 600, fontSize: 13, color: "#0F172A" }}>
            {P.name} · {F.lbl}
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="bt"
            onClick={exportToExcel}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: "#16A34A",
              color: "white",
              border: "none",
              borderRadius: 10,
              padding: "8px 14px",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "inherit",
              boxShadow: "0 3px 10px #16A34A44",
            }}
          >
            <Download size={13} /> Excel ADM
          </button>
          <button
            className="bt"
            onClick={exportToPDF}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: P.color,
              color: "white",
              border: "none",
              borderRadius: 10,
              padding: "8px 14px",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "inherit",
              boxShadow: `0 3px 10px ${P.color}44`,
            }}
          >
            <Printer size={13} /> PDF
          </button>
        </div>
      </div>

      <div
        id="print-area"
        style={{ maxWidth: 700, margin: "0 auto", padding: "28px 20px" }}
      >
        {/* Doc header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src="https://i.imgur.com/PC29UvP.png"
              crossOrigin="anonymous"
              alt="Logo Sánchez Business"
              style={{ height: "44px", width: "auto" }}
              onError={(e) => (e.target.style.display = "none")}
            />
            <div>
              <div
                style={{
                  fontFamily: "'Montserrat',sans-serif",
                  fontWeight: 900,
                  fontSize: 14,
                  color: "#0F172A",
                  letterSpacing: 0.5,
                }}
              >
                SÁNCHEZ BUSINESS & CORP.
              </div>
              <div style={{ fontSize: 11, color: "#94A3B8" }}>
                Ciudad del Sol · Punta Cana · República Dominicana
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 10,
                color: "#94A3B8",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Fecha del plan
            </div>
            <div style={{ fontWeight: 600, fontSize: 13, color: "#0F172A" }}>
              {fmtL(today)}
            </div>
          </div>
        </div>

        {/* Hero */}
        <div
          style={{
            borderRadius: 18,
            overflow: "hidden",
            marginBottom: 18,
            position: "relative",
            height: 200,
            boxShadow: sh,
            background: P.color,
          }}
        >
          <img
            src={`${P.img}?not-cache=${new Date().getTime()}`}
            alt={P.name}
            crossOrigin="anonymous"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.52)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              padding: "22px 26px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 8,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  background: P.color,
                  color: "white",
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "4px 12px",
                  borderRadius: 20,
                }}
              >
                {P.badge}
              </span>
              <span
                style={{
                  background: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "4px 12px",
                  borderRadius: 20,
                  backdropFilter: "blur(4px)",
                }}
              >
                {F.lbl} · {F.info}
              </span>
            </div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 700,
                margin: "0 0 4px",
                color: "white",
              }}
            >
              {P.name}
            </h1>
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.75)",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <MapPin size={12} />
              {P.loc}
            </div>
          </div>
        </div>

        {/* Description */}
        <div
          style={{
            background: "white",
            borderRadius: 14,
            padding: "16px 20px",
            marginBottom: 14,
            boxShadow: sh,
            border: "1px solid #F1F5F9",
          }}
        >
          <p
            style={{
              fontSize: 13,
              color: "#475569",
              lineHeight: 1.65,
              margin: "0 0 10px",
            }}
          >
            {P.desc}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 7,
              padding: "9px 12px",
              background: P.cL,
              borderRadius: 9,
              border: `1px solid ${P.color}22`,
            }}
          >
            <Star
              size={13}
              color={P.color}
              style={{ flexShrink: 0, marginTop: 1 }}
            />
            <span
              style={{
                fontSize: 12,
                color: P.color,
                fontWeight: 500,
                lineHeight: 1.5,
              }}
            >
              {P.hl}
            </span>
          </div>
        </div>

        {/* Client + Unit */}
        <div
          className="g2"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 14,
          }}
        >
          {[
            [
              "Cliente",
              <Users size={13} color={P.color} />,
              client || "–",
              "Broker: " + (broker || "–") + (unit ? " · Unidad: " + unit : ""),
            ],
            ["Tipología", <Home size={13} color={P.color} />, T.name, T.area],
          ].map(([lbl, icon, main, sub]) => (
            <div
              key={lbl}
              style={{
                background: "white",
                borderRadius: 14,
                padding: "16px",
                boxShadow: sh,
                border: "1px solid #F1F5F9",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#94A3B8",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                  marginBottom: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                {icon}
                {lbl}
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#0F172A" }}>
                {main}
              </div>
              <div style={{ fontSize: 12, color: "#64748B", marginTop: 3 }}>
                {sub}
              </div>
            </div>
          ))}
        </div>

        {/* Summary bar */}
        <div
          style={{
            background: "#0F172A",
            borderRadius: 14,
            padding: "16px 20px",
            marginBottom: 14,
            display: "grid",
            gridTemplateColumns: `repeat(${F.imm ? 2 : 3},1fr)`,
            gap: 12,
          }}
        >
          {[
            ["Precio Total", usd(price), P.color],
            ...(!F.imm
              ? [
                  [
                    "Plan",
                    plan.id === "custom" ? `${ip}%/${cp}%` : plan.lbl,
                    "white",
                  ],
                ]
              : []),
            ["Entrega", F.imm ? "Inmediata" : fmtM(delivery), "white"],
          ].map(([l, v, c], i) => (
            <div
              key={l}
              style={{
                textAlign: "center",
                borderLeft: i > 0 ? "1px solid #1E293B" : "none",
                paddingLeft: i > 0 ? 12 : 0,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#64748B",
                  marginBottom: 4,
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                }}
              >
                {l}
              </div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: i === 0 ? 18 : 14,
                  color: c,
                }}
              >
                {v}
              </div>
            </div>
          ))}
        </div>

        {/* Schedule */}
        <div
          style={{
            background: "white",
            borderRadius: 14,
            border: "1px solid #F1F5F9",
            overflow: "hidden",
            marginBottom: 14,
            boxShadow: sh,
          }}
        >
          <div
            style={{
              background: "#0F172A",
              padding: "14px 18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              <Calendar size={14} color={P.color} />
              Calendario de pagos
            </span>
            <span style={{ fontSize: 11, color: P.color, fontWeight: 600 }}>
              {F.imm ? "Plan inmediato" : nMo + " cuotas mensuales"}
            </span>
          </div>
          <div className="ss" style={{ maxHeight: 400, overflowY: "auto" }}>
            {sched.map((item, i) => {
              const isE = item.tp === "e",
                isU = item.tp === "u",
                isR = item.tp === "r",
                isI = item.tp === "i",
                isExtra = item.extra;
              const bg = isR
                ? P.cL
                : isI
                ? P.color + "08"
                : isExtra
                ? P.color + "05"
                : i % 2 === 0
                ? "white"
                : "#FAFAFA";
              return (
                <div
                  key={i}
                  style={{
                    padding: "11px 18px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom:
                      i < sched.length - 1 ? "1px solid #F8FAFC" : "none",
                    background: isE ? "#F8FAFC" : bg,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: isE
                          ? "#CBD5E1"
                          : isU || isExtra
                          ? P.color
                          : isR || isI
                          ? P.color
                          : "#CBD5E1",
                        opacity: item.tp === "c" && !isExtra ? 0.4 : 1,
                      }}
                    />
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: isE
                              ? 400
                              : isR || isI || isU
                              ? 600
                              : 400,
                            fontSize: 13,
                            color: isE ? "#94A3B8" : "#0F172A",
                          }}
                        >
                          {item.lbl}
                        </span>
                        {isE && (
                          <span
                            style={{
                              background: "#F1F5F9",
                              color: "#6B7280",
                              fontSize: 10,
                              padding: "1px 7px",
                              borderRadius: 8,
                            }}
                          >
                            70% · ver nota
                          </span>
                        )}
                        {isU && (
                          <span
                            style={{
                              background: P.cL,
                              color: P.color,
                              fontSize: 10,
                              padding: "1px 7px",
                              borderRadius: 8,
                              fontWeight: 600,
                            }}
                          >
                            último
                          </span>
                        )}
                        {isExtra && (
                          <span
                            style={{
                              background: P.color + "18",
                              color: P.color,
                              fontSize: 10,
                              padding: "1px 7px",
                              borderRadius: 8,
                              fontWeight: 600,
                            }}
                          >
                            + extraordinario
                          </span>
                        )}
                      </div>
                      <div
                        style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}
                      >
                        {fmtD(item.date)}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontWeight: isE
                        ? 400
                        : isU || isExtra
                        ? 700
                        : isR || isI
                        ? 600
                        : 500,
                      fontSize: 13,
                      color: isE
                        ? "#94A3B8"
                        : isU || isExtra
                        ? P.color
                        : isR || isI
                        ? P.color
                        : "#374151",
                      fontStyle: isE ? "italic" : "normal",
                    }}
                  >
                    {isE ? "Financiamiento bancario" : usd(item.amt)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bank note */}
        <div
          style={{
            background: P.cL,
            border: `1.5px solid ${P.color}33`,
            borderRadius: 14,
            padding: "16px 18px",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 13,
              color: P.color,
              marginBottom: 6,
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <Banknote size={15} />
            Balance al cierre / contra entrega: {usd(bankAmt)} (70%)
          </div>
          <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.65 }}>
            Este monto puede financiarse a través de entidades bancarias.{" "}
            <strong style={{ color: "#0F172A" }}>
              Sánchez Business & Corp. gestiona todo el proceso de
              financiamiento bancario
            </strong>
            , quitándole la gestión compleja al cliente para que solo se
            concentre en disfrutar su inversión.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            paddingTop: 18,
            borderTop: "1px solid #E2E8F0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
              marginBottom: 6,
            }}
          >
            <img
              src="https://i.imgur.com/PC29UvP.png"
              crossOrigin="anonymous"
              alt="Logo SBC"
              style={{ height: "26px", width: "auto" }}
            />
            <span
              style={{
                fontFamily: "'Montserrat',sans-serif",
                fontWeight: 900,
                fontSize: 12,
                color: "#0F172A",
                letterSpacing: 0.5,
              }}
            >
              SÁNCHEZ BUSINESS & CORP.
            </span>
          </div>
          <div style={{ fontSize: 11, color: "#94A3B8" }}>
            Ciudad del Sol · Punta Cana · República Dominicana
          </div>
          <div style={{ fontSize: 10, color: "#CBD5E1", marginTop: 5 }}>
            <div
              style={{
                fontSize: 10,
                color: "#64748B",
                marginTop: 10,
                fontStyle: "italic",
                borderTop: "1px solid #F1F5F9",
                paddingTop: 8,
              }}
            >
              Plataforma diseñada por Yeison Tejada para Sánchez Business &
              Corp.
            </div>
            Montos referenciales. Diseños sujetos a cambios. Precios sujetos a
            disponibilidad.
          </div>
        </div>
      </div>
    </div>
  );
}
