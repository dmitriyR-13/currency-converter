class CurrencyConverter {
    constructor() {
        this.ratesCache = {};
        this.inputStart = document.querySelector('#input-start');
        this.fromSelect = document.querySelector('#currency');
        this.toSelect = document.querySelector('#currency-total');
        this.total = document.querySelector('#total');
        this.swapBtn = document.querySelector('#swap');
        this.init();
    }

    init() {
        this.inputStart.addEventListener('input', () => {
            this.convert();
        });
        this.fromSelect.addEventListener('change', () => {
            this.convert();
        });
        this.toSelect.addEventListener('change', () => {
            this.convert();
        });
        this.swapBtn.addEventListener('click', () => {
            this.swapCurrencies();
        })
    }
    async convert() {
        const amount = this.inputStart.value;
        if (!amount || amount <= 0) {
            this.total.innerText = '';
            return;
        };
        const from = this.fromSelect.value;
        const to = this.toSelect.value;
        const rates = await this.getRates(from);
        if (rates) {
            const result = (amount * rates[to]).toFixed(2);
            this.total.innerText = `${result} ${to}`;
        }
    }
    async getRates(baseCurrency) {
        if (this.ratesCache[baseCurrency]) {
            return this.ratesCache[baseCurrency];
        }
        try {
            const url = `https://v6.exchangerate-api.com/v6/099c33949ad3bd13f76b6ddf/latest/${baseCurrency}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Ошибка сети');
            const data = await response.json();
            this.ratesCache[baseCurrency] = data.conversion_rates;
            return data.conversion_rates;
        } catch (error) {
            alert('Не удалось получить данные. Проверьте подключение.');
            return null;
        }
    }
    swapCurrencies() {
        const temp = this.fromSelect.value;
        this.fromSelect.value = this.toSelect.value;
        this.toSelect.value = temp;
        this.convert();
    }
}
const myConverter = new CurrencyConverter();