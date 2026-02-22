window.addEventListener("load", () => {
    const frames = document.querySelectorAll('.zunda-frame');
    const audio = document.querySelector('#zunda-audio');
    const startScreen = document.querySelector('#start-screen');
    const startButton = document.querySelector('#start-button');
    
    let currentIndex = 0;
    const intervalTime = 300; 
    let timer = null;

    // ボタンをクリックした時に音声をアクティブにする
    startButton.addEventListener('click', () => {
        startScreen.style.display = 'none';
        // ブラウザの音声ロックを解除
        audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
        });
    });

    const startShow = () => {
        if (!timer) {
            timer = setInterval(() => {
                frames.forEach(f => f.setAttribute('visible', false));
                frames[currentIndex].setAttribute('visible', true);
                currentIndex = (currentIndex + 1) % frames.length;
            }, intervalTime);
        }
        audio.currentTime = 0; // 最初から
        audio.play().catch(e => console.error("音声再生エラー:", e));
    };

    const stopShow = () => {
        clearInterval(timer);
        timer = null;
        frames.forEach(f => f.setAttribute('visible', false));
        audio.pause();
        audio.currentTime = 0;
    };

    const targetEl = document.querySelector('#zunda-target');
    
    targetEl.addEventListener("targetFound", startShow);
    targetEl.addEventListener("targetLost", stopShow);
});