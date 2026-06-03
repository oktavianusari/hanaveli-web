/**
 * Hanaveli Web - Core Application Logic
 */

// Initial Seed Data
const DEFAULT_MONITORED = ["USD", "SGD", "EMAS"];
const ALL_CURRENCIES = [
    "USD", "SGD", "HKD", "CHF", "GBP", "AUD", "JPY", "DKK", "CAD", 
    "EUR", "SAR", "NZD", "CNY", "SEK", "THB", "RUB", "KRW", "MYR", "EMAS"
];

const FLAG_EMOJIS = {
    USD: "🇺🇸", SGD: "🇸🇬", EUR: "🇪🇺", GBP: "🇬🇧", AUD: "🇦🇺", CAD: "🇨🇦",
    CHF: "🇨🇭", CNY: "🇨🇳", HKD: "🇭🇰", JPY: "🇯🇵", MYR: "🇲🇾", NZD: "🇳🇿",
    SAR: "🇸🇦", SEK: "🇸🇪", THB: "🇹🇭", RUB: "🇷🇺", KRW: "🇰🇷", EMAS: "🪙", DKK: "🇩🇰"
};

// Mock Fallback Rates for First-time / Offline loads
const FALLBACK_RATES = {
    USD: { eRateBuy: 16180, eRateSell: 16220, ttCounterBuy: 16000, ttCounterSell: 16400, bankNotesBuy: 16000, bankNotesSell: 16400 },
    SGD: { eRateBuy: 11950, eRateSell: 12050, ttCounterBuy: 11800, ttCounterSell: 12200, bankNotesBuy: 11800, bankNotesSell: 12200 },
    EUR: { eRateBuy: 17450, eRateSell: 17580, ttCounterBuy: 17300, ttCounterSell: 17750, bankNotesBuy: 17300, bankNotesSell: 17750 },
    GBP: { eRateBuy: 20500, eRateSell: 20700, ttCounterBuy: 20300, ttCounterSell: 20900, bankNotesBuy: 20300, bankNotesSell: 20900 },
    AUD: { eRateBuy: 10700, eRateSell: 10820, ttCounterBuy: 10550, ttCounterSell: 10980, bankNotesBuy: 10550, bankNotesSell: 10980 },
    CAD: { eRateBuy: 11800, eRateSell: 11950, ttCounterBuy: 11600, ttCounterSell: 12100, bankNotesBuy: 11600, bankNotesSell: 12100 },
    CHF: { eRateBuy: 17800, eRateSell: 17990, ttCounterBuy: 17600, ttCounterSell: 18200, bankNotesBuy: 17600, bankNotesSell: 18200 },
    CNY: { eRateBuy: 2220, eRateSell: 2260, ttCounterBuy: 2150, ttCounterSell: 2320, bankNotesBuy: 2150, bankNotesSell: 2320 },
    HKD: { eRateBuy: 2060, eRateSell: 2090, ttCounterBuy: 2010, ttCounterSell: 2140, bankNotesBuy: 2010, bankNotesSell: 2140 },
    JPY: { eRateBuy: 103.50, eRateSell: 104.90, ttCounterBuy: 101.00, ttCounterSell: 107.50, bankNotesBuy: 101.00, bankNotesSell: 107.50 },
    MYR: { eRateBuy: 3420, eRateSell: 3465, ttCounterBuy: 3350, ttCounterSell: 3550, bankNotesBuy: 3350, bankNotesSell: 3550 },
    NZD: { eRateBuy: 9850, eRateSell: 9980, ttCounterBuy: 9700, ttCounterSell: 10150, bankNotesBuy: 9700, bankNotesSell: 10150 },
    SAR: { eRateBuy: 4310, eRateSell: 4350, ttCounterBuy: 4200, ttCounterSell: 4480, bankNotesBuy: 4200, bankNotesSell: 4480 },
    SEK: { eRateBuy: 1510, eRateSell: 1540, ttCounterBuy: 1470, ttCounterSell: 1580, bankNotesBuy: 1470, bankNotesSell: 1580 },
    THB: { eRateBuy: 440, eRateSell: 450, ttCounterBuy: 425, ttCounterSell: 465, bankNotesBuy: 425, bankNotesSell: 465 },
    RUB: { eRateBuy: 178, eRateSell: 185, ttCounterBuy: 170, ttCounterSell: 195, bankNotesBuy: 170, bankNotesSell: 195 },
    KRW: { eRateBuy: 11.60, eRateSell: 11.95, ttCounterBuy: 11.00, ttCounterSell: 12.50, bankNotesBuy: 11.00, bankNotesSell: 12.50 },
    EMAS: { eRateBuy: 1350000, eRateSell: 1450000, ttCounterBuy: 1350000, ttCounterSell: 1450000, bankNotesBuy: 1350000, bankNotesSell: 1450000 }
};

