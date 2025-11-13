function el(id){ return document.getElementById(id); }
function showPage(id){
  document.querySelectorAll('.container,.dashboard').forEach(p => p.classList.add('hidden'));
  el(id).classList.remove('hidden');
}

if(!localStorage.getItem('crf_user'))
  localStorage.setItem('crf_user', JSON.stringify({name:'Demo User', email:'demo@example.com', pass:'1234'}));

document.addEventListener('DOMContentLoaded', () => {
  el('showSignup').onclick = () => showPage('signupPage');
  el('backToLogin').onclick = () => showPage('loginPage');
  el('guestLink').onclick = e => {
    e.preventDefault();
    localStorage.setItem('crf_name','Guest');
    showPage('rolePage');
  };

  el('createBtn').onclick = () => {
    const name = el('signupName').value,
          email = el('signupEmail').value,
          pass = el('signupPassword').value;
    if(!name || !email || !pass){
      alert('Fill all fields');
      return;
    }
    localStorage.setItem('crf_user', JSON.stringify({name,email,pass}));
    alert('Account created!');
    showPage('loginPage');
  };

  el('loginBtn').onclick = () => {
    const email = el('loginEmail').value,
          pass = el('loginPassword').value;
    const u = JSON.parse(localStorage.getItem('crf_user'));
    if(email===u.email && pass===u.pass){
      localStorage.setItem('crf_name', u.name);
      showPage('rolePage');
    } else alert('Invalid credentials!');
  };

  el('openStudent').onclick = () => roleRedirect('student');
  el('openTeacher').onclick = () => roleRedirect('teacher');
  el('openAdmin').onclick = () => roleRedirect('admin');

  el('stuFile').addEventListener('change', e => previewUpload(e,'stu'));
  el('teachFile').addEventListener('change', e => previewUpload(e,'teach'));

  el('logoutBtnS').onclick = logout;
  el('logoutBtnT').onclick = logout;
  el('logoutBtnA').onclick = logout;
});

function roleRedirect(role){
  const n = localStorage.getItem('crf_name') || 'Guest';
  el(role + 'Name').textContent = n;
  el('fade').classList.add('show');
  setTimeout(() => {
    el('fade').classList.remove('show');
    showPage(role + 'Page');
    showToast(role.charAt(0).toUpperCase() + role.slice(1) + ' Dashboard Loaded');
  }, 300);
}

function previewUpload(e, prefix){
  const f = e.target.files[0];
  if(!f) return;
  el(prefix+'FileInfo').textContent = `${f.name} (${(f.size/1024).toFixed(2)} KB)`;
}

function submitUpload(p){
  const i = el(p+'File');
  if(!i.files.length) return alert('No file selected');
  showToast('Uploaded ' + i.files[0].name);
  i.value = '';
  el(p+'FileInfo').textContent = '';
}

function downloadSample(f){
  const b = new Blob(['Sample file: '+f+'\nGenerated: '+new Date().toLocaleString()], {type:'text/plain'});
  const u = URL.createObjectURL(b);
  const a = document.createElement('a');
  a.href = u; a.download = f; a.click();
  URL.revokeObjectURL(u);
}

function goHome(){ showPage('rolePage'); }

function logout(){
  localStorage.removeItem('crf_name');
  showToast('Logged out');
  showPage('loginPage');
}

function showToast(t){
  const o = document.createElement('div');
  o.className = 'toast';
  o.textContent = t;
  document.body.appendChild(o);
  setTimeout(() => {
    o.style.opacity='0';
    setTimeout(() => o.remove(), 500);
  }, 1500);
}
