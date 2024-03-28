/// <reference types="types-for-adobe/InDesign/2021" />

class Main {
  showBuildname() {
    let foo = "hogehoge";
    alert(`App version is ${foo}`);
  }
}

const main = new Main();
main.showBuildname();