// Global State
let state = {
    monitored: [],
    transactions: [],
    settings: {
        rateType: "e-rate",
        rateDirection: "jual",
        emasRateDirection: "jual",
        themePreference: "system",
        customColors: { primary: "#386A20", secondary: "#D7E8CD", text: "#1A1C18" },
        language: "system"
    },
    rates: {},
    baseRatesToday: {}, // Used to store today's opening rates for daily change calculation
    lastSyncDay: "",
    bcaLastUpdated: "",
    pegadaianLastUpdated: ""
};

// Localization Translations
const TRANSLATIONS = {
    id: {
        syncing: "Sinkronisasi kurs...",
        sync_success: "Sinkronisasi berhasil",
        sync_failed: "Gagal memuat data kurs",
        bca: "BCA",
        indogold: "IndoGold",
        empty_portfolio: "Belum ada aset valas yang terbeli.",
        total_value: "Estimasi Nilai Total Portofolio",
        add_currency_title: "Tambah Valas untuk Dimonitor",
        add: "Tambah",
        cancel: "Batal",
        select_currency: "Pilih Mata Uang",
        new_transaction: "Transaksi Baru",
        edit_transaction: "Edit Transaksi",
        save: "Simpan",
        buy: "BELI",
        sell: "JUAL",
        date: "Tanggal",
        currency: "Valas",
        type: "Tipe",
        rate: "Nilai Kurs",
        amount: "Jumlah",
        total: "Total (IDR)",
        actions: "Aksi",
        delete_confirm: "Apakah Anda yakin ingin menghapus transaksi ini?",
        import_success: "Impor berhasil! {count} data baru disinkronisasi.",
        import_failed: "Gagal impor: format tidak valid"
    },
    en: {
        syncing: "Syncing rates...",
        sync_success: "Sync completed",
        sync_failed: "Failed to sync rates",
        bca: "BCA",
        indogold: "IndoGold",
        empty_portfolio: "No assets purchased yet.",
        total_value: "Estimated Total Portfolio Value",
        add_currency_title: "Add Currency to Monitor",
        add: "Add",
        cancel: "Cancel",
        select_currency: "Select Currency",
        new_transaction: "New Transaction",
        edit_transaction: "Edit Transaction",
        save: "Save",
        buy: "BUY",
        sell: "SELL",
        date: "Date",
        currency: "Currency",
        type: "Type",
        rate: "Exchange Rate",
        amount: "Amount",
        total: "Total (IDR)",
        actions: "Actions",
        delete_confirm: "Are you sure you want to delete this transaction?",
        import_success: "Import successful! {count} new transactions synced.",
        import_failed: "Import failed: invalid format"
    }
};

function getTranslation(key) {
    const lang = state.settings.language === "system" ? 
        (navigator.language.startsWith("id") ? "id" : "en") : 
        state.settings.language;
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS["id"][key] || key;
}

// Helpers
function formatNumber(num, fractionDigits = 2) {
    return new Intl.NumberFormat(state.settings.language === "id" ? "id-ID" : "en-US", {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
    }).format(num);
}

function formatCurrencyIdr(num) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(num);
}

function getFlag(code) {
    return FLAG_EMOJIS[code] || "🏳️";
}

