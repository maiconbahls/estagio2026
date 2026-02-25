// INTELIGÊNCIA E LÓGICA - COCAL PROGRAMA DE ESTÁGIO 2026

const CONFIG = {
    STORAGE_KEY: 'cocal_metrics_2026',
    AUTH_KEY: 'cocal_auth_session',
    ROLE_KEY: 'cocal_user_role',
    USER_NAME_KEY: 'cocal_user_name',
    DATE_DISPLAY_ID: 'current-date-display',
    API_URL: 'https://script.google.com/macros/s/AKfycbz7id1Jjq4YJNfQa6_Z1I56ipvHhQ3vw0WtCRWHWNNT7Ov-7uKLBNNwyZOIVN5K-Ixl/exec',
    CREDENTIALS: { user: 'gestao', pass: 'Cocal@2025' }
};

// DADOS REAIS EXTRAÍDOS DA BASE (Mapeamento Inicial)
const INITIAL_DATA = {
    ativos: [
        { "MATRICULA": 3009000, "COLABORADOR": "BEATRIZ CARNELOS VIEIRA", "ADMISSAO": "2025-08-20", "CARGO": "ESTAGIARIO" },
        { "MATRICULA": 3483400, "COLABORADOR": "BERNARDO BRAGA BONFIM", "ADMISSAO": "2026-01-21", "CARGO": "ESTAGIARIO" },
        { "MATRICULA": 3483100, "COLABORADOR": "DANIEL COSTA NICODEMO", "ADMISSAO": "2026-01-21", "CARGO": "ESTAGIARIO" },
        { "MATRICULA": 3482800, "COLABORADOR": "DANIEL VIEIRA DA CUNHA", "ADMISSAO": "2026-01-21", "CARGO": "ESTAGIARIO" },
        { "MATRICULA": 3008500, "COLABORADOR": "DEBORAH RIVERO LACERDA ACIOLI", "ADMISSAO": "2025-08-20", "CARGO": "ESTAGIARIO" },
        { "MATRICULA": 3483300, "COLABORADOR": "EDUARDO OLIVEIRA RIBEIRO DE MORAES", "ADMISSAO": "2026-01-21", "CARGO": "ESTAGIARIO" },
        { "MATRICULA": 3483500, "COLABORADOR": "ENRICO PONTELLI CANDIDO", "ADMISSAO": "2026-01-21", "CARGO": "ESTAGIARIO" },
        { "MATRICULA": 3008600, "COLABORADOR": "FELIPE SILVA DIAS", "ADMISSAO": "2025-08-20", "CARGO": "ESTAGIARIO" },
        { "MATRICULA": 3014900, "COLABORADOR": "GUILHERME JORGE DA SILVA", "ADMISSAO": "2025-09-17", "CARGO": "ESTAGIARIO" },
        { "MATRICULA": 3010100, "COLABORADOR": "ISLAINE OLIVEIRA COSTA", "ADMISSAO": "2025-09-03", "CARGO": "ESTAGIARIO" },
        { "MATRICULA": 3483600, "COLABORADOR": "JACQUELINE AKINA NAKAGAWA", "ADMISSAO": "2026-01-21", "CARGO": "ESTAGIARIO" },
        { "MATRICULA": 3008700, "COLABORADOR": "JENYFFER SEVERINO DA SILVA", "ADMISSAO": "2025-08-20", "CARGO": "ESTAGIARIO" },
        { "MATRICULA": 3013900, "COLABORADOR": "JONATHAN FREITAS DE SOUZA", "ADMISSAO": "2025-09-17", "CARGO": "ESTAGIARIO" },
        { "MATRICULA": 3008900, "COLABORADOR": "JULIA PEREIRA GOMES", "ADMISSAO": "2025-08-20", "CARGO": "ESTAGIARIO" },
        { "MATRICULA": 3483900, "COLABORADOR": "LEONARDO D AVANCO LOUREIRO", "ADMISSAO": "2026-01-21", "CARGO": "ESTAGIARIO" },
        { "MATRICULA": 3014200, "COLABORADOR": "LEONARDO HENRIQUE DA CRUZ NOGUEIRA", "ADMISSAO": "2025-09-17", "CARGO": "ESTAGIARIO" },
        { "MATRICULA": 3483700, "COLABORADOR": "LUCAS MATHEUS DE OLIVEIRA MULATO", "ADMISSAO": "2026-01-21", "CARGO": "ESTAGIARIO" },
        { "MATRICULA": 3483800, "COLABORADOR": "MARCELO JOSE BICUDO JUNIOR", "ADMISSAO": "2026-01-21", "CARGO": "ESTAGIARIO" },
        { "MATRICULA": 3014500, "COLABORADOR": "MATHEUS ACIOLI FELIX SILVA", "ADMISSAO": "2025-09-17", "CARGO": "ESTAGIARIO" },
        { "MATRICULA": 3008400, "COLABORADOR": "PAULA FERNANDA FRANCELINO CARDOSO DOS SA", "ADMISSAO": "2025-08-20", "CARGO": "ESTAGIARIO" },
        { "MATRICULA": 3013700, "COLABORADOR": "PAULO RICARDO DOS SANTOS", "ADMISSAO": "2025-09-17", "CARGO": "ESTAGIARIO" },
        { "MATRICULA": 3438900, "COLABORADOR": "PEDRO NATANIEL GABILON ARCE", "ADMISSAO": "2025-10-22", "CARGO": "ESTAGIARIO" },
        { "MATRICULA": 3009200, "COLABORADOR": "STEFANI CAROLINE SOUZA DE OLIVEIRA", "ADMISSAO": "2025-08-20", "CARGO": "ESTAGIARIO" },
        { "MATRICULA": 3008800, "COLABORADOR": "TAMIRIS DOS SANTOS VENANCIO GOIS", "ADMISSAO": "2025-08-20", "CARGO": "ESTAGIARIO" }
    ],
    promovidos: [
        { "MATRICULA": 3008701, "COLABORADOR": "JENYFFER SEVERINO DA SILVA", "DATA_PROMOCAO": "2026-02-04", "CARGO": "JOVEM PROFISSIONAL" },
        { "MATRICULA": 3009001, "COLABORADOR": "BEATRIZ CARNELOS VIEIRA", "DATA_PROMOCAO": "2025-11-05", "CARGO": "JOVEM PROFISSIONAL" },
        { "MATRICULA": 3013701, "COLABORADOR": "PAULO RICARDO DOS SANTOS", "DATA_PROMOCAO": "2026-02-04", "CARGO": "JOVEM PROFISSIONAL" }
    ]
};

