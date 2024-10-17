/* __placeholder__ */
export default (await import('vue')).default.extend({
mounted() {
const btn1Toggles = document.querySelectorAll('.jsBtnToggle1');
btn1Toggles.forEach((btn1Toggle) => {
btn1Toggle.onclick = function () {
if (this.classList.contains('active')) {
this.classList.remove('active');
} else {
for (let i = 0; i < btn1Toggles.length; i++) {
btn1Toggles[i].classList.remove('active');
}
this.classList.add('active');
return false;
}
};
});

const tooltips2 = document.querySelectorAll('.tooltip2-wrap');
const tooltip2Btns = document.querySelectorAll('.jsTooltip2');
tooltip2Btns.forEach((tooltip2) => {
tooltip2.onclick = function () {
if (this.parentNode.classList.contains('active')) {
this.parentNode.classList.remove('active');
} else {
for (let i = 0; i < tooltips2.length; i++) {
tooltips2[i].parentNode.classList.remove('active');
}
this.parentNode.classList.add('active');
}
};
});

const tooltip2Closes = document.querySelectorAll('.jsTooltipClose2');
tooltip2Closes.forEach((tooltip2Close) => {
tooltip2Close.onclick = function () {
this.parentNode.parentNode.classList.remove('active');
};
});
},
data() {
return {
userGuideUrl: getLocal('userInfo').userGuideUrl,
};
},
});