function getFlagHtml(code) {
    if (code === "EMAS") {
        return `<span class="card-flag">🪙</span>`;
    }
    const countryCode = {
        USD: "us", SGD: "sg", EUR: "eu", GBP: "gb", AUD: "au", CAD: "ca",
        CHF: "ch", CNY: "cn", HKD: "hk", JPY: "jp", MYR: "my", NZD: "nz",
        SAR: "sa", SEK: "se", THB: "th", RUB: "ru", KRW: "kr", DKK: "dk", KWD: "kw"
    }[code.toUpperCase()] || "un";
    
    return `<img src="https://flagcdn.com/w40/${countryCode}.png" srcset="https://flagcdn.com/w80/${countryCode}.png 2x" width="24" height="18" alt="${code} flag" class="flag-img" style="vertical-align: middle; border-radius: 2px; box-shadow: 0 1px 3px rgba(0,0,0,0.15); margin-right: 4px; object-fit: cover;">`;
}

// Local Storage Handlers
function loadState() {
    try {
        const stored = localStorage.getItem("hanaveli_state");
        if (stored) {
            state = JSON.parse(stored);
        } else {
            // Seed defaults
            state.monitored = [...DEFAULT_MONITORED];
            state.transactions = [];
            state.settings = {
                rateType: "e-rate",
                rateDirection: "jual",
                emasRateDirection: "jual",
                themePreference: "system",
                customColors: { primary: "#386A20", secondary: "#D7E8CD", text: "#1A1C18" },
                language: "system"
            };
            state.rates = { ...FALLBACK_RATES };
            state.baseRatesToday = {};
            ALL_CURRENCIES.forEach(c => {
                const isJual = c === "EMAS" ? state.settings.emasRateDirection === "jual" : state.settings.rateDirection === "jual";
                state.baseRatesToday[c] = isJual ? FALLBACK_RATES[c].eRateSell : FALLBACK_RATES[c].eRateBuy;
            });
            saveState();
        }
    } catch (e) {
        console.error("Failed loading state:", e);
    }
}

function saveState() {
    try {
        localStorage.setItem("hanaveli_state", JSON.stringify(state));
    } catch (e) {
        console.error("Failed saving state:", e);
    }
}

// Rate Math & Portfolio Engine
function getRatesForCurrency(code) {
    const rateInfo = state.rates[code] || FALLBACK_RATES[code];
    const prefDirection = code === "EMAS" ? state.settings.emasRateDirection : state.settings.rateDirection;
    const isJual = prefDirection.toLowerCase() === "jual";

    if (!rateInfo) return 0;

    switch (state.settings.rateType.toLowerCase()) {
        case "bank notes":
        case "bank-notes":
            return isJual ? rateInfo.bankNotesSell : rateInfo.bankNotesBuy;
        case "tt counter":
        case "tt-counter":
            return isJual ? rateInfo.ttCounterSell : rateInfo.ttCounterBuy;
        case "e-rate":
        default:
            return isJual ? rateInfo.eRateSell : rateInfo.eRateBuy;
    }
}

function calculatePortfolio() {
    const data = {};

    // Sort transactions by date
    const sortedTrx = [...state.transactions].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // Initialize all monitored
    state.monitored.forEach(code => {
        data[code] = {
            currencyCode: code,
            balance: 0,
            totalCost: 0,
            realizedGain: 0,
            currentRate: getRatesForCurrency(code)
        };
    });

    // Run transaction ledger
    sortedTrx.forEach(t => {
        if (!data[t.currency]) {
            data[t.currency] = {
                currencyCode: t.currency,
                balance: 0,
                totalCost: 0,
                realizedGain: 0,
                currentRate: getRatesForCurrency(t.currency)
            };
        }

        const d = data[t.currency];
        if (t.type === "BUY") {
            d.balance += t.amount;
            d.totalCost += t.amount * t.rate;
        } else if (t.type === "SELL") {
            const averageCost = d.balance > 0 ? d.totalCost / d.balance : 0;
            d.realizedGain += (t.rate - averageCost) * t.amount;
            d.balance -= t.amount;
            d.totalCost -= t.amount * averageCost;
        }
    });

    // Finalize Calculations
    const results = [];
    state.monitored.forEach(code => {
        const d = data[code];
        const baseRate = state.baseRatesToday[code] || d.currentRate;
        const dailyChangePercent = baseRate > 0 ? ((d.currentRate - baseRate) / baseRate) * 100 : 0;
        
        const unrealizedGain = d.currentRate > 0 ? (d.balance * d.currentRate) - d.totalCost : 0;
        const totalGain = d.realizedGain + unrealizedGain;
        const averageBuyPrice = d.balance > 0 ? d.totalCost / d.balance : 0;

        results.push({
            ...d,
            dailyChangePercent,
            unrealizedGain,
            totalGain,
            averageBuyPrice
        });
    });

    return results;
}

