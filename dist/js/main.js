class Transaction {
  constructor(description, amount) {
    this.description = description;
    this.amount = parseInt(amount);
    this.date = currentDateTransaction();
    this.id = id++;
  }
}

class TransactionList {
  constructor() {
    this.incomeList = [];
    this.expenseList = [];
    this.budget = [this.incomeList, this.expenseList];
  }
  printIncome() {
    console.table(this.incomeList);
  }
  printExpenses() {
    console.table(this.expenseList);
  }
  addNewTransaction(description, amount) {
    if (amount >= 0) {
      this.incomeList.push(new Transaction(description, amount));
    } else if (amount < 0) {
      this.expenseList.push(new Transaction(description, amount));
    }
    this.reDraw();
  }
  removeTransaction(id) {
    this.budget.forEach(list => {
      const currentIndex = list.findIndex(item => item.id == id);

      if (currentIndex !== -1) {
        list.splice(currentIndex, 1);
      }
    });
    this.reDraw();
  }
  getIncome(income) {
    return income.amount;
  }
  getExpense(expense) {
    return expense.amount;
  }
  calculateTotalIncome() {
    let totalIncome = 0;
    this.incomeList.forEach(income => {
      totalIncome += this.getIncome(income);
    });
    return totalIncome;
  }
  calculateTotalExpenses() {
    let totalExpenses = 0;
    this.expenseList.forEach(expense => {
      totalExpenses += this.getExpense(expense);
    })
    return totalExpenses;
  }
  calculateTotalBudget() {
    let totalBudget = 0;
    totalBudget = this.calculateTotalIncome() + this.calculateTotalExpenses();
    return totalBudget;
  }
  calculateTotalPercentage() {
    let percentage = 0;
    percentage = Math.round((this.calculateTotalExpenses() / this.calculateTotalIncome())*100)*(-1) + '%';
    return percentage;
  } 
  reDraw() {
    const budgetValue = document.querySelector('.budget__value');
    budgetValue.innerHTML = this.calculateTotalBudget() > 0 ? (`+ $${this.calculateTotalBudget().toFixed(2)}`) : (`- $${((this.calculateTotalBudget()*(-1)).toFixed(2))}`);

    const incomeValue = document.querySelector('.budget__income--value');
    incomeValue.innerHTML = '+' + ' ' + '$'+ this.calculateTotalIncome().toFixed(2);

    const expenseValue = document.querySelector('.budget__expenses--value');
    expenseValue.innerHTML = `- $${(this.calculateTotalExpenses()*(-1)).toFixed(2)}`;

    const totalPercentage = document.querySelector('.budget__expenses--percentage');
    if (this.calculateTotalPercentage() == Infinity || this.incomeList.length === 0) {
      totalPercentage.innerHTML = `${0}%`;
    } else {
      totalPercentage.innerHTML = this.calculateTotalPercentage();
    }
  }
  reDrawIncome() {
    const incomeItems = document.querySelector('.income__list');
    incomeItems.innerHTML = '';
      
    this.incomeList.forEach(transaction => {
      const newIncome = `<div class="item" data-transaction-id="${transaction.id}">
        <div class="item__description">${transaction.description}</div>            
          <div class="right">
            <div class="item__value">+ $${transaction.amount.toFixed(2)}</div>
              <div class="item__delete">
                <button class="item__delete--btn">
                  <i class="ion-ios-close-outline"></i>
                </button>
              </div>
            </div>
          <div class="item__date">${transaction.date}</div>
        </div>`
      incomeItems.insertAdjacentHTML('beforeend', newIncome);
    });  
  }
  reDrawExpense() {
    const expenseItems = document.querySelector('.expenses__list');
    expenseItems.innerHTML = '';

    this.expenseList.forEach(transaction => {
      //for each expense calculate the relative percentage ---> relative = each expense / total income * 100
      let relativePercentage = Math.round(((this.getExpense(transaction)) / this.calculateTotalIncome())*(-100));
      if (relativePercentage == Infinity || this.incomeList.length === 0) {
        relativePercentage = '-';
      }
      const newExpense = `<div class="item" data-transaction-id="${transaction.id} ">
        <div class="item__description">${transaction.description}</div>
          <div class="right">
            <div class="item__value">- $${(transaction.amount*(-1)).toFixed(2)}</div>
              <div class="item__percentage">${relativePercentage}%</div>
                <div class="item__delete">
                  <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
              </div>
          <div class="item__date">${transaction.date}</div>
        </div>`;
      expenseItems.insertAdjacentHTML('beforeend', newExpense);
    })
  }
  updateDate() {
    const date = document.querySelector('.budget__title--month');
    date.innerHTML = currentDate();
  }
}

function currentDate() {
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
  const date = new Date();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${year}`;
}
function currentDateTransaction() {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let string = '';
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  
  switch(currentDate) {
    default: n = 'th';
    break;
    case 1: n = 'st';
    break;
    case 2: n = 'nd';
    break;
    case 3: n = 'rd';
    break;
  }
  return string = `${month}. ${day}, ${year}`;
}  

let id = 0;
const transactionList = new TransactionList();
transactionList.updateDate();
const inputValues = document.querySelector('.add__container');
const inputDescription = document.querySelector('.add__description');
const inputAmount = document.querySelector('.add__value');
const deleteBtn = document.querySelector('.container');

inputValues.addEventListener('submit', event => {
    if (inputDescription.value !== '' && inputAmount.value !== '') {
      transactionList.addNewTransaction(inputDescription.value, inputAmount.value);
      inputAmount.value >= 0 ? transactionList.reDrawIncome() : transactionList.reDrawExpense();
      transactionList.reDrawIncome();
      transactionList.reDrawExpense();
    }
    inputDescription.value = '';
    inputAmount.value = '';
    event.preventDefault();
    console.log(transactionList.calculateTotalIncome());
})

deleteBtn.addEventListener('click', event => {
  if (event.target.nodeName === 'I') {
    selectedTransaction = event.target.closest('.item');
    
    transactionList.removeTransaction(selectedTransaction.dataset.transactionId);
    transactionList.reDrawIncome();
    transactionList.reDrawExpense();
  }
});



