// �Q�[���V�X�e���ϐ�
var game = {
    ctx: null,
    time: 0,
    status: 'play',
    pos: {
        x: 0,
        y: 0
    },
    fps: 30,
    cvs: {
        width: 640,
        height: 480
    }, // �L�����o�X�F�T�C�Y
    paddle: {
        size: 50,
        color: '#00dd00'
    }, // �p�h���F�T�C�Y, �F
    ball: {
        size: 5,
        speed: 5,
        x: 320,
        y: 240,
        color: '#dd0000'
    }, // �{�[���F�T�C�Y, ����, �F
    block: {
        size: 5,
        speed: 5,
        x: 0,
        y: 0,
        row: 10,
        col: 14,
        color: '#00aa00',
        strokeColor: '#003300'
    }, // �u���b�N�F�T�C�Y, ����, �F(����), �F(�O�g)
    background: {
        color: '#001100'
    }, // �w�i: �F
    score: {
        point: 0,
        color: '#00aa00'
    }
};

// �p�h���Ǘ��p�̃N���X
function Paddle() {
    this.initialize.apply(this, arguments);
}
Paddle.prototype = {
    size: 0,
    x: 0,
    y: 0,
    // �R���X�g���N�^
    initialize: function (option) {
        this.size = option.size;
    },
    // �ړ�
    move: function (x, y) {
        this.x = x;
        this.y = y;
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x > game.cvs.width) {
            this.x = game.cvs.width;
        }
    },
    // �`��
    draw: function () {
        game.ctx.fillStyle = game.paddle.color;
        game.ctx.fillRect(this.x - (this.size / 2), this.y, this.size, 10);
    }
};

// �{�[���Ǘ��p�̃N���X
function Ball() {
    this.initialize.apply(this, arguments);
}
Ball.prototype = {
    size: 0,
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    // �R���X�g���N�^
    initialize: function (option) {
        this.size = option.size;
        this.x = option.x;
        this.y = option.y;
        this.dx = option.speed;
        this.dy = option.speed;
    },
    // �ړ��e�X�g
    moveTest: function () {
        return {
            x: this.x + this.dx,
            y: this.y + this.dy
        };
    },
    // �ړ�
    move: function () {
        var pos = this.moveTest();
        if (pos.x < this.size || pos.x > game.cvs.width - this.size) {
            this.dx *= -1;
        }
        if (pos.y < this.size || pos.y > game.cvs.height - this.size) {
            this.dy *= -1;
        }
        this.x += this.dx;
        this.y += this.dy;
    },
    // �`��
    draw: function () {
        game.ctx.fillStyle = game.ball.color;
        game.ctx.beginPath();
        game.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
        game.ctx.fill();
        game.ctx.closePath();
    }
};

// �u���b�N�Ǘ��p�̃N���X
function Block() {
    this.initialize.apply(this, arguments);
}
Block.prototype = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    flag: true,
    // �R���X�g���N�^
    initialize: function (option) {
        this.x = option.x;
        this.y = option.y;
        this.w = option.w;
        this.h = option.h;
    },
    // �`��
    draw: function () {
        if (this.flag) {
            game.ctx.fillStyle = game.block.color;
            game.ctx.fillRect(this.x, this.y, this.w, this.h);
            game.ctx.strokeStyle = game.block.strokeColor;
            game.ctx.strokeRect(this.x, this.y, this.w, this.h);
        }
    }
};

// �}�E�X�C�x���g
window.addEventListener('mousedown', function (e) {}, false);
window.addEventListener('mousemove', function (e) {
    var rect = e.target.getBoundingClientRect();
    game.pos.x = e.clientX - rect.left;
    game.pos.y = e.clientY - rect.top;
}, false);

// �u���b�N�̏�����
function initBlocks() {
    var blocks = [];
    var col = game.block.col;
    var row = game.block.row;
    for (var i = 0; i < row; i++) {
        for (var j = 0; j < col; j++) {
            blocks[i * col + j] = new Block({
                x: 40 + j * 40,
                y: 40 + i * 20,
                w: 40,
                h: 20
            });
        }
    }
    return blocks;
}


