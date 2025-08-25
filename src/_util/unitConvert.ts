export function parseMarginToPt(inputText: string): number | null {
	var marginValue = parseFloat(inputText);
	if (isNaN(marginValue) || marginValue < 0) {
		return null;
	}
	return marginValue * 2.83465; // mm → pt
}
