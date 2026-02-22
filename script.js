window.addEventListener("load", () => {
    const sceneEl = document.querySelector('a-scene');
    const frames = document.querySelectorAll('.zunda-frame');
    const audio = document.querySelector('#zunda-audio');
    const startScreen = document.querySelector('#start-screen');
    const startButton = document.querySelector('#start-button');
    const targetEl = document.querySelector('#zunda-target');
    
    let currentIndex = 0;
    let timer = null;
    const intervalTime = 300;
    let isArEnabled = false; // ボタンを押すまで認識させないためのフラグ

    // 起動直後に認識を一時停止
    sceneEl.addEventListener("arReady", () => {
        sceneEl.systems['mindar-image-system'].pause(true); 
    });

    // 「開始なのだ！」ボタン
    startButton.addEventListener('click', () => {
        isArEnabled = true; // 認識を許可
        
        // システム再開
        sceneEl.systems['mindar-image-system'].unpause();
        
        // スキャンラインUIをここで表示させる設定に変更
        sceneEl.setAttribute('mindar-image', 'uiScanning: yes');

        // 音声の再生準備（iOS対策の空再生）
        audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
        }).catch(e => console.log(e));

        startScreen.style.display = 'none';
        window.dispatchEvent(new Event('resize'));
    });

    const startShow = () => {
        if (!isArEnabled) return; // ボタン押す前なら何もしない

        // アニメーション
        if (!timer) {
            timer = setInterval(() => {
                frames.forEach(f => f.setAttribute('visible', false));
                frames[currentIndex].setAttribute('visible', true);
                currentIndex = (currentIndex + 1) % frames.length;
            }, intervalTime);
        }
        
        // 音声再生
        audio.currentTime = 0;
        audio.play().catch(e => console.error("再生エラー:", e));
    };

    const stopShow = () => {
        // アニメーション停止
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        frames.forEach(f => f.setAttribute('visible', false));
        
        // 音声停止
        audio.pause();
        audio.currentTime = 0;
    };

    // イベント登録
    targetEl.addEventListener("targetFound", startShow);
    targetEl.addEventListener("targetLost", stopShow);
});