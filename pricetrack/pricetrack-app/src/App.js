import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from './supabase';

/* ═══════════════════════════════════════════════════════
   ESTILOS
═══════════════════════════════════════════════════════ */
const G = {
  bg: '#0b1120',
  surface: '#111c2e',
  card: '#172035',
  border: '#1d2f4a',
  accent: '#00d4aa',
  accentDim: '#00d4aa18',
  accentHover: '#00ffcc',
  text: '#dde6f5',
  muted: '#5a7090',
  danger: '#f87171',
  warn: '#fbbf24',
  blue: '#60a5fa',
  green: '#4ade80',
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html,body{background:${G.bg};color:${G.text};font-family:'Plus Jakarta Sans',sans-serif;min-height:100vh;}
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-track{background:${G.surface};}
::-webkit-scrollbar-thumb{background:${G.border};border-radius:3px;}

/* ── AUTH ── */
.auth-bg{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;background:radial-gradient(ellipse at 30% 20%, #00d4aa12 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, #60a5fa0a 0%, transparent 50%), ${G.bg};}
.auth-card{background:${G.surface};border:1px solid ${G.border};border-radius:20px;padding:40px;width:100%;max-width:400px;box-shadow:0 32px 80px #00000060;}
.auth-logo{display:flex;align-items:center;gap:12px;margin-bottom:32px;}
.auth-logo-icon{width:44px;height:44px;background:linear-gradient(135deg,${G.accent},#0099ff);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;color:#0b1120;font-family:'Space Mono',monospace;}
.auth-logo-text{font-size:22px;font-weight:800;letter-spacing:-0.5px;}
.auth-logo-text span{color:${G.accent};}
.auth-card h2{font-size:18px;font-weight:700;margin-bottom:6px;}
.auth-card p{font-size:13px;color:${G.muted};margin-bottom:28px;}
.field{margin-bottom:16px;}
.field label{display:block;font-size:12px;font-weight:600;letter-spacing:.5px;color:${G.muted};margin-bottom:6px;text-transform:uppercase;}
.field input{width:100%;padding:11px 14px;background:${G.card};border:1px solid ${G.border};border-radius:10px;color:${G.text};font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;outline:none;transition:border .2s;}
.field input:focus{border-color:${G.accent};}
.auth-btn{width:100%;padding:12px;background:linear-gradient(135deg,${G.accent},#00a8ff);border:none;border-radius:10px;color:#0b1120;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:opacity .2s;margin-top:4px;}
.auth-btn:hover{opacity:.9;}
.auth-btn:disabled{opacity:.5;cursor:default;}
.auth-switch{text-align:center;margin-top:20px;font-size:13px;color:${G.muted};}
.auth-switch button{background:none;border:none;color:${G.accent};cursor:pointer;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;}
.auth-err{background:${G.danger}18;border:1px solid ${G.danger}44;color:${G.danger};padding:10px 14px;border-radius:8px;font-size:13px;margin-bottom:16px;}
.auth-ok{background:${G.green}18;border:1px solid ${G.green}44;color:${G.green};padding:10px 14px;border-radius:8px;font-size:13px;margin-bottom:16px;}

/* ── LAYOUT ── */
.app{min-height:100vh;display:flex;flex-direction:column;}
.header{padding:0 28px;height:58px;border-bottom:1px solid ${G.border};display:flex;align-items:center;gap:14px;background:${G.surface};position:sticky;top:0;z-index:50;}
.header-logo{width:32px;height:32px;background:linear-gradient(135deg,${G.accent},#0099ff);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:#0b1120;font-family:'Space Mono',monospace;flex-shrink:0;}
.header h1{font-size:17px;font-weight:800;letter-spacing:-.3px;}
.header h1 span{color:${G.accent};}
.header-user{margin-left:auto;display:flex;align-items:center;gap:10px;}
.header-user span{font-size:12px;color:${G.muted};}
.logout-btn{padding:6px 14px;border-radius:7px;border:1px solid ${G.border};background:transparent;color:${G.muted};font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s;}
.logout-btn:hover{border-color:${G.danger};color:${G.danger};}

.nav{display:flex;gap:2px;padding:10px 28px;background:${G.surface};border-bottom:1px solid ${G.border};overflow-x:auto;}
.nav-btn{padding:7px 18px;border-radius:8px;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:600;transition:all .2s;background:transparent;color:${G.muted};white-space:nowrap;}
.nav-btn:hover{color:${G.text};background:${G.card};}
.nav-btn.active{background:${G.accentDim};color:${G.accent};border:1px solid ${G.accent}33;}

.main{flex:1;padding:28px;max-width:1300px;margin:0 auto;width:100%;}

/* ── UPLOAD ── */
.upload-zone{border:2px dashed ${G.border};border-radius:18px;padding:52px 32px;text-align:center;cursor:pointer;transition:all .3s;background:${G.card};}
.upload-zone:hover,.upload-zone.drag{border-color:${G.accent};background:${G.accentDim};}
.upload-icon{font-size:52px;line-height:1;margin-bottom:18px;}
.upload-zone h3{font-size:18px;font-weight:700;margin-bottom:8px;}
.upload-zone p{color:${G.muted};font-size:13px;}
.loading-wrap{display:flex;flex-direction:column;align-items:center;gap:16px;padding:60px;}
.spinner{width:42px;height:42px;border:3px solid ${G.border};border-top-color:${G.accent};border-radius:50%;animation:spin 1s linear infinite;}
@keyframes spin{to{transform:rotate(360deg)}}
.load-msg{color:${G.muted};font-size:13px;font-family:'Space Mono',monospace;}

/* ── CARDS ── */
.grid-4{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px;margin-bottom:24px;}
.stat-card{background:${G.card};border:1px solid ${G.border};border-radius:14px;padding:20px;transition:border .2s;}
.stat-card:hover{border-color:${G.accent}33;}
.stat-label{font-size:10px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${G.muted};margin-bottom:10px;}
.stat-val{font-size:26px;font-weight:800;font-family:'Space Mono',monospace;line-height:1;}
.stat-sub{font-size:11px;color:${G.muted};margin-top:6px;}
.c-accent{color:${G.accent};}
.c-warn{color:${G.warn};}
.c-blue{color:${G.blue};}
.c-green{color:${G.green};}

/* ── TABLE ── */
.panel{background:${G.card};border:1px solid ${G.border};border-radius:14px;overflow:hidden;}
.panel-header{padding:14px 20px;border-bottom:1px solid ${G.border};display:flex;justify-content:space-between;align-items:center;}
.panel-header h3{font-size:14px;font-weight:700;}
table{width:100%;border-collapse:collapse;}
th{padding:9px 16px;text-align:left;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${G.muted};background:${G.surface};border-bottom:1px solid ${G.border};}
td{padding:11px 16px;font-size:13px;border-bottom:1px solid ${G.border}18;}
tr:last-child td{border-bottom:none;}
tr:hover td{background:${G.accentDim};}

/* ── RECEIPT LIST ── */
.r-item{display:flex;align-items:center;gap:14px;padding:13px 18px;border-bottom:1px solid ${G.border}18;transition:background .2s;cursor:default;}
.r-item:hover{background:${G.accentDim};}
.r-icon{width:34px;height:34px;background:${G.accentDim};border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
.r-info{flex:1;min-width:0;}
.r-name{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.r-meta{font-size:11px;color:${G.muted};margin-top:2px;}
.r-total{font-family:'Space Mono',monospace;font-size:14px;font-weight:700;color:${G.accent};flex-shrink:0;}

/* ── SEARCH ── */
.searchbar{display:flex;gap:10px;margin-bottom:18px;flex-wrap:wrap;}
.s-input{flex:1;min-width:200px;padding:9px 14px;background:${G.card};border:1px solid ${G.border};border-radius:9px;color:${G.text};font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;outline:none;}
.s-input:focus{border-color:${G.accent};}
select.s-input{cursor:pointer;}

/* ── ITEM DETAIL ── */
.detail-header{background:${G.card};border:1px solid ${G.border};border-radius:14px;padding:22px;margin-bottom:18px;}
.detail-header h2{font-size:20px;font-weight:800;margin-bottom:8px;letter-spacing:-.3px;}
.stats-row{display:flex;gap:20px;flex-wrap:wrap;margin-top:14px;}
.ms{display:flex;flex-direction:column;gap:3px;}
.ms .l{font-size:10px;color:${G.muted};text-transform:uppercase;letter-spacing:1px;font-weight:700;}
.ms .v{font-size:15px;font-weight:800;font-family:'Space Mono',monospace;}

/* ── CHART ── */
.chart-box{background:${G.card};border:1px solid ${G.border};border-radius:14px;padding:20px;margin-bottom:18px;}
.chart-box h3{font-size:14px;font-weight:700;margin-bottom:18px;}
.bars{display:flex;align-items:flex-end;gap:6px;height:160px;padding-top:24px;}
.bw{display:flex;flex-direction:column;align-items:center;flex:1;gap:3px;height:100%;justify-content:flex-end;}
.bar{width:100%;border-radius:4px 4px 0 0;transition:all .3s;min-height:3px;cursor:pointer;}
.bar:hover{filter:brightness(1.4);}
.blabel{font-size:9px;color:${G.muted};text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:58px;}
.bprice{font-size:9px;font-family:'Space Mono',monospace;color:${G.text};}

/* ── MISC ── */
.badge{display:inline-block;padding:2px 8px;border-radius:99px;font-size:11px;font-weight:700;}
.b-green{background:${G.accent}20;color:${G.accent};}
.b-red{background:${G.danger}20;color:${G.danger};}
.b-blue{background:${G.blue}20;color:${G.blue};}
.tag{background:${G.accentDim};color:${G.accent};padding:2px 9px;border-radius:99px;font-size:11px;font-weight:700;}
.btn{padding:8px 18px;border-radius:8px;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700;transition:all .2s;}
.btn-p{background:${G.accent};color:#0b1120;}
.btn-p:hover{background:${G.accentHover};}
.btn-g{background:transparent;color:${G.muted};border:1px solid ${G.border};}
.btn-g:hover{color:${G.text};border-color:${G.text};}
.btn-d{background:${G.danger}18;color:${G.danger};border:1px solid ${G.danger}33;}
.btn-d:hover{background:${G.danger}35;}
.empty{text-align:center;padding:52px;color:${G.muted};font-size:14px;line-height:1.8;}
.sec-title{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${G.muted};margin-bottom:14px;}
.toast{position:fixed;bottom:22px;right:22px;padding:13px 18px;background:${G.card};border:1px solid ${G.border};border-radius:10px;font-size:13px;font-weight:600;z-index:999;box-shadow:0 8px 40px #00000070;animation:tup .3s ease;}
.toast.success{border-color:${G.accent};color:${G.accent};}
.toast.error{border-color:${G.danger};color:${G.danger};}
@keyframes tup{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}

.two-col{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:22px;}
@media(max-width:700px){.two-col{grid-template-columns:1fr;}.main{padding:16px;}.header{padding:0 16px;}.nav{padding:8px 16px;}}

/* ── MONTHLY CHART ── */
.monthly-chart{background:${G.card};border:1px solid ${G.border};border-radius:14px;padding:22px;margin-bottom:22px;}
.monthly-chart-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;}
.monthly-chart-header h3{font-size:14px;font-weight:700;}
.chart-legend{display:flex;gap:16px;flex-wrap:wrap;}
.legend-item{display:flex;align-items:center;gap:6px;font-size:11px;color:${G.muted};}
.legend-dot{width:8px;height:8px;border-radius:50%;}
.svg-chart-wrap{position:relative;width:100%;overflow:hidden;}
.chart-tooltip{position:absolute;background:${G.surface};border:1px solid ${G.border};border-radius:8px;padding:10px 14px;font-size:12px;pointer-events:none;white-space:nowrap;z-index:10;box-shadow:0 4px 20px #00000060;transition:opacity .15s;}
.chart-tooltip .tt-month{font-weight:700;color:${G.text};margin-bottom:4px;}
.chart-tooltip .tt-val{color:${G.accent};font-family:'Space Mono',monospace;font-weight:700;}
.chart-tooltip .tt-count{color:${G.muted};font-size:11px;margin-top:2px;}
`;

/* ═══════════════════════════════════════════════════════
   CLAUDE API — extração NFCe
═══════════════════════════════════════════════════════ */
async function extractNFCe(base64PDF) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: [
          { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64PDF } },
          { type: 'text', text: `Extraia todas as informações desta NFCe e retorne APENAS um JSON válido, sem markdown:
{
  "store": "nome do estabelecimento",
  "cnpj": "XX.XXX.XXX/XXXX-XX",
  "address": "endereço",
  "date": "DD/MM/YYYY",
  "items": [{"name":"","code":"","qty":0,"unit":"","unitPrice":0,"total":0}],
  "totalBruto": 0,
  "discounts": 0,
  "totalLiquido": 0
}` }
        ]
      }]
    })
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const d = await res.json();
  const txt = d.content.map(c => c.text || '').join('');
  return JSON.parse(txt.replace(/```json|```/g, '').trim());
}

/* ═══════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════ */
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  return <div className={`toast ${type}`}>{type === 'success' ? '✓ ' : '✗ '}{msg}</div>;
}

/* ═══════════════════════════════════════════════════════
   AUTH VIEW
═══════════════════════════════════════════════════════ */
function AuthView({ onAuth }) {
  const [mode, setMode] = useState('login'); // login | register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  const handle = async () => {
    setErr(''); setOk('');
    if (!email || !password) return setErr('Preencha todos os campos.');
    setLoading(true);
    if (mode === 'register') {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name } }
      });
      if (error) setErr(error.message);
      else setOk('Conta criada! Verifique seu e-mail para confirmar e depois faça login.');
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErr('E-mail ou senha incorretos.');
      else onAuth(data.user);
    }
    setLoading(false);
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">₿</div>
          <div className="auth-logo-text">Price<span>Track</span></div>
        </div>
        <h2>{mode === 'login' ? 'Entrar na sua conta' : 'Criar conta'}</h2>
        <p>{mode === 'login' ? 'Rastreie preços de supermercado com sua família.' : 'Crie sua conta gratuita agora.'}</p>

        {err && <div className="auth-err">⚠ {err}</div>}
        {ok && <div className="auth-ok">✓ {ok}</div>}

        {mode === 'register' && (
          <div className="field">
            <label>Nome</label>
            <input type="text" placeholder="Seu nome" value={name} onChange={e => setName(e.target.value)} />
          </div>
        )}
        <div className="field">
          <label>E-mail</label>
          <input type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handle()} />
        </div>
        <div className="field">
          <label>Senha</label>
          <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handle()} />
        </div>

        <button className="auth-btn" onClick={handle} disabled={loading}>
          {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
        </button>

        <div className="auth-switch">
          {mode === 'login'
            ? <>Não tem conta? <button onClick={() => { setMode('register'); setErr(''); setOk(''); }}>Criar conta gratuita</button></>
            : <>Já tem conta? <button onClick={() => { setMode('login'); setErr(''); setOk(''); }}>Entrar</button></>
          }
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   UPLOAD VIEW
═══════════════════════════════════════════════════════ */
function UploadView({ user, onUploaded }) {
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const ref = useRef();

  const process = useCallback(async (file) => {
    if (!file || file.type !== 'application/pdf') return;
    setLoading(true);
    try {
      setMsg('Lendo PDF...');
      const b64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result.split(',')[1]);
        r.onerror = rej;
        r.readAsDataURL(file);
      });

      setMsg('Extraindo dados com IA...');
      const data = await extractNFCe(b64);

      setMsg('Salvando no banco de dados...');
      // Insert receipt
      const { data: receipt, error: re } = await supabase
        .from('receipts')
        .insert({
          user_id: user.id,
          store: data.store,
          cnpj: data.cnpj,
          address: data.address,
          date: data.date,
          total_bruto: data.totalBruto,
          discounts: data.discounts,
          total_liquido: data.totalLiquido,
        })
        .select()
        .single();

      if (re) throw new Error(re.message);

      // Insert items
      const items = (data.items || []).map(it => ({
        receipt_id: receipt.id,
        user_id: user.id,
        name: it.name,
        code: it.code,
        qty: it.qty,
        unit: it.unit,
        unit_price: it.unitPrice,
        total: it.total,
        store: data.store,
        date: data.date,
      }));

      const { error: ie } = await supabase.from('items').insert(items);
      if (ie) throw new Error(ie.message);

      onUploaded(`NFCe de "${data.store}" importada — ${items.length} itens!`, 'success');
    } catch (e) {
      onUploaded('Erro: ' + e.message, 'error');
    }
    setLoading(false);
  }, [user, onUploaded]);

  const onDrop = e => { e.preventDefault(); setDrag(false); process(e.dataTransfer.files[0]); };

  return (
    <div>
      <div className="sec-title">Importar Nota Fiscal</div>
      {loading
        ? <div className="loading-wrap"><div className="spinner" /><div className="load-msg">{msg}</div></div>
        : <div
            className={`upload-zone${drag ? ' drag' : ''}`}
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            onClick={() => ref.current?.click()}
          >
            <div className="upload-icon">📄</div>
            <h3>Arraste o PDF da NFCe aqui</h3>
            <p>ou clique para selecionar o arquivo</p>
            <p style={{ marginTop: 8, fontSize: 11, color: G.muted }}>Formato: PDF da Nota Fiscal de Consumidor Eletrônica</p>
            <input ref={ref} type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => process(e.target.files[0])} />
          </div>
      }
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MONTHLY CHART COMPONENT
═══════════════════════════════════════════════════════ */
function MonthlyChart({ receipts }) {
  const [tooltip, setTooltip] = useState(null);
  const svgRef = useRef();

  const MONTHS_PT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

  // Build last 12 months data
  const monthlyData = (() => {
    const now = new Date();
    const result = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${String(d.getMonth() + 1).padStart(2,'0')}/${d.getFullYear()}`;
      result.push({
        key,
        label: `${MONTHS_PT[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`,
        month: MONTHS_PT[d.getMonth()],
        year: d.getFullYear(),
        total: 0,
        count: 0,
      });
    }

    receipts.forEach(r => {
      if (!r.date) return;
      const parts = r.date.split('/');
      if (parts.length < 3) return;
      const key = `${parts[1]}/${parts[2]}`;
      const slot = result.find(s => s.key === key);
      if (slot) {
        slot.total += r.total_liquido || 0;
        slot.count++;
      }
    });
    return result;
  })();

  const maxVal = Math.max(...monthlyData.map(m => m.total), 1);
  const hasData = monthlyData.some(m => m.total > 0);

  // SVG dimensions
  const W = 100; // percentage-based via viewBox
  const H = 200;
  const PAD = { top: 20, right: 4, bottom: 36, left: 52 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const barCount = monthlyData.length;
  const gap = 0.25;
  const barW = (chartW / barCount) * (1 - gap);
  const slotW = chartW / barCount;

  // Y axis grid lines (4 lines)
  const gridLines = [0.25, 0.5, 0.75, 1.0].map(f => ({
    y: PAD.top + chartH * (1 - f),
    label: `R$${(maxVal * f).toFixed(0)}`,
  }));

  // Line path (average trend)
  const points = monthlyData.map((m, i) => {
    const x = PAD.left + slotW * i + slotW / 2;
    const y = m.total > 0 ? PAD.top + chartH * (1 - m.total / maxVal) : null;
    return { x, y, m };
  }).filter(p => p.y !== null);

  const linePath = points.length > 1
    ? points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
    : '';

  const areaPath = points.length > 1
    ? `${linePath} L${points[points.length-1].x.toFixed(1)},${(PAD.top + chartH).toFixed(1)} L${points[0].x.toFixed(1)},${(PAD.top + chartH).toFixed(1)} Z`
    : '';

  const handleMouseMove = (e, m, i) => {
    if (!m.total) return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTooltip({ x, y, m });
  };

  return (
    <div className="monthly-chart">
      <div className="monthly-chart-header">
        <div>
          <h3>📅 Consumo por Mês</h3>
          <div style={{ fontSize: 11, color: G.muted, marginTop: 4 }}>Últimos 12 meses</div>
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-dot" style={{ background: G.accent }} />
            <span>Gasto mensal</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: G.blue }} />
            <span>Tendência</span>
          </div>
        </div>
      </div>

      {!hasData ? (
        <div style={{ textAlign: 'center', padding: '32px', color: G.muted, fontSize: 13 }}>
          Importe mais notas para ver a evolução mensal
        </div>
      ) : (
        <div className="svg-chart-wrap" ref={svgRef} onMouseLeave={() => setTooltip(null)}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={G.accent} stopOpacity="0.9" />
                <stop offset="100%" stopColor={G.accent} stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={G.blue} stopOpacity="0.25" />
                <stop offset="100%" stopColor={G.blue} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {gridLines.map((gl, i) => (
              <g key={i}>
                <line
                  x1={PAD.left} y1={gl.y} x2={W - PAD.right} y2={gl.y}
                  stroke={G.border} strokeWidth="0.4" strokeDasharray="1.5,1.5"
                />
                <text x={PAD.left - 2} y={gl.y + 1} textAnchor="end"
                  fontSize="3.8" fill={G.muted} fontFamily="Space Mono, monospace">
                  {gl.label}
                </text>
              </g>
            ))}

            {/* Baseline */}
            <line
              x1={PAD.left} y1={PAD.top + chartH}
              x2={W - PAD.right} y2={PAD.top + chartH}
              stroke={G.border} strokeWidth="0.6"
            />

            {/* Bars */}
            {monthlyData.map((m, i) => {
              const x = PAD.left + slotW * i + (slotW - barW) / 2;
              const barH2 = m.total > 0 ? Math.max((m.total / maxVal) * chartH, 1) : 0;
              const y = PAD.top + chartH - barH2;
              const isHovered = tooltip?.m?.key === m.key;
              return (
                <g key={i} onMouseMove={e => handleMouseMove(e, m, i)} style={{ cursor: m.total ? 'pointer' : 'default' }}>
                  {/* Hover zone */}
                  <rect x={PAD.left + slotW * i} y={PAD.top} width={slotW} height={chartH + 1}
                    fill="transparent" />
                  {/* Bar */}
                  {m.total > 0 && (
                    <rect
                      x={x} y={y} width={barW} height={barH2}
                      fill={isHovered ? G.accentHover : 'url(#barGrad)'}
                      rx="1" ry="1"
                      style={{ transition: 'fill .15s' }}
                    />
                  )}
                  {/* Month label */}
                  <text
                    x={PAD.left + slotW * i + slotW / 2}
                    y={PAD.top + chartH + 9}
                    textAnchor="middle"
                    fontSize="3.5"
                    fill={isHovered ? G.accent : G.muted}
                    fontFamily="Plus Jakarta Sans, sans-serif"
                    fontWeight={isHovered ? '700' : '400'}
                  >
                    {m.label}
                  </text>
                  {/* Value on top of bar when hovered */}
                  {isHovered && m.total > 0 && (
                    <text
                      x={x + barW / 2} y={y - 2}
                      textAnchor="middle" fontSize="3.6"
                      fill={G.accent} fontFamily="Space Mono, monospace" fontWeight="700"
                    >
                      R${m.total.toFixed(0)}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Area under line */}
            {areaPath && (
              <path d={areaPath} fill="url(#areaGrad)" />
            )}

            {/* Trend line */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke={G.blue}
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="none"
                opacity="0.8"
              />
            )}

            {/* Dots on line */}
            {points.map((p, i) => (
              <circle
                key={i} cx={p.x} cy={p.y} r="1.2"
                fill={tooltip?.m?.key === p.m.key ? G.accentHover : G.blue}
                stroke={G.card} strokeWidth="0.5"
                style={{ transition: 'fill .15s' }}
              />
            ))}
          </svg>

          {/* Tooltip */}
          {tooltip && (
            <div
              className="chart-tooltip"
              style={{
                left: Math.min(tooltip.x + 12, (svgRef.current?.offsetWidth || 400) - 140),
                top: Math.max(tooltip.y - 52, 0),
                opacity: 1,
              }}
            >
              <div className="tt-month">{tooltip.m.month} {tooltip.m.year}</div>
              <div className="tt-val">R$ {tooltip.m.total.toFixed(2)}</div>
              <div className="tt-count">{tooltip.m.count} nota{tooltip.m.count !== 1 ? 's' : ''}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   DASHBOARD VIEW
═══════════════════════════════════════════════════════ */
function DashboardView({ user }) {
  const [receipts, setReceipts] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: r } = await supabase
        .from('receipts').select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setReceipts(r || []);

      const { data: items } = await supabase
        .from('items').select('name, code, total')
        .eq('user_id', user.id);
      // group
      const map = {};
      (items || []).forEach(it => {
        const k = it.code || it.name;
        if (!map[k]) map[k] = { name: it.name, count: 0, total: 0 };
        map[k].count++;
        map[k].total += it.total || 0;
      });
      setTopItems(Object.values(map).sort((a, b) => b.count - a.count).slice(0, 8));
      setLoading(false);
    })();
  }, [user]);

  if (loading) return <div className="loading-wrap"><div className="spinner" /></div>;
  if (!receipts.length) return <div className="empty">📊 Nenhuma nota importada ainda.<br />Vá em <b>Upload NFCe</b> para começar!</div>;

  const totalSpent = receipts.reduce((s, r) => s + (r.total_liquido || 0), 0);
  const stores = [...new Set(receipts.map(r => r.store))];
  const recent = receipts.slice(0, 5);

  return (
    <div>
      <div className="grid-4">
        <div className="stat-card"><div className="stat-label">Total Gasto</div><div className="stat-val c-accent">R${totalSpent.toFixed(2)}</div><div className="stat-sub">{receipts.length} notas fiscais</div></div>
        <div className="stat-card"><div className="stat-label">Ticket Médio</div><div className="stat-val c-warn">R${(totalSpent / receipts.length).toFixed(2)}</div><div className="stat-sub">por compra</div></div>
        <div className="stat-card"><div className="stat-label">Estabelecimentos</div><div className="stat-val c-blue">{stores.length}</div><div className="stat-sub">{stores.slice(0, 2).join(', ')}</div></div>
        <div className="stat-card"><div className="stat-label">Itens Cadastrados</div><div className="stat-val c-green">{topItems.reduce((s, i) => s + i.count, 0)}</div><div className="stat-sub">compras registradas</div></div>
      </div>

      <MonthlyChart receipts={receipts} />

      <div className="two-col">
        <div className="panel">
          <div className="panel-header"><h3>🧾 Compras Recentes</h3></div>
          {recent.map(r => (
            <div key={r.id} className="r-item">
              <div className="r-icon">🏪</div>
              <div className="r-info">
                <div className="r-name">{r.store}</div>
                <div className="r-meta">{r.date}</div>
              </div>
              <div className="r-total">R${(r.total_liquido || 0).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="panel">
          <div className="panel-header"><h3>🛒 Itens Mais Comprados</h3></div>
          <table>
            <thead><tr><th>Produto</th><th>Vezes</th><th>Total</th></tr></thead>
            <tbody>
              {topItems.map((it, i) => (
                <tr key={i}>
                  <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</td>
                  <td><span className="tag">{it.count}x</span></td>
                  <td style={{ fontFamily: "'Space Mono',monospace", color: G.accent }}>R${it.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="sec-title">Todas as Notas</div>
      <div className="panel">
        <table>
          <thead><tr><th>Estabelecimento</th><th>Data</th><th>CNPJ</th><th>Desconto</th><th>Total</th></tr></thead>
          <tbody>
            {receipts.map(r => (
              <tr key={r.id}>
                <td style={{ fontWeight: 600 }}>{r.store}</td>
                <td style={{ fontFamily: "'Space Mono',monospace", fontSize: 12 }}>{r.date}</td>
                <td style={{ fontSize: 11, color: G.muted }}>{r.cnpj}</td>
                <td style={{ color: G.warn }}>- R${(r.discounts || 0).toFixed(2)}</td>
                <td style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, color: G.accent }}>R${(r.total_liquido || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ITEMS VIEW
═══════════════════════════════════════════════════════ */
function ItemsView({ user }) {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [history, setHistory] = useState([]);
  const [storeFilter, setStoreFilter] = useState('');
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from('items').select('name, code, unit_price, total, store, date, qty, unit')
        .eq('user_id', user.id);

      // group by code/name
      const map = {};
      (data || []).forEach(it => {
        const k = it.code || it.name;
        if (!map[k]) map[k] = { name: it.name, code: it.code, entries: [] };
        map[k].entries.push(it);
      });
      setProducts(Object.values(map).sort((a, b) => a.name.localeCompare(b.name)));
      setStores([...new Set((data || []).map(i => i.store))]);
      setLoading(false);
    })();
  }, [user]);

  const filtered = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  const selectProduct = (p) => {
    setSelected(p);
    const entries = [...p.entries]
      .filter(e => !storeFilter || e.store === storeFilter)
      .sort((a, b) => {
        const [da, ma, ya] = a.date.split('/');
        const [db2, mb, yb] = b.date.split('/');
        return new Date(`${ya}-${ma}-${da}`) - new Date(`${yb}-${mb}-${db2}`);
      });
    setHistory(entries);
  };

  useEffect(() => {
    if (selected) selectProduct(selected);
  }, [storeFilter]); // eslint-disable-line

  if (loading) return <div className="loading-wrap"><div className="spinner" /></div>;
  if (!products.length) return <div className="empty">📦 Nenhum produto ainda.<br />Importe notas para ver o histórico.</div>;

  const maxP = history.length ? Math.max(...history.map(e => e.unit_price)) : 1;
  const minP = history.length ? Math.min(...history.map(e => e.unit_price)) : 0;
  const avgP = history.length ? history.reduce((s, e) => s + e.unit_price, 0) / history.length : 0;
  const lastP = history.length ? history[history.length - 1].unit_price : 0;
  const firstP = history.length ? history[0].unit_price : 0;
  const diff = lastP - firstP;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: selected ? '300px 1fr' : '1fr', gap: 18 }}>
      {/* Lista */}
      <div>
        <div className="searchbar">
          <input className="s-input" placeholder="🔍 Buscar produto..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="panel">
          <div className="panel-header"><h3>Produtos ({filtered.length})</h3></div>
          {filtered.map(p => {
            const prices = p.entries.map(e => e.unit_price);
            const mn = Math.min(...prices), mx = Math.max(...prices);
            const last = p.entries[p.entries.length - 1].unit_price;
            return (
              <div key={p.code || p.name} className="r-item"
                style={{ cursor: 'pointer', background: selected?.name === p.name ? G.accentDim : '' }}
                onClick={() => selectProduct(p)}>
                <div className="r-icon">🛒</div>
                <div className="r-info">
                  <div className="r-name" style={{ fontSize: 12 }}>{p.name}</div>
                  <div className="r-meta">{p.entries.length}x · min R${mn.toFixed(2)} · max R${mx.toFixed(2)}</div>
                </div>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 13 }}>R${last.toFixed(2)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detalhe */}
      {selected && (
        <div>
          <div className="detail-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="sec-title">Histórico de Preço</div>
                <h2>{selected.name}</h2>
                {selected.code && <span className="tag" style={{ marginTop: 6, display: 'inline-block' }}>Código {selected.code}</span>}
              </div>
              <button className="btn btn-g" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="stats-row">
              <div className="ms"><span className="l">Último</span><span className="v" style={{ color: G.accent }}>R${lastP.toFixed(2)}</span></div>
              <div className="ms"><span className="l">Mínimo</span><span className="v" style={{ color: G.blue }}>R${minP.toFixed(2)}</span></div>
              <div className="ms"><span className="l">Máximo</span><span className="v" style={{ color: G.warn }}>R${maxP.toFixed(2)}</span></div>
              <div className="ms"><span className="l">Média</span><span className="v">R${avgP.toFixed(2)}</span></div>
              <div className="ms">
                <span className="l">Variação</span>
                <span className="v" style={{ color: diff > 0 ? G.danger : diff < 0 ? G.accent : G.muted }}>
                  {diff > 0 ? '▲' : diff < 0 ? '▼' : '–'} R${Math.abs(diff).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="searchbar">
            <select className="s-input" value={storeFilter} onChange={e => setStoreFilter(e.target.value)}>
              <option value="">Todos os estabelecimentos</option>
              {stores.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {history.length > 1 && (
            <div className="chart-box">
              <h3>Evolução do Preço</h3>
              <div className="bars">
                {history.map((e, i) => {
                  const pct = maxP > 0 ? (e.unit_price / maxP) * 100 : 10;
                  const col = i === history.length - 1 ? G.accent : i === 0 ? G.blue : '#2a4a7a';
                  return (
                    <div key={i} className="bw">
                      <div className="bprice">R${e.unit_price.toFixed(2)}</div>
                      <div className="bar" style={{ height: `${Math.max(pct, 4)}%`, background: col }} title={`${e.date} — ${e.store}`} />
                      <div className="blabel">{e.date.slice(0, 5)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="panel">
            <div className="panel-header"><h3>Compras ({history.length})</h3></div>
            <table>
              <thead><tr><th>Data</th><th>Estabelecimento</th><th>Qtde</th><th>Preço Unit.</th><th>Total</th><th>vs Último</th></tr></thead>
              <tbody>
                {[...history].reverse().map((e, i) => {
                  const d = e.unit_price - lastP;
                  return (
                    <tr key={i}>
                      <td style={{ fontFamily: "'Space Mono',monospace", fontSize: 11 }}>{e.date}</td>
                      <td style={{ fontWeight: 600, fontSize: 12 }}>{e.store}</td>
                      <td>{e.qty} {e.unit}</td>
                      <td style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>R${(e.unit_price || 0).toFixed(2)}</td>
                      <td style={{ fontFamily: "'Space Mono',monospace" }}>R${(e.total || 0).toFixed(2)}</td>
                      <td>{Math.abs(d) < 0.01
                        ? <span style={{ color: G.muted }}>—</span>
                        : <span className={`badge ${d > 0 ? 'b-red' : 'b-green'}`}>{d > 0 ? '▲' : '▼'} R${Math.abs(d).toFixed(2)}</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   RECEIPTS VIEW
═══════════════════════════════════════════════════════ */
function ReceiptsView({ user }) {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('receipts').select('*, items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setReceipts(data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const del = async (id) => {
    await supabase.from('items').delete().eq('receipt_id', id);
    await supabase.from('receipts').delete().eq('id', id);
    load();
  };

  if (loading) return <div className="loading-wrap"><div className="spinner" /></div>;
  if (!receipts.length) return <div className="empty">📄 Nenhuma nota importada ainda.</div>;

  return (
    <div>
      {receipts.map(r => (
        <div key={r.id} className="panel" style={{ marginBottom: 16 }}>
          <div className="panel-header">
            <div>
              <h3>🏪 {r.store}</h3>
              <div style={{ fontSize: 11, color: G.muted, marginTop: 3 }}>{r.date} · {r.cnpj}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 17, fontWeight: 700, color: G.accent }}>R$ {(r.total_liquido || 0).toFixed(2)}</div>
                {r.discounts > 0 && <div style={{ fontSize: 11, color: G.warn }}>desconto: - R${r.discounts.toFixed(2)}</div>}
              </div>
              <button className="btn btn-d" onClick={() => del(r.id)}>🗑</button>
            </div>
          </div>
          <table>
            <thead><tr><th>Produto</th><th>Cód.</th><th>Qtde.</th><th>Un</th><th>Preço Unit.</th><th>Total</th></tr></thead>
            <tbody>
              {(r.items || []).map((it, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{it.name}</td>
                  <td style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: G.muted }}>{it.code}</td>
                  <td>{it.qty}</td>
                  <td><span className="tag">{it.unit}</span></td>
                  <td style={{ fontFamily: "'Space Mono',monospace" }}>R${(it.unit_price || 0).toFixed(2)}</td>
                  <td style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, color: G.accent }}>R${(it.total || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════════════ */
export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('upload');
  const [toast, setToast] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  const handleUploaded = (msg, type) => {
    showToast(msg, type);
    if (type === 'success') setTab('dashboard');
  };

  if (authLoading) return <div className="loading-wrap" style={{ minHeight: '100vh' }}><div className="spinner" /></div>;
  if (!user) return <><style>{CSS}</style><AuthView onAuth={setUser} /></>;

  const tabs = [
    { id: 'upload', label: '📤 Upload NFCe' },
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'items', label: '🔍 Consulta por Item' },
    { id: 'receipts', label: '🧾 Notas Importadas' },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <div className="header">
          <div className="header-logo">₿</div>
          <h1>Price<span>Track</span></h1>
          <div className="header-user">
            <span>{user.email}</span>
            <button className="logout-btn" onClick={() => supabase.auth.signOut()}>Sair</button>
          </div>
        </div>
        <div className="nav">
          {tabs.map(t => (
            <button key={t.id} className={`nav-btn${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>
        <div className="main">
          {tab === 'upload' && <UploadView user={user} onUploaded={handleUploaded} />}
          {tab === 'dashboard' && <DashboardView user={user} />}
          {tab === 'items' && <ItemsView user={user} />}
          {tab === 'receipts' && <ReceiptsView user={user} />}
        </div>
      </div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
