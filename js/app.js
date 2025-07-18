const description = document.getElementById('description');
const amount = document.getElementById('amount');
const category = document.getElementById('category');
const addTransactionBtn = document.getElementById('addTransactionBtn');
const transactionList = document.getElementById('transactionList');
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expensesEl = document.getElementById('expenses');
const clearAllBtn = document.getElementById('clearAllBtn');

addTransactionBtn.addEventListener('click', addTransaction);
clearAllBtn.addEventListener('click', clearAllTransactions);

function addTransaction() {
    const desc = description.value.trim();
    const amt = parseFloat(amount.value);
    const cat = category.value;

    if (!desc || isNaN(amt) || !cat) {
        alert("All fields are required!");
        return;
    }

    const transaction = {
        id: Date.now(),
        desc,
        amt,
        cat
    };

    saveTransaction(transaction);
    renderTransactions();
    updateSummary();
    description.value = "";
    amount.value = "";
    category.value = "";
}

function saveTransaction(transaction) {
    const transactions = getTransactions();
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function getTransactions() {
    return JSON.parse(localStorage.getItem('transactions')) || [];
}

function renderTransactions() {
    transactionList.innerHTML = "";
    const transactions = getTransactions();

    transactions.forEach(tx => {
        const txEl = document.createElement('div');
        txEl.classList.add('transaction');
        if (tx.amt < 0) txEl.classList.add('expense');
        txEl.innerHTML = `
            <p><strong>${tx.desc}</strong> (${tx.cat})</p>
            <p>${tx.amt < 0 ? '-' : '+'}$${Math.abs(tx.amt).toFixed(2)}</p>
            <button onclick="deleteTransaction(${tx.id})">🗑️</button>
        `;
        transactionList.appendChild(txEl);
    });
}

function deleteTransaction(id) {
    const transactions = getTransactions().filter(tx => tx.id !== id);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    renderTransactions();
    updateSummary();
}

function clearAllTransactions() {
    if (confirm("Delete all transactions?")) {
        localStorage.removeItem('transactions');
        renderTransactions();
        updateSummary();
    }
}

function updateSummary() {
    const transactions = getTransactions();
    let income = 0, expenses = 0;

    transactions.forEach(tx => {
        if (tx.amt > 0) income += tx.amt;
        else expenses += tx.amt;
    });

    balanceEl.textContent = `$${(income + expenses).toFixed(2)}`;
    incomeEl.textContent = `$${income.toFixed(2)}`;
    expensesEl.textContent = `$${Math.abs(expenses).toFixed(2)}`;
}

window.onload = () => {
    renderTransactions();
    updateSummary();
};


