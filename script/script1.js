'use strict';

//объявляем переменные
let start = document.getElementById('start'),
    cancel = document.getElementById('cancel'),
    btnPlus = document.getElementsByTagName('button'),
    incomePlus = btnPlus[0],
    expensesPlus = btnPlus[1],
    additionalIncomeItem = document.querySelectorAll('.additional_income-item'),
    depositCheck = document.querySelector('#deposit-check'),
    budgetDayValue = document.getElementsByClassName('budget_day-value')[0],
    budgetMonthValue = document.getElementsByClassName('budget_month-value')[0],
    expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0],
    accumulatedMonthValue = document.getElementsByClassName('accumulated_month-value')[0],
    additionalIncomeValue = document.getElementsByClassName('additional_income-value')[0],
    additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0],
    incomePeriodValue = document.getElementsByClassName('income_period-value')[0],
    targetMonthValue = document.getElementsByClassName('target_month-value')[0],
    salaryAmount = document.querySelector('.salary-amount'),
    incomeTitle = document.querySelector('.income-title'),
    incomeAmount = document.querySelector('.income-amount'),
    expensesTitle = document.querySelector('.expenses-title'),
    expensesItems = document.querySelectorAll('.expenses-items'),
    additionalExpenses = document.querySelector('.additional_expenses'),
    periodSelect = document.querySelector('.period-select'),
    periodAmount = document.querySelector('.period-amount'),
    additionalExpensesItem = document.querySelector('.additional_expenses-item'),
    targetAmount = document.querySelector('.target-amount'),
    incomeItems = document.querySelectorAll('.income-items');

    let isNumber = function(n){
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    
    let isString = function(s){
        return (typeof s) === 'string' && s !== '';
    }

const AppData = function(){
    this.budget = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.income = {};
    this.incomeMonth = 0;
    this.expensesMonth = 0;
    this.addIncome = [];
    this.expenses = {};
    this.addExpenses = [];
    this.deposit = false;
    this.percentDeposit = 0;
    this.moneyDeposit = 0; 
}

AppData.prototype.check = function(){
    if(salaryAmount.value !== ''){
        start.removeAttribute('disabled');
    }
};

AppData.prototype.start = function(){
    if(salaryAmount.value === ''){
        start.setAttribute('disabled', 'true');
        return;
    }
    let allInput = document.querySelectorAll('.data input[type = text]');
    allInput.forEach(function(item){
        item.setAttribute('disabled','true');
    });
    expensesPlus.setAttribute('disabled','true');
    incomePlus.setAttribute('disabled','true');
    start.style.display = 'none';
    cancel.style.display = 'block';
    
    
    this.budget = +salaryAmount.value;
    
    this.getExpenses();
    this.getIncome();
    this.getExpensesMonth();
    this.getAddExpenses();
    this.getAddIncome();
    this.getBudget();
    this.getInfoDeposit();
    this.getStatusIncome();

    this.showResult();
};

AppData.prototype.showResult = function(){
    const _this = this;
    budgetMonthValue.value = this.budgetMonth;
    budgetDayValue.value = this.budgetDay;
    expensesMonthValue.value = this.expensesMonth;
    additionalExpensesValue.value = this.addExpenses.join(', ');
    additionalIncomeValue.value = this.addIncome.join(', ');
    targetMonthValue.value = Math.ceil(this.getTargetMonth());
    incomePeriodValue.value = this.calcPeriod();
    periodSelect.addEventListener('change', function(){
        incomePeriodValue.value = _this.calcPeriod();
    });
};
AppData.prototype.getAddExpenses = function(){
    const _this = this;
    let addExpenses = additionalExpensesItem.value.split(',');
    addExpenses.forEach(function(item){
        item = item.trim();
        if(item !== ''){
            _this.addExpenses.push(item);
        }
    });
};
AppData.prototype.addExpensesBlock = function(){
    
    let cloneExpensesItem = expensesItems[0].cloneNode(true);
    expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlus);
    expensesItems = document.querySelectorAll('.expenses-items');
    if(expensesItems.length === 3){
        expensesPlus.style.display = 'none';
    }
};
AppData.prototype.getExpenses = function(){
    const _this = this;
    expensesItems.forEach(function(item){
        let itemExpenses = item.querySelector('.expenses-title').value;
        let cashExpenses = item.querySelector('.expenses-amount').value;
        if(itemExpenses !== '' && cashExpenses !== ''){
            _this.expenses[itemExpenses] = cashExpenses;
        }
    });
};
AppData.prototype.addIncomeBlock = function(){
    let cloneIncomeItem = incomeItems[0].cloneNode(true);
    incomeItems[0].parentNode.insertBefore(cloneIncomeItem, incomePlus);
    incomeItems = document.querySelectorAll('.income-items');
    if(incomeItems.length === 3){
        incomePlus.style.display = 'none';
    }
};
AppData.prototype.getIncome = function(){
    const _this = this;
    incomeItems.forEach(function(item){
        let itemIncome = item.querySelector('.income-title').value;
        let cashIncome = item.querySelector('.income-amount').value;
        if(itemIncome !== '' && cashIncome !== ''){
            _this.income[itemIncome] = cashIncome;
        }
    });
        for(let key in this.income){
            this.incomeMonth += +this.income[key];
        }
    
};
AppData.prototype.getAddIncome = function(){
    const _this = this;
    additionalIncomeItem.forEach(function(item){
        let itemValue = item.value.trim();
        if(itemValue !== ''){
            _this.addIncome.push(itemValue);
        }
    });
};
AppData.prototype.getExpensesMonth = function() {
    for(let key in this.expenses){
        this.expensesMonth += +this.expenses[key];
    }
};
AppData.prototype.getBudget = function() {
    this.budgetMonth = +this.budget + (+this.incomeMonth) - (+this.getExpensesMonth());
    this.budgetDay = Math.floor(this.budgetMonth / 30);
    
};
AppData.prototype.getTargetMonth =  function(){
    return targetAmount.value / this.budgetMonth;
};
AppData.prototype.getStatusIncome = function(){
    if(this.budgetDay >= 1200){
        console.log('you have high level of income');
    } else if(this.budgetDay < 1200 && this.budgetDay >= 600){
        console.log('you have medium level of income');
    } else if(this.budgetDay < 600){
        console.log('you have low level of income');
    } else if(this.budgetDay < 0){
        console.log('something went wrong');
    }
};
AppData.prototype.getInfoDeposit = function(){
    if(this.deposit){
        do{
            this.percentDeposit = prompt('Какой годовой процент депозита', '2');
        } while(!isNumber(appData.percentDeposit));
        
        do{
            appData.moneyDeposit = prompt('Какая сумма заложена?', '10000');
        } while(!isNumber(this.moneyDeposit));
        
    }
};
AppData.prototype.calcPeriod = function(){
    return this.budgetMonth * periodSelect.value;
};
AppData.prototype.reset = function(){
    let inputTextData = document.querySelectorAll('.data input[type = text]');
    let resultInputAll = document.querySelectorAll('.result input[type = text]');

    inputTextData.forEach(function(elem){
        elem.value = '';
        elem.removeAttribute('disabled');
        periodSelect.value = '0';
        periodAmount.innerHTML = periodSelect.value;
    });
    resultInputAll.forEach(function(elem){
        elem.value = '';
    });

    for(let i = 0; i < incomeItems.length; i++){
        incomeItems[i].parentNode.removeChild(incomeItems[i]);
        incomePlus.style.display = 'block';
    }
    for(let i = 0; i < expensesItems.length; i++){
        expensesItems[i].parentNode.removeChild(expensesItems[i]);
        expensesPlus.style.display = 'block';
    }

    this.budget = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.income = {};
    this.incomeMonth = 0;
    this.expensesMonth = 0;
    this.addIncome = [];
    this.expenses = {};
    this.addExpenses = [];
    this.deposit = false;
    this.percentDeposit = 0;
    this.moneyDeposit = 0; 

    cancel.style.display = 'none';
    start.style.display = 'block';
    expensesPlus.removeAttribute('disabled');
    incomePlus.removeAttribute('disabled');
    depositCheck.checked = false;

};

const appData = new AppData();



start.addEventListener('click', appData.start.bind(appData));
expensesPlus.addEventListener('click', appData.addExpensesBlock);
incomePlus.addEventListener('click', appData.addIncomeBlock);
salaryAmount.addEventListener('keyup', appData.check);
cancel.addEventListener('click', appData.reset.bind(appData));
console.log(appData);
