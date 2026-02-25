// INTELIGÊNCIA E LÓGICA - COCAL PROGRAMA DE ESTÁGIO 2026

const CONFIG = {
    STORAGE_KEY: 'cocal_metrics_2026',
    DATE_DISPLAY_ID: 'current-date-display'
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
let db = INITIAL_DATA.ativos; // Base de ativos padrão

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', async () => {
    initClock();
    await carregarDadosExternos();
    carregarPersistencia();

    // Listeners para Upload e Filtro
    const uploadEl = document.getElementById('uploadAtividadesCsv');
    if (uploadEl) uploadEl.addEventListener('change', handleFileUpload);

    const buscaEl = document.getElementById('buscaAtividades');
    if (buscaEl) buscaEl.addEventListener('input', (e) => filtrarTabela(e.target.value));
});

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
        promovidos: 'CASES DE SUCESSO'
    };
    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.innerText = map[id] || 'PROGRAMA DE ESTÁGIO';

    if (id === 'promovidos') renderizarPromovidos();
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

function mapearColuna(row, prefixos) {
    const keys = Object.keys(row);
    const norm = (s) => String(s || '').toUpperCase().normalize("NFD").replace(/[^A-Z0-9]/g, "");
    for (let pref of prefixos) {
        const match = keys.find(k => norm(k).includes(norm(pref)));
        if (match) return row[match];
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

        const tr = document.createElement('tr');
        tr.className = "hover:bg-brand-light transition-all cursor-pointer group";
        tr.onclick = () => verMais(ix);
        tr.innerHTML = `
            <td class="py-6 pl-6 font-mono text-[9px] font-black text-brand-primary opacity-60">${mapearColuna(row, ['MATRICULA', 'ID']) || '-'}</td>
            <td class="py-6 font-black text-[11px] text-brand-dark group-hover:text-brand-accent transition-colors uppercase">${name}</td>
            <td class="py-6 text-[10px] font-bold text-brand-gray uppercase">${role}</td>
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
                <p class="text-[9px] font-black text-brand-gray tracking-widest uppercase mb-2">Cargo</p>
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

function exportarExcel() {
    let content = "data:text/csv;charset=ISO-8859-1,MATRICULA;COLABORADOR;CARGO;ADMISSAO\n";
    db.forEach(r => content += `${mapearColuna(r, ['MATRICULA'])};${mapearColuna(r, ['COLABORADOR'])};${mapearColuna(r, ['CARGO'])};${mapearColuna(r, ['ADMISSAO'])}\n`);
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(content));
    link.setAttribute("download", `GESTAO_ESTAGIO_COCAL_2026.csv`);
    link.click();
}
