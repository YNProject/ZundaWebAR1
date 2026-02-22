window.addEventListener("load", () => {
    const frames = document.querySelectorAll('.zunda-frame');
    let currentIndex = 0;
    const intervalTime = 1000; 
    let timer = null;

    const startAnimation = () => {
        if (timer) return;
        timer = setInterval(() => {
            frames.forEach(f => f.setAttribute('visible', false));
            frames[currentIndex].setAttribute('visible', true);
            currentIndex = (currentIndex + 1) % frames.length;
        }, intervalTime);
    };

    const stopAnimation = () => {
        clearInterval(timer);
        timer = null;
        // 停止時に全フレーム非表示（または0番目だけ表示など）にする
        frames.forEach(f => f.setAttribute('visible', false));
    };

    const targetEl = document.querySelector('#zunda-target');
    
    targetEl.addEventListener("targetFound", () => {
        startAnimation();
    });

    targetEl.addEventListener("targetLost", () => {
        stopAnimation();
    });
});