/* Media gallery: filters, search, shared lightbox with prev/next */
(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  var modalEl = document.getElementById('galleryModal');
  if (!items.length || !modalEl) return;

  var chips = document.querySelectorAll('.chip');
  var search = document.getElementById('gallerySearch');
  var statusEl = document.getElementById('galleryStatus');
  var emptyEl = document.getElementById('galleryEmpty');
  var labels = { deployed: 'Deployed', development: 'In Development', local: 'Local Project' };
  var filter = 'all', query = '', current = 0;
  var modal = new bootstrap.Modal(modalEl);

  function visible() {
    return items.filter(function (el) { return !el.closest('.gallery-col').classList.contains('d-none'); });
  }

  function apply() {
    var shown = 0;
    items.forEach(function (el) {
      var hay = (el.dataset.title + ' ' + el.dataset.meta + ' ' + el.dataset.desc).toLowerCase();
      var ok = (filter === 'all' || el.dataset.category === filter) && (!query || hay.indexOf(query) !== -1);
      el.closest('.gallery-col').classList.toggle('d-none', !ok);
      if (ok) shown++;
    });
    emptyEl.classList.toggle('d-none', shown > 0);
    statusEl.textContent = 'Showing ' + shown + ' of ' + items.length + ' projects';
  }

  chips.forEach(function (chip) {
    var f = chip.dataset.filter;
    chip.querySelector('.chip-count').textContent =
      f === 'all' ? items.length : items.filter(function (i) { return i.dataset.category === f; }).length;
    chip.addEventListener('click', function () {
      filter = f;
      chips.forEach(function (c) { c.classList.toggle('active', c === chip); });
      apply();
    });
  });

  search.addEventListener('input', function () { query = search.value.trim().toLowerCase(); apply(); });

  function show(i) {
    var list = visible();
    if (!list.length) return;
    current = (i + list.length) % list.length;
    var d = list[current].dataset;
    var img = document.getElementById('lbImage');
    img.classList.add('lb-loading');
    img.onload = function () { img.classList.remove('lb-loading'); };
    img.src = d.full; img.alt = d.title;
    document.getElementById('lbTitle').textContent = d.title;
    document.getElementById('lbMeta').textContent = d.meta;
    document.getElementById('lbDesc').textContent = d.desc;
    document.getElementById('lbCounter').textContent = (current + 1) + ' / ' + list.length;
    var st = document.getElementById('lbStatus');
    st.textContent = labels[d.category]; st.className = 'status-pill static ' + d.category;
    var link = document.getElementById('lbLink');
    link.classList.toggle('d-none', !d.link);
    if (d.link) link.href = d.link;
    document.querySelectorAll('.lb-nav').forEach(function (b) { b.classList.toggle('d-none', list.length < 2); });
  }

  items.forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      show(visible().indexOf(el));
      modal.show();
    });
  });

  document.getElementById('lbPrev').addEventListener('click', function () { show(current - 1); });
  document.getElementById('lbNext').addEventListener('click', function () { show(current + 1); });

  document.addEventListener('keydown', function (e) {
    if (!modalEl.classList.contains('show')) return;
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  var x0 = null;
  modalEl.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  modalEl.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    x0 = null;
  }, { passive: true });

  apply();
})();