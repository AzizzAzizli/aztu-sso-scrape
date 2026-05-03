
function formatDuration(ms) {
    const totalSeconds = ms / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toFixed(1); 

    if (minutes > 0) {
        return `${minutes}d ${seconds}s`; 
    }
    return `${seconds} saniyə`;
}

module.exports = { formatDuration };