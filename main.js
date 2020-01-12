//Book constructor
class Book {
    constructor(id, title, author){
        this.id = id;
        this.title = title;
        this.author = author;
    }
}
//UI constructor
class UI {
    //add book to ui
    addBook(book){
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${book.id}</td>
                        <td>${book.title}</td>
                        <td>${book.author}</td>
                        <td><a href="#" class="del-item">X</a></td>`
        document.querySelector('#tb').appendChild(tr);
    }
    //clear input fields after submitting
     clearFields(){
         document.querySelector('#book-id').value = '';
         document.querySelector('#title').value = '';
         document.querySelector('#author').value = '';
     }
     // delete a book from ui
     deleteBook(target){
         if(target.className === 'del-item'){
             if (confirm('are you sure')) {
                 target.parentElement.parentElement.remove();
             }
         }
     }
     //delet all books from ui
     clear(){
         while (document.querySelector('#tb').firstElementChild){
             document.querySelector('#tb').firstElementChild.remove();
         }
     }

     showAlert(msg, msgtype){
        const div = document.createElement('div');
        div.className = `msgtype ${msgtype}`;
         div.appendChild(document.createTextNode(msg));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        setTimeout(() => {
            div.remove();
        }, 2000);
     }
}
//persist to local storage
class Store {
    static getBook(){
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books
    }

    static addBook(book){
        const books = Store.getBook()
        books.push(book)
        localStorage.setItem('books', JSON.stringify(books))
    }

    static clearBooks(){
        localStorage.clear();
    }

    static displayBooks(){
        const books = Store.getBook();
        books.forEach(book =>{
            const ui = new UI();
            ui.addBook(book);
        })
    }

    static deleteBook(target){
        const books = Store.getBook();
        books.forEach((book, index) =>{
            if (target === book.id) {
                books.splice(index, 1)
                localStorage.setItem('books', JSON.stringify(books))
            }
        })
    }
}
document.querySelector('#book-form').addEventListener('submit', runEvent);
function runEvent(e){
    const id = document.querySelector('#book-id').value;
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const ui = new UI();
    if (id ==='' || title === '' || author === '') {
        ui.showAlert('please fill in all fields', 'alert-danger');
    }else{
        const book = new Book(id, title, author);
        ui.addBook(book);
        ui.clearFields();
        //add to local storage
        Store.addBook(book);
        ui.showAlert('Book added', 'alert-success');
    }
    e.preventDefault();
}

document.querySelector('.table').addEventListener('click', delBook);
function delBook(e){
    const ui = new UI();
    ui.deleteBook(e.target);
    Store.deleteBook(e.target.parentElement.parentElement.firstChild.textContent)
    ui.showAlert('Book removed', 'alert-success')
}
document.querySelector('#clear').addEventListener('click', clearBooks);
function clearBooks(e){
    const ui = new UI();
    ui.clear()
    ui.showAlert('All books cleared', 'alert-success');
    //delete book from local storage
    Store.clearBooks();
}

document.addEventListener('DOMContentLoaded', loadDOM);
function loadDOM(){
    Store.displayBooks();
}
