function overlaps(start, hours, booking) {
  var end = start + hours;
  var busyEnd = booking.start + booking.hours;
  return start < busyEnd && end > booking.start;
}
function draw() {
  var t = T();
  var dateEl = document.getElementById('date');
  var box = document.getElementById('slots');
  var note = document.getElementById('dayNote');
  var need = plan().h;
  if (!dateEl || !box) return;
  box.innerHTML = '';
  if (note) note.textContent = '';
  if (CLOSED.includes(dateEl.value)) {
    if (note) note.textContent = t.closed;
    chosen = '';
    return;
  }
  var last = need <= 2 ? 19 : need === 3 ? 18 : 17;
  var busy = TAKEN.filter(function (x) { return x.date === dateEl.value; });
  if (note && busy.length) {
    note.textContent = t.busy + ' ' + busy.map(function (b) {
      return pad(b.start) + ':00-' + pad(b.start + b.hours) + ':00';
    }).join(', ');
  }
  ['10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'].forEach(function (time) {
    var s = +time.slice(0, 2);
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = time;
    b.disabled = s > last || past(s) || busy.some(function (x) { return overlaps(s, need, x); });
    b.className = chosen === time ? 'on' : '';
    b.onclick = function () { chosen = time; draw(); };
    box.appendChild(b);
  });
}