let chartCompInstance = null;
let chartStatusInstance = null;
let chartFeedbackComp = null;
let chartFeedbackRem = null;
let chartIndividualInstance = null;
let db = INITIAL_DATA.ativos;
let feedbackDB = []; // Base de feedbacks

// INICIALIZAÇÃO ULTRA-RÁPIDA
document.addEventListener('DOMContentLoaded', () => {
    // 1. Verifica autenticação ANTES de qualquer outra coisa
    checkAuth();

    // 2. Carrega componentes visuais (não-bloqueante)
    initClock();

    // 3. Carrega dados em background (sem await)
    carregarDadosExternos();
    carregarPersistencia();

    // Listeners
    const uploadEl = document.getElementById('uploadAtividadesCsv');
    if (uploadEl) uploadEl.addEventListener('change', handleFileUpload);

    const buscaEl = document.getElementById('buscaAtividades');
    if (buscaEl) buscaEl.addEventListener('input', (e) => filtrarTabela(e.target.value));

    const buscaGeralEl = document.getElementById('buscaColaboradoresGeral');
    if (buscaGeralEl) buscaGeralEl.addEventListener('input', (e) => filtrarColaboradoresGeral(e.target.value));
});

function checkAuth() {
    const isLogged = localStorage.getItem(CONFIG.AUTH_KEY);
    const role = localStorage.getItem(CONFIG.ROLE_KEY);
    const name = localStorage.getItem(CONFIG.USER_NAME_KEY);

    if (isLogged === 'true') {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('main-layout').classList.remove('hidden');

        applyRoleRestrictions(role);
        if (name) {
            const nameEl = document.querySelector('header .text-sm');
            if (nameEl) nameEl.innerText = name;
            const roleEl = document.querySelector('header .text-\[10px\]');
            if (roleEl) roleEl.innerText = role === 'admin' ? 'Administrador do Programa' : 'Estagiário Cocal';
        }
        navigateTo('dashboard');
    }
}

