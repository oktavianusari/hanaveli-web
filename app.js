/**
 * Hanaveli Web - Core Application Logic
 */

// Initial Seed Data
const DEFAULT_MONITORED = ["USD", "SGD", "EMAS"];
const ALL_CURRENCIES = [
    "USD", "SGD", "HKD", "CHF", "GBP", "AUD", "JPY", "DKK", "CAD", 
    "EUR", "SAR", "NZD", "CNY", "SEK", "THB", "RUB", "KRW", "MYR", "EMAS"
];

const DEFAULT_STOCKS = ["BBCA.JK", "BBNI.JK", "GOOG", "MSFT", "AAPL", "NVDA", "WDC"];
const ALL_STOCKS = ["BBCA.JK", "BBNI.JK", "GOOG", "MSFT", "AAPL", "NVDA", "WDC", "SNDK"];

const STOCK_NAMES = {
    "BBCA.JK": "Bank Central Asia Tbk.",
    "BBNI.JK": "Bank Negara Indonesia Tbk.",
    "GOOG": "Alphabet Inc. (Google)",
    "MSFT": "Microsoft Corporation",
    "AAPL": "Apple Inc.",
    "NVDA": "NVIDIA Corporation",
    "WDC": "Western Digital Corp.",
    "SNDK": "SanDisk Corp. (Delisted - Acquired by WDC)"
};

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
    monitoredStocks: [],
    transactions: [],
    settings: {
        rateType: "e-rate",
        rateDirection: "jual",
        emasRateDirection: "jual",
        syncInterval: 15,
        themePreference: "system",
        customColors: { primary: "#386A20", secondary: "#D7E8CD", text: "#1A1C18" },
        language: "system"
    },
    rates: {},
    stockRates: {},
    baseRatesToday: {}, // Used to store today's opening rates for daily change calculation
    baseStockRatesToday: {},
    lastSyncDay: "",
    bcaLastUpdated: "",
    pegadaianLastUpdated: "",
};

// Privacy Protection State
let privacyHidden = true;
let privacyTimeout = null;

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

function getAssetFlagHtml(code) {
    const codeUpper = code.toUpperCase();
    if (ALL_STOCKS.includes(codeUpper)) {
        return getStockFlagHtml(codeUpper);
    }
    return getFlagHtml(codeUpper);
}

