window.addEventListener("load", () => {
    const sceneEl = document.querySelector('a-scene');
    const audio = document.querySelector('#zunda-audio');
    const startScreen = document.querySelector('#start-screen');
    const startButton = document.querySelector('#start-button');
    const targetEl = document.querySelector('#zunda-target');
    const particleContainer = document.querySelector('#particle-container');
    
    let timer = null;
    let isScannerActive = false; 
    const intervalTime = 300; 

    // パーティクル生成関数（放射状・ゆっくり）
    const createParticles = () => {
        particleContainer.innerHTML = ''; // リセット
        const count = 15; // パーティクルの数

        for (let i = 0; i < count; i++) {
            const p = document.createElement('a-image');
            p.setAttribute('src', '#particle-img');
            p.setAttribute('width', '0.12');
            p.setAttribute('height', '0.12');
            
            // 角度を計算（360度を等分）
            const angle = (i / count) * Math.PI * 2;
            const distance = 0.8; // 広がる距離
            
            // 中心位置
            p.setAttribute('position', '0 0 0.1');

            // 放射状にゆっくり広がるアニメーション
            p.setAttribute('animation__move', {
                property: 'position',
                to: `${Math.cos(angle) * distance} ${Math.sin(angle) * distance} 0.1`,
                dur: 4000, // 4秒かけてゆっくり移動
                easing: 'easeOutQuad',
                loop: true
            });

            // ゆっくり消えていくアニメーション
            p.setAttribute('animation__fade', {
                property: 'material.opacity',
                from: 1,
                to: 0,
                dur: 4000, // 移動と同じ時間で消える
                easing: 'linear',
                loop: true
            });

            particleContainer.appendChild(p);
        }
    };

    startButton.addEventListener('click', () => {
        isScannerActive = true; 
        document.body.classList.add('ar-active');
        
        audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
        }).catch(e => console.log(e));

        startScreen.style.display = 'none';
        window.dispatchEvent(new Event('resize'));
    });

    targetEl.addEventListener("targetFound", () => {
        if (!isScannerActive) return;

        document.body.classList.add('target-found');
        createParticles(); // 放射状パーティクル開始

        const frames = document.querySelectorAll('.zunda-frame');
        let currentIndex = 0;
        if (timer) clearInterval(timer);
        timer = setInterval(() => {
            for (let i = 0; i < frames.length; i++) {
                frames[i].setAttribute('visible', i === currentIndex ? 'true' : 'false');
            }
            currentIndex = (currentIndex + 1) % frames.length;
        }, intervalTime);

        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log(e));
        }
    });

    targetEl.addEventListener("targetLost", () => {
        document.body.classList.remove('target-found');
        particleContainer.innerHTML = ''; // パーティクル消去

        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        const frames = document.querySelectorAll('.zunda-frame');
        frames.forEach(f => f.setAttribute('visible', 'false'));
        if (audio) audio.pause();
    });
});