// UI Views Render
function renderMonitorTab() {
    const container = document.getElementById("currency-list");
    container.innerHTML = "";

    const calculated = calculatePortfolio();

    calculated.forEach((c, idx) => {
        const div = document.createElement("div");
        div.className = "currency-card";
        div.dataset.code = c.currencyCode;
        div.dataset.index = idx;

        const gainPercent = c.totalCost > 0 ? (c.totalGain / c.totalCost) * 100 : 0;
        const sign = c.totalGain >= 0 ? "+" : "-";
        const gainClass = c.totalGain >= 0 ? "gain-up" : "gain-down";
        const totalGainAbs = Math.abs(c.totalGain);
        const gainPercentAbs = Math.abs(gainPercent);

        const gainLabel = c.totalGain >= 0 ? "G" : "L";
        const gainText = `${gainLabel}: ${sign} Rp ${formatNumber(totalGainAbs, 0)} (${sign}${formatNumber(gainPercentAbs, 1)}%)`;

        const changeSign = c.dailyChangePercent >= 0 ? "+" : "";
        const changeClass = c.dailyChangePercent >= 0 ? "pill-up" : "pill-down";

        div.innerHTML = `
            <div class="card-left">
                <span class="card-drag-handle">☰</span>
                <span class="card-flag">${getFlagHtml(c.currencyCode)}</span>
                <div class="card-info">
                    <span class="card-title">${c.currencyCode} <span style="font-weight: 400; font-size:14px; opacity:0.8;">IDR ${formatNumber(c.currentRate, 2)}</span></span>
                    <span class="card-gain ${c.totalGain !== 0 ? gainClass : ''}" style="${c.totalGain === 0 ? 'opacity: 0.5;' : ''}">
                        ${c.totalGain !== 0 ? gainText : 'Belum ada transaksi'}
                    </span>
                </div>
            </div>
            <div class="card-right">
                <span class="card-change-pill ${changeClass}">${changeSign}${formatNumber(c.dailyChangePercent, 2)}%</span>
                <div class="card-actions-menu">
                    <button class="btn-move-up" title="Pindah Ke Atas">▲</button>
                    <button class="btn-move-down" title="Pindah Ke Bawah">▼</button>
                    <button class="btn-delete-monitored" style="color:var(--red-down);" title="Hapus">✖</button>
                </div>
            </div>
        `;

        // Handle Card Menu Actions
        div.querySelector(".btn-move-up").onclick = (e) => {
            e.stopPropagation();
            if (idx > 0) {
                const temp = state.monitored[idx];
                state.monitored[idx] = state.monitored[idx - 1];
                state.monitored[idx - 1] = temp;
                saveState();
                renderMonitorTab();
            }
        };

        div.querySelector(".btn-move-down").onclick = (e) => {
            e.stopPropagation();
            if (idx < state.monitored.length - 1) {
                const temp = state.monitored[idx];
                state.monitored[idx] = state.monitored[idx + 1];
                state.monitored[idx + 1] = temp;
                saveState();
                renderMonitorTab();
            }
        };

        div.querySelector(".btn-delete-monitored").onclick = (e) => {
            e.stopPropagation();
            state.monitored.splice(idx, 1);
            saveState();
            renderMonitorTab();
        };

        container.appendChild(div);
    });

    // Update banner
    document.getElementById("bca-time").innerText = state.bcaLastUpdated.replace(/BCA\s*:?/i, "").trim() || "-";
    document.getElementById("indogold-time").innerText = state.pegadaianLastUpdated.replace(/IndoGold\s*:?/i, "").trim() || "-";
}

