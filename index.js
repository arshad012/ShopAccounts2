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
    sameNameCusAlert.style.display = 'none';

    let enteredName = document.getElementById('enteredName').value;
    if (enteredName == '') return;

    document.getElementById('enteredName').value = null;

    enteredName = enteredName.split('');
    enteredName[0] = enteredName[0].toUpperCase();
    enteredName = enteredName.join('');

    let isNamePresent = false;
    for(let cus of customersDetails) {
        if(cus.name == enteredName) {
            isNamePresent = true;
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

        numberInput.addEventListener('keydown', () => {
            updateData(event, cus.name);
        });

        const alert = document.createElement('div');
        alert.innerText = 'Please enter a valid number';
        alert.className = 'alertMessage'

        const entryFieldChildDiv = document.createElement('div');
        entryFieldChildDiv.append(signInput, numberInput, alert);

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


function isSignValid(e) {
    let value = e.target.value;

    if(value == '+' || value == '-') {
        const nextInput = e.target.nextElementSibling;
        nextInput.focus();
    }
    else {
        e.target.value = null;
    }
}


function updateData(e, customerName) {

    // adding value
    if (e.key == 'Enter') {
        let newValue = e.target.value;
        newValue = Number(newValue);

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