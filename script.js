window.onload = () => {
    const sceneEl = document.querySelector('a-scene');
    const targetEl = document.querySelector('[mindar-image-target]');

    // ターゲットが見つかったとき
    targetEl.addEventListener("targetFound", (event) => {
        console.log("ずんだもん、出現なのだ！");
    });

    // ターゲットを見失ったとき
    targetEl.addEventListener("targetLost", (event) => {
        console.log("どこへ行くのだ？");
    });

    // エラーハンドリング（ファイルパス間違いなどの確認用）
    sceneEl.addEventListener("arError", (event) => {
        console.error("ARの起動に失敗したのだ。パスやカメラ権限を確認するのだ。");
    });
};