function renderHistoryTab() {
    const list = document.getElementById("trx-list");
    list.innerHTML = "";

    const sortedTrx = [...state.transactions].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    sortedTrx.forEach(t => {
        const tr = document.createElement("tr");
        const typeBadge = t.type === "BUY" ? 
            `<span class="badge-buy">${getTranslation("buy")}</span>` : 
            `<span class="badge-sell">${getTranslation("sell")}</span>`;

        const totalIdr = t.amount * t.rate;
        const formattedDate = new Date(t.timestamp).toLocaleString(state.settings.language === "id" ? "id-ID" : "en-US", {
            dateStyle: "short",
            timeStyle: "short"
        });

        tr.innerHTML = `
            <td>${formattedDate}</td>
            <td>${getFlagHtml(t.currency)} <strong>${t.currency}</strong></td>
            <td>${typeBadge}</td>
            <td>Rp ${formatNumber(t.rate, 2)}</td>
            <td>${formatNumber(t.amount, 4)}</td>
            <td>Rp ${formatNumber(totalIdr, 0)}</td>
            <td>
                <button class="btn btn-secondary btn-edit-trx" style="padding: 4px 8px; font-size:11px;">✏️</button>
                <button class="btn btn-secondary btn-del-trx" style="padding: 4px 8px; font-size:11px; color:var(--red-down);">✖</button>
            </td>
        `;

        tr.querySelector(".btn-edit-trx").onclick = () => openTransactionModal(t);
        tr.querySelector(".btn-del-trx").onclick = () => {
            if (confirm(getTranslation("delete_confirm"))) {
                state.transactions = state.transactions.filter(item => item.id !== t.id);
                saveState();
                renderHistoryTab();
                renderMonitorTab();
                renderTotalTab();
            }
        };

        list.appendChild(tr);
    });
}

function renderTotalTab() {
    const calculated = calculatePortfolio();
    const assetsList = document.getElementById("total-assets-list");
    assetsList.innerHTML = "";

    const ownedAssets = calculated.filter(c => c.balance > 0);
    let grandTotal = 0;

    if (ownedAssets.length === 0) {
        assetsList.innerHTML = `<div style="text-align:center; padding: 40px 0; opacity: 0.6;">${getTranslation("empty_portfolio")}</div>`;
    } else {
        ownedAssets.forEach(c => {
            const rupiahValue = c.balance * c.currentRate;
            grandTotal += rupiahValue;

            const div = document.createElement("div");
            div.className = "asset-card";
             div.innerHTML = `
                <div class="asset-header" style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size: 16px; font-weight:700; display:flex; align-items:center; gap:6px;">${getFlagHtml(c.currencyCode)} ${c.currencyCode}</span>
                    <span style="font-size: 16px; font-weight:700; margin-left:auto;">${formatNumber(c.balance, 4)}</span>
                </div>
                <div class="asset-row">
                    <span>Harga Beli Rata-rata:</span>
                    <span class="val">Rp ${formatNumber(c.averageBuyPrice, 2)}</span>
                </div>
                <div class="asset-row">
                    <span>Kurs Saat Ini:</span>
                    <span class="val">Rp ${formatNumber(c.currentRate, 2)}</span>
                </div>
                <div class="asset-row">
                    <span>Estimasi Nilai Rupiah:</span>
                    <span class="val" style="color:var(--primary-color); font-weight:700;">Rp ${formatNumber(rupiahValue, 0)}</span>
                </div>
            `;
            assetsList.appendChild(div);
        });
    }

    document.getElementById("grand-total-idr").innerText = formatCurrencyIdr(grandTotal);
}

