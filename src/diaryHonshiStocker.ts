class diaryHonshiStocker {
	daysList: string[] = [];
	stock(daysList: string[]) {
		/*@ts-ignore*/
		daysList.map((day) => {
			this.daysList.push(day);
		});
	}
	get() {
		return this.daysList;
	}
}

export default diaryHonshiStocker;
