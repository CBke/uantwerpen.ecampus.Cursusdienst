const {RefreshComposite, CheckBox, ScrollView, TextView, ui} = require('tabris');

let refreshComposite = new RefreshComposite({
  left: 0, right: 0, top: 0, bottom: 0,
}).on('refresh', ({target}) => setTimeout(() => {
  target.refreshIndicator = false;
  textView.text = `last refresh: ${new Date()}\n${textView.text}`;

   let xhr = new window.XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === xhr.DONE) {
       textView.text = xhr.responseText
    }
  };
  xhr.open('GET', 'https://cursussen.uantwerpen.be/Home/Level');
  xhr.send();


}, 1000)).appendTo(ui.contentView);

let scrollView = new ScrollView({
  left: 0, right: 0, top: 0, bottom: 0,
}).appendTo(refreshComposite);

new TextView({
  left: 0, right: 0, top: 32,
  alignment: 'center',
  font: 'black 24px',
  text: 'pull to refresh'
}).appendTo(scrollView);

const textView = new TextView({
  left: 0, right: 0, top: 'prev() 32',
  alignment: 'center',
  lineSpacing: 1.4,
}).appendTo(scrollView);

new CheckBox({
  left: 16, right: 16, bottom: 16,
  text: 'Enable pull to refresh',
  checked: true
}).on('checkedChanged', ({value: checked}) => refreshComposite.refreshEnabled = checked)
  .appendTo(ui.contentView);
