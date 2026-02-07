import "@testing-library/jest-dom";

if (!globalThis.matchMedia) {
	globalThis.matchMedia = (query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: () => {},
		removeListener: () => {},
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => false,
	});
}

if (!globalThis.IntersectionObserver) {
	class IntersectionObserverStub implements IntersectionObserver {
		readonly root = null;
		readonly rootMargin = "0px";
		readonly thresholds = [0];
		constructor(_callback: IntersectionObserverCallback) {}
		observe() {}
		unobserve() {}
		disconnect() {}
		takeRecords(): IntersectionObserverEntry[] {
			return [];
		}
	}

	globalThis.IntersectionObserver = IntersectionObserverStub;
}