function renderSettingsTab() {
    document.getElementById("set-rate-type").value = state.settings.rateType;
    document.getElementById("set-rate-dir").value = state.settings.rateDirection;
    document.getElementById("set-emas-dir").value = state.settings.emasRateDirection;
    document.getElementById("set-theme").value = state.settings.themePreference;
    document.getElementById("set-lang").value = state.settings.language;

    // Toggle Pickers
    if (state.settings.themePreference === "custom") {
        document.getElementById("custom-color-pickers").classList.remove("hidden");
        document.getElementById("color-primary").value = state.settings.customColors.primary;
        document.getElementById("color-secondary").value = state.settings.customColors.secondary;
        document.getElementById("color-text").value = state.settings.customColors.text;
    } else {
        document.getElementById("custom-color-pickers").classList.add("hidden");
    }
}

// App Settings & Theme Coordination
function applyTheme() {
    const pref = state.settings.themePreference;
    const body = document.body;

    // Reset themes
    body.removeAttribute("data-theme");
    document.documentElement.style.removeProperty("--primary-color");
    document.documentElement.style.removeProperty("--secondary-color");
    document.documentElement.style.removeProperty("--text-color");

    if (pref === "dark") {
        body.setAttribute("data-theme", "dark");
    } else if (pref === "light") {
        body.setAttribute("data-theme", "light");
    } else if (pref === "system") {
        const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (isSystemDark) {
            body.setAttribute("data-theme", "dark");
        } else {
            body.setAttribute("data-theme", "light");
        }
    } else if (pref === "custom") {
        // Set dynamic colors
        const colors = state.settings.customColors;
        document.documentElement.style.setProperty("--primary-color", colors.primary);
        document.documentElement.style.setProperty("--secondary-color", colors.secondary);
        document.documentElement.style.setProperty("--text-color", colors.text);
    }
}

// Syncing and Scraper coordination
async function syncRates() {
    const status = document.getElementById("sync-status");
    status.innerText = getTranslation("syncing");

    try {
        const todayStr = new Date().toISOString().split("T")[0].replace(/-/g, "");
        const isNewDay = todayStr !== state.lastSyncDay;

        // Scrape BCA
        const bca = await window.scraper.BcaScraper.scrapeRates();
        if (Object.keys(bca.rates).length > 0) {
            Object.assign(state.rates, bca.rates);
            state.bcaLastUpdated = bca.lastUpdated;
        }

        // Scrape Gold
        const gold = await window.scraper.PegadaianScraper.scrapeRates();
        if (Object.keys(gold.rates).length > 0) {
            Object.assign(state.rates, gold.rates);
            state.pegadaianLastUpdated = gold.lastUpdated;
        }

        // Set baseline daily rates
        if (isNewDay || Object.keys(state.baseRatesToday).length === 0) {
            state.lastSyncDay = todayStr;
            ALL_CURRENCIES.forEach(c => {
                state.baseRatesToday[c] = getRatesForCurrency(c);
            });
        }

        status.innerText = `${getTranslation("sync_success")} : ${new Date().toLocaleTimeString()}`;
        saveState();
        renderMonitorTab();
        renderTotalTab();
    } catch (e) {
        console.error("Sync error:", e);
        status.innerText = getTranslation("sync_failed");
    }
}

// Modals Trigger
const modalOverlay = document.getElementById("modal-container");
const modalAddCurrency = document.getElementById("modal-add-currency");
const modalTransaction = document.getElementById("modal-transaction");

function showModal(modal) {
    modalOverlay.classList.remove("hidden");
    modalAddCurrency.classList.add("hidden");
    modalTransaction.classList.add("hidden");
    modal.classList.remove("hidden");
}

function hideModal() {
    modalOverlay.classList.add("hidden");
    modalAddCurrency.classList.add("hidden");
    modalTransaction.classList.add("hidden");
}

// Add Currency Dialog
document.getElementById("btn-add-currency-trigger").onclick = () => {
    const select = document.getElementById("add-currency-select");
    select.innerHTML = "";

    // Show only currencies NOT currently monitored
    const available = ALL_CURRENCIES.filter(c => !state.monitored.includes(c));
    if (available.length === 0) {
        alert("Semua valas sudah dimonitor!");
        return;
    }

    available.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.innerText = `${getFlag(c)} ${c}`;
        select.appendChild(opt);
    });

    showModal(modalAddCurrency);
};

