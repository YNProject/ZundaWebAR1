document.addEventListener("DOMContentLoaded", () => {
    const targetImg = document.querySelector('#zunda-display');
    let currentIndex = 0;
    const maxIndex = 8;
    const intervalTime = 1000; // 1秒ごとに切り替え

    // スライドショーの実行
    setInterval(() => {
        currentIndex++;
        if (currentIndex > maxIndex) {
            currentIndex = 0;
        }
        
        // id="zunda0" などの ID を src にセット
        const nextSrc = `#zunda${currentIndex}`;
        targetImg.setAttribute('src', nextSrc);
        
        console.log("Current image:", nextSrc);
    }, intervalTime);

    // ターゲット検知の確認ログ
    const targetEl = document.querySelector('#zunda-target');
    targetEl.addEventListener("targetFound", () => {
        console.log("マーカーを検知したのだ！");
    });
});