document.getElementById("checkoutForm").addEventListener("submit", function(e){
    e.preventDefault()
    const form = this
    let isValid = true

    const fullName = form.fullName;
    if(!/^[A-Za-z\s]+$/.test(fullName.value)){
        fullName.classList.add("is-invalid")
        isValid = false
    }
    else{
        fullName.classList.remove("is-invalid")
    }

    const email = form.email
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)){
        email.classList.add ("is-invalid")
        isValid = false
    }
    else{
        email.classList.remove("is-invalid")
    }

    const phone = form.phone
    if(!/^[0-9]{10,15}$/.test(phone.value)){
        phone.classList.add("is-invalid")
        isValid = false
    }
    else{
        phone.classList.remove("is-invalid")
    }
    const address = form.address
    if(!address.value.trim()){
        address.classList.add("is-invalid")
        isValid = false
    }
    else{
        address.classList.remove("is-invalid")
    }
    const cardNumber = form.cardNumber
    if(!/^[0-9]{16}$/.test(cardNumber.value)){
        cardNumber.classList.add("is-invalid")
        isValid = false
    }
    else{
        cardNumber.classList.remove("is-invalid")
    }

    const expiryDate = form.expiryDate;
    const selectedDate = new Date(expiryDate.value + "-01")
    const currentDate = new Date()
    if(!expiryDate.value || selectedDate <= currentDate){
        expiryDate.classList.add("is-invalid")
        isValid = false
    }
    else{
        expiryDate.classList.remove("is-invalid")
    }
    const cvv = form.cvv
    if(!/^[0-9]{3}$/.test(cvv.value)){
        cvv.classList.add("is-invalid")
        isValid = false
    }
    else{
        cvv.classList.remove("is-invalid")
    }
    if (isValid) {
        alert('Payment submitted successfully!');
        form.reset();  
    } else {
        alert('Please fix the errors in the form.');
        
    }
})
 