document.getElementById("btn-add-currency-cancel").onclick = hideModal;
document.getElementById("btn-add-currency-confirm").onclick = () => {
    const val = document.getElementById("add-currency-select").value;
    if (val && !state.monitored.includes(val)) {
        state.monitored.push(val);
        // baseline today
        state.baseRatesToday[val] = getRatesForCurrency(val);
        saveState();
        renderMonitorTab();
    }
    hideModal();
};

// Transaction Modal
function openTransactionModal(trx = null) {
    const title = document.getElementById("modal-trx-title");
    const idInput = document.getElementById("trx-id");
    const currencySelect = document.getElementById("trx-currency");
    const typeSelect = document.getElementById("trx-type");
    const rateInput = document.getElementById("trx-rate");
    const amountInput = document.getElementById("trx-amount");
    const dateInput = document.getElementById("trx-date");

    // Populate currency dropdown
    currencySelect.innerHTML = "";
    ALL_CURRENCIES.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.innerText = `${getFlag(c)} ${c}`;
        currencySelect.appendChild(opt);
    });

    // Populate default date
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const defaultDateStr = now.toISOString().slice(0, 16);

    if (trx) {
        title.innerText = getTranslation("edit_transaction");
        idInput.value = trx.id;
        currencySelect.value = trx.currency;
        typeSelect.value = trx.type;
        rateInput.value = trx.rate;
        amountInput.value = trx.amount;
        
        const tDate = new Date(trx.timestamp);
        tDate.setMinutes(tDate.getMinutes() - tDate.getTimezoneOffset());
        dateInput.value = tDate.toISOString().slice(0, 16);
    } else {
        title.innerText = getTranslation("new_transaction");
        idInput.value = "";
        currencySelect.selectedIndex = 0;
        typeSelect.value = "BUY";
        rateInput.value = "";
        amountInput.value = "";
        dateInput.value = defaultDateStr;

        // Auto pre-populate rate when currency changes
        currencySelect.onchange = () => {
            const current = getRatesForCurrency(currencySelect.value);
            rateInput.value = current || "";
        };
        // trigger once
        const current = getRatesForCurrency(currencySelect.value);
        rateInput.value = current || "";
    }

    showModal(modalTransaction);
}

document.getElementById("btn-add-trx-trigger").onclick = () => openTransactionModal();
document.getElementById("btn-trx-cancel").onclick = hideModal;
document.getElementById("btn-trx-confirm").onclick = () => {
    const id = document.getElementById("trx-id").value;
    const currency = document.getElementById("trx-currency").value;
    const type = document.getElementById("trx-type").value;
    const rate = parseFloat(document.getElementById("trx-rate").value);
    const amount = parseFloat(document.getElementById("trx-amount").value);
    const dateVal = document.getElementById("trx-date").value;

    if (!currency || isNaN(rate) || isNaN(amount) || !dateVal) {
        alert("Mohon lengkapi semua isian!");
        return;
    }

    const timestamp = new Date(dateVal).getTime();

    if (id) {
        // Edit Mode
        const trx = state.transactions.find(t => t.id === parseInt(id));
        if (trx) {
            trx.currency = currency;
            trx.type = type;
            trx.rate = rate;
            trx.amount = amount;
            trx.timestamp = timestamp;
        }
    } else {
        // Create Mode
        state.transactions.push({
            id: Date.now(),
            currency,
            type,
            rate,
            amount,
            timestamp
        });
    }

    saveState();
    hideModal();
    renderHistoryTab();
    renderMonitorTab();
    renderTotalTab();
};

// Export Import Functionality
document.getElementById("btn-export").onclick = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.transactions, null, 4));
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `hanaveli_transactions_${new Date().toISOString().split("T")[0]}.json`);
    dlAnchorElem.click();
};

