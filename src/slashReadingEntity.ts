class textFrames {
	textFrames: TextFrames;
	contentsLength: number;
	constructor(TextFrames: TextFrames) {
		this.textFrames = TextFrames;
		this.contentsLength = this.textFrames.length;
	}
	getStory(): Story {
		let story: Story;
		story = this.textFrames[0].parentStory;
		return story;
	}
}

export class slashReadingEntity {
	myNumberTextFrames: TextFrame[] = [];
	myTranslateTextFrames: TextFrame[] = [];
	constructor() {
		//アンカーオブジェクトを取得
		const _textFrames = new textFrames(<TextFrames>app.activeDocument.selection);
		const mystory: Story = _textFrames.getStory();

		const myAnchorItems: PageItem[] = [];
		for (let i = 0; i < mystory.pageItems.length; i++) {
			myAnchorItems.push(mystory.pageItems[i]);
		}
		$.writeln("myAnchorItems " + myAnchorItems.length);

		for (let i = 0; i < mystory.pageItems.length; i++) {
			let anchorItem = myAnchorItems[i];
			switch (anchorItem.getElements()[0].constructor.name) {
				case "TextFrame":
					const textFrame: TextFrame = anchorItem.getElements()[0] as TextFrame;
					// $.writeln("contents  " + textFrame.contents);
					const bounds = textFrame.geometricBounds;
					const width = (bounds[3] as number) - (bounds[1] as number);

					if (width < 5) {
						this.myNumberTextFrames.push(textFrame);
					} else {
						this.myTranslateTextFrames.push(textFrame);
					}
					break;
				case "Rectangle":
					const rectangle: Rectangle = anchorItem.getElements()[0] as Rectangle;
					// rectangle.remove();
					$.writeln("rectangle  " + rectangle);
					break;
				case "Group":
					const group: Group = anchorItem.getElements()[0] as Group;
					this.myNumberTextFrames.push(group.textFrames[0]);
					break;
				default:
					$.writeln(anchorItem.getElements()[0].constructor.name);
					break;
			}
		}
		$.writeln("--------------------");
	}
}
