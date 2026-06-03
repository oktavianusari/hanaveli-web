/**
 * Scraper utility for fetching BCA Exchange Rates and IndoGold Gold Prices
 * using CORS proxies with auto-failover and offline mock backups.
 */

const PROXIES = [
    (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`
];

async function fetchWithProxy(url) {
    let lastError = null;
    for (const getProxyUrl of PROXIES) {
        try {
            const proxyUrl = getProxyUrl(url);
            const response = await fetch(proxyUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const text = await response.text();
            if (text && text.trim().length > 0) {
                return text;
            }
        } catch (e) {
            console.warn(`Proxy failed for ${url}:`, e);
            lastError = e;
        }
    }
    throw lastError || new Error(`Failed to fetch ${url} through all proxies`);
}

const BcaScraper = {
    URL: "https://www.bca.co.id/id/informasi/kurs",

    async scrapeRates() {
        const rates = {};
        let lastUpdated = "";

        try {
            const html = await fetchWithProxy(this.URL);
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            // Extract last updated time
            const text = doc.body.textContent || doc.body.innerText || "";
            const match = text.match(/Terakhir diperbarui pada .*? WIB/i);
            if (match) {
                lastUpdated = match[0];
            } else {
                lastUpdated = `Terakhir diperbarui: ${new Date().toLocaleDateString("id-ID")}`;
            }

            // Parse currency options
            const elements = doc.querySelectorAll("a.a-dropdown-currency1");
            elements.forEach(el => {
                const currency = el.getAttribute("data-text")?.trim();
                const buyStr = el.getAttribute("data-value-buy");
                const sellStr = el.getAttribute("data-value-sell");

                if (currency && buyStr && sellStr) {
                    const buyRates = buyStr.split("-").map(parseFloat);
                    const sellRates = sellStr.split("-").map(parseFloat);

                    if (buyRates.length === 3 && sellRates.length === 3) {
                        rates[currency] = {
                            currency,
                            eRateBuy: buyRates[0] || 0,
                            ttCounterBuy: buyRates[1] || 0,
                            bankNotesBuy: buyRates[2] || 0,
                            eRateSell: sellRates[0] || 0,
                            ttCounterSell: sellRates[1] || 0,
                            bankNotesSell: sellRates[2] || 0
                        };
                    }
                }
            });
        } catch (e) {
            console.error("BCA Scraper Error, using fallback:", e);
        }

        return { rates, lastUpdated };
    }
};

const PegadaianScraper = {
    URL: "https://www.indogold.id/detail-emas-batangan",

    async scrapeRates() {
        const rates = {};
        let lastUpdated = "";
        let buyPrice = 0;
        let sellPrice = 0;

        try {
            const html = await fetchWithProxy(this.URL);
            
            // Search for Antam 1 Gram prices in JSON content or script attributes
            // Match the pattern like in PegadaianScraper.kt
            const pricePattern = /"nama"\s*:\s*"LM Antam 99\.99% 1\.0 Gram".*?"tahun"\s*:\s*"\d{4}".*?"harga_beli"\s*:\s*"([0-9,]+)".*?"harga_jual"\s*:\s*"([0-9,]+)"/i;
            const fallbackPattern = /LM Antam.*?1\.0 Gram.*?harga_beli.*?([\d,]+).*?harga_jual.*?([\d,]+)/i;
            
            let match = html.match(pricePattern) || html.match(fallbackPattern);
            if (!match) {
                // Try simpler lookup inside HTML attributes decoded or raw
                const decodedHtml = html.replace(/&quot;/g, '"');
                match = decodedHtml.match(pricePattern);
            }

            if (match) {
                const beliVal = parseFloat(match[1].replace(/,/g, ""));
                const jualVal = parseFloat(match[2].replace(/,/g, ""));
                sellPrice = beliVal; // Bank buy from user
                buyPrice = jualVal;  // Bank sell to user
            }

            const updateMatch = html.match(/Last Update\s*:\s*\d{1,2}\s+[a-zA-Z]+\s+\d{4}\s+\d{2}:\d{2}/i);
            if (updateMatch) {
                lastUpdated = updateMatch[0].trim();
            } else {
                lastUpdated = `Last Update : ${new Date().toLocaleString("id-ID")}`;
            }
        } catch (e) {
            console.error("IndoGold Scraper Error, using fallback:", e);
        }

        // Fallback standard value if fetch failed
        if (buyPrice === 0 || sellPrice === 0) {
            buyPrice = 1450000;  // Mock Buy Price (Harga Jual IndoGold ke User)
            sellPrice = 1350000; // Mock Sell Price (Harga Beli IndoGold dari User)
            lastUpdated = `Last Update : ${new Date().toLocaleString("id-ID")} (Fallback)`;
        }

        rates["EMAS"] = {
            currency: "EMAS",
            eRateBuy: sellPrice,
            eRateSell: buyPrice,
            ttCounterBuy: sellPrice,
            ttCounterSell: buyPrice,
            bankNotesBuy: sellPrice,
            bankNotesSell: buyPrice
        };

        return { rates, lastUpdated };
    }
};

window.scraper = { BcaScraper, PegadaianScraper };
