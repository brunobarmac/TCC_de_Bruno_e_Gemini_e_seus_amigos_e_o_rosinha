const signUpButton = document.getElementById('signUpButton');
const signInButton = document.getElementById('signInButton');
<<<<<<< HEAD
const signInForm = document.getElementById('signIn');
const signUpForm = document.getElementById('signup');

signUpButton.addEventListener('click', function(){
    signInForm.style.display = 'none';
    signUpForm.style.display = 'block';
})

signInButton.addEventListener('click', function(){
    signInForm.style.display = 'block';
    signUpForm.style.display = 'none';
})
=======

const signInForm = document.getElementById('signIn');
const signUpForm = document.getElementById('signup');

signUpButton.addEventListener('click', () => {
  signInForm.style.display = 'none';
  signUpForm.style.display = 'block';
});

signInButton.addEventListener('click', () => {
  signInForm.style.display = 'block';
  signUpForm.style.display = 'none';
});
>>>>>>> branch-do-luiz
