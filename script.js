window.addEventListener("load", () => {
    const sceneEl = document.querySelector('a-scene');
    const audio = document.querySelector('#zunda-audio');
    const startScreen = document.querySelector('#start-screen');
    const startButton = document.querySelector('#start-button');
    const targetEl = document.querySelector('#zunda-target');
    
    let timer = null;
    const intervalTime = 300; 

    // ボタン押下時の処理
    startButton.addEventListener('click', () => {
        // システムを明示的に開始
        const arSystem = sceneEl.systems['mindar-image-system'];
        if (arSystem) {
            arSystem.start(); 
        }

        // CSSでの表示を切り替え
        document.body.classList.add('ar-active');
        
        // 音声の初期化（ブラウザ制限解除）
        audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
        }).catch(e => console.log("Audio init failed:", e));

        // 初期画面を消去
        startScreen.style.display = 'none';

        // 描画領域を強制リサイズ
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 100);
    });

    // ターゲット発見
    targetEl.addEventListener("targetFound", () => {
        document.body.classList.add('target-found');
        
        const frames = document.querySelectorAll('.zunda-frame');
        let currentIndex = 0;

        if (timer) clearInterval(timer);
        
        timer = setInterval(() => {
            for (let i = 0; i < frames.length; i++) {
                if (i === currentIndex) {
                    frames[i].setAttribute('visible', 'true');
                } else {
                    frames[i].setAttribute('visible', 'false');
                }
            }
            currentIndex = (currentIndex + 1) % frames.length;
        }, intervalTime);

        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log("Play error:", e));
        }
    });

    // ターゲット紛失
    targetEl.addEventListener("targetLost", () => {
        document.body.classList.remove('target-found');
        
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        
        const frames = document.querySelectorAll('.zunda-frame');
        frames.forEach(f => f.setAttribute('visible', 'false'));
        
        if (audio) audio.pause();
    });
});