/**
 * @param {SVGElement} svgEl
 * @returns {{windowId:?number,side:?string}}
 */
export function getShutterData(svgEl) {
    const matches = svgEl.id.match(/window-(\d+)-(\w)/);
    if (matches?.length === 3) {
        return {
            windowId: +matches[1],
            side: matches[2],
        };
    }
    return { windowId: null, side: null };
}
