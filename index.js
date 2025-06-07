document.getElementById('saveCustomer').addEventListener('click', saveNewCustomer);

document.getElementById('cancelAddCustomer').addEventListener('click', cancel_AddNewCustomer);

document.getElementById('cancelUpdateName').addEventListener('click', cancelUpdateName);
document.getElementById('updateName').addEventListener('click', updateName);

document.getElementById('proceedDeleteCustomer').addEventListener('click', proceedDeleteCustomer);

document.getElementById('addCustomerModal').addEventListener('shown.bs.modal', function () {
    const myInput = document.getElementById('enteredName');
    myInput.focus();
});

let customersDetails = JSON.parse(localStorage.getItem('customersDetails')) || [];

// [
//     {name: 'Arshad mhd', amount: -1000},
//     {name: 'Shaizy', amount: -630},
//     {name: 'Rahul', amount: 220},
//     {name: 'Asnal', amount: -1080},
//     {name: 'Mobin', amount: -930},
//     {name: 'Navneet', amount: -570},
//     {name: 'MD Arshad', amount: 200},
//     {name: 'Tofeek', amount: -410},
// ]


window.onload = () => {
    appendData(customersDetails);
}


let oldName = '';
let cusNameToDelete = '';


function saveNewCustomer() {
    let enteredName = document.getElementById('enteredName').value;
    if (enteredName == '') return;

    document.getElementById('enteredName').value = null;

    enteredName = enteredName.split('');
    enteredName[0] = enteredName[0].toUpperCase();
    enteredName = enteredName.join('');

    customersDetails.push({ name: enteredName, amount: 0 });

    localStorage.setItem('customersDetails', JSON.stringify(customersDetails));
    appendData(customersDetails);
}


function cancel_AddNewCustomer() {
    document.getElementById('enteredName').value = null;
}


function appendData(data) {
    const tBody = document.getElementById('dataTableBody');
    tBody.innerHTML = null;

    data.forEach((cus, i) => {

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

        const input = document.createElement('input');
        input.setAttribute('placeholder', 'New Entry');
        input.setAttribute('aria-label', "default input example");
        input.addEventListener('keydown', () => {
            updateData(event, cus.name);
        });
        input.addEventListener('input', () => {
            checkInput(event);
        })
        input.setAttribute('class', `form-control`);

        const alert = document.createElement('div');
        alert.innerText = 'Please enter a valid number';
        alert.className = 'alertMessage'

        const entryFieldChildDiv = document.createElement('div');
        entryFieldChildDiv.append(input, alert);

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
        tr.append(name, amount, entryField, removeCustomerTd);

        tBody.append(tr);
    })
}


function checkInput(e) {
    const alertMessage = e.target.nextElementSibling;
    let value = e.target.value;

    if (value[0] == '+' || value[0] == '-') {
        value = value.slice(1, value.length);

        value = Number(value);
        let isNumber = Number.isInteger(value);

        if (!isNumber) {
            alertMessage.style.display = 'block';
        }
        else {
            alertMessage.style.display = 'none';
        }
    }
    else if(value != '') {
        alertMessage.style.display = 'block';
    }
}


function updateData(e, customerName) {
    const alertMessage = e.target.nextElementSibling;

    // adding value
    if (e.key == 'Enter') {
        let newValue = e.target.value;

        let sign = newValue[0];
        if (sign != '+' && sign != '-') {
            alertMessage.style.display = 'block';
            return;
        }

        newValue = newValue.slice(1, newValue.length);

        newValue = Number(newValue);
        let isNumber = Number.isInteger(newValue);
        if (!isNumber) {
            alertMessage.style.display = 'block';
            return;
        }

        switch (sign) {
            case "-":
                for (let customer of customersDetails) {
                    if (customer.name == customerName) {
                        customer.amount -= newValue;
                        break;
                    }
                }
                break;
            default:
                for (let customer of customersDetails) {
                    if (customer.name == customerName) {
                        customer.amount += newValue;
                        break;
                    }
                }
        }

        localStorage.setItem('customersDetails', JSON.stringify(customersDetails));
        appendData(customersDetails);
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