function main() {
    var cvs = document.getElementById('sample');
    game.ctx = cvs.getContext('2d');
    // �{�[��������
    var ball = new Ball({
        size: game.ball.size,
        x: 0,
        y: 0,
        speed: game.ball.speed
    });
    ball.x = game.ball.x;
    ball.y = game.ball.y;
    ball.dx = game.ball.speed;
    ball.dy = game.ball.speed * -1;
    // �p�h��������
    var paddle = new Paddle({
        size: game.paddle.size
    });
    // �u���b�N������
    blocks = initBlocks();
    // �A�j���[�V����
    setInterval(function () {
        var col = game.block.col; // �u���b�N�̗�
        var row = game.block.row; // �u���b�N�̍s��
        if (game.status != 'play') {
            game.ctx.fillStyle = game.background.color;
            game.ctx.fillRect(0, 0, game.cvs.width, game.cvs.height);
            game.ctx.fillStyle = '#aa0000';
            game.ctx.font = '60px "Arial Black"';
            if (game.status == 'gameover') {
                game.ctx.fillText('Game Over', 160, 230);
                game.ctx.fillText('Score : ' + game.score.point, 160, 320);
            } else if (game.status == 'clear') {
                game.ctx.fillText('Game Clear', 160, 230);
                game.ctx.fillText('Score : ' + game.score.point, 160, 320);
            }
            return;
        }
        game.time++; // ���ԉ��Z
        game.ctx.clearRect(0, 0, game.cvs.width, game.cvs.height); // �L�����o�X�N���A
        game.ctx.fillStyle = '#001100'; // �L�����o�X��h��Ԃ�
        game.ctx.fillRect(0, 0, game.cvs.width, game.cvs.height);
        paddle.move(game.pos.x, game.cvs.height - 40); // �p�h���ړ�
        // �p�h�������蔻��
        if (ball.y >= paddle.y - ball.size && ball.y <= paddle.y + ball.size && ball.x >= paddle.x - (paddle.size / 2) && ball.x <= paddle.x + (paddle.size / 2)) {
            ball.dy *= -1;
        }
        // �{�[���ړ��e�X�g
        var pos = ball.moveTest();
        // �u���b�N�����蔻��
        for (var i = 0; i < row; i++) {
            for (var j = 0; j < col; j++) {
                if (blocks[i * col + j].flag) {
                    // ������q�b�g
                    if (ball.x <= blocks[i * col + j].x && blocks[i * col + j].x <= pos.x && pos.y >= blocks[i * col + j].y && pos.y <= blocks[i * col + j].y + blocks[i * col + j].h) {
                        ball.dx *= -1;
                        blocks[i * col + j].flag = false;
                        game.score.point += 5;
                    }
                    // �E����q�b�g
                    if (pos.x <= blocks[i * col + j].x + blocks[i * col + j].w && blocks[i * col + j].x + blocks[i * col + j].w <= ball.x && pos.y >= blocks[i * col + j].y && pos.y <= blocks[i * col + j].y + blocks[i * col + j].h) {
                        ball.dx *= -1;
                        blocks[i * col + j].flag = false;
                        game.score.point += 5;
                    }
                    // �ォ��q�b�g
                    if (ball.y <= blocks[i * col + j].y && blocks[i * col + j].y <= pos.y && pos.x >= blocks[i * col + j].x && pos.x <= blocks[i * col + j].x + blocks[i * col + j].w) {
                        ball.dy *= -1;
                        blocks[i * col + j].flag = false;
                        game.score.point += 10;
                    }
                    // ������q�b�g
                    if (pos.y <= blocks[i * col + j].y + blocks[i * col + j].h && blocks[i * col + j].y + blocks[i * col + j].h <= ball.y && pos.x >= blocks[i * col + j].x && pos.x <= blocks[i * col + j].x + blocks[i * col + j].w) {
                        ball.dy *= -1;
                        blocks[i * col + j].flag = false;
                        game.score.point += 1;
                    }
                }
            }
        }
        ball.move(); // �{�[���ړ�
        // �A�E�g����
        if (ball.y >= game.cvs.height - ball.size) {
            game.status = 'gameover';
        }
        var flag = true; // �N���A����
        for (var i = 0; i < row; i++) {
            for (var j = 0; j < col; j++) {
                if (blocks[i * col + j].flag) {
                    flag = false;
                }
            }
        }
        if (flag) {
            game.status = 'clear';
        } // �N���A��Ԃ�
        paddle.draw(); //�o�h���`��
        ball.draw(); //�{�[���`��
        // �u���b�N�`��
        for (var i = 0; i < row; i++) {
            for (var j = 0; j < col; j++) {
                blocks[i * col + j].draw();
            }
        }
        // �X�R�A�`��
        game.ctx.fillStyle = game.score.color;
        game.ctx.font = '30px "Arial Black"';
        game.ctx.fillText('score : ' + game.score.point, 10, game.cvs.height - 10);
    }, parseInt(1000 / game.fps));
}