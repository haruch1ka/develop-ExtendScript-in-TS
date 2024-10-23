class diaryPageStracture {
	pageNum: number;
	year: number;
	month: number;
	dayList: number[];
	rokuyouList: string[];
	constructor(pageNum: number, month: number, year: number, dayList: number[]) {
		this.pageNum = pageNum;
		this.month = month;
		this.year = year;
		this.dayList = dayList;
	}
}

class diaryPageEntity {
	pageNum: number;
	monthItems: pageItem[];
	monthTitleItem: pageItem;
	dayItems: pageItem[];
	weekItems: pageItem[];
	rokuyouItems: pageItem[];
	holidayItems: pageItem[];

	constructor(pageNum: number, month: number, year: number, dayList: number[]) {
		this.pageNum = pageNum;
		this.month = month;
		this.year = year;
		this.dayList = dayList;
	}
}
