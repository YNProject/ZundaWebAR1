window.onload = () => {
    const targetImg = document.querySelector('#target-img');
    let currentIndex = 0;
    const maxIndex = 8; // 0000〜0008 なので最大は8
    const intervalTime = 1000; // 切り替え速度（ミリ秒）。1000 = 1秒

    // スライドショーの関数
    const startSlideshow = () => {
        setInterval(() => {
            currentIndex++;
            if (currentIndex > maxIndex) {
                currentIndex = 0; // 最後までいったら最初に戻る
            }
            // a-imageのsrc属性を更新（#zunda0, #zunda1...）
            targetImg.setAttribute('src', `#zunda${currentIndex}`);
        }, intervalTime);
    };

    // 実行
    startSlideshow();

    // デバッグ用ログ
    const targetEl = document.querySelector('[mindar-image-target]');
    targetEl.addEventListener("targetFound", () => console.log("出現なのだ！"));
};