// Local Storage Handlers
function loadState() {
    try {
        const stored = localStorage.getItem("hanaveli_state");
        if (stored) {
            state = JSON.parse(stored);
            if (!state.settings.syncInterval) {
                state.settings.syncInterval = 15;
            }
            if (!state.monitoredStocks) {
                state.monitoredStocks = [...DEFAULT_STOCKS];
            }
            if (!state.stockRates) {
                state.stockRates = {};
            }
            if (!state.baseStockRatesToday) {
                state.baseStockRatesToday = {};
            }
            if (!state.settings.dayTheme) {
                state.settings.dayTheme = "light";
            }
            if (!state.settings.nightTheme) {
                state.settings.nightTheme = "dark";
            }
        } else {
            // Seed defaults
            state.monitored = [...DEFAULT_MONITORED];
            state.monitoredStocks = [...DEFAULT_STOCKS];
            state.transactions = [];
            state.settings = {
                rateType: "e-rate",
                rateDirection: "jual",
                emasRateDirection: "jual",
                syncInterval: 15,
                themePreference: "system",
                dayTheme: "light",
                nightTheme: "dark",
                customColors: { primary: "#386A20", secondary: "#D7E8CD", text: "#1A1C18" },
                language: "system"
            };
            state.rates = { ...FALLBACK_RATES };
            state.stockRates = {};
            state.baseRatesToday = {};
            state.baseStockRatesToday = {};
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

// Privacy Protection Functions
function togglePrivacy() {
    privacyHidden = !privacyHidden;
    if (privacyTimeout) {
        clearTimeout(privacyTimeout);
        privacyTimeout = null;
    }
    if (!privacyHidden) {
        // Auto-hide again after 30 seconds
        privacyTimeout = setTimeout(() => {
            privacyHidden = true;
            renderPrivacyButtons();
            renderHistoryTab();
            renderTotalTab();
        }, 30000);
    }
    renderPrivacyButtons();
    renderHistoryTab();
    renderTotalTab();
}

function renderPrivacyButtons() {
    const btnHistory = document.getElementById("btn-privacy-history");
    const btnTotal = document.getElementById("btn-privacy-total");
    const label = privacyHidden ?
        `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px; vertical-align: middle;"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>Tampilkan` :
        `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px; vertical-align: middle;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>Sembunyikan (30s)`;

    if (btnHistory) btnHistory.innerHTML = label;
    if (btnTotal) btnTotal.innerHTML = label;
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

function calculateStockPortfolio() {
    const data = {};
    const sortedTrx = [...state.transactions].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    state.monitoredStocks.forEach(symbol => {
        const symUpper = symbol.toUpperCase();
        const info = state.stockRates[symUpper] || { price: 0, currency: symUpper.endsWith(".JK") ? "IDR" : "USD", name: STOCK_NAMES[symUpper] || symUpper };
        data[symUpper] = {
            symbol: symUpper,
            balance: 0,
            totalCost: 0,
            realizedGain: 0,
            currentRate: info.price || 0,
            currency: info.currency || (symUpper.endsWith(".JK") ? "IDR" : "USD"),
            name: info.name || symbol
        };
    });

    sortedTrx.forEach(t => {
        const symUpper = t.currency.toUpperCase();
        if (ALL_STOCKS.includes(symUpper)) {
            if (!data[symUpper]) {
                const info = state.stockRates[symUpper] || { price: 0, currency: symUpper.endsWith(".JK") ? "IDR" : "USD", name: STOCK_NAMES[symUpper] || symUpper };
                data[symUpper] = {
                    symbol: symUpper,
                    balance: 0,
                    totalCost: 0,
                    realizedGain: 0,
                    currentRate: info.price || 0,
                    currency: info.currency || (symUpper.endsWith(".JK") ? "IDR" : "USD"),
                    name: info.name || t.currency
                };
            }

            const d = data[symUpper];
            if (t.type === "BUY") {
                d.balance += t.amount;
                d.totalCost += t.amount * t.rate;
            } else if (t.type === "SELL") {
                const averageCost = d.balance > 0 ? d.totalCost / d.balance : 0;
                d.realizedGain += (t.rate - averageCost) * t.amount;
                d.balance -= t.amount;
                d.totalCost -= t.amount * averageCost;
            }
        }
    });

    const results = [];
    state.monitoredStocks.forEach(symbol => {
        const symUpper = symbol.toUpperCase();
        const d = data[symUpper];
        const info = state.stockRates[symUpper] || {};
        const dailyChangePercent = info.changePercent !== undefined ? info.changePercent : 0;

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

function updateHeaderTitle() {
    const headerH1 = document.querySelector(".app-header .logo-text h1");
    if (!headerH1) return;

    const isWidgetStock = document.body.classList.contains("widget-saham");
    const activeTabBtn = document.querySelector(".nav-tab.active");
    const isTabStock = activeTabBtn && activeTabBtn.dataset.tab === "saham";

    if (isWidgetStock || isTabStock) {
        headerH1.innerText = "Monitor Saham";
    } else {
        headerH1.innerText = "Monitor Valas";
    }
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
                    <button class="btn-move-up" title="Pindah Ke Atas"><svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg></button>
                    <button class="btn-move-down" title="Pindah Ke Bawah"><svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
                    <button class="btn-delete-monitored" style="color:var(--red-down);" title="Hapus"><svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
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
    updateHeaderTitle();
}

function getStockFlagHtml(symbol) {
    const country = symbol.toUpperCase().endsWith(".JK") ? "id" : "us";
    return `<img src="https://flagcdn.com/w40/${country}.png" srcset="https://flagcdn.com/w80/${country}.png 2x" width="24" height="18" alt="${symbol} flag" class="flag-img" style="vertical-align: middle; border-radius: 2px; box-shadow: 0 1px 3px rgba(0,0,0,0.15); margin-right: 4px; object-fit: cover;">`;
}

function renderStockTab() {
    const container = document.getElementById("stock-list");
    if (!container) return;
    container.innerHTML = "";

    const calculated = calculateStockPortfolio();
    const usdToIdr = getRatesForCurrency("USD") || 16200;

    calculated.forEach((s, idx) => {
        const div = document.createElement("div");
        div.className = "currency-card";
        div.dataset.symbol = s.symbol;
        div.dataset.index = idx;

        const isUsd = s.currency === "USD";
        const priceText = isUsd ? `$ ${formatNumber(s.currentRate, 2)}` : `Rp ${formatNumber(s.currentRate, 0)}`;

        const nativeGainSign = s.totalGain >= 0 ? "+" : "-";
        const gainClass = s.totalGain >= 0 ? "gain-up" : "gain-down";
        const totalGainAbs = Math.abs(s.totalGain);
        const gainPercent = s.totalCost > 0 ? (s.totalGain / s.totalCost) * 100 : 0;
        const gainPercentAbs = Math.abs(gainPercent);

        const idrGain = isUsd ? s.totalGain * usdToIdr : s.totalGain;
        const idrGainText = `Rp ${formatNumber(Math.abs(idrGain), 0)}`;

        const gainLabel = s.totalGain >= 0 ? "G" : "L";
        const nativeGainText = isUsd ? `$ ${formatNumber(totalGainAbs, 2)}` : `Rp ${formatNumber(totalGainAbs, 0)}`;
        const gainText = `${gainLabel}: ${nativeGainSign} ${nativeGainText} (${nativeGainSign}${formatNumber(gainPercentAbs, 1)}%)` + (isUsd ? ` [${nativeGainSign} ${idrGainText}]` : '');

        const changeSign = s.dailyChangePercent >= 0 ? "+" : "";
        const changeClass = s.dailyChangePercent >= 0 ? "pill-up" : "pill-down";

        const isSndk = s.symbol === "SNDK";
        const titleText = isSndk ? `<span style="color:var(--red-down); font-weight:700;">${s.symbol}</span>` : s.symbol;
        const descText = isSndk ? `<span style="color:var(--red-down); font-size:11px;">Aset Delisted (WDC)</span>` : (s.totalGain !== 0 ? gainText : 'Belum ada transaksi');

        div.innerHTML = `
            <div class="card-left">
                <span class="card-drag-handle">☰</span>
                <span class="card-flag">${getStockFlagHtml(s.symbol)}</span>
                <div class="card-info">
                    <span class="card-title">${titleText} <span class="badge-currency">${s.currency}</span> <span style="font-weight: 400; font-size:13px; opacity:0.8;">${priceText}</span></span>
                    <span class="card-gain ${s.totalGain !== 0 || isSndk ? gainClass : ''}" style="${s.totalGain === 0 && !isSndk ? 'opacity: 0.5;' : ''}">
                        ${descText}
                    </span>
                </div>
            </div>
            <div class="card-right">
                <span class="card-change-pill ${changeClass}">${changeSign}${formatNumber(s.dailyChangePercent, 2)}%</span>
                <div class="card-actions-menu">
                    <button class="btn-stock-move-up" title="Pindah Ke Atas"><svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg></button>
                    <button class="btn-stock-move-down" title="Pindah Ke Bawah"><svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
                    <button class="btn-delete-stock" style="color:var(--red-down);" title="Hapus"><svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                </div>
            </div>
        `;

        div.querySelector(".btn-stock-move-up").onclick = (e) => {
            e.stopPropagation();
            if (idx > 0) {
                const temp = state.monitoredStocks[idx];
                state.monitoredStocks[idx] = state.monitoredStocks[idx - 1];
                state.monitoredStocks[idx - 1] = temp;
                saveState();
                renderStockTab();
            }
        };

        div.querySelector(".btn-stock-move-down").onclick = (e) => {
            e.stopPropagation();
            if (idx < state.monitoredStocks.length - 1) {
                const temp = state.monitoredStocks[idx];
                state.monitoredStocks[idx] = state.monitoredStocks[idx + 1];
                state.monitoredStocks[idx + 1] = temp;
                saveState();
                renderStockTab();
            }
        };

        div.querySelector(".btn-delete-stock").onclick = (e) => {
            e.stopPropagation();
            state.monitoredStocks.splice(idx, 1);
            saveState();
            renderStockTab();
        };

        container.appendChild(div);
    });

    // Update stock update banner time with date and time
    const stockTimeEl = document.getElementById("stocks-time");
    if (stockTimeEl) {
        stockTimeEl.innerText = state.stocksLastUpdated.replace(/Last Update:?\s*/i, "").trim() || "Live dari Yahoo Finance";
    }

    updateHeaderTitle();
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

        const displayRate = privacyHidden ? "Rp -----" : `Rp ${formatNumber(t.rate, 2)}`;
        const displayAmount = privacyHidden ? "-----" : formatNumber(t.amount, 4);
        const displayTotal = privacyHidden ? "Rp -----" : `Rp ${formatNumber(totalIdr, 0)}`;

        tr.innerHTML = `
            <td>${formattedDate}</td>
            <td>${getAssetFlagHtml(t.currency)} <strong>${t.currency}</strong></td>
            <td>${typeBadge}</td>
            <td>${displayRate}</td>
            <td>${displayAmount}</td>
            <td>${displayTotal}</td>
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
    const assetsList = document.getElementById("total-assets-list");
    if (!assetsList) return;
    assetsList.innerHTML = "";

    const calculatedCurrencies = calculatePortfolio();
    const calculatedStocks = calculateStockPortfolio();

    const ownedCurrencies = calculatedCurrencies.filter(c => c.balance > 0);
    const ownedStocks = calculatedStocks.filter(s => s.balance > 0);

    let grandTotal = 0;
    const usdToIdr = getRatesForCurrency("USD") || 16200;

    if (ownedCurrencies.length === 0 && ownedStocks.length === 0) {
        assetsList.innerHTML = `<div style="text-align:center; padding: 40px 0; opacity: 0.6;">${getTranslation("empty_portfolio")}</div>`;
    } else {
        // Render owned Currencies
        ownedCurrencies.forEach(c => {
            const rupiahValue = c.balance * c.currentRate;
            grandTotal += rupiahValue;

            const displayBalance = privacyHidden ? "-----" : formatNumber(c.balance, 4);
            const displayAvg = privacyHidden ? "Rp -----" : `Rp ${formatNumber(c.averageBuyPrice, 2)}`;
            const displayValue = privacyHidden ? "Rp -----" : `Rp ${formatNumber(rupiahValue, 0)}`;

            const div = document.createElement("div");
            div.className = "asset-card";
            div.innerHTML = `
                <div class="asset-header" style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size: 16px; font-weight:700; display:flex; align-items:center; gap:6px;">${getFlagHtml(c.currencyCode)} ${c.currencyCode}</span>
                    <span style="font-size: 16px; font-weight:700; margin-left:auto;">${displayBalance}</span>
                </div>
                <div class="asset-row">
                    <span>Harga Beli Rata-rata:</span>
                    <span class="val">${displayAvg}</span>
                </div>
                <div class="asset-row">
                    <span>Kurs Saat Ini:</span>
                    <span class="val">Rp ${formatNumber(c.currentRate, 2)}</span>
                </div>
                <div class="asset-row">
                    <span>Estimasi Nilai Rupiah:</span>
                    <span class="val" style="color:var(--primary-color); font-weight:700;">${displayValue}</span>
                </div>
            `;
            assetsList.appendChild(div);
        });

        // Render owned Stocks
        ownedStocks.forEach(s => {
            const isUsd = s.currency === "USD";
            const rupiahValue = isUsd ? (s.balance * s.currentRate * usdToIdr) : (s.balance * s.currentRate);
            grandTotal += rupiahValue;

            const displayBalance = privacyHidden ? "-----" : formatNumber(s.balance, 4);
            const displayAvg = privacyHidden ? (isUsd ? "$ -----" : "Rp -----") : (isUsd ? `$ ${formatNumber(s.averageBuyPrice, 2)}` : `Rp ${formatNumber(s.averageBuyPrice, 2)}`);
            const displayValue = privacyHidden ? "Rp -----" : `Rp ${formatNumber(rupiahValue, 0)}`;
            const priceText = isUsd ? `$ ${formatNumber(s.currentRate, 2)}` : `Rp ${formatNumber(s.currentRate, 0)}`;

            const div = document.createElement("div");
            div.className = "asset-card";
            div.innerHTML = `
                <div class="asset-header" style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size: 16px; font-weight:700; display:flex; align-items:center; gap:6px;">${getStockFlagHtml(s.symbol)} ${s.symbol} <span class="badge-currency">${s.currency}</span></span>
                    <span style="font-size: 16px; font-weight:700; margin-left:auto;">${displayBalance}</span>
                </div>
                <div class="asset-row">
                    <span>Harga Beli Rata-rata:</span>
                    <span class="val">${displayAvg}</span>
                </div>
                <div class="asset-row">
                    <span>Harga Pasar Saat Ini:</span>
                    <span class="val">${priceText}</span>
                </div>
                <div class="asset-row">
                    <span>Estimasi Nilai Rupiah:</span>
                    <span class="val" style="color:var(--primary-color); font-weight:700;">${displayValue}</span>
                </div>
            `;
            assetsList.appendChild(div);
        });
    }

    const displayGrandTotal = privacyHidden ? "Rp -----" : formatCurrencyIdr(grandTotal);
    document.getElementById("grand-total-idr").innerText = displayGrandTotal;
}

function renderSettingsTab() {
    document.getElementById("set-rate-type").value = state.settings.rateType;
    document.getElementById("set-rate-dir").value = state.settings.rateDirection;
    document.getElementById("set-emas-dir").value = state.settings.emasRateDirection;
    document.getElementById("set-sync-interval").value = state.settings.syncInterval || 15;
    document.getElementById("set-theme").value = state.settings.themePreference;
    document.getElementById("set-lang").value = state.settings.language;

    // Populate day/night inputs
    document.getElementById("set-day-theme").value = state.settings.dayTheme || "light";
    document.getElementById("set-night-theme").value = state.settings.nightTheme || "dark";

    // Toggle Pickers
    if (state.settings.themePreference === "custom") {
        document.getElementById("custom-color-pickers").classList.remove("hidden");
        document.getElementById("color-primary").value = state.settings.customColors.primary;
        document.getElementById("color-secondary").value = state.settings.customColors.secondary;
        document.getElementById("color-text").value = state.settings.customColors.text;
    } else {
        document.getElementById("custom-color-pickers").classList.add("hidden");
    }

    // Toggle Auto Time Settings
    if (state.settings.themePreference === "auto-time") {
        document.getElementById("auto-time-settings").classList.remove("hidden");
    } else {
        document.getElementById("auto-time-settings").classList.add("hidden");
    }
}

function applyTheme() {
    let pref = state.settings.themePreference;
    const body = document.body;

    // Reset themes
    body.removeAttribute("data-theme");
    document.documentElement.style.removeProperty("--primary-color");
    document.documentElement.style.removeProperty("--secondary-color");
    document.documentElement.style.removeProperty("--text-color");

    if (pref === "auto-time") {
        const hour = new Date().getHours();
        const isDaytime = hour >= 6 && hour < 18; // 6 AM to 6 PM
        pref = isDaytime ? (state.settings.dayTheme || "light") : (state.settings.nightTheme || "dark");
    }

    if (["dark", "light", "sunset", "zen", "vivaldi"].includes(pref)) {
        body.setAttribute("data-theme", pref);
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
    
    // Add rotating class to sync icons
    document.querySelectorAll(".btn-sync-widget svg, #btn-refresh svg").forEach(svg => {
        svg.classList.add("rotating");
    });

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

        // Scrape Stocks
        const stockData = await window.scraper.StockScraper.scrapeRates(state.monitoredStocks);
        if (Object.keys(stockData).length > 0) {
            Object.assign(state.stockRates, stockData);
            state.stocksLastUpdated = `Last Update: ${new Date().toLocaleString("id-ID", {dateStyle: "short", timeStyle: "short"})}`;
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
        renderStockTab();
        renderTotalTab();
    } catch (e) {
        console.error("Sync error:", e);
        status.innerText = getTranslation("sync_failed");
    } finally {
        // Remove rotating class from sync icons
        document.querySelectorAll(".btn-sync-widget svg, #btn-refresh svg").forEach(svg => {
            svg.classList.remove("rotating");
        });
    }
}

// Modals Trigger
const modalOverlay = document.getElementById("modal-container");
const modalAddCurrency = document.getElementById("modal-add-currency");
const modalAddStock = document.getElementById("modal-add-stock");
const modalTransaction = document.getElementById("modal-transaction");

function showModal(modal) {
    modalOverlay.classList.remove("hidden");
    modalAddCurrency.classList.add("hidden");
    modalAddStock.classList.add("hidden");
    modalTransaction.classList.add("hidden");
    modal.classList.remove("hidden");
}

function hideModal() {
    modalOverlay.classList.add("hidden");
    modalAddCurrency.classList.add("hidden");
    modalAddStock.classList.add("hidden");
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

// Add Stock Dialog
document.getElementById("btn-add-stock-trigger").onclick = () => {
    const select = document.getElementById("add-stock-select");
    if (!select) return;
    select.innerHTML = "";

    const available = ALL_STOCKS.filter(s => !state.monitoredStocks.includes(s));
    if (available.length === 0) {
        alert("Semua saham sudah dimonitor!");
        return;
    }

    available.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s;
        const flag = s.endsWith(".JK") ? "🇮🇩" : "🇺🇸";
        opt.innerText = `${flag} ${s} - ${STOCK_NAMES[s] || s}`;
        select.appendChild(opt);
    });

    showModal(modalAddStock);
};

document.getElementById("btn-add-stock-cancel").onclick = hideModal;
document.getElementById("btn-add-stock-confirm").onclick = () => {
    const val = document.getElementById("add-stock-select").value;
    if (val && !state.monitoredStocks.includes(val)) {
        state.monitoredStocks.push(val);
        saveState();
        renderStockTab();
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
    
    const optGroupCurrencies = document.createElement("optgroup");
    optGroupCurrencies.label = "Valuta Asing & Emas";
    ALL_CURRENCIES.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.innerText = `${getFlag(c)} ${c}`;
        optGroupCurrencies.appendChild(opt);
    });
    currencySelect.appendChild(optGroupCurrencies);

    const optGroupStocks = document.createElement("optgroup");
    optGroupStocks.label = "Saham (Indonesia & US)";
    ALL_STOCKS.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s;
        const flag = s.endsWith(".JK") ? "🇮🇩" : "🇺🇸";
        opt.innerText = `${flag} ${s} - ${STOCK_NAMES[s] || s}`;
        optGroupStocks.appendChild(opt);
    });
    currencySelect.appendChild(optGroupStocks);

    function getAssetPrice(code) {
        const codeUpper = code.toUpperCase();
        if (ALL_STOCKS.includes(codeUpper)) {
            const info = state.stockRates[codeUpper];
            return info ? info.price : 0;
        }
        return getRatesForCurrency(codeUpper);
    }

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

        // Auto pre-populate rate when asset changes
        currencySelect.onchange = () => {
            const current = getAssetPrice(currencySelect.value);
            rateInput.value = current || "";
        };
        const current = getAssetPrice(currencySelect.value);
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
function toggleWidgetMode(force = null, mode = "valas") {
    const isWidget = force !== null ? force : !document.body.classList.contains("widget-mode");
    if (isWidget) {
        document.body.classList.add("widget-mode");
        if (mode === "saham") {
            document.body.classList.add("widget-saham");
        } else {
            document.body.classList.remove("widget-saham");
        }
        document.getElementById("btn-widget-toggle").title = "Mode Dashboard Penuh";
        document.getElementById("btn-widget-toggle").innerHTML = `<span class="icon">🖥️</span>`;
    } else {
        document.body.classList.remove("widget-mode");
        document.body.classList.remove("widget-saham");
        document.getElementById("btn-widget-toggle").title = "Mode Widget";
        document.getElementById("btn-widget-toggle").innerHTML = `<span class="icon">📱</span>`;
    }
    updateHeaderTitle();
}

document.getElementById("btn-widget-toggle").onclick = () => {
    // If we are toggling widget mode manually, we check what active tab we are on to determine widget type
    const activeTab = document.querySelector(".nav-tab.active")?.dataset.tab || "monitor";
    const mode = activeTab === "saham" ? "saham" : "valas";
    toggleWidgetMode(null, mode);
};

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
        if (tab.dataset.tab === "saham") renderStockTab();
        if (tab.dataset.tab === "history") renderHistoryTab();
        if (tab.dataset.tab === "total") renderTotalTab();
        if (tab.dataset.tab === "settings") renderSettingsTab();
        updateHeaderTitle();
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

document.getElementById("set-day-theme").onchange = (e) => {
    state.settings.dayTheme = e.target.value;
    saveState();
    applyTheme();
};

document.getElementById("set-night-theme").onchange = (e) => {
    state.settings.nightTheme = e.target.value;
    saveState();
    applyTheme();
};

document.getElementById("set-sync-interval").onchange = (e) => {
    state.settings.syncInterval = parseInt(e.target.value);
    saveState();
    startAutoSync();
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
document.querySelectorAll(".btn-sync-widget").forEach(btn => {
    btn.onclick = syncRates;
});

let syncIntervalId = null;
function startAutoSync() {
    if (syncIntervalId) clearInterval(syncIntervalId);
    const mins = state.settings.syncInterval || 15;
    syncIntervalId = setInterval(syncRates, mins * 60 * 1000);
}

// App Initialization
window.onload = () => {
    loadState();

    // Check URL parameters for theme override
    const params = new URLSearchParams(window.location.search);
    const themeParam = params.get("theme");
    if (themeParam) {
        state.settings.themePreference = themeParam;
    }

    applyTheme();

    // Check URL parameters for widget mode
    const widgetParam = params.get("widget");
    if (widgetParam === "true" || widgetParam === "valas") {
        toggleWidgetMode(true, "valas");
    } else if (widgetParam === "saham") {
        toggleWidgetMode(true, "saham");
    }

    renderMonitorTab();
    renderStockTab();
    
    // Bind privacy toggle buttons
    document.getElementById("btn-privacy-history").onclick = togglePrivacy;
    document.getElementById("btn-privacy-total").onclick = togglePrivacy;
    renderPrivacyButtons();

    syncRates(); // Auto fetch rates on load
    startAutoSync(); // Start interval scheduler

    // Setup media query listener for system themes
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
        if (state.settings.themePreference === "system") {
            applyTheme();
        }
    });

    // Check and update theme every minute for auto-time transition
    setInterval(() => {
        if (state.settings.themePreference === "auto-time") {
            applyTheme();
        }
    }, 60000);
};
