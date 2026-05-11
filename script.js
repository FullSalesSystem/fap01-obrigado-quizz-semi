(function () {
  var TOTAL = 5;
  var current = 1;

  var progressBar   = document.getElementById('progress-bar');
  var stepLabel     = document.getElementById('step-label');
  var stepNum       = document.getElementById('step-num');
  var btnBack       = document.getElementById('btn-back');
  var btnConfirm    = document.getElementById('btn-confirm');
  var btnSubmit     = document.getElementById('btn-submit');
  var quizNav       = document.getElementById('quiz-nav');
  var successScreen = document.getElementById('success-screen');

  function showStep(num, back) {
    for (var i = 1; i <= TOTAL; i++) {
      var wrapper = document.getElementById('wrapper-' + i) || (i === 1 ? document.querySelector('.steps-wrapper') : null);
      var step    = document.getElementById('step-' + i);
      if (!wrapper || !step) continue;
      if (i === num) {
        wrapper.style.display = '';
        step.classList.add('active');
        step.classList.toggle('anim-back', !!back);
        void step.offsetWidth;
      } else {
        wrapper.style.display = 'none';
        step.classList.remove('active');
      }
    }
  }

  function updateUI() {
    stepLabel.textContent       = 'Pergunta ' + current + ' de ' + TOTAL;
    stepNum.textContent         = current;
    progressBar.style.width     = ((current / TOTAL) * 100) + '%';
    btnBack.classList.toggle('btn--hidden', current === 1);
    btnConfirm.classList.toggle('btn--hidden', current !== 2);
    btnSubmit.classList.add('btn--hidden');
  }

  function advance() {
    if (current < TOTAL) {
      current++;
      showStep(current, false);
      updateUI();
    } else {
      submitQuiz();
    }
  }

  function submitQuiz() {
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Enviando…';

    var q1 = document.querySelector('input[name="q1"]:checked');
    var q2 = Array.from(document.querySelectorAll('input[name="q2"]:checked')).map(function (cb) { return cb.value; });
    var q3 = document.querySelector('input[name="q3"]:checked');
    var q4 = document.querySelector('input[name="q4"]:checked');
    var q5 = document.querySelector('input[name="q5"]:checked');

    fetch('https://responsefss.fullsalessystem.com.br/webhook/DESENVRESPS', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q1: q1 ? q1.value : null,
        q2: q2,
        q3: q3 ? q3.value : null,
        q4: q4 ? q4.value : null,
        q5: q5 ? q5.value : null
      })
    }).finally(function () {
      var params = window.location.search;
      window.location.href = 'https://fap01-calendly-semi.fullsalessystem.com/' + (params || '');
    });
  }

  btnSubmit.addEventListener('click', submitQuiz);

  document.querySelectorAll('input[type="radio"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      document.querySelectorAll('input[name="' + radio.name + '"]').forEach(function (r) {
        r.closest('.option, .scale-option').classList.remove('selected');
      });
      radio.closest('.option, .scale-option').classList.add('selected');

      setTimeout(function () {
        if (current === TOTAL) {
          btnSubmit.classList.remove('btn--hidden');
        } else {
          advance();
        }
      }, 380);
    });
  });

  document.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
    cb.addEventListener('change', function () {
      if (cb.value === 'todos' && cb.checked) {
        document.querySelectorAll('input[name="q2"]').forEach(function (other) {
          if (other.value !== 'todos') {
            other.checked = false;
            other.closest('.option').classList.remove('selected');
          }
        });
      } else if (cb.value !== 'todos' && cb.checked) {
        var todos = document.getElementById('todos-acima');
        todos.checked = false;
        todos.closest('.option').classList.remove('selected');
      }
      cb.closest('.option').classList.toggle('selected', cb.checked);
    });
  });

  btnConfirm.addEventListener('click', function () {
    if (!document.querySelector('input[name="q2"]:checked')) {
      var card = document.getElementById('quiz-card');
      card.style.animation = 'none';
      void card.offsetWidth;
      card.style.animation = 'shake 0.4s ease';
      return;
    }
    advance();
  });

  btnBack.addEventListener('click', function () {
    if (current > 1) {
      current--;
      showStep(current, true);
      updateUI();
    }
  });

  var logo = document.querySelector('.navbar__logo');
  if (logo) {
    logo.addEventListener('error', function () {
      logo.style.display = 'none';
      if (logo.nextElementSibling) logo.nextElementSibling.style.display = 'inline';
    });
  }

  updateUI();
})();
