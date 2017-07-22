const ALERT_TITLE = 'Oops!';
const ALERT_BUTTON_SAVE = 'Save';
const ALERT_BUTTON_NOT_SAVE = 'Dont save';

function removeCustomAlert() {
  document.getElementsByTagName('body')[0].removeChild(document.getElementById('modalContainer'));
}

function createCustomAlert(txt, next) {
  const d = document;

  if (d.getElementById('modalContainer')) return;

  const mObj = d.getElementsByTagName('body')[0].appendChild(d.createElement('div'));
  mObj.id = 'modalContainer';
  mObj.style = `  background-color:rgba(0, 0, 0, 0.3);
                  position:absolute;
                  top:0;
                  width:100%;
                  height:100%;
                  left:0px;
                  z-index:10000;
                  background-image:url(tp.png); /* required by MSIE to prevent actions on lower z-index elements */
                  height: ${d.documentElement.scrollHeight}px;`;

  const alertObj = mObj.appendChild(d.createElement('div'));
  alertObj.id = 'alertBox';
  if (d.all && !window.opera) {
    alertObj.style.top = `${document.documentElement.scrollTop}px`;
  }
  alertObj.style = `position:relative;
                    width:33%;
                    min-height:100px;
                    max-height:400px;
                    margin-top:50px;
                    border:1px solid #fff;
                    background-color:#fff;
                    background-repeat:no-repeat;
                    top:30%;`;
  alertObj.style.left = `${(d.documentElement.scrollWidth - alertObj.offsetWidth) / 2}px`;
  alertObj.style.visiblity = 'visible';

  const h1 = alertObj.appendChild(d.createElement('h1'));
  h1.appendChild(d.createTextNode(ALERT_TITLE));
  h1.style = `margin:0;
              font:bold 1em Raleway,arial;
              background-color:#f97352;
              color:#FFF;
              border-bottom:1px solid #f97352;
              padding:10px 0 10px 5px;`;

  const msg = alertObj.appendChild(d.createElement('p'));
  msg.innerHTML = txt;
  msg.style = `height:50px;
               padding-left:5px;
               padding-top:30px;
               text-align:center;
               vertical-align:middle; `;

  const btn1 = alertObj.appendChild(d.createElement('a'));
  btn1.appendChild(d.createTextNode(ALERT_BUTTON_NOT_SAVE));
  btn1.href = '#';
  btn1.focus();
  btn1.onclick = function click() {
    removeCustomAlert();
    next(false);
  };
  btn1.style = `display:inline-block;
               position:relative;
               margin:10px auto 10px auto;
               padding:7px;
               border:0 none;
               width:70px;
               text-transform:uppercase;
               text-align:center;
               color:#FFF;
               background-color:#f97352;
               border-radius: 0px;
               text-decoration:none;
               outline:0!important;`;

  const btn2 = alertObj.appendChild(d.createElement('a'));
  btn2.appendChild(d.createTextNode(ALERT_BUTTON_SAVE));
  btn2.href = '#';
  btn2.focus();
  btn2.onclick = function click() {
    removeCustomAlert();
    next(true);
  };
  btn2.style = `display:inline-block;
               position:relative;
               margin:10px auto 10px auto;
               padding:7px;
               border:0 none;
               width:70px;
               text-transform:uppercase;
               text-align:center;
               color:#FFF;
               background-color:#f97352;
               border-radius: 0px;
               text-decoration:none;
               outline:0!important;`;

  alertObj.style.display = 'block';
}

if (document.getElementById) {
  window.alert = function createAlert(txt, callback) {
    createCustomAlert(txt, callback);
  };
}

