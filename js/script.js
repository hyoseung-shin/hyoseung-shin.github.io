document.addEventListener('DOMContentLoaded', function () {
  var hamburger = document.getElementById('hamburger');
  var menu = document.getElementById('nav-menu');
  var closeBtn = document.getElementById('close-btn'); // 닫기 버튼 가져오기

  if (hamburger && menu) {
    hamburger.addEventListener('click', function () {
      menu.classList.toggle('show');
    });
  }

  if (closeBtn && menu) {
    closeBtn.addEventListener('click', function () {
      menu.classList.remove('show'); // 닫기 버튼 클릭 시 메뉴 닫기
    });
  }
});
