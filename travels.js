const galleryCards = Array.from(document.querySelectorAll(".travel-card"));
const albumSections = Array.from(document.querySelectorAll("[data-album-section]"));
const filterButtons = Array.from(document.querySelectorAll(".filter-button"));
const lightbox = document.querySelector("#travel-lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxKicker = document.querySelector("#lightbox-kicker");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxCaption = document.querySelector("#lightbox-caption");
const lightboxCount = document.querySelector("#lightbox-count");
const closeButton = document.querySelector(".lightbox-close");
const prevButton = document.querySelector(".lightbox-prev");
const nextButton = document.querySelector(".lightbox-next");

let activeFilter = "all";
let activeIndex = 0;
let lastFocusedElement = null;

function visibleCards() {
    return galleryCards.filter((card) => !card.hidden);
}

function cardDetails(card) {
    const image = card.querySelector("img");
    return {
        album: card.querySelector(".project-tag")?.textContent || "",
        alt: image?.alt || "",
        caption: card.querySelector("p")?.textContent || "",
        src: image?.getAttribute("src") || "",
        title: card.querySelector("h3")?.textContent || "Travel photo"
    };
}

function renderLightbox() {
    const cards = visibleCards();
    const card = cards[activeIndex];

    if (!card) {
        return;
    }

    const details = cardDetails(card);
    lightboxImage.src = details.src;
    lightboxImage.alt = details.alt;
    lightboxKicker.textContent = details.album;
    lightboxTitle.textContent = details.title;
    lightboxCaption.textContent = details.caption;
    lightboxCount.textContent = `${activeIndex + 1} / ${cards.length}`;
}

function openLightbox(card) {
    const cards = visibleCards();
    activeIndex = Math.max(0, cards.indexOf(card));
    lastFocusedElement = document.activeElement;
    renderLightbox();
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    closeButton.focus();
}

function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    lightboxImage.removeAttribute("src");

    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
}

function showNextPhoto(step) {
    const cards = visibleCards();
    if (!cards.length) {
        return;
    }

    activeIndex = (activeIndex + step + cards.length) % cards.length;
    renderLightbox();
}

function applyFilter(filter) {
    activeFilter = filter;

    albumSections.forEach((section) => {
        section.hidden = filter !== "all" && section.dataset.albumSection !== filter;
    });

    galleryCards.forEach((card) => {
        card.hidden = filter !== "all" && card.dataset.album !== filter;
    });

    filterButtons.forEach((button) => {
        const isActive = button.dataset.filter === filter;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
}

galleryCards.forEach((card) => {
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Open ${cardDetails(card).title} photo`);

    card.addEventListener("click", () => openLightbox(card));
    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openLightbox(card);
        }
    });
});

filterButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.classList.contains("active")));
    button.addEventListener("click", () => applyFilter(button.dataset.filter));
});

closeButton.addEventListener("click", closeLightbox);
prevButton.addEventListener("click", () => showNextPhoto(-1));
nextButton.addEventListener("click", () => showNextPhoto(1));

lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("open")) {
        return;
    }

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "ArrowLeft") {
        showNextPhoto(-1);
    }

    if (event.key === "ArrowRight") {
        showNextPhoto(1);
    }
});
