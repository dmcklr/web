// Global einstellbar (Sekunden):
window.EVENT_SWITCH_SECONDS = window.EVENT_SWITCH_SECONDS ?? 9;

let currentEventIndex = 0;
let slideshowTimerId = null;

const dom = {
    textBottom: null,
    image: null
};

function cacheDom() {
    if (!dom.textBottom) dom.textBottom = document.querySelector(".text-bottom-layers");
    if (!dom.image) dom.image = document.querySelector(".image");

    return Boolean(dom.textBottom && dom.image);
}

function getEventById(eventId) {
    return events.find(event => event.id === eventId);
}

function getAllEvents() {
    return events;
}

function getEventIndexById(eventId) {
    return events.findIndex(event => event.id === eventId);
}

function getSwitchIntervalMs() {
    const seconds = Number(window.EVENT_SWITCH_SECONDS);
    return Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : 5000;
}

function renderLayers(container, items, className, renderContent) {
    container.innerHTML = "";

    items.forEach((item, index) => {
        const layer = document.createElement("div");
        layer.className = className;
        layer.dataset.eventIndex = String(index);
        renderContent(layer, item);
        container.appendChild(layer);
    });
}

function setVisibleLayer(container, className, eventIndex) {
    const allLayers = container.querySelectorAll(`.${className}`);
    allLayers.forEach(layer => layer.classList.remove("is-visible"));

    const activeLayer = container.querySelector(`[data-event-index="${eventIndex}"]`);
    if (activeLayer) activeLayer.classList.add("is-visible");
}

function renderTextLayers() {
    if (!cacheDom()) {
        return;
    }

    renderLayers(dom.textBottom, events, "event-text-layer", (layer, event) => {
        const el1 = document.createElement("p");
        el1.className = "text1";
        el1.innerHTML = event.text1 ?? event.top1 ?? event.top ?? "";

        const el2 = document.createElement("p");
        el2.className = "text2";
        el2.innerHTML = event.text2 ?? event.tzop2 ?? event.top2 ?? "";

        layer.appendChild(el1);
        layer.appendChild(el2);
    });
}

function renderImageLayers() {
    if (!cacheDom()) {
        return;
    }

    dom.image.innerHTML = "";
    events.forEach((event, index) => {
        const imageLayer = document.createElement("img");
        imageLayer.className = "event-image-layer";
        imageLayer.dataset.eventIndex = String(index);
        imageLayer.src = "images/" + event.id + ".jpg";
        imageLayer.alt = event.id;
        dom.image.appendChild(imageLayer);
    });
}

function showTextLayer(eventIndex) {
    if (!cacheDom()) {
        return;
    }

    setVisibleLayer(dom.textBottom, "event-text-layer", eventIndex);
}

function showImageLayer(eventIndex) {
    if (!cacheDom()) {
        return;
    }

    setVisibleLayer(dom.image, "event-image-layer", eventIndex);
}

function showEventByIndex(eventIndex) {
    showTextLayer(eventIndex);
    showImageLayer(eventIndex);
    currentEventIndex = eventIndex;
}

function loadEvent(eventId) {
    const eventIndex = getEventIndexById(eventId);
    if (eventIndex < 0) {
        console.error("Event nicht gefunden:", eventId);
        return;
    }

    showEventByIndex(eventIndex);
}

function crossfadeToNextEvent() {
    if (!events.length) {
        return;
    }

    const nextIndex = (currentEventIndex + 1) % events.length;
    showEventByIndex(nextIndex);
}

function stopEventSlideshow() {
    if (!slideshowTimerId) {
        return;
    }

    window.clearInterval(slideshowTimerId);
    slideshowTimerId = null;
}

function startEventSlideshow(startEventId) {
    if (!events.length || !cacheDom()) {
        return;
    }

    stopEventSlideshow();
    renderTextLayers();
    renderImageLayers();

    const startIndex = startEventId ? getEventIndexById(startEventId) : 0;
    showEventByIndex(startIndex >= 0 ? startIndex : 0);

    slideshowTimerId = window.setInterval(crossfadeToNextEvent, getSwitchIntervalMs());
}

function setEventSwitchSeconds(seconds) {
    window.EVENT_SWITCH_SECONDS = Number(seconds);

    if (slideshowTimerId) {
        startEventSlideshow(events[currentEventIndex]?.id);
    }
}