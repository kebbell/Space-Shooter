window.onload = () => {

    const start = document.getElementById("start");
    var star_push, bullet_push, enemy_push;
    var moving = false;
    var gameOver = false;

    setTimeout(() => {
        document.getElementById("loader").remove();
        start.style.visibility = "visible";
        canvas.style.backgroundColor = "#000";
    }, 6000);

    start.onclick = () => {
    start.textContent = "Re-start";
        start.style.visibility = "hidden";
        hearts = 3;
        score = 0;
        enemySpeed = 1;
        gameOver = false;
        if (!moving) {
            moving = true;
            Animate();
        }

        star_push = setInterval(() => {
            stars.push({
                sx: Math.random() * (canvas.width - 20) + 20,
                sy: -20,
                rad: Math.random() * (2.5 - 1) + 1
            });
        }, 150);

        bullet_push = setInterval(() => {
            bullets.push({
                bx: x - 3,
                by: y - 70,
                collided_bullet: false
            });
        }, 300);

        enemy_push = setInterval(() => {
            enemy.push({
                ex: Math.random() * (canvas.width - 150) + 50,
                ey: -100,
                collided_enemy: false,
                blastTime: 0
            });
        }, 500);
    };

    var x = window.innerWidth / 2;
    var y = window.innerHeight / 1.3;
    var level = 0;
    var level_score = 200;
    var showLevelMessage = false;
    var hearts = 3;
    var enemySpeed = 1;
    var score = 0;
    var bullets = [];
    var enemy = [];
    var stars = [];
    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var lvly = canvas.height / 2;
    var opacity = 1;
    const ctx = canvas.getContext("2d");

    canvas.addEventListener("touchmove", (e) => {
        x = e.changedTouches[0].clientX;
        if (x > canvas.width - 53) x = canvas.width - 53;
        if (x < 50) x = 50;
    });

    function Draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!gameOver) {
            ctx.beginPath();
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            ctx.font = "20px sans-serif";
            ctx.fillStyle = "#fff";
            ctx.fillText('Score: ' + score, 10, 24);
            ctx.closePath();

            ctx.beginPath();
            ctx.textAlign = "right";
            ctx.textBaseline = "top";
            ctx.font = "20px sans-serif";
            ctx.fillStyle = "#fff";
            ctx.fillText('Life: ' + hearts + "❤️", canvas.width - 10, 24);
            ctx.closePath();
            
            
            for (let a = 0; a < stars.length; a++) {
            ctx.beginPath();
            var star = stars[a];
            ctx.arc(star.sx, star.sy, star.rad, 0, Math.PI * 2, false);
            ctx.fillStyle = "#fff";
            ctx.fill();
            ctx.closePath();
            star.sy += 1;
            if (star.sy > canvas.height) stars.splice(a--, 1);
        }

            const userPlane = new Image();
            userPlane.src = 'https://i.imgur.com/2My8BFX.png';
            ctx.drawImage(userPlane, x - 50, y - 50, 100, 100);
        }


        for (let i = 0; i < bullets.length; i++) {
            let oneBullet = bullets[i];
            ctx.beginPath();
            ctx.arc(oneBullet.bx + 8 / 2, oneBullet.by, 8 / 2, Math.PI, 0, false);
            ctx.rect(oneBullet.bx, oneBullet.by, 8, 8);
            ctx.fillStyle = "#ffa500";
            ctx.fill();
            ctx.closePath();
            oneBullet.by -= 3;
            if (oneBullet.by <= 0) {
                bullets.splice(i, 1);
                i--;
            }
        }

        for (let j = 0; j < enemy.length; j++) {
            let oneEnemy = enemy[j];
            if (oneEnemy.blastTime > 0) {
                const blast_img = new Image();
                blast_img.src = "https://i.imgur.com/DVbeM4J.png";
                ctx.drawImage(blast_img, oneEnemy.ex, oneEnemy.ey, 50, 50);
                oneEnemy.blastTime--;
                if (oneEnemy.blastTime <= 0) {
                    enemy.splice(j--, 1);
                }
                continue;
            }
            const enemyPlane = new Image();
            enemyPlane.src = 'https://i.imgur.com/RZ2zPfW.png';
            ctx.drawImage(enemyPlane, oneEnemy.ex, oneEnemy.ey, 50, 50);
            if (enemySpeed < 4) enemySpeed += 0.0001;
            oneEnemy.ey += enemySpeed;
            if (oneEnemy.ey > canvas.height) {
                enemy.splice(j--, 1);
                continue;
            }

            if ((oneEnemy.ex - x) > -50 && (oneEnemy.ex - x) < 5) {
                if (oneEnemy.ex + 50 <= x + 100 && x <= oneEnemy.ex + 100 && oneEnemy.ey + 50 <= y + 100 && y <= oneEnemy.ey + 100 && !oneEnemy.collided_enemy) {
                    oneEnemy.collided_enemy = true;
                    oneEnemy.blastTime = 15;
                    hearts--;
                    continue;
                }
            } else {
                if (oneEnemy.ex + 50 <= x + 100 && x <= oneEnemy.ex + 100 && oneEnemy.ey <= y && y <= oneEnemy.ey + 30 && !oneEnemy.collided_enemy) {
                    oneEnemy.collided_enemy = true;
                    oneEnemy.blastTime = 15;
                    hearts--;
                    continue;
                }
            }

            if (hearts == 0) {
            alert(`Game Over
Score: ${score}`);
                gameOver = true;
                enemy = [];
                stars = [];
                clearInterval(bullet_push);
                clearInterval(enemy_push);
                clearInterval(star_push);
                start.style.visibility = "visible";
            }

            if (score >= level_score) {
                level++;
                level_score += 200;
                showLevelMessage = true;
                lvly = canvas.height / 2;
                opacity = 1;
            }

            for (let i = 0; i < bullets.length; i++) {
                let oneBullet = bullets[i];
                if (oneBullet.bx >= oneEnemy.ex && oneBullet.bx <= oneEnemy.ex + 50 && oneBullet.by >= oneEnemy.ey && oneBullet.by <= oneEnemy.ey + 50) {
                    oneBullet.collided_bullet = true;
                    oneEnemy.collided_enemy = true;
                    oneEnemy.blastTime = 15;
                    score += 5;
                    bullets.splice(i--, 1);
                    break;
                }
            }
        }

        if (showLevelMessage && lvly > 0) {
            ctx.beginPath();
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = "40px sans-serif";
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.fillText("Reached level " + level, canvas.width / 2, lvly);
            ctx.closePath();
            lvly -= 1;
            opacity -= 0.003;
            if (lvly <= 0 || opacity <= 0) {
                showLevelMessage = false;
            }
        }
    }

    function Animate() {
        Draw();
        requestAnimationFrame(Animate);
    }
}


