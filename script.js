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

    sceneEl.addEventListener("arReady", () => {
        sceneEl.systems['mindar-image-system'].pause(true); 
    });

    startButton.addEventListener('click', () => {
        document.body.classList.add('ar-active');
        sceneEl.systems['mindar-image-system'].unpause();
        
        audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
        }).catch(e => console.log(e));

        startScreen.style.display = 'none';

        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 100);
    });

    // ターゲット発見時の処理を確実に実行させる
    targetEl.addEventListener("targetFound", () => {
        document.body.classList.add('target-found');
        
        // 既存のタイマーがあれば一度クリア（重複防止）
        if (timer) clearInterval(timer);
        
        // インデックスをリセットして表示開始
        currentIndex = 0;
        timer = setInterval(() => {
            // 全てのフレームを一旦非表示にする
            frames.forEach(f => f.setAttribute('visible', false));
            // 現在のインデックスのフレームだけを表示する
            if (frames[currentIndex]) {
                frames[currentIndex].setAttribute('visible', true);
            }
            currentIndex = (currentIndex + 1) % frames.length;
        }, intervalTime);

        // 音声再生
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log("Audio play failed:", e));
        }
    });

    targetEl.addEventListener("targetLost", () => {
        document.body.classList.remove('target-found');
        
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        // 全て隠す
        frames.forEach(f => f.setAttribute('visible', false));
        if (audio) audio.pause();
    });
});