document.getElementById("import-file").onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const list = JSON.parse(event.target.result);
            if (!Array.isArray(list)) throw new Error();

            let added = 0;
            list.forEach(t => {
                // simple validator
                if (t.currency && t.type && !isNaN(t.rate) && !isNaN(t.amount) && t.timestamp) {
                    const duplicate = state.transactions.some(item => item.id === t.id);
                    if (!duplicate) {
                        state.transactions.push({
                            id: t.id || Date.now() + Math.random(),
                            currency: t.currency,
                            type: t.type,
                            rate: parseFloat(t.rate),
                            amount: parseFloat(t.amount),
                            timestamp: parseInt(t.timestamp)
                        });
                        added++;
                    }
                }
            });

            saveState();
            alert(getTranslation("import_success").replace("{count}", added));
            renderHistoryTab();
            renderMonitorTab();
            renderTotalTab();
        } catch (err) {
            alert(getTranslation("import_failed"));
        }
    };
    reader.readAsText(file);
};

// Widget Mode check
function toggleWidgetMode(force = null) {
    const isWidget = force !== null ? force : !document.body.classList.contains("widget-mode");
    if (isWidget) {
        document.body.classList.add("widget-mode");
        document.getElementById("btn-widget-toggle").title = "Mode Dashboard Penuh";
        document.getElementById("btn-widget-toggle").innerHTML = `<span class="icon">🖥️</span>`;
    } else {
        document.body.classList.remove("widget-mode");
        document.getElementById("btn-widget-toggle").title = "Mode Widget";
        document.getElementById("btn-widget-toggle").innerHTML = `<span class="icon">📱</span>`;
    }
}

document.getElementById("btn-widget-toggle").onclick = () => toggleWidgetMode();

// Tab Coordination
document.querySelectorAll(".nav-tab").forEach(tab => {
    tab.onclick = () => {
        document.querySelectorAll(".nav-tab").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));

        tab.classList.add("active");
        const targetId = `tab-${tab.dataset.tab}`;
        document.getElementById(targetId).classList.add("active");

        // trigger page-specific refresh
        if (tab.dataset.tab === "monitor") renderMonitorTab();
        if (tab.dataset.tab === "history") renderHistoryTab();
        if (tab.dataset.tab === "total") renderTotalTab();
        if (tab.dataset.tab === "settings") renderSettingsTab();
    };
});

// Settings Changes Handler
document.getElementById("set-rate-type").onchange = (e) => {
    state.settings.rateType = e.target.value;
    saveState();
    renderMonitorTab();
};

document.getElementById("set-rate-dir").onchange = (e) => {
    state.settings.rateDirection = e.target.value;
    saveState();
    renderMonitorTab();
};

document.getElementById("set-emas-dir").onchange = (e) => {
    state.settings.emasRateDirection = e.target.value;
    saveState();
    renderMonitorTab();
};

document.getElementById("set-theme").onchange = (e) => {
    state.settings.themePreference = e.target.value;
    saveState();
    renderSettingsTab();
    applyTheme();
};

document.getElementById("set-lang").onchange = (e) => {
    state.settings.language = e.target.value;
    saveState();
    location.reload(); // Reload to refresh headers & translations
};

// Color pickers changes
const bindColorPicker = (id, key) => {
    document.getElementById(id).onchange = (e) => {
        state.settings.customColors[key] = e.target.value;
        saveState();
        applyTheme();
    };
};
bindColorPicker("color-primary", "primary");
bindColorPicker("color-secondary", "secondary");
bindColorPicker("color-text", "text");

// Refresh button trigger
document.getElementById("btn-refresh").onclick = syncRates;

// App Initialization
window.onload = () => {
    loadState();
    applyTheme();

    // Check URL parameters for widget mode
    const params = new URLSearchParams(window.location.search);
    if (params.get("widget") === "true") {
        toggleWidgetMode(true);
    }

    renderMonitorTab();
    syncRates(); // Auto fetch rates on load

    // Setup media query listener for system themes
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
        if (state.settings.themePreference === "system") {
            applyTheme();
        }
    });
};
