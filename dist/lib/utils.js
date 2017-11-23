export const diffDays = (a, b) => {
	const MS_PER_DAY = 1000 * 60 * 60 * 24;
	// Discard the time and time-zone information.
	let utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate()),
		utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  	return Math.floor((utc2 - utc1) / MS_PER_DAY);
};