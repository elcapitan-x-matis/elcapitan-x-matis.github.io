document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('galleryGrid');
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  const chips = document.querySelectorAll('.chip');
  const searchInput = document.getElementById('gallerySearch');
  const statusText = document.getElementById('galleryStatus');
  const emptyState = document.getElementById('galleryEmpty');
  
  // Modal Elements
  const modalElement = document.getElementById('galleryModal');
  const modal = new bootstrap.Modal(modalElement);
  const lbImage = document.getElementById('lbImage');
  const lbTitle = document.getElementById('lbTitle');
  const lbMeta = document.getElementById('lbMeta');
  const lbDesc = document.getElementById('lbDesc');
  const lbLink = document.getElementById('lbLink');
  const lbStatus = document.getElementById('lbStatus');
  const lbCounterPill = document.getElementById('lbCounterPill');
  const btnPrev = document.getElementById('lbPrev');
  const btnNext = document.getElementById('lbNext');

  let currentFilter = 'all';
  let currentSearch = '';
  let currentImageIndex = 0;
  let activeImages = [];

  // --- FILTER LOGIC ---
  function applyFilters() {
    let visibleCount = 0;

    items.forEach(item => {
      const category = item.dataset.category;
      const title = item.dataset.title.toLowerCase();
      const meta = item.dataset.meta.toLowerCase();
      const desc = item.dataset.desc.toLowerCase();
      
      const matchesFilter = (currentFilter === 'all' || category === currentFilter);
      const matchesSearch = (title.includes(currentSearch) || meta.includes(currentSearch) || desc.includes(currentSearch));

      if (matchesFilter && matchesSearch) {
        item.parentElement.style.display = 'block';
        visibleCount++;
      } else {
        item.parentElement.style.display = 'none';
      }
    });

    // Update Status & Empty State
    statusText.textContent = `Showing ${visibleCount} project${visibleCount !== 1 ? 's' : ''}`;
    if (visibleCount === 0) {
      emptyState.classList.remove('d-none');
    } else {
      emptyState.classList.add('d-none');
    }
  }

  // Filter Chips Click
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.dataset.filter;
      applyFilters();
    });
  });

  // Search Input
  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value.toLowerCase().trim();
    applyFilters();
  });

  // Calculate counts for chips on load
  const counts = { all: items.length, deployed: 0, development: 0, local: 0 };
  items.forEach(item => counts[item.dataset.category]++);
  chips.forEach(chip => {
    const filter = chip.dataset.filter;
    const countSpan = chip.querySelector('.chip-count');
    if (countSpan) countSpan.textContent = `(${counts[filter]})`;
  });

  // Initial filter
  applyFilters();

  // --- CAROUSEL / MODAL LOGIC ---
  
  function updateCarousel() {
    if (activeImages.length === 0) return;
    
    // Set Image
    lbImage.src = activeImages[currentImageIndex];
    
    // Update Counter
    lbCounterPill.textContent = `${currentImageIndex + 1} / ${activeImages.length}`;

    // Hide/Show navigation arrows based on image count
    if (activeImages.length <= 1) {
      btnPrev.style.display = 'none';
      btnNext.style.display = 'none';
    } else {
      btnPrev.style.display = 'flex';
      btnNext.style.display = 'flex';
    }

    // Reset loading state
    lbImage.style.opacity = 0.5;
    lbImage.onload = () => { lbImage.style.opacity = 1; };
  }

  // Attach click event to all gallery items
  items.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Extract Data
      const title = item.dataset.title;
      const meta = item.dataset.meta;
      const desc = item.dataset.desc;
      const link = item.dataset.link;
      const category = item.dataset.category;
      const imagesStr = item.dataset.images;
      
      // Parse Images (comma separated)
      activeImages = imagesStr.split(',').map(s => s.trim());
      currentImageIndex = 0;

      // Populate Text Content
      lbTitle.textContent = title;
      lbMeta.textContent = meta;
      lbDesc.textContent = desc;
      
      // Handle Live Link
      if (link) {
        lbLink.href = link;
        lbLink.classList.remove('d-none');
      } else {
        lbLink.classList.add('d-none');
      }

      // Handle Status Pill formatting
      lbStatus.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      lbStatus.className = `status-pill ${category} static`;

      // Load first image and open modal
      updateCarousel();
      modal.show();
    });
  });

  // Carousel Controls
  btnPrev.addEventListener('click', () => {
    if (activeImages.length <= 1) return;
    currentImageIndex = (currentImageIndex - 1 + activeImages.length) % activeImages.length;
    updateCarousel();
  });

  btnNext.addEventListener('click', () => {
    if (activeImages.length <= 1) return;
    currentImageIndex = (currentImageIndex + 1) % activeImages.length;
    updateCarousel();
  });

  // Keyboard Navigation (Left / Right Arrows)
  document.addEventListener('keydown', (e) => {
    if (!modalElement.classList.contains('show')) return;
    
    if (e.key === 'ArrowLeft') btnPrev.click();
    if (e.key === 'ArrowRight') btnNext.click();
  });
});