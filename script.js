window.addEventListener("load", () => {// DOMが完全に読み込まれた後に実行
    const sceneEl = document.querySelector('a-scene');
    const audio = document.querySelector('#zunda-audio');
    const startScreen = document.querySelector('#start-screen');
    const startButton = document.querySelector('#start-button');
    const targetEl = document.querySelector('#zunda-target');
    const particleContainer = document.querySelector('#particle-container');
    
    let timer = null;// アニメーションのタイマー
    let isScannerActive = false; // スキャナーがアクティブかどうかのフラグ
    const intervalTime = 300; // アニメーションの切り替え間隔（ミリ秒）

    const createParticles = () => {// パーティクルを生成する関数
        particleContainer.innerHTML = ''; // 既存のパーティクルをクリア
        const count = 15; // パーティクルの数

        for (let i = 0; i < count; i++) {// パーティクルを生成して配置
            const p = document.createElement('a-image');// a-image要素を作成
            p.setAttribute('src', '#particle-img');// パーティクルの画像を設定
            p.setAttribute('width', '0.12');// パーティクルの幅を設定
            p.setAttribute('height', '0.12');// パーティクルの高さを設定
            
            // チラつき防止：奥行き判定をオフにする
            p.setAttribute('material', 'transparent: true; alphaTest: 0.05; depthTest: false;');
            
            const angle = (i / count) * Math.PI * 2;// パーティクルの角度を計算
            const distance = 0.8; // パーティクルの距離を設定
            
            p.setAttribute('position', '0 0 0');// パーティクルの初期位置を設定

            p.setAttribute('animation__move', {// パーティクルの移動アニメーションを設定
                property: 'position',// アニメーションさせるプロパティ
                to: `${Math.cos(angle) * distance} ${Math.sin(angle) * distance} 0`,
                dur: 4000,
                easing: 'easeOutQuad',
                loop: true
            });

            p.setAttribute('animation__fade', {// パーティクルのフェードアウトアニメーションを設定
                property: 'material.opacity',
                from: 1,
                to: 0,
                dur: 4000,
                easing: 'linear',
                loop: true
            });

            particleContainer.appendChild(p);// パーティクルをコンテナに追加
        }
    };

    startButton.addEventListener('click', () => {// スタートボタンがクリックされたときの処理
        isScannerActive = true; // スキャナーをアクティブにする
        document.body.classList.add('ar-active');// ARモードのクラスを追加
        
        audio.play().then(() => {// 音声の再生が成功した場合の処理
            audio.pause();// 音声を一時停止して、再生位置をリセット
            audio.currentTime = 0;// 音声の再生位置をリセット
        }).catch(e => console.log(e));// 音声の再生に失敗した場合のエラーハンドリング

        startScreen.style.display = 'none';// スタート画面を非表示にする
        window.dispatchEvent(new Event('resize'));// ウィンドウのリサイズイベントを発火して、ARシーンのサイズを更新
    });

    targetEl.addEventListener("targetFound", () => {// ターゲットが見つかったときの処理
        if (!isScannerActive) return;// スキャナーがアクティブでない場合は処理を行わない

        document.body.classList.add('target-found');// ターゲットが見つかったクラスを追加
        createParticles();// パーティクルを生成して表示

        const frames = document.querySelectorAll('.zunda-frame');// アニメーション開始
        let currentIndex = 0;// アニメーションの現在のフレームインデックス
        if (timer) clearInterval(timer);// 既存のタイマーがあればクリア
        timer = setInterval(() => {// アニメーションのフレームを切り替えるタイマー
            for (let i = 0; i < frames.length; i++) {// フレームの表示を切り替える
                frames[i].setAttribute('visible', i === currentIndex ? 'true' : 'false');
            }
            currentIndex = (currentIndex + 1) % frames.length;// インデックスを次に進める（ループさせる）
        }, intervalTime);// タイマーの間隔を設定

        if (audio) {// 音声が存在する場合は再生
            audio.currentTime = 0;// 音声の再生位置をリセット
            audio.play().catch(e => console.log(e));// 音声の再生に失敗した場合のエラーハンドリング
        }
    });

    targetEl.addEventListener("targetLost", () => {// ターゲットが見失われたときの処理
        document.body.classList.remove('target-found');// ターゲットが見つかったクラスを削除
        particleContainer.innerHTML = ''; // パーティクルをクリア

        if (timer) {// タイマーが存在する場合はクリア
            clearInterval(timer);
            timer = null;
        }
        const frames = document.querySelectorAll('.zunda-frame');// アニメーションのフレームをすべて非表示にする
        frames.forEach(f => f.setAttribute('visible', 'false'));// フレームをすべて非表示にする
        if (audio) audio.pause();// 音声を停止する
    });
});