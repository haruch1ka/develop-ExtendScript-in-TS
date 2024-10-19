import calendar from "./calendar";
import polyfill from "./polyfill/polyfill";
polyfill();
var cal = new calendar();
$.writeln(cal.isLeapYear(2025));
$.writeln(cal.getMonthDays(2025, 2));
