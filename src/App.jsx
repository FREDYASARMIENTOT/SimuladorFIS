import React, { useMemo, useState } from 'react';
import {
  Activity,
  BarChart3,
  Brain,
  Database,
  Download,
  Menu,
  PlayCircle,
  RefreshCcw,
  Save,
  SlidersHorizontal,
  Target,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const DEFAULT_WEIGHTS = {
  lambda: 1.0,
  sigma: 0.6,
  mu: 0.4,
  phi: 0.2,
};

const WEIGHT_META = {
  lambda: 'λ: peso de eficiencia. Escala la Calidad del Dato (O) dentro de la ganancia.',
  sigma: 'σ: penalización por sicofancia. Escala el costo S.',
  mu: 'μ: penalización por fricción. Escala el costo R.',
  phi: 'φ: penalización por coordinación. Escala el costo Cc.',
};

const QUESTIONS = [
  { id: 1, text: 'Fidelidad dato fuente', dim: 'O', label: 'O' },
  { id: 2, text: 'Ausencia redundancias', dim: 'O', label: 'O' },
  { id: 3, text: 'Adherencia modelo ABC', dim: 'O', label: 'O' },
  { id: 4, text: 'Consistencia enjambre', dim: 'O', label: 'O' },
  { id: 5, text: 'Identificación drivers', dim: 'O', label: 'O' },
  { id: 6, text: 'Cuestionamiento agente', dim: 'S', label: 'S', inverse: true },
  { id: 7, text: 'Independencia crítica', dim: 'S', label: 'S', inverse: true },
  { id: 8, text: 'Transparencia XAI', dim: 'alpha', label: 'α' },
  { id: 9, text: 'Autonomía equilibrada', dim: 'alpha', label: 'α' },
  { id: 10, text: 'Calidad vs flujo humano', dim: 'alpha', label: 'α' },
  { id: 11, text: 'Reducción repeticiones', dim: 'R', label: 'R', inverse: true },
  { id: 12, text: 'Carga supervisión', dim: 'R', label: 'R', inverse: true },
  { id: 15, text: 'Optimización recursos', dim: 'R', label: 'R', inverse: true },
  { id: 13, text: 'Latencia interacción', dim: 'Cc', label: 'Cc', inverse: true },
  { id: 14, text: 'Efectividad memoria', dim: 'Cc', label: 'Cc', inverse: true },
];

const DIMENSION_META = {
  O: {
    title: 'Calidad del dato (O)',
    detail: 'Aumenta utilidad: eficiencia, precisión y trazabilidad.',
    mode: 'increase',
  },
  S: {
    title: 'Riesgo sicofántico (S)',
    detail: 'Disminuye pérdida si hay crítica e independencia.',
    mode: 'decrease',
  },
  alpha: {
    title: 'Sinergia humano-IA (α)',
    detail: 'Aumenta utilidad: explicación, autonomía y flujo.',
    mode: 'increase',
  },
  R: {
    title: 'Fricción operativa (R)',
    detail: 'Disminuye pérdida si baja repetición, carga y costo.',
    mode: 'decrease',
  },
  Cc: {
    title: 'Coordinación contextual (Cc)',
    detail: 'Disminuye pérdida si baja latencia y mejora memoria.',
    mode: 'decrease',
  },
};

const DIMENSION_ORDER = ['O', 'S', 'alpha', 'R', 'Cc'];

const SCENARIOS = {
  caos: { 1: 1, 2: 1, 3: 2, 4: 1, 5: 2, 6: 1, 7: 1, 8: 1, 9: 2, 10: 1, 11: 1, 12: 1, 13: 2, 14: 2, 15: 1 },
  madurez: { 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 5, 7: 5, 8: 5, 9: 5, 10: 5, 11: 5, 12: 5, 13: 5, 14: 5, 15: 5 },
};

const DEMO_HISTORY = [
  { t: 1, O: 0.1, alpha: 0.08, S: 1, R: 1, Cc: 1, gain: 0.008, lossS: 0.6, lossR: 0.4, lossCc: 0.2, dUdt: -1.192, Ut: -1.192, k: 0 },
  { t: 2, O: 0.35, alpha: 0.25, S: 0.75, R: 0.75, Cc: 0.75, gain: 0.087, lossS: 0.45, lossR: 0.3, lossCc: 0.15, dUdt: -0.813, Ut: -2.005, k: 0.09 },
  { t: 3, O: 0.6, alpha: 0.58, S: 0.38, R: 0.42, Cc: 0.4, gain: 0.348, lossS: 0.228, lossR: 0.168, lossCc: 0.08, dUdt: -0.128, Ut: -2.133, k: 0.43 },
  { t: 4, O: 0.85, alpha: 0.75, S: 0.25, R: 0.17, Cc: 0.2, gain: 0.637, lossS: 0.15, lossR: 0.068, lossCc: 0.04, dUdt: 0.379, Ut: -1.754, k: 0.68 },
  { t: 5, O: 1, alpha: 1, S: 0, R: 0, Cc: 0, gain: 1, lossS: 0, lossR: 0, lossCc: 0, dUdt: 1, Ut: -0.754, k: 1 },
  { t: 6, O: 1, alpha: 1, S: 0, R: 0, Cc: 0, gain: 1, lossS: 0, lossR: 0, lossCc: 0, dUdt: 1, Ut: 0.246, k: 1 },
  { t: 7, O: 1, alpha: 1, S: 0, R: 0, Cc: 0, gain: 1, lossS: 0, lossR: 0, lossCc: 0, dUdt: 1, Ut: 1.246, k: 1 },
  { t: 8, O: 1, alpha: 1, S: 0, R: 0, Cc: 0, gain: 1, lossS: 0, lossR: 0, lossCc: 0, dUdt: 1, Ut: 2.246, k: 1 },
  { t: 9, O: 1, alpha: 1, S: 0, R: 0, Cc: 0, gain: 1, lossS: 0, lossR: 0, lossCc: 0, dUdt: 1, Ut: 3.246, k: 1 },
  { t: 10, O: 1, alpha: 1, S: 0, R: 0, Cc: 0, gain: 1, lossS: 0, lossR: 0, lossCc: 0, dUdt: 1, Ut: 4.246, k: 1 },
].map((row) => ({ ...row, timestamp: `t=${row.t}`, ...DEFAULT_WEIGHTS, totalLoss: row.lossS + row.lossR + row.lossCc }));

const normalize = (value, inverse = false) => {
  const normalized = (Number(value) - 1) / 4;
  return inverse ? 1 - normalized : normalized;
};

function calculateMetrics(answers, weights) {
  const average = (dimension) => {
    const items = QUESTIONS.filter((question) => question.dim === dimension);
    return items.reduce((sum, question) => sum + normalize(answers[question.id], question.inverse), 0) / items.length;
  };

  const O = average('O');
  const S = average('S');
  const alpha = average('alpha');
  const R = average('R');
  const Cc = average('Cc');
  const gain = alpha * (weights.lambda * O);
  const lossS = weights.sigma * S;
  const lossR = weights.mu * R;
  const lossCc = weights.phi * Cc;
  const totalLoss = lossS + lossR + lossCc;
  const dUdt = gain - totalLoss;
  const k = Math.max(0, Math.min(1, gain / Math.max(gain + totalLoss, 0.0001)));

  return { O, S, alpha, R, Cc, gain, lossS, lossR, lossCc, totalLoss, dUdt, k };
}

function formatSigned(value) {
  const number = Number(value);
  return `${number > 0 ? '+' : ''}${number.toFixed(3)}`;
}

function DimensionTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const data = payload[0].payload;
  return (
    <div className="dimension-tooltip">
      <strong>{data.title}</strong>
      <span>{data.description}</span>
      <em>{data.impact}</em>
      <b>Valor normalizado: {data.value.toFixed(3)}</b>
    </div>
  );
}

