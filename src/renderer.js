/**
 * =======================================================
 * Fauna
 * Di sini menyambung fungsi spawn call_rpa_log dan send_rpa_log
 * Nanti akan dipanggil di renderer dengan:
 *      fauna.call_rpa_log()
 * BTW: di html tidak boleh pasang onclick attribute, jadi mesti
 * pasang event listener disini
 * =======================================================
 */

const screenscanner_toggle = document.getElementById('screenscanner_toggle')
const update_credential = document.getElementById('update_credential')
const verify_button = document.getElementById('verify-button')

const show_pass = document.getElementById('show_pass')
if (show_pass) {
  show_pass.addEventListener('click', () => {
    const x = document.getElementById("pass");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  })
}

let unit_list = ''

const get_screenscanner = async () => {
  let log = await window.fauna.send_screenscanner()
  console.log(log)
  document.getElementById('log_screenscanner').innerText = log
}
if (update_credential) {
  update_credential.addEventListener('click', async () => {
    const uname = document.getElementById('uname').value
    const pass = document.getElementById('pass').value
    console.log(uname, pass);
    window.fauna.set_credential(uname, pass).then(data => {
      console.log(data)
      document.getElementById('toast-body').innerText = data
      const toast = new bootstrap.Toast(toastLiveExample)
      toast.show()
    })
  })
}
if (screenscanner_toggle) {
  screenscanner_toggle.addEventListener('change', async () => {
    if (screenscanner_toggle.checked == true) {
      await window.fauna.call_screenscanner()
    } else {
      let resp = await window.fauna.kill_screenscanner()
      console.log(`Sukses matikan: ${resp}`)
    }
  })
}

// Get the modal
const modal = document.getElementById("myModal");

// Get the button that opens the modal
const btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];
const saveBtn = document.getElementById("save-button");
const input_unit = document.querySelector('input[name=tags]');

// When the user clicks the button, open the modal 
if (btn) {
  btn.onclick = function () {
    modal.style.display = "block";
  }
}

// When the user clicks on <span> (x), close the modal
if (span) {
  span.onclick = function () {
    modal.style.display = "none";
  }
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function check_unit() {
  if (document.getElementById("unit-list").value === "") {
    document.getElementById('save-button').disabled = true;
  } else {
    document.getElementById('save-button').disabled = false;
  }
}

if (saveBtn) {
  saveBtn.onclick = function () {
    unit_list = document.getElementById('unit-list').value
    document.getElementById('verify_list').innerText = unit_list
  }
}

if (verify_button) {
  verify_button.addEventListener('click', async () => {
    window.fauna.set_unit_list(unit_list)
  })
}
const backBtn = document.getElementById("myBtnBack");
if (backBtn) {
  backBtn.onclick = function () {
    window.location.replace("./index.html")
  }
}

if (input_unit) {
  new Tagify(input_unit, { originalInputValueFormat: unit => unit.map(item => item.value).join(', ') })
  input_unit.addEventListener('change', onChange)
}

function onChange(e) {
  if (e.target.value !== '') {
    document.getElementById('save-button').disabled = false;
  } else {
    document.getElementById('save-button').disabled = true;
  }
}