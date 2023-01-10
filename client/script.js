comment.textComment.addEventListener('input', (e) => validateField(e.target));
comment.addEventListener('submit', onSubmit);

const comments = document.getElementById('comments')
let commentsValid = true;
let doNotRunSaveTask = false;
const api = new Api('http://localhost:5000/tasks');

function validateField(field) {
    const {name, value} = field;
    let = validationMessage = '';
    switch (name) {
        case 'textComment': {
            if (value.length <= 0) {
                commentsValid = false;
                validationMessage =
                "The field can not be left empty.";
            }
            else {
                commentsValid = true;
                doNotRunSaveTask = true;
            }
            break;
        }
    }
    if (commentsValid == false) {
        field.previousElementSibling.innerHTML = validationMessage;
        field.previousElementSibling.classList.remove('hidden');
    }
    else {
        field.previousElementSibling.classList.add('hidden');
    }
}

function onSubmit(e) {
    
    e.preventDefault();
    if (commentsValid && doNotRunSaveTask) {
        
      saveTask();
    }
    else {
        console.log('failed to submit');
    }
  }

function saveTask() {
    console.log('Submit');
}