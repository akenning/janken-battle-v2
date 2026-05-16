
// 👊✌️✋の変数設定
const hands = ['guu', 'choki', 'paa'];

// ライフ（♡）の変数設定
let playerLives = 3;
let cpuLives = 3;


// ライフUIを更新する関数
function updateLives() {

    // ハート1〜3を順に見て、ライフ数以内なら赤、超えたら灰色にする
    for (let i = 1; i <= 3; i++) {

        // もし現在のライフ数以内だったら何もしない（'lost'をつけない）
        if (i <= playerLives) {
            $('#player-heart-' + i).removeClass('lost');
        
        // それ以外だったら、そのライフ番号にクラス属性'lost'をつける 
        } else {
            $('#player-heart-' + i).addClass('lost');
        }

        // CPUも同様に処理
        if (i <= cpuLives) {
            $('#cpu-heart-' + i).removeClass('lost');
        } else {
            $('#cpu-heart-' + i).addClass('lost');
        }
    }
}


// じゃんけん勝敗を判定する関数
function getResult(player, cpu) {

    // PlayerとCPUの👊✌️✋が同じだったらあいこ
    if (player === cpu) {
        return 'draw';

    // Playerが👊✌️✋、CPUが✌️✋👊だったら、Playerの勝ち
    } else if (
        (player === 'guu' && cpu === 'choki') ||
        (player === 'choki' && cpu === 'paa') ||
        (player === 'paa' && cpu === 'guu')
    ) {
        return 'player_win';

    //それ以外だったら、Playerの負け
    } else {
        return 'cpu_win';
    }
}


// じゃんけんを実行する関数。
// 「あいこ」か「あいこ以外」でアニメーションを出し分ける。
function startCount(isAiko = false) {

    const animFile = isAiko ? 'img/aiko.png' : 'img/janken.png';

    let imgPath = animFile.split('?')[0];
    console.log(`isAiko：${isAiko}, animation：${animFile}`);

    $('#count-img').attr('src', imgPath + '?' + Date.now());

    $('#count-img').show();
    $('#choice-buttons').show();

    $('.hand-btn').addClass('disabled');

    countTimer = setTimeout(function () {
        $('.hand-btn').removeClass('disabled');
    }, 2000);
}


// STARTボタンを押してじゃんけんを実行する関数を実行させる
$('#btn-start').on('click', function () {

    // ライフを初期化してUIを表示
    playerLives = 3;
    cpuLives = 3;
    updateLives();
    $('#lives-display').show();

    $('#screen-start').hide();
    $('#screen-game').show();
    startCount();
});


// Playerが👊✌️✋を押すと、CPUの👊✌️✋がランダムで選択され、じゃんけん勝敗を判定する関数が実行される
$('.hand-btn').on('click', function () {

    // Playerの押した👊✌️✋が変数として設定
    const playerHand = $(this).data('hand');

    // CPUの👊✌️✋がランダム決定
    const cpuHand = hands[Math.floor(Math.random() * 3)];
    console.log(`Player：${playerHand}, CPU:${cpuHand}`);

    // フラッシュアニメーション
    $('#flash').addClass('active');
    setTimeout(function () {
        $('#flash').removeClass('active');
    }, 500);

    // Player/CPUの選んだ👊✌️✋の組み合わせを変数設定
    const result = getResult(playerHand, cpuHand);
    console.log(result);

    // 勝敗判定：あいこのとき
    if (result === 'draw') {

        // カウント/手選択の画面を閉じる
        $('#screen-game').hide();

        // じゃんけん結果の画面を表示
        $('#screen-result').show();
        $('#result-bg').attr('src', 'img/cpu_' + cpuHand + '.png');
        $('#player-hand-img').attr('src', 'img/' + playerHand + '.png').show();

        // ２秒後に「あいこでしょ」を出す
        setTimeout(function () {

            // じゃんけん結果の画面を初期化
            $('#screen-result').hide();
            $('#result-bg').attr('src', '');
            $('#player-hand-img').attr('src', '').hide();

            // isAiko=trueにして「あいこでしょ」のアニメーションを出す
            $('#screen-game').show();
            startCount(true);

        }, 2000);


    // 勝敗判定：あいこ以外のとき
    } else {

        // 画面を揺らす（０．5秒後に開始し、０．５秒後にシェイク解除）
        setTimeout(function () {

            $('.wrapper').addClass('shake');

            setTimeout(function () {
                $('.wrapper').removeClass('shake');
            }, 500);

        }, 500);


        // ライフを減らしてUIを更新
        if (result === 'player_win') {
            cpuLives--;
        } else {
            playerLives--;
        }
        updateLives();

        // Player/CPUいずれかのライフ数がゼロになったらゲームセットという変数を設定
        const isGameOver = playerLives === 0 || cpuLives === 0;

        // カウント/手選択の画面を閉じる
        $('#screen-game').hide();

        // じゃんけん結果の画面を表示
        $('#screen-result').show();
        $('#result-bg').attr('src', 'img/cpu_' + cpuHand + '.png');
        $('#player-hand-img').attr('src', 'img/' + playerHand + '.png').show();

        // 1.5秒後：ゲームセットなら勝敗画像、そうでなければ次ラウンドへ
        setTimeout(function () {

            // じゃんけん結果の画面を初期化
            $('#result-bg').attr('src', '');
            $('#player-hand-img').hide().attr('src', '');

            // ゲームセットなら勝敗結果を出す
            if (isGameOver) {
                if (result === 'player_win') {
                    $('#result-img').attr('src', 'img/cpu_lose.png').show();
                } else {
                    $('#result-img').attr('src', 'img/cpu_win.png').show();
                }
                setTimeout(function () {
                    $('#btn-replay').show();
                }, 1500);

            // まだゲームセットでなければゲームを続ける
            } else {

                // じゃんけん結果の画面を初期化
                $('#screen-result').hide();

                // 次のラウンドをスタート
                $('#screen-game').show();
                startCount();
            }
        }, 1500);
    }
});


// REPLAYボタンを押すと、ライフをリセットしてリスタート
$('#btn-replay').on('click', function () {

    // リプレイボタンを消す
    $('#btn-replay').hide();

    // ゲームセットの勝敗画像を消す
    $('#result-img').hide().attr('src', '');

    // じゃんけん結果画面を消す
    $('#screen-result').hide();

    // ライフをリセット
    playerLives = 3;
    cpuLives = 3;
    updateLives();

    // じゃんけんスタート
    $('#screen-game').show();
    startCount();
});
