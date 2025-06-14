document.getElementById('saveCustomer').addEventListener('click', saveNewCustomer);
document.getElementById('cancelAddCustomer').addEventListener('click', cancel_AddNewCustomer);

document.getElementById('cancelUpdateName').addEventListener('click', cancelUpdateName);
document.getElementById('updateName').addEventListener('click', updateName);

document.getElementById('proceedDeleteCustomer').addEventListener('click', proceedDeleteCustomer);

document.getElementById('addCustomerModal').addEventListener('shown.bs.modal', function () {
    const myInput = document.getElementById('enteredName');
    myInput.focus();
});

document.getElementById('reNameHandlerModal').addEventListener('shown.bs.modal', () => {
    const newNameInput = document.getElementById('newName');
    newNameInput.focus();
})

const sameNameCusAlert = document.getElementById('sameNameCusAlert');

document.getElementById('searchCustomer').addEventListener('input', searchCustomer);
document.getElementById('searchInputCleaner').addEventListener('click', resetFilters);
document.getElementById('resetFilters').addEventListener('click', resetFilters);

document.getElementById('sort_by_name').addEventListener('click', sort_by_name);
document.getElementById('ascending_balance_sort').addEventListener('click', ascending_balance_sort);
document.getElementById('descending_balance_sort').addEventListener('click', descending_balance_sort);


let customersDetails = JSON.parse(localStorage.getItem('customersDetails')) || [];


window.onload = () => {
    appendData(customersDetails);

    showTotalBalance();
}


let oldName = '';
let cusNameToDelete = '';
let filtered_data;
let isDataSorted = false;


function saveNewCustomer() {
    sameNameCusAlert.style.display = 'none';

    let enteredName = document.getElementById('enteredName').value;
    if (enteredName == '') return;

    document.getElementById('enteredName').value = null;

    enteredName = enteredName.split('');
    enteredName[0] = enteredName[0].toUpperCase();
    enteredName = enteredName.join('');

    for (let cus of customersDetails) {
        if (cus.name.toLowerCase() == enteredName.toLowerCase()) {
            sameNameCusAlert.style.display = 'block';
            sameNameCusAlert.innerText = `${cus.name} is already present in your list. Try another name.`
            return;
        }
    }

    customersDetails.push({ name: enteredName, amount: 0 });

    localStorage.setItem('customersDetails', JSON.stringify(customersDetails));
    appendData(customersDetails);
}


function cancel_AddNewCustomer() {
    document.getElementById('enteredName').value = null;
}


async function appendData(data) {

    const tBody = document.getElementById('dataTableBody');
    tBody.innerHTML = null;

    // this condition is only for mount phase.
    const value = document.getElementById('searchCustomer').value;
    if(value) {
        data = filtered_data;
    }

    data.forEach((cus, i) => {

        const serialNum = document.createElement('td'); // td 0
        serialNum.innerText = i+1;

        const name = document.createElement('td'); // td 1

        const nameBox = document.createElement('div');
        nameBox.className = 'nameBox';

        const nameDiv = document.createElement('div');
        nameDiv.innerText = cus.name;
        nameDiv.style.border = 'none';

        const reNameIcon = document.createElement('i');
        // font awesome
        reNameIcon.setAttribute('class', 'fa-solid fa-ellipsis-vertical reNameIcon');
        reNameIcon.setAttribute('title', `Re name ${cus.name}`);

        // bootstrap
        reNameIcon.setAttribute('type', 'button');
        reNameIcon.setAttribute('data-bs-toggle', "modal");
        reNameIcon.setAttribute('data-bs-target', "#reNameHandlerModal");

        reNameIcon.onclick = () => {
            let renameInputField = document.getElementById('newName');
            renameInputField.value = cus.name;
            oldName = cus.name;
        }

        nameBox.append(nameDiv, reNameIcon);
        name.append(nameBox);

        const amount = document.createElement('td'); // td 2
        const text = document.createElement('div');

        text.innerText = cus.amount;
        amount.append(text);

        const entryField = document.createElement('td'); // td 3
        entryField.className = 'entryField';

        const signInput = document.createElement('input');
        signInput.setAttribute('placeholder', '+ or -');
        signInput.setAttribute('aria-label', "default input example");
        signInput.setAttribute('class', `form-control`);

        signInput.addEventListener('input', () => {
            isSignValid(event);
        })

        const numberInput = document.createElement('input');
        numberInput.setAttribute('placeholder', 'New Entry');
        numberInput.setAttribute('aria-label', "default input example");
        numberInput.setAttribute('class', `form-control`);
        numberInput.setAttribute('type', 'number');
        numberInput.setAttribute('disabled', true);

        numberInput.addEventListener('keydown', () => {
            updateData(event, cus.name);
        });

        const entryFieldChildDiv = document.createElement('div');
        entryFieldChildDiv.append(signInput, numberInput);

        entryField.append(entryFieldChildDiv);

        const removeCustomerTd = document.createElement('td'); // td 4
        const removeCustomerBtn = document.createElement('button');
        removeCustomerBtn.innerText = 'Remove';
        removeCustomerBtn.setAttribute('class', 'btn btn-outline-danger btn-md');
        removeCustomerBtn.setAttribute('data-bs-toggle', "modal");
        removeCustomerBtn.setAttribute('data-bs-target', "#deleteCustomerModal");

        removeCustomerBtn.onclick = () => {
            cusNameToDelete = cus.name;
        }

        removeCustomerTd.append(removeCustomerBtn);


        const tr = document.createElement('tr');
        tr.append(serialNum, name, amount, entryField, removeCustomerTd);

        tBody.append(tr);
    })
}


