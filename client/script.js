"use strict";

formComment.textComment.addEventListener('input', (e) => validateField(e.target));
formComment.addEventListener('submit', onSubmit);

const commentsElement = document.getElementById('comments')
let commentsValid = true;
let doNotRunSaveTask = true;
const api = new Api('http://localhost:5000/comments');

function validateField(field) {
    const {name, value} = field;
    let validationMessage = '';
    switch (name) {
        case 'textComment': {
            if (field.innerHTML == '') {
                commentsValid = false;
                doNotRunSaveTask = false;
                validationMessage = 
                "The field may not be left empty.";
            }
            else if (value.length <= 0) {
                commentsValid = false;
                doNotRunSaveTask = false;
                validationMessage = 
                "The field may not be left empty.";
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
        
    saveComment();
    }
    else {
        console.log('failed to submit');
    }
  }

function saveComment() {
    const comment = {
        comment: formComment.textComment.value
    };

    api.create(comment).then((comment) => {
        if (comment) {
            renderComment(comment);
        }
    });
}

function renderAll() {
    console.log('rendering');

    api.getAll().then((comments) => {
        commentsElement.innerHTML = "";
        if (comments && comments.length > 0) {
            comments.forEach((comment) => {
                commentsElement.insertAdjacentHTML('beforeend', renderComment(comment));
            });
        }
    });
}

function renderComment({ id, comment}) {
    let html =
    `
        <div class="flex items-center group my-8">
            <p class="flex-1 text-base rounded-md bg-neutral-200 pb-2 px-2 w-[25rem] h-[15rem] drop-shadow-xl">${comment}</p>
            <button 
                onclick="deleteComment(${id})" class=" self-start text-xs text-zinc-200 px-1 invisible group-hover:visible ml-2 mt-3 w-[2.5rem] h-[1rem]">
                delete
            </button>
        </div>
    `;
                /* rounded-md bg-neutral-200 hover:bg-zinc-500 w-1/12 mt-2 */
    return html;
}

function deleteComment(id) {
    api.remove(id).then((result) => {
  
      renderAll();
    });
  }


  renderAll();