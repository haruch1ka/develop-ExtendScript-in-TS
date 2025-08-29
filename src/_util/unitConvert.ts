export function parseMarginToPt(inputText: string): number | null {
	var marginValue = parseFloat(inputText);
	if (isNaN(marginValue) || marginValue < 0) {
		return null;
	}
	return marginValue * 2.83465; // mm → pt
}

export const Q_mm = (q: number): number => q * 0.25;
export const pt_mm = (pt: number): number => pt * 0.35278;
