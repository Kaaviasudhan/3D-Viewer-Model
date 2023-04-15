const form = document.getElementById('upload-form');
const fileInput = document.getElementById('file-input');

form.addEventListener('submit', (e) => {
  e.preventDefault(); // prevent form submission
  
  const file = fileInput.files[0]; // get the selected file
  const fileName = file.name; // get the file name
  
  const fileExtension = fileName.split('.').pop(); // get the file extension
  
  console.log(`File extension: ${fileExtension}`); // display the file extension in the console
});