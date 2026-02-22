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

    // 起動時：カメラ映像は出すが、画像認識だけを一時停止
    sceneEl.addEventListener("arReady", () => {
        sceneEl.systems['mindar-image-system'].pause(true); 
    });

    // 「開始なのだ！」ボタン
    startButton.addEventListener('click', () => {
        // 1. 画像認識システムを再開（これで標準スキャンUIが動き出す）
        sceneEl.systems['mindar-image-system'].unpause();

        // 2. CSSで隠していた標準UIを表示可能にする
        document.body.classList.add('ar-active');

        // 3. 音声のブラウザロック解除
        audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
        }).catch(e => console.log("Audio Init Error:", e));

        // 4. 案内画面を消す
        startScreen.style.display = 'none';
        
        // レイアウト崩れ防止
        window.dispatchEvent(new Event('resize'));
    });

    // スキャン成功時の処理
    const startShow = () => {
        // アニメーション開始
        if (!timer) {
            timer = setInterval(() => {
                frames.forEach(f => f.setAttribute('visible', false));
                frames[currentIndex].setAttribute('visible', true);
                currentIndex = (currentIndex + 1) % frames.length;
            }, intervalTime);
        }
        
        // 音声再生
        audio.currentTime = 0;
        audio.play().catch(e => console.error("Audio Play Error:", e));
    };

    // スキャン中断時の処理
    const stopShow = () => {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        frames.forEach(f => f.setAttribute('visible', false));
        audio.pause();
        audio.currentTime = 0;
    };

    // Mind-ARのイベントをリッスン
    targetEl.addEventListener("targetFound", startShow);
    targetEl.addEventListener("targetLost", stopShow);
});