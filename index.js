
// main
const current_money = document.getElementById('current-money')
const current_incomes = document.getElementById('current-incomes')
const current_expenses = document.getElementById('current-expenses')
const delete_btn = document.querySelectorAll('delete-btn')
const list = document.getElementById('list')
const text = document.getElementById('text')
const amount = document.getElementById('amount')
const add_btn = document.getElementById('add-btn')
const add_div = document.getElementById('add-new')
const select = document.getElementById('sort')
const sign = document.getElementById('sign')
const openModal = document.getElementById('add-transaction')
const closeModalBtn = document.getElementById('close-modal')

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

function openModalWindow() {
  add_div.classList.add('modal')
}

function closeModal() {
  add_div.classList.remove('modal')
}
// show warning

function showWarning() {
  const warning = document.createElement('div')
  warning.classList.add('warning')
  warning.innerHTML = '<h3>Please fill in the reqired files!</h3>'
  add_div.prepend(warning)
  console.log(add_div.children)
  setTimeout(() => {
    add_div.removeChild(warning)
  }, 2000)
}

// add transaction
function addTransaction() {
  const rand = Math.floor(Math.random() * 999)

  if (text.value === '' || amount.value === '') {
    showWarning()
  } else {
    if (sign.value === "-") {
      amount.value = "-" + amount.value
    }
    const transaction = {
      id: rand,
      text: text.value,
      amount: +amount.value,
      sign: sign.value
    }
    transactions.push(transaction)
    addTransactionToDOM(transaction)
    calculateValues()
    updateLocalStorage()
    closeModal()
    text.value = '';
    amount.value = '';
  }
}

function addTransactionToDOM(transaction) {
  const li = document.createElement('li')
  transaction.sign === "+" ? li.classList.add('plus') : li.classList.add('minus')
  li.classList.add('list-item')
  li.innerHTML = `<span>${transaction.text}</span> <span>${transaction.amount.toFixed(2)}</span><button type="button" class="delete-btn" onClick=deleteTransaction(${transaction.id})><i class="fas fa-minus-circle"></i></button>`
  list.appendChild(li)
}

function deleteTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id)

  updateLocalStorage()
  initialize()
}

// calculate

function calculateValues() {

  const amounts = transactions.map(transaction => transaction.amount)

  const incomes = amounts
    .filter(amount => amount > 0)
    .reduce((acc, cv) => (acc + cv), 0)
    .toFixed(2)
  const expenses = amounts
    .filter(amount => amount < 0)
    .reduce((acc, cv) => (acc + cv), 0)
    .toFixed(2)

  const total = amounts.reduce((acc, cv) => (acc + cv), 0).toFixed(2)
  total >= 0 ? current_money.style.color = "#00ac6a" : current_money.style.color = "#ff4949"
  current_money.innerText = `$${total}`;
  current_incomes.innerText = `$${incomes}`;
  current_expenses.innerText = `$${expenses}`;

}

function optionsFunc() {
  if (sort.value == 'expenses') {
    filterExpenses()
  }
  if (sort.value == 'incomes') {
    filterIncomes()
  }
  if (sort.value == 'no-filter') {
    initialize()
  }
}

function filterExpenses() {
  list.innerHTML = '';
  const expenses = transactions.filter(transaction => transaction.amount < 0)
  expenses.forEach(addTransactionToDOM)
}
function filterIncomes() {
  list.innerHTML = '';
  const incomes = transactions.filter(transaction => transaction.amount > 0)
  incomes.forEach(addTransactionToDOM)
}


// update local storage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

function initialize() {
  list.innerHTML = '';
  transactions.forEach(addTransactionToDOM)
  current_incomes.classList.add('plus')
  current_expenses.classList.add('minus')
  calculateValues()
}

initialize()
openModal.addEventListener('click', openModalWindow)
closeModalBtn.addEventListener('click', closeModal)
delete_btn.forEach(deleteTransaction)
add_btn.addEventListener('click', addTransaction)
select.addEventListener('change', optionsFunc)