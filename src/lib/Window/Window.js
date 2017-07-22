import '../../components/pw-exit-dialog/pw-exit-dialog';

const pwExitDialog = document.createElement('pw-save-dialog');

function removeCustomAlert() {
  document.getElementsByTagName('body')[0].removeChild(pwExitDialog);
}

function createCustomAlert(txt, next) {
  document.getElementsByTagName('body')[0].appendChild(pwExitDialog);
  pwExitDialog.title = 'Patchwork';
  pwExitDialog.message = txt;

  pwExitDialog.saveButton.get().addEventListener('click', () => {
    removeCustomAlert();
    next(true);
  }, false);

  pwExitDialog.dontSaveButton.get().addEventListener('click', () => {
    removeCustomAlert();
    next(false);
  }, false);
}

if (document.getElementById) {
  window.alert = function createAlert(txt, callback) {
    createCustomAlert(txt, callback);
  };
}

