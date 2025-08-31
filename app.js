// Simple client-side booking manager using localStorage
const cinemaEl = document.getElementById('cinema');
const timeEl = document.getElementById('time');
const seatsEl = document.getElementById('seats');
const bookBtn = document.getElementById('bookBtn');
const message = document.getElementById('message');
const bookingsList = document.getElementById('bookingsList');
const ticketModal = document.getElementById('ticketModal');
const ticketText = document.getElementById('ticketText');
const downloadBtn = document.getElementById('downloadTicket');
const closeModal = document.getElementById('closeModal');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

function loadBookings(){
  const raw = localStorage.getItem('bookings')||'[]';
  return JSON.parse(raw);
}

function saveBookings(arr){
  localStorage.setItem('bookings', JSON.stringify(arr));
}

function renderBookings(){
  const arr = loadBookings();
  bookingsList.innerHTML='';
  if(arr.length===0){ bookingsList.innerHTML='<li>No bookings yet</li>'; return; }
  arr.forEach((b,i)=>{
    const li = document.createElement('li');
    li.innerHTML = `<span>${b.cinema} • ${b.time} • ${b.seats} seat(s)</span>
    <span><button onclick="removeBooking(${i})">Cancel</button></span>`;
    bookingsList.appendChild(li);
  });
}

function removeBooking(i){
  const arr = loadBookings();
  arr.splice(i,1);
  saveBookings(arr);
  renderBookings();
  message.innerText = 'Booking cancelled';
  setTimeout(()=>message.innerText='',2000);
}

bookBtn.addEventListener('click', ()=>{
  const cinema = cinemaEl.value;
  const time = timeEl.value;
  const seats = seatsEl.value;
  if(!cinema || !time){ message.innerText='Choose cinema and time'; return; }
  const b = {cinema,time,seats,ts:new Date().toISOString()};
  const arr = loadBookings();
  arr.push(b);
  saveBookings(arr);
  renderBookings();
  message.innerText = 'Booking successful!';
  ticketText.innerText = `Cinema: ${cinema}\nTime: ${time}\nSeats: ${seats}\nBooked at: ${new Date(b.ts).toLocaleString()}`;
  ticketModal.setAttribute('aria-hidden','false');
  setTimeout(()=>message.innerText='',2000);
});

downloadBtn.addEventListener('click', ()=>{
  const text = ticketText.innerText;
  const blob = new Blob([text], {type: 'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ticket.txt';
  a.click();
  URL.revokeObjectURL(url);
});

closeModal.addEventListener('click', ()=>{
  ticketModal.setAttribute('aria-hidden','true');
});

// gallery cards linking
document.querySelectorAll('.card').forEach(c=>{
  c.addEventListener('click', ()=>{
    const l = c.getAttribute('data-link');
    window.open(l,'_blank');
  });
});

// search - just focuses selects/options for demo
searchBtn.addEventListener('click', ()=>{
  const q = searchInput.value.trim().toLowerCase();
  if(!q){ message.innerText='Type to search'; setTimeout(()=>message.innerText='',1500); return; }
  // naive match demo: if query matches a cinema name, set select
  const options = Array.from(cinemaEl.options).map(o=>o.text.toLowerCase());
  const idx = options.findIndex(t=>t.includes(q));
  if(idx>=0){ cinemaEl.selectedIndex = idx; message.innerText='Matched cinema'; setTimeout(()=>message.innerText='',1400); return; }
  message.innerText = 'No exact match (demo)'; setTimeout(()=>message.innerText='',1400);
});

// initial render
renderBookings();