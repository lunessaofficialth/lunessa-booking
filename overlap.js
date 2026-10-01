function overlaps(start, hours, booking) {
  return start < booking.start + booking.hours && start + hours > booking.start;
}
function draw() {
  const t = T();
  const date = document.getElementById('date').value;
  const box = document.getElementById('slots');
  const note = document.getElementById('dayNote');
  const need = plan().h;
  box.innerHTML = '';
  note.textContent = '';
  if (CLOSED.includes(date)) {
    note.textContent = t.closed;
    chosen = '';
    return;
  }
  const last = need <= 2 ? 19 : need === 3 ? 18 : 17;
  const busy = TAKEN.filter(function (x) { return x.date === date; });
  if (busy.length) {
    note.textContent = t.busy + ' ' + busy.map(function (b) {
      return pad(b.start) + ':00-' + pad(b.start + b.hours) + ':00';
    }).join(', ');
  }
  ['10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'].forEach(function (time) {
    const s = +time.slice(0, 2);
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = time;
    b.disabled = s > last || past(s) || busy.some(function (x) { return overlaps(s, need, x); });
    b.className = chosen === time ? 'on' : '';
    b.onclick = function () { chosen = time; draw(); };
    box.appendChild(b);
  });
}
