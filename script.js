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
});window.addEventListener("load", () => {
    const frames = document.querySelectorAll('.zunda-frame');
    let currentIndex = 0;
    const intervalTime = 300; // 0.3秒間隔（パラパラ感を出すため少し速めに設定）
    let timer = null;

    const startAnimation = () => {
        if (timer) return; // 二重起動防止
        timer = setInterval(() => {
            // 全フレームを一旦消す
            frames.forEach(f => f.setAttribute('visible', false));
            
            // 現在のフレームだけ表示
            frames[currentIndex].setAttribute('visible', true);
            
            // 次のフレームへ
            currentIndex = (currentIndex + 1) % frames.length;
        }, intervalTime);
    };

    const stopAnimation = () => {
        clearInterval(timer);
        timer = null;
    };

    // マーカー検知イベントの登録
    const targetEl = document.querySelector('#zunda-target');
    
    // 認識したときだけアニメーション開始
    targetEl.addEventListener("targetFound", () => {
        console.log("Found!");
        startAnimation();
    });

    // 認識が外れたら停止
    targetEl.addEventListener("targetLost", () => {
        console.log("Lost!");
        stopAnimation();
    });
});