function isSignValid(e) {
    let value = e.target.value;

    if (value == '+' || value == '-') {
        const nextInput = e.target.nextElementSibling;
        nextInput.removeAttribute('disabled');
        nextInput.focus();
    }
    else {
        const nextInput = e.target.nextElementSibling;
        nextInput.setAttribute('disabled', true);
        e.target.value = null;
    }
}


function updateData(e, customerName) {

    // adding value
    if (e.key == 'Enter') {
        let newValue = Number(e.target.value);

        const sign = e.target.previousElementSibling.value;

        switch (sign) {
            case "-":
                for (let customer of customersDetails) {
                    if (customer.name == customerName) {
                        customer.amount -= newValue;
                        break;
                    }
                }
                break;
            case "+":
                for (let customer of customersDetails) {
                    if (customer.name == customerName) {
                        customer.amount += newValue;
                        break;
                    }
                }
                break;
            default:
                // 
        }

        localStorage.setItem('customersDetails', JSON.stringify(customersDetails));
        appendData(customersDetails);

        showTotalBalance();
    }
}


function updateName() {
    let newName = document.getElementById('newName').value;
    if (newName == '') return;

    newName = newName.split('');
    newName[0] = newName[0].toUpperCase();
    newName = newName.join('');

    document.getElementById('newName').value = null;

    for (let customer of customersDetails) {

        if (customer.name == oldName) {
            customer.name = newName;
            oldName = '';
            break;
        }
    }

    localStorage.setItem('customersDetails', JSON.stringify(customersDetails));

    appendData(customersDetails);
}


function cancelUpdateName() {
    document.getElementById('newName').value = null;
}


function proceedDeleteCustomer() {

    customersDetails = customersDetails.filter(cus => cus.name != cusNameToDelete);

    localStorage.setItem('customersDetails', JSON.stringify(customersDetails));

    appendData(customersDetails);
}


// debouncer function
let timer = null;
function searchCustomer() {
    const value = document.getElementById('searchCustomer').value;

    if (timer) {
        clearTimeout(timer);
        timer = null;
    }

    timer = setTimeout(() => {

        filtered_data = customersDetails.filter((cus) => {
            return cus.name.toLowerCase().includes(value.toLowerCase())
        });

        appendData(filtered_data);
    }, 500)
}


function resetFilters() {
    let input = document.getElementById('searchCustomer');
    input.value = null;

    appendData(customersDetails);
}


function sort_by_name() {
    if(filtered_data) {
        filtered_data.sort((a, b) => a.name.localeCompare(b.name));
        appendData(filtered_data);
    }
    else {
        filtered_data = customersDetails.slice();
        filtered_data.sort((a, b) => a.name.localeCompare(b.name));
        appendData(filtered_data);
    }
}


function ascending_balance_sort() {
    if(filtered_data) {
        filtered_data.sort((a,b) => {
            if(a.amount > b.amount) return 1;
            else if(a.amount < b.amount) return -1;
            else return 0;
        });

        appendData(filtered_data);
    }
    else {
        filtered_data = customersDetails.slice();
        filtered_data.sort((a,b) => {
            if(a.amount > b.amount) return 1;
            else if(a.amount < b.amount) return -1;
            else return 0;
        });

        appendData(filtered_data);
    }

}

function descending_balance_sort() {
    if(filtered_data) {
        filtered_data.sort((a,b) => {
            if(a.amount > b.amount) return -1;
            else if(a.amount < b.amount) return 1;
            else return 0;
        });

        appendData(filtered_data);
    }
    else {
        filtered_data = customersDetails.slice();
        filtered_data.sort((a,b) => {
            if(a.amount > b.amount) return -1;
            else if(a.amount < b.amount) return 1;
            else return 0;
        });

        appendData(filtered_data);
    }
}


function showTotalBalance() {
    const total_balance = document.getElementById('total_balance');

    let balance = 0
    for(let cus of customersDetails) {
        balance += cus.amount;
    }
    
    total_balance.innerHTML = `Total balance : <i class="fa-solid fa-indian-rupee-sign rupay"></i> ${balance}`;
}
