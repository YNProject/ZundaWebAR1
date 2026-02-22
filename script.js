window.addEventListener("load", () => {
    const sceneEl = document.querySelector('a-scene');
    const audio = document.querySelector('#zunda-audio');
    const startScreen = document.querySelector('#start-screen');
    const startButton = document.querySelector('#start-button');
    const targetEl = document.querySelector('#zunda-target');
    
    // アニメーション用のタイマー変数（状態を維持）
    let timer = null;
    const intervalTime = 300; 

    // ★今回の修正点：起動時は何もしない（autoStart: false と連動）

    // ボタン押下時の処理
    startButton.addEventListener('click', () => {
        // ★今回の修正点：ここをクリックした時だけシステムを開始する
        const arSystem = sceneEl.systems['mindar-image-system'];
        arSystem.start(); 

        document.body.classList.add('ar-active');
        
        audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
        }).catch(e => console.log(e));

        startScreen.style.display = 'none';

        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 100);
    });

    // ターゲット発見（以前「表示されない」問題を解決した時のロジックそのまま）
    targetEl.addEventListener("targetFound", () => {
        document.body.classList.add('target-found');
        
        // フレームはその都度最新の状態で取得
        const frames = document.querySelectorAll('.zunda-frame');
        let currentIndex = 0;

        if (timer) clearInterval(timer);
        
        timer = setInterval(() => {
            // A-Frameの visible 属性を 'true'/'false' で確実に切り替える
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
            audio.play().catch(e => console.log(e));
        }
    });

    // ターゲット紛失（以前の状態を維持）
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