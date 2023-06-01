const fileInput = document.getElementById('db-upload');
const queryInput = document.getElementById('db-query');
const submitButton = document.getElementById('db-submit');

fileInput.onchange = async () => {
  const reader = new FileReader()
  reader.readAsDataURL(fileInput.files[0])

  reader.onload = () => {
    document.documentElement.style.setProperty('--sql-database', `url('${reader.result}')`)
  }
}

submitButton.onclick = async () => {
  let query = queryInput.value;
  if (query.endsWith(';')) {
    query = query.slice(0, -1)
  }

  document.documentElement.style.setProperty('--sql-query', query);
}


CSS.paintWorklet.addModule('js/sqlcss.js');