function applyRoleRestrictions(role) {
    const adminElements = document.querySelectorAll('.admin-only');
    if (role === 'admin') {
        adminElements.forEach(el => el.classList.remove('hidden'));
    } else {
        adminElements.forEach(el => el.classList.add('hidden'));
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById('login-user').value.trim();
    const pass = document.getElementById('login-pass').value.trim();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerHTML;

    btn.innerHTML = '<i class="ph-bold ph-circle-notch animate-spin text-xl"></i>';
    btn.disabled = true;

    try {
        if (user === CONFIG.CREDENTIALS.user && pass === CONFIG.CREDENTIALS.pass) {
            loginSuccess('admin', 'Maicon Bahls');
            return;
        }

        // Timeout de 10s para não deixar o usuário esperando eternamente o Google
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const url = `${CONFIG.API_URL}?user=${encodeURIComponent(user)}&pass=${encodeURIComponent(pass)}`;
        const response = await fetch(url, { signal: controller.signal });
        const result = await response.json();
        clearTimeout(timeoutId);

        if (result.status === 'success') {
            loginSuccess(result.role, result.name);
        } else {
            showLoginError("Matrícula ou CPF Incorretos");
        }
    } catch (err) {
        console.error("Erro no login:", err);
        showLoginError(err.name === 'AbortError' ? "Tempo esgotado (Google Lento)" : "Erro na Conexão");
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

function loginSuccess(role, name) {
    localStorage.setItem(CONFIG.AUTH_KEY, 'true');
    localStorage.setItem(CONFIG.ROLE_KEY, role);
    localStorage.setItem(CONFIG.USER_NAME_KEY, name);

    // Aplica entrada imediata
    checkAuth();
}

function showLoginError(msg) {
    const errorEl = document.getElementById('login-error');
    errorEl.innerText = msg;
    errorEl.classList.remove('hidden');
    const form = document.getElementById('login-form');
    form.classList.add('animate-shake');
    setTimeout(() => form.classList.remove('animate-shake'), 500);
}

function logout() {
    localStorage.clear();
    window.location.reload();
}

async function carregarDadosExternos() {
    try {
        const response = await fetch('base_data.json');
        if (response.ok) {
            const data = await response.json();
            if (data.ativos) INITIAL_DATA.ativos = data.ativos;
            if (data.promovidos) INITIAL_DATA.promovidos = data.promovidos;
            console.log("Dados externos carregados com sucesso!");
        }
    } catch (e) {
        console.warn("Aviso: base_data.json não encontrado ou inacessível (comum em acesso via file://). Usando dados internos.");
    }
}

function initClock() {
    const el = document.getElementById(CONFIG.DATE_DISPLAY_ID);
    if (!el) return;
    const now = new Date();
    const opt = { day: '2-digit', month: 'long', year: 'numeric' };
    el.innerText = now.toLocaleDateString('pt-BR', opt).toUpperCase();
}

// NAVEGAÇÃO ENTRE TELAS
function navigateTo(id) {
    // Estilo dos botões da Sidebar
    document.querySelectorAll('nav button').forEach(b => {
        b.classList.remove('nav-active', 'bg-brand-primary', 'text-white');
        b.classList.add('text-brand-gray');
    });

    const target = document.getElementById('nav-' + id);
    if (target) {
        target.classList.add('nav-active', 'bg-brand-primary', 'text-white');
        target.classList.remove('text-brand-gray');
    }

    // Troca de seção visível
    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden-section'));
    const view = document.getElementById('view-' + id);
    if (view) view.classList.remove('hidden-section');

    // Título dinâmico do Header
    const map = {
        dashboard: 'VISÃO GERAL DO PROGRAMA',
        trilhas: 'TRILHA ESTRATÉGICA',
        atividades: 'GESTÃO SEMANAL',
        promovidos: 'CASES DE SUCESSO',
        indicadores: 'INDICADORES DE FEEDBACK'
    };
    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.innerText = map[id] || 'PROGRAMA DE ESTÁGIO';

    if (id === 'promovidos') renderizarPromovidos();
    if (id === 'indicadores') sincronizarFeedbacks();
    if (id === 'colaboradores') renderizarListaColaboradores();
}

// PERSISTÊNCIA DE DADOS
function carregarPersistencia() {
    const data = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (data) {
        try {
            db = JSON.parse(data);
        } catch (e) { db = INITIAL_DATA.ativos; }
    }
    sincronizarInterface();
}

function salvarPersistencia() {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(db));
}

function limparDados() {
    if (confirm("Deseja resetar para os dados originais do programa?")) {
        localStorage.removeItem(CONFIG.STORAGE_KEY);
        db = INITIAL_DATA.ativos;
        window.location.reload();
    }
}

// GESTO DE DADOS (CSV)
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        processarCSV(event.target.result);
    };
    reader.readAsText(file, 'ISO-8859-1');
}

function processarCSV(csv) {
    const rows = csv.split(/\r?\n/).filter(l => l.trim() !== '');
    if (rows.length < 2) return;
    const headers = rows[0].split(';').map(h => h.trim().toUpperCase());
    const novos = rows.slice(1).map(linha => {
        const cols = linha.split(';');
        let item = {};
        headers.forEach((h, i) => { item[h] = cols[i] || ''; });
        return item;
    });
    db = [...db, ...novos];
    salvarPersistencia();
    sincronizarInterface();
}

function sincronizarInterface() {
    renderizarTabela(db);
    atualizarMetrics(db);
}

function formatarDataBR(dataStr) {
    if (!dataStr || dataStr === '-') return '-';
    // Se já estiver no formato DD/MM/AAAA, retorna como está
    if (/^\d{2}\/\d{2}\/\d{4}/.test(dataStr)) return dataStr;

    try {
        const d = new Date(dataStr);
        if (isNaN(d.getTime())) return dataStr;
        return d.toLocaleDateString('pt-BR');
    } catch (e) {
        return dataStr;
    }
}

