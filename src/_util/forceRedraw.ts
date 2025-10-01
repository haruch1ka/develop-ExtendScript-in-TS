const forceRedraw = () => {
  try {
    app.menuActions.itemByName("$ID/Force Redraw").invoke();
  } catch (e) {
    $.writeln(e);
  }
};

export default forceRedraw;