function downloadCsv(rows) {
  const headers = ['t', 'timestamp', 'O', 'alpha', 'S', 'R', 'Cc', 'gain', 'lossS', 'lossR', 'lossCc', 'totalLoss', 'dUdt', 'Ut', 'k'];
  const csv = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const rawValue = row[header] ?? '';
          const value = typeof rawValue === 'number' ? rawValue.toFixed(6) : String(rawValue);
          return `"${value.replaceAll('"', '""')}"`;
        })
        .join(','),
    ),
  ].join('\n');

  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `simulacion-fis-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function App() {
  const [answers, setAnswers] = useState(SCENARIOS.madurez);
  const [history, setHistory] = useState(DEMO_HISTORY);
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);
  const [telemetryVisible, setTelemetryVisible] = useState(true);
  const [selectedIteration, setSelectedIteration] = useState(null);

  const metrics = useMemo(() => calculateMetrics(answers, weights), [answers, weights]);
  const displayMetrics = history.length > 0 ? history[history.length - 1] : metrics;
  const displayWeights = history.length > 0 ? displayMetrics : weights;
  const selectedHistoryPoint = history.find((row) => row.t === selectedIteration);
  const selectedMetrics = selectedHistoryPoint ?? displayMetrics;
  const selectedWeights = selectedHistoryPoint ?? displayWeights;
  const renderDerivativeDot = ({ cx, cy, payload }) => (
    <circle
      cx={cx}
      cy={cy}
      r={payload.t === selectedIteration ? 4.5 : 2.6}
      fill={payload.t === selectedIteration ? '#0f172a' : '#4f46e5'}
      stroke={payload.t === selectedIteration ? '#facc15' : '#4f46e5'}
      strokeWidth={payload.t === selectedIteration ? 2 : 1}
      className="derivative-click-dot"
      onClick={(event) => {
        event.stopPropagation();
        setSelectedIteration(payload.t);
      }}
    />
  );

  const compositionData = [
    {
      name: 'Actual',
      'Calidad del Dato [λ·O]': Number((displayWeights.lambda * displayMetrics.O).toFixed(3)),
      'Sinergia [α]': Number(displayMetrics.alpha.toFixed(3)),
      Ganancia: Number(displayMetrics.gain.toFixed(3)),
      Sicofancia: Number(displayMetrics.lossS.toFixed(3)),
      Fricción: Number(displayMetrics.lossR.toFixed(3)),
      Coordinación: Number(displayMetrics.lossCc.toFixed(3)),
    },
  ];

  const dimensionData = [
    {
      name: 'O Dato',
      title: 'Calidad del dato (O)',
      description: 'Mide eficiencia, fidelidad, ausencia de redundancia, adherencia ABC y drivers.',
      impact: '↑ Aumenta la ganancia cuando sube.',
      value: Number(displayMetrics.O.toFixed(3)),
    },
    {
      name: 'α Sin',
      title: 'Sinergia humano-IA (α)',
      description: 'Mide transparencia XAI, autonomía equilibrada y mejora del flujo humano.',
      impact: '↑ Multiplica la calidad del dato para producir ganancia.',
      value: Number(displayMetrics.alpha.toFixed(3)),
    },
    {
      name: 'S Sico',
      title: 'Sicofancia (S)',
      description: 'Mide complacencia del agente y falta de independencia crítica.',
      impact: '↓ Aumenta la pérdida penalizada por σ cuando sube.',
      value: Number(displayMetrics.S.toFixed(3)),
    },
    {
      name: 'R Fric',
      title: 'Fricción operativa (R)',
      description: 'Mide repeticiones, carga de supervisión y costo de recursos.',
      impact: '↓ Aumenta la pérdida penalizada por μ cuando sube.',
      value: Number(displayMetrics.R.toFixed(3)),
    },
    {
      name: 'Cc Coord',
      title: 'Coordinación contextual (Cc)',
      description: 'Mide latencia y pérdida de efectividad de memoria.',
      impact: '↓ Aumenta la pérdida penalizada por φ cuando sube.',
      value: Number(displayMetrics.Cc.toFixed(3)),
    },
  ];

  const groupedQuestions = DIMENSION_ORDER.map((dimension) => ({
    key: dimension,
    ...DIMENSION_META[dimension],
    questions: QUESTIONS.filter((question) => question.dim === dimension),
    value: displayMetrics[dimension],
  }));

  const saveMeasurement = () => {
    const previousUt = history.length > 0 ? history[history.length - 1].Ut : 0;
    const entry = {
      t: history.length + 1,
      timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      ...weights,
      ...metrics,
      Ut: previousUt + metrics.dUdt,
    };
    setHistory((current) => [...current, entry]);
    setSelectedIteration(entry.t);
  };

  const loadDemo = () => {
    setHistory(DEMO_HISTORY);
    setAnswers(SCENARIOS.madurez);
    setWeights(DEFAULT_WEIGHTS);
    setSelectedIteration(null);
  };

  const clearSimulation = () => {
    setAnswers(SCENARIOS.caos);
    setHistory([]);
    setSelectedIteration(null);
  };

  return (
    <main className="sim-shell">
      <header className="sim-header">
        <div className="brand-lockup">
          <Brain className="brand-icon" size={20} />
          <div>
            <h1>FIS Simulator</h1>
            <span>Telemetría de Utilidad Simbiótica</span>
          </div>
        </div>
        <div className="header-actions">
          <button type="button" className="btn-primary" onClick={loadDemo}>
            <PlayCircle size={12} /> Demo (10 t)
          </button>
          <button type="button" onClick={clearSimulation}>
            <Trash2 size={12} /> Limpiar
          </button>
          <button type="button" onClick={() => downloadCsv(history)} disabled={history.length === 0}>
            <Download size={12} /> CSV
          </button>
        </div>
      </header>

      <section className="sim-body">
        {!telemetryVisible && (
          <button
            type="button"
            className="telemetry-rail-toggle"
            onClick={() => setTelemetryVisible(true)}
            aria-label="Mostrar telemetria cognitiva"
            title="Mostrar telemetria cognitiva"
          >
            <Menu size={15} />
          </button>
        )}

        <aside className={`controls-card ${telemetryVisible ? 'is-visible' : 'is-hidden'}`}>
          <div className="compact-card-header">
            <div>
              <h2>Telemetría cognitiva</h2>
              <p>Escala Likert 1-5 normalizada a 0-1.</p>
            </div>
            <div className="telemetry-header-actions">
              <button
                type="button"
                className="telemetry-icon-button"
                onClick={() => setTelemetryVisible(false)}
                aria-label="Ocultar telemetria cognitiva"
                title="Ocultar telemetria cognitiva"
              >
                <Menu size={13} />
              </button>
              <Target size={12} />
            </div>
          </div>
          <div className="question-stack">
            {groupedQuestions.map((group) => (
              <section className={`telemetry-group ${group.mode}`} key={group.key}>
                <div className="telemetry-group-head">
                  <div>
                    <strong>{group.title}</strong>
                    <span>{group.detail}</span>
                  </div>
                  <b>{group.value.toFixed(2)}</b>
                </div>
                {group.questions.map((question) => (
                  <label className="compact-question" key={question.id}>
                    <span className="question-line">
                      <span
                        className={`dimension-code dim-${question.label === 'α' ? 'alpha' : question.label}`}
                        title={`${DIMENSION_META[question.dim].title}: ${DIMENSION_META[question.dim].detail}`}
                        aria-label={`${DIMENSION_META[question.dim].title}: ${DIMENSION_META[question.dim].detail}`}
                      >
                        {question.label}
                      </span>
                      <span className="question-copy">{question.text}</span>
                      <em>{question.inverse ? '↓ pérdida' : '↑ utilidad'}</em>
                      <b>L{answers[question.id]}</b>
                    </span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={answers[question.id]}
                      onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: Number(event.target.value) }))}
                    />
                  </label>
                ))}
              </section>
            ))}
          </div>
          <div className="control-footer">
            <button type="button" className="btn-primary register-button" onClick={saveMeasurement}>
              <Save size={12} /> Registrar (t={history.length + 1})
            </button>
          </div>
        </aside>

        <section className="dashboard">
          <section className="top-row">
            <article className="k-card">
              <h3>Madurez (k)</h3>
              <strong>{(selectedMetrics.k * 100).toFixed(1)}%</strong>
              <p>{selectedHistoryPoint ? `Iteración seleccionada t=${selectedMetrics.t}.` : 'Homeostasis del sistema.'}</p>
              <span className={`utility-chip ${selectedMetrics.dUdt >= 0 ? 'positive' : 'negative'}`}>
                {selectedMetrics.dUdt >= 0 ? 'Utilidad positiva' : 'Utilidad negativa'}
              </span>
              <Activity className="k-watermark" size={86} strokeWidth={1.4} />
            </article>

            <article className="equation-card">
              <div className="equation-header">
                <h3>Ecuación dU/dt</h3>
                <code>dU/dt = α·(λ·O) - (σ·S + μ·R + φ·Cc)</code>
              </div>
              <div className="equation-split">
                <section className="equation-column gains-column">
                  <h4>↑ GANANCIAS</h4>
                  <div className="equation-line">
                    <span>Calidad del Dato [λ·O]</span>
                    <b>{selectedWeights.lambda.toFixed(1)}·{selectedMetrics.O.toFixed(2)} = {(selectedWeights.lambda * selectedMetrics.O).toFixed(3)}</b>
                  </div>
                  <div className="equation-line">
                    <span>Sinergia [α]</span>
                    <b>{selectedMetrics.alpha.toFixed(2)}</b>
                  </div>
                  <div className="equation-line total-line">
                    <span>Impacto positivo [α·(λ·O)]</span>
                    <b className="gain-text">
                      {selectedMetrics.alpha.toFixed(2)}·({selectedWeights.lambda.toFixed(1)}·{selectedMetrics.O.toFixed(2)}) =
                      +{selectedMetrics.gain.toFixed(3)}
                    </b>
                  </div>
                </section>

                <section className="equation-column losses-column">
                  <h4>↓ PÉRDIDAS</h4>
                  <div className="equation-line">
                    <span>Sicofancia [σ·S]</span>
                    <b className="loss-text">
                      {selectedWeights.sigma.toFixed(1)}·{selectedMetrics.S.toFixed(2)} = -{selectedMetrics.lossS.toFixed(3)}
                    </b>
                  </div>
                  <div className="equation-line">
                    <span>Fricción [μ·R]</span>
                    <b className="loss-text">
                      {selectedWeights.mu.toFixed(1)}·{selectedMetrics.R.toFixed(2)} = -{selectedMetrics.lossR.toFixed(3)}
                    </b>
                  </div>
                  <div className="equation-line">
                    <span>Coordinación [φ·Cc]</span>
                    <b className="loss-text">
                      {selectedWeights.phi.toFixed(1)}·{selectedMetrics.Cc.toFixed(2)} = -{selectedMetrics.lossCc.toFixed(3)}
                    </b>
                  </div>
                  <div className="equation-line total-line">
                    <span>Penalización total</span>
                    <b className="loss-text">-{selectedMetrics.totalLoss.toFixed(3)}</b>
                  </div>
                </section>
              </div>
              <div className="velocity-strip">
                <span>Velocidad Instantánea Evaluada (dU/dt)</span>
                <strong className={selectedMetrics.dUdt >= 0 ? 'gain-text' : 'loss-text'}>{formatSigned(selectedMetrics.dUdt)}</strong>
              </div>
            </article>

            <article className="weights-compact">
              <div className="compact-card-header">
                <h2>Pesos</h2>
                <SlidersHorizontal size={12} />
              </div>
              {[
                ['lambda', 'λ'],
                ['sigma', 'σ'],
                ['mu', 'μ'],
                ['phi', 'φ'],
              ].map(([key, label]) => (
                <label className="weight-mini" key={key}>
                  <span className="weight-symbol" title={WEIGHT_META[key]} aria-label={WEIGHT_META[key]}>
                    {label}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.05"
                    value={weights[key]}
                    onChange={(event) => setWeights((current) => ({ ...current, [key]: Number(event.target.value) }))}
                  />
                  <b>{weights[key].toFixed(2)}</b>
                </label>
              ))}
              <button type="button" className="weights-reset" onClick={() => setWeights(DEFAULT_WEIGHTS)}>
                <RefreshCcw size={11} /> Reset
              </button>
            </article>
          </section>

          <section className="chart-row">
            <article className="chart-panel">
              <h4>
                <TrendingUp size={10} /> Derivada dU/dt
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={history}
                  margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                  onClick={(event) => {
                    const point = event?.activePayload?.[0]?.payload;
                    if (point) {
                      setSelectedIteration(point.t);
                    }
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="t" hide />
                  <YAxis fontSize={8} axisLine={false} tickLine={false} domain={[-1.5, 1.5]} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ fontSize: '9px', borderRadius: '4px', padding: '4px' }} />
                  <ReferenceLine y={0} stroke="#cbd5e1" strokeDasharray="3 3" />
                  {selectedHistoryPoint && (
                    <ReferenceDot
                      x={selectedHistoryPoint.t}
                      y={selectedHistoryPoint.dUdt}
                      r={5}
                      fill="#0f172a"
                      stroke="#facc15"
                      strokeWidth={2}
                    />
                  )}
                  <Line type="monotone" dataKey="dUdt" stroke="#4f46e5" strokeWidth={2} dot={renderDerivativeDot} />
                </LineChart>
              </ResponsiveContainer>
            </article>

            <article className="chart-panel">
              <h4>
                <Database size={10} /> Integral Ut Acumulada
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="t" hide />
                  <YAxis fontSize={8} axisLine={false} tickLine={false} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ fontSize: '9px', borderRadius: '4px', padding: '4px' }} />
                  <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1} />
                  {selectedHistoryPoint && (
                    <ReferenceDot
                      x={selectedHistoryPoint.t}
                      y={selectedHistoryPoint.Ut}
                      r={5}
                      fill="#0f172a"
                      stroke="#10b981"
                      strokeWidth={2}
                    />
                  )}
                  <Area type="monotone" dataKey="Ut" stroke="#10b981" strokeWidth={2} fill="url(#colorUt)" />
                </AreaChart>
              </ResponsiveContainer>
            </article>

            <article className="chart-panel small-chart">
              <h4>
                <BarChart3 size={10} /> Ganancia vs pérdidas
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={compositionData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" hide />
                  <YAxis fontSize={8} axisLine={false} tickLine={false} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ fontSize: '9px', borderRadius: '4px', padding: '4px' }} />
                  <Legend wrapperStyle={{ fontSize: 9 }} />
                  <Bar dataKey="Calidad del Dato [λ·O]" fill="#0ea5e9" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Sinergia [α]" fill="#14b8a6" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Ganancia" fill="#10b981" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Sicofancia" fill="#f43f5e" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Fricción" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Coordinación" fill="#7c3aed" radius={[3, 3, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            </article>

            <article className="chart-panel small-chart">
              <h4>
                <Activity size={10} /> Dimensiones
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dimensionData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" interval={0} fontSize={7} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 1]} fontSize={8} axisLine={false} tickLine={false} stroke="#94a3b8" />
                  <Tooltip content={<DimensionTooltip />} />
                  <Bar dataKey="value" fill="#4f46e5" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </article>
          </section>

          <section className="history-card">
            <div className="compact-card-header">
              <h2>Cinta Estigmérgica (Historial)</h2>
              <span>{history.length} iteraciones</span>
            </div>
            <div className="history-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>t</th>
                    <th>O (Efic)</th>
                    <th>α (Siner)</th>
                    <th>S (Sico)</th>
                    <th>R (Fricc)</th>
                    <th>Cc</th>
                    <th>Gain</th>
                    <th>Loss</th>
                    <th>dU/dt</th>
                    <th>Ut (Intg)</th>
                    <th>k</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((row) => (
                    <tr key={row.t} className={selectedIteration === row.t ? 'selected-history-row' : ''}>
                      <td>t={row.t}</td>
                      <td>{row.O.toFixed(2)}</td>
                      <td>{row.alpha.toFixed(2)}</td>
                      <td className="loss-text">{row.S.toFixed(2)}</td>
                      <td className="loss-text">{row.R.toFixed(2)}</td>
                      <td className="loss-text">{row.Cc.toFixed(2)}</td>
                      <td className="gain-text">{row.gain.toFixed(3)}</td>
                      <td className="loss-text">{(row.totalLoss ?? row.lossS + row.lossR + row.lossCc).toFixed(3)}</td>
                      <td className={row.dUdt >= 0 ? 'gain-text' : 'loss-text'}>{formatSigned(row.dUdt)}</td>
                      <td className={row.Ut >= 0 ? 'gain-text' : 'loss-text'}>{row.Ut.toFixed(3)}</td>
                      <td>{(row.k * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr>
                      <td colSpan="11" className="empty-cell">
                        Pulse "Demo (10 t)" para simular el proceso simbiomemético o registre una nueva medición.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="conventions-strip">
              <section className="convention-block">
                <h3>Convenciones</h3>
                <p><b>O</b>: calidad del dato · <b>α</b>: sinergia · <b>S</b>: sicofancia · <b>R</b>: fricción · <b>Cc</b>: coordinación</p>
                <p><b>λ, σ, μ, φ</b>: pesos del modelo que escalan impacto positivo y penalizaciones.</p>
              </section>
              <section className="convention-block formula-block">
                <h3>Derivada dU/dt</h3>
                <code>dU/dt = α·(λ·O) - (σ·S + μ·R + φ·Cc)</code>
                <p>1. Calcular ganancia: <b>α·(λ·O)</b>. 2. Calcular pérdidas: <b>σ·S + μ·R + φ·Cc</b>. 3. Restar pérdidas a ganancias.</p>
              </section>
              <section className="convention-block">
                <h3>Integral Ut</h3>
                <code>Ut = Ut-1 + dU/dt</code>
                <p>La integral acumula la utilidad histórica: cada iteración suma su velocidad instantánea al stock anterior.</p>
              </section>
              <section className="convention-block">
                <h3>{selectedHistoryPoint ? `Paso seleccionado t=${selectedMetrics.t}` : 'Paso actual'}</h3>
                <p>
                  <b>{selectedMetrics.alpha.toFixed(2)}</b>·(<b>{selectedWeights.lambda.toFixed(1)}</b>·<b>{selectedMetrics.O.toFixed(2)}</b>)
                  - (<b>{selectedWeights.sigma.toFixed(1)}</b>·<b>{selectedMetrics.S.toFixed(2)}</b> + <b>{selectedWeights.mu.toFixed(1)}</b>·<b>{selectedMetrics.R.toFixed(2)}</b> + <b>{selectedWeights.phi.toFixed(1)}</b>·<b>{selectedMetrics.Cc.toFixed(2)}</b>)
                  = <b className={selectedMetrics.dUdt >= 0 ? 'gain-text' : 'loss-text'}>{formatSigned(selectedMetrics.dUdt)}</b>
                </p>
              </section>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

export default App;