function mapearColuna(row, prefixos) {
    const keys = Object.keys(row);
    const norm = (s) => String(s || '').toUpperCase().normalize("NFD").replace(/[^A-Z0-9]/g, "");
    for (let pref of prefixos) {
        const match = keys.find(k => norm(k).includes(norm(pref)));
        if (match) return row[match];
    }
    // Caso específico para a nova coluna "Temino contrato" que pode conter caracteres especiais
    if (prefixos.includes('TERMINO')) {
        const matchContrato = keys.find(k => norm(k).includes("TEMINOCONTRATO") || norm(k).includes("TERMINOCONTRATO"));
        if (matchContrato) return row[matchContrato];
    }
    return '';
}

// RENDERIZAÇÃO DA TABELA DE ATIVOS
function renderizarTabela(data) {
    const tbody = document.getElementById('tabela-atividades-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    data.forEach((row, ix) => {
        const name = mapearColuna(row, ['COLABORADOR', 'NOME', 'ESTAGIARIO']) || 'NOME NÃO INFORMADO';
        const role = mapearColuna(row, ['CARGO', 'FUNCAO']) || 'ESTAGIARIO';
        const hours = mapearColuna(row, ['HORAS', 'TEMPO']) || '0';
        const status = String(mapearColuna(row, ['STATUS', 'SITUACAO']) || 'ATIVO').toUpperCase();
        const inicio = formatarDataBR(mapearColuna(row, ['ADMISSAO', 'INICIO']));
        const termino = formatarDataBR(mapearColuna(row, ['TERMINO', 'FIM', 'CONTRATO']));

        const tr = document.createElement('tr');
        tr.className = "hover:bg-brand-light transition-all cursor-pointer group";
        tr.onclick = () => verMais(ix);
        tr.innerHTML = `
            <td class="py-6 pl-6 font-mono text-[9px] font-black text-brand-primary opacity-60">${mapearColuna(row, ['MATRICULA', 'ID']) || '-'}</td>
            <td class="py-6 font-black text-[11px] text-brand-dark group-hover:text-brand-accent transition-colors uppercase">${name}</td>
            <td class="py-6 text-[10px] font-bold text-brand-gray uppercase">${inicio}</td>
            <td class="py-6 text-[10px] font-bold text-brand-gray uppercase">${termino}</td>
            <td class="py-6 text-center font-black text-[10px] text-brand-primary">${hours}H</td>
            <td class="py-6 text-right pr-6">
                <span class="px-4 py-1.5 rounded-xl text-[8px] font-black shadow-lg ${status.includes('CONCLU') ? 'bg-brand-accent text-white' : 'bg-slate-100 text-slate-500'}">
                    ${status}
                </span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// RENDERIZAÇÃO DE PROMOVIDOS (CASES DE SUCESSO)
function renderizarPromovidos() {
    const container = document.getElementById('promovidos-cards');
    const tbody = document.getElementById('tabela-promovidos-body');
    if (!container || !tbody) return;

    container.innerHTML = '';
    tbody.innerHTML = '';

    INITIAL_DATA.promovidos.forEach(p => {
        const colaborador = mapearColuna(p, ['COLABORADOR', 'NOME']) || 'NOME';
        const cargo = mapearColuna(p, ['CARGO', 'FUNCAO', 'PROMOVIDO']) || 'JOVEM PROFISSIONAL';
        const dataPromocao = String(mapearColuna(p, ['DATA', 'PROMOCAO']) || '').split(' ')[0] || '-';
        const matricula = mapearColuna(p, ['MATRICULA', 'ID']) || '-';

        // Cards de destaque
        const card = document.createElement('div');
        card.className = "glass-card p-8 rounded-[2.5rem] flex flex-col items-center text-center gap-4 relative overflow-hidden group";
        card.innerHTML = `
            <div class="absolute -right-6 -top-6 w-24 h-24 bg-brand-accent/5 rounded-full transform group-hover:scale-150 transition-transform duration-700"></div>
            <div class="w-16 h-16 bg-brand-accent rounded-2xl flex items-center justify-center text-white text-2xl shadow-xl shadow-brand-accent/30">
                <i class="ph-fill ph-rocket-launch"></i>
            </div>
            <div>
                <h4 class="font-black text-brand-primary text-sm uppercase">${colaborador}</h4>
                <p class="text-[9px] font-bold text-brand-accent tracking-widest uppercase">Promovido a ${cargo}</p>
            </div>
            <div class="text-[9px] font-black text-brand-gray bg-brand-light px-4 py-2 rounded-full border border-gray-100 uppercase">
                Desde ${dataPromocao}
            </div>
        `;
        container.appendChild(card);

        // Linhas da tabela
        const tr = document.createElement('tr');
        tr.className = "hover:bg-brand-light transition-all border-b border-gray-50 uppercase";
        tr.innerHTML = `
            <td class="py-6 pl-6 font-mono text-[9px] font-black text-brand-primary opacity-60">${matricula}</td>
            <td class="py-6 font-black text-[11px] text-brand-dark">${colaborador}</td>
            <td class="py-6 text-[10px] font-bold text-brand-accent">${cargo}</td>
            <td class="py-6 text-right pr-6 font-black text-[10px] text-brand-gray">${dataPromocao}</td>
        `;
        tbody.appendChild(tr);
    });
}

function verMais(ix) {
    const data = db[ix];
    const content = document.getElementById('modal-content');
    if (!content) return;
    content.innerHTML = `
        <div class="grid grid-cols-2 gap-8">
            <div class="col-span-2 bg-brand-light p-8 rounded-[2.5rem] flex items-center gap-6">
                <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm"><i class="ph-fill ph-user text-3xl text-brand-primary"></i></div>
                <div>
                    <p class="text-[9px] font-black text-brand-gray tracking-widest uppercase mb-1">Colaborador</p>
                    <h4 class="font-black text-xl text-brand-primary uppercase">${mapearColuna(data, ['COLABORADOR', 'NOME']) || 'NÃO INFORMADO'}</h4>
                </div>
            </div>
            <div>
                <p class="text-[9px] font-black text-brand-gray tracking-widest uppercase mb-2">Início Trilha</p>
                <h4 class="font-bold text-sm uppercase">${formatarDataBR(mapearColuna(data, ['ADMISSAO', 'INICIO']))}</h4>
            </div>
            <div>
                <p class="text-[9px] font-black text-brand-gray tracking-widest uppercase mb-2">Término Contrato</p>
                <h4 class="font-black text-sm uppercase">${formatarDataBR(mapearColuna(data, ['TERMINO', 'FIM', 'CONTRATO']))}</h4>
            </div>
            <div>
                <p class="text-[9px] font-black text-brand-gray tracking-widest uppercase mb-2">Cargo Atual</p>
                <h4 class="font-bold text-xs uppercase">${mapearColuna(data, ['CARGO', 'FUNCAO']) || 'ESTAGIÁRIO'}</h4>
            </div>
            <div>
                <p class="text-[9px] font-black text-brand-gray tracking-widest uppercase mb-2">Matrícula</p>
                <h4 class="font-black text-sm uppercase">${mapearColuna(data, ['MATRICULA', 'ID'])}</h4>
            </div>
            <div class="col-span-2">
                <p class="text-[9px] font-black text-brand-gray tracking-widest uppercase mb-2">Resumo de Atuação</p>
                <p class="bg-brand-light/50 p-6 rounded-2xl border border-gray-100 text-xs font-bold leading-relaxed uppercase">
                    ${mapearColuna(data, ['ATIVIDADE', 'DESCRICAO']) || 'ESTAGIÁRIO ATIVO DO CICLO 2026. PARTICIPAÇÃO EM PROJETOS DA ÁREA.'}
                </p>
            </div>
        </div>
    `;
    document.getElementById('modal-detalhes').classList.remove('hidden');
}

function fecharModal() {
    document.getElementById('modal-detalhes').classList.add('hidden');
}

// MÉTRICAS DO DASHBOARD
function atualizarMetrics(data) {
    const totalPromovidos = INITIAL_DATA.promovidos.length;
    const totalAtivos = data.length;
    const totalCiclo = totalAtivos + totalPromovidos;
    const taxa = ((totalPromovidos / totalCiclo) * 100).toFixed(1);

    document.getElementById('kpi-estagiarios').innerText = totalAtivos;
    document.getElementById('kpi-concluidas').innerText = totalPromovidos;
    document.getElementById('kpi-taxa').innerText = taxa + '%';

    let totalH = 0;
    data.forEach(r => totalH += parseFloat(mapearColuna(r, ['HORAS']) || 0));
    document.getElementById('kpi-horas').innerText = Math.round(totalH) + 'H';

    renderCharts(data, totalPromovidos);
}

function renderCharts(dataAtivos, promovidosCount) {
    // Gráfico de Cargos
    const cargos = {};
    dataAtivos.forEach(r => {
        const c = mapearColuna(r, ['CARGO', 'FUNCAO']) || 'ESTAGIARIO';
        cargos[c] = (cargos[c] || 0) + 1;
    });

    const ctxC = document.getElementById('chartComplexidade');
    if (ctxC) {
        if (chartCompInstance) chartCompInstance.destroy();
        chartCompInstance = new Chart(ctxC.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: Object.keys(cargos),
                datasets: [{
                    data: Object.values(cargos),
                    backgroundColor: ['#30515F', '#76B82A', '#E2E8F0', '#64748B'],
                    borderWidth: 6,
                    borderColor: '#ffffff'
                }]
            },
            options: { cutout: '75%', maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { font: { weight: '900', size: 9 }, usePointStyle: true } } } }
        });
    }

    // Gráfico de Evolução
    const ctxS = document.getElementById('chartStatus');
    if (ctxS) {
        if (chartStatusInstance) chartStatusInstance.destroy();
        chartStatusInstance = new Chart(ctxS.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['EVOLUÇÃO'],
                datasets: [
                    { label: 'ATIVOS', data: [dataAtivos.length], backgroundColor: '#30515F', borderRadius: 12, barThickness: 50 },
                    { label: 'EFETIVADOS', data: [promovidosCount], backgroundColor: '#76B82A', borderRadius: 12, barThickness: 50 }
                ]
            },
            options: { maintainAspectRatio: false, scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } }, plugins: { legend: { position: 'bottom', labels: { font: { weight: '900', size: 9 }, usePointStyle: true } } } }
        });
    }
}

function filtrarTabela(val) {
    const v = val.toUpperCase();
    const filtered = db.filter(r => Object.values(r).some(col => String(col).toUpperCase().includes(v)));
    renderizarTabela(filtered);
}

// GESTÃO DE FEEDBACKS (INDICADORES)
async function sincronizarFeedbacks() {
    if (CONFIG.API_URL === 'SUA_URL_DO_APPS_SCRIPT_AQUI') return;

    const tbody = document.getElementById('tabela-feedback-body');
    if (tbody) tbody.innerHTML = '<tr><td colspan="5" class="py-10 text-center font-black text-brand-gray animate-pulse">CARREGANDO DADOS DA PLANILHA...</td></tr>';

    try {
        const response = await fetch(CONFIG.API_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'getFeedbacks' })
        });
        const data = await response.json();

        if (data && data.length > 0) {
            feedbackDB = data;
            renderizarIndicadores();
        }
    } catch (err) {
        console.error("Erro ao buscar feedbacks:", err);
    }
}

function renderizarIndicadores() {
    const tbody = document.getElementById('tabela-feedback-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    const compStats = {};
    const remStats = {};
    let mesCount = 0;
    const trintaDias = new Date();
    trintaDias.setDate(trintaDias.getDate() - 30);

    feedbackDB.forEach(f => {
        const dataF = new Date(f.data);
        if (dataF > trintaDias) mesCount++;

        compStats[f.competencia] = (compStats[f.competencia] || 0) + 1;
        remStats[f.remetente] = (remStats[f.remetente] || 0) + 1;

        const tr = document.createElement('tr');
        tr.className = "hover:bg-brand-light transition-all uppercase";
        tr.innerHTML = `
            <td class="py-6 pl-6 font-mono text-[9px] font-black text-brand-primary opacity-60">${new Date(f.data).toLocaleDateString()}</td>
            <td class="py-6 font-black text-[11px] text-brand-dark">${f.colaborador}</td>
            <td class="py-6 text-[10px] font-bold text-brand-accent">${f.competencia}</td>
            <td class="py-6 text-[10px] font-bold text-brand-gray">${f.remetente}</td>
            <td class="py-6 pr-6 text-[10px] font-medium normal-case italic text-brand-gray/80 max-w-xs truncate" title="${f.comentario}">${f.comentario}</td>
        `;
        tbody.appendChild(tr);
    });

    // Atualizar KPIs
    document.getElementById('kpi-total-feedback').innerText = feedbackDB.length;
    document.getElementById('kpi-total-competencias').innerText = Object.keys(compStats).length;
    document.getElementById('kpi-feedback-mes').innerText = mesCount;

    renderFeedbackCharts(compStats, remStats);
}

function renderFeedbackCharts(compStats, remStats) {
    const ctxC = document.getElementById('chartFeedbackComp');
    if (ctxC) {
        if (chartFeedbackComp) chartFeedbackComp.destroy();
        chartFeedbackComp = new Chart(ctxC.getContext('2d'), {
            type: 'polarArea',
            data: {
                labels: Object.keys(compStats),
                datasets: [{ data: Object.values(compStats), backgroundColor: ['#30515F', '#76B82A', '#E2E8F0', '#64748B', '#F1F5F9'] }]
            },
            options: { maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { font: { weight: '900', size: 8 } } } } }
        });
    }

    const ctxR = document.getElementById('chartFeedbackRemetente');
    if (ctxR) {
        if (chartFeedbackRem) chartFeedbackRem.destroy();
        const sortedRem = Object.entries(remStats).sort((a, b) => b[1] - a[1]).slice(0, 5);
        chartFeedbackRem = new Chart(ctxR.getContext('2d'), {
            type: 'bar',
            data: {
                labels: sortedRem.map(r => r[0]),
                datasets: [{ label: 'Feedbacks Enviados', data: sortedRem.map(r => r[1]), backgroundColor: '#76B82A', borderRadius: 8 }]
            },
            options: { indexAxis: 'y', maintainAspectRatio: false, scales: { x: { beginAtZero: true, grid: { display: false } }, y: { grid: { display: false } } }, plugins: { legend: { display: false } } }
        });
    }
}

// GESTÃO DE COLABORADORES (LISTA GERAL E DASHBOARD INDIVIDUAL)
function renderizarListaColaboradores(filtro = '') {
    const grid = document.getElementById('lista-colaboradores-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const f = filtro.toUpperCase();

    // Unificar ativos e promovidos
    const todos = [
        ...db.map(x => ({ ...x, _tipo: 'ATIVO' })),
        ...INITIAL_DATA.promovidos.map(x => ({ ...x, _tipo: 'PROMOVIDO' }))
    ];

    todos.filter(item => {
        const nome = (mapearColuna(item, ['COLABORADOR', 'NOME']) || '').toUpperCase();
        const mat = String(mapearColuna(item, ['MATRICULA', 'ID']) || '').toUpperCase();
        return nome.includes(f) || mat.includes(f);
    }).forEach(item => {
        const nome = mapearColuna(item, ['COLABORADOR', 'NOME']) || 'NOME';
        const mat = mapearColuna(item, ['MATRICULA', 'ID']) || '-';
        const status = item._tipo;

        const card = document.createElement('div');
        card.className = "bg-brand-light/50 p-8 rounded-[2.5rem] border border-gray-100 hover:border-brand-accent/50 hover:bg-white transition-all cursor-pointer group relative overflow-hidden";
        card.onclick = () => abrirDashboardIndividual(item);
        card.innerHTML = `
            <div class="flex items-center gap-5 mb-6 text-left">
                <div class="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <i class="ph-fill ph-user text-2xl text-brand-primary opacity-40"></i>
                </div>
                <div class="flex-1 truncate">
                    <h4 class="font-black text-brand-primary text-xs uppercase truncate">${nome}</h4>
                    <p class="text-[9px] font-bold text-brand-gray tracking-widest uppercase">Mat: ${mat}</p>
                </div>
            </div>
            <div class="flex justify-between items-center">
                <span class="text-[9px] font-black tracking-widest uppercase ${status === 'ATIVO' ? 'text-brand-accent' : 'text-purple-500'}">${status}</span>
                <i class="ph-bold ph-arrow-right text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity"></i>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filtrarColaboradoresGeral(val) {
    renderizarListaColaboradores(val);
}

function abrirDashboardIndividual(colaborador) {
    const nome = mapearColuna(colaborador, ['COLABORADOR', 'NOME']) || 'COLABORADOR';
    const mat = mapearColuna(colaborador, ['MATRICULA', 'ID']) || '-';
    const cargo = mapearColuna(colaborador, ['CARGO', 'FUNCAO']) || 'ESTAGIÁRIO';
    const status = colaborador._tipo || (mapearColuna(colaborador, ['STATUS', 'SITUACAO']) || 'ATIVO');
    const inicio = formatarDataBR(mapearColuna(colaborador, ['ADMISSAO', 'INICIO']));
    const termino = formatarDataBR(mapearColuna(colaborador, ['TERMINO', 'FIM', 'CONTRATO']));

    // Dados Complementares (Mapeamento de novas colunas)
    const curso = mapearColuna(colaborador, ['CURSO', 'ESCOLARIDADE', 'FORMACAO']) || 'NÃO INFORMADO';
    const bio = mapearColuna(colaborador, ['BIO', 'SOBRE', 'RESUMO', 'DESCRICAO']) || 'ESTAGIÁRIO ATIVO DO CICLO 2026. PARTICIPAÇÃO EM PROJETOS DA ÁREA.';
    const nascimento = formatarDataBR(mapearColuna(colaborador, ['NASCIMENTO', 'DATA_NASC']));
    const hobbies = mapearColuna(colaborador, ['HOBBIES', 'INTERESSES']) || '-';
    const foto = mapearColuna(colaborador, ['FOTO', 'URL_FOTO', 'IMAGEM']);

    // Contatos
    const email = mapearColuna(colaborador, ['EMAIL', 'CORREIO']) || '#';
    const whatsapp = mapearColuna(colaborador, ['WHATSAPP', 'CELULAR', 'TELEFONE']) || '';
    const linkedin = mapearColuna(colaborador, ['LINKEDIN']) || '#';

    // Preencher Textos Básicos
    document.getElementById('indiv-nome').innerText = nome;
    document.getElementById('indiv-matricula').innerText = mat;
    document.getElementById('indiv-cargo').innerText = cargo;
    document.getElementById('indiv-data-inicio').innerText = inicio;
    document.getElementById('indiv-data-termino').innerText = termino;

    // Preencher Dados Complementares
    document.getElementById('indiv-curso').innerText = curso;
    document.getElementById('indiv-bio').innerText = bio;
    document.getElementById('indiv-nascimento').innerText = nascimento;
    document.getElementById('indiv-hobbies').innerText = hobbies;

    // Foto
    const imgEl = document.getElementById('indiv-foto');
    const placeholderEl = document.getElementById('indiv-foto-placeholder');
    if (foto && foto.startsWith('http')) {
        imgEl.src = foto;
        imgEl.classList.remove('hidden');
        placeholderEl.classList.add('hidden');
    } else {
        imgEl.classList.add('hidden');
        placeholderEl.classList.remove('hidden');
    }

    // Links de Contato
    document.getElementById('indiv-email-btn').href = email.includes('@') ? `mailto:${email}` : '#';
    document.getElementById('indiv-whatsapp-btn').href = whatsapp ? `https://wa.me/55${whatsapp.replace(/\D/g, '')}` : '#';
    document.getElementById('indiv-linkedin-btn').href = linkedin.startsWith('http') ? linkedin : `https://linkedin.com/in/${linkedin}`;

    const badge = document.getElementById('indiv-status-badge');
    badge.innerText = status;
    badge.className = `px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${status === 'ATIVO' ? 'bg-brand-accent/10 text-brand-accent' : 'bg-purple-100 text-purple-600'}`;

    // Calcular tempo (simples)
    if (inicio !== '-' && (inicio.includes('/') || inicio.includes('-'))) {
        const partes = inicio.includes('/') ? inicio.split('/') : inicio.split('-');
        const d1 = inicio.includes('/') ? new Date(partes[2], partes[1] - 1, partes[0]) : new Date(partes[0], partes[1] - 1, partes[2]);
        const d2 = new Date();
        const meses = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
        document.getElementById('indiv-tempo').innerText = Math.max(0, meses) + " Meses";
    } else {
        document.getElementById('indiv-tempo').innerText = "-";
    }

    // Filtrar feedbacks deste colaborador
    const feedbacks = feedbackDB.filter(f =>
        String(f.colaborador).toUpperCase().includes(nome.toUpperCase()) ||
        String(f.matricula) === String(mat)
    );

    const feedLista = document.getElementById('indiv-feedbacks-lista');
    feedLista.innerHTML = '';

    if (feedbacks.length === 0) {
        feedLista.innerHTML = '<div class="col-span-full py-12 flex flex-col items-center opacity-30"><i class="ph-bold ph-chat-slash text-4xl mb-4"></i><p class="text-[10px] font-black uppercase">Nenhum feedback registrado</p></div>';
    } else {
        feedbacks.forEach(f => {
            const item = document.createElement('div');
            item.className = "bg-brand-light/50 p-6 rounded-[2rem] border border-gray-50 flex flex-col gap-4 text-left hover:bg-white hover:shadow-xl hover:shadow-brand-primary/5 transition-all group";
            item.innerHTML = `
                <div class="flex justify-between items-start">
                    <div class="bg-brand-accent/10 px-3 py-1 rounded-full border border-brand-accent/20">
                        <span class="text-[8px] font-black text-brand-accent uppercase">${f.competencia}</span>
                    </div>
                    <span class="text-[8px] font-bold text-brand-gray opacity-40">${new Date(f.data).toLocaleDateString('pt-BR')}</span>
                </div>
                <p class="text-[11px] font-medium leading-relaxed italic text-brand-gray/80 text-left flex-1">"${f.comentario}"</p>
                <div class="pt-4 border-t border-gray-100 flex items-center gap-3">
                    <div class="w-6 h-6 bg-brand-primary rounded-lg flex items-center justify-center text-[10px] text-white font-black">${f.remetente.charAt(0)}</div>
                    <div class="text-[9px] font-black text-brand-primary uppercase truncate">${f.remetente}</div>
                </div>
            `;
            feedLista.appendChild(item);
        });
    }

    // Navegar
    navigateTo('dashboard-individual');

    // Renderizar gráfico fictício de evolução
    setTimeout(() => renderIndividualChart(feedbacks), 300);
}

function renderIndividualChart(feedbacks) {
    const ctx = document.getElementById('chartEvolucaoIndividual');
    if (!ctx) return;

    if (chartIndividualInstance) chartIndividualInstance.destroy();

    // Dados baseados em feedbacks por mês ou competência (Exemplo iterativo)
    const labels = ['Integração', 'Mês 2', 'Mês 3', 'Mês 4', 'Mês 5', 'Mês 6'];
    const data = [60, 65, 75, 72, 85, 92];

    chartIndividualInstance = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Nível de Competência',
                data: data,
                borderColor: '#76B82A',
                backgroundColor: 'rgba(118, 184, 42, 0.1)',
                borderWidth: 4,
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointBackgroundColor: '#fff',
                pointBorderWidth: 3
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, max: 100, grid: { color: 'rgba(0,0,0,0.02)' }, ticks: { font: { weight: 'black', size: 9 } } },
                x: { grid: { display: false }, ticks: { font: { weight: 'black', size: 9 } } }
            },
            plugins: { legend: { display: false } }
        }
    });
}
