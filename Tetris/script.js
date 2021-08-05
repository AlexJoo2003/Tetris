var width = 10;
var height = 20;
var x_offset = Math.round(width/2);
var tetro_fall_time = 1500;
var tetro_min_fall_time = 100;
var tetro_fall_timeout;
var score = 0;
var single_line_score = 10;
var tetris_line_score = single_line_score*8;
var score_time_multiplyer = 0.5;
var spare_tetro = false;
var game_over = false;


var tetros = [
    { // I
        "rotations":[
            [[0,1],[1,1],[2,1],[3,1]],
            [[2,0],[2,1],[2,2],[2,3]],
            [[0,2],[1,2],[2,2],[3,2]],
            [[1,0],[1,1],[1,2],[1,3]]
        ],
        "color": "cyan",
        "current_rotation": 0,
        "offset": [x_offset-2,0],
        "id": 0
    },
    { // J
        "rotations":[
            [[0,0],[0,1],[1,1],[2,1]],
            [[1,0],[2,0],[1,1],[1,2]],
            [[0,1],[1,1],[2,1],[2,2]],
            [[0,2],[1,2],[1,1],[1,0]]
        ],
        "color": "blue",
        "current_rotation": 0,
        "offset": [x_offset-1,0],
        "id": 1
    },
    { // L
        "rotations":[
            [[0,0],[0,1],[0,2],[1,2]],
            [[0,0],[0,1],[1,0],[2,0]],
            [[0,0],[1,0],[1,1],[1,2]],
            [[0,1],[1,1],[2,1],[2,0]]
        ],
        "color": "orange",
        "current_rotation": 0,
        "offset": [x_offset-1,0],
        "id": 2
    },
    { // O
        "rotations":[
            [[0,0],[1,0],[0,1],[1,1]]
        ],
        "color": "yellow",
        "current_rotation": 0,
        "offset": [x_offset-1,0],
        "id": 3
    },
    { // S
        "rotations":[
            [[0,1],[1,1],[1,0],[2,0]],
            [[1,0],[1,1],[2,1],[2,2]],
            [[0,2],[1,2],[1,1],[2,1]],
            [[0,0],[0,1],[1,1],[1,2]]
        ],
        "color": "lime",
        "current_rotation": 0,
        "offset": [x_offset-2,0],
        "id": 4
    },
    { // T
        "rotations":[
            [[0,1],[1,1],[1,0],[2,1]],
            [[1,0],[1,1],[1,2],[2,1]],
            [[0,1],[1,1],[2,1],[1,2]],
            [[0,1],[1,0],[1,1],[1,2]]
        ],
        "color": "purple",
        "current_rotation": 0,
        "offset": [x_offset-2,0],
        "id": 5
    },
    { // Z
        "rotations":[
            [[0,0],[1,0],[1,1],[2,1]],
            [[2,0],[2,1],[1,1],[1,2]],
            [[0,1],[1,1],[1,2],[2,2]],
            [[1,0],[1,1],[0,1],[0,2]]
        ],
        "color": "red",
        "current_rotation": 0,
        "offset": [x_offset-2,0],
        "id": 6
    }
]

var tetro_list = [];
var current_tetro = [];
var squares = [];

$("document").ready(function (){
    makeGrid();
    randomTetro();
    spawnTetro();
});

function makeGrid(){
    $(".middle").empty();
    for(var i=0; i<height; i++){
        for(var j=0; j<width; j++){
            // $(".middle").append('<div class="box" id="'+j+''+i+'">'+j+','+i+'</div>');
            $(".middle").append('<div class="box" id="'+j+''+i+'"></div>');
        }
        $(".middle").append("<br>");
    }
}

function randomTetro(){
    var new_tetroes = 0;
    if (tetro_list.length == 0){
        new_tetroes = 2;
    }
    for(var i=0; i<=new_tetroes; i++){
        // pushes a random integer between 0 and 6 (inclusive)
        var random_number = Math.floor(Math.random() * (Math.floor(6)-Math.ceil(0)+1)+Math.ceil(0))
        tetro_list.push(random_number);
    }
}

function spawnTetro(){
    // get the next tetro
    var tetro = tetros[tetro_list[0]];
    tetro_list.shift();
    randomTetro();
    var id = 0;
    tetro_list.forEach(tetro_id => {
        var tetro_letter = '';
        switch (tetro_id){
            case 0:
                tetro_letter = 'I';
                break;
            case 1:
                tetro_letter = 'J';
                break;
            case 2:
                tetro_letter = 'L';
                break;
            case 3:
                tetro_letter = 'O';
                break;
            case 4:
                tetro_letter = 'S';
                break;
            case 5:
                tetro_letter = 'T';
                break;
            case 6:
                tetro_letter = 'Z';
                break;
        }
        $(`.tetro#${id}`).html(`<img src="images/${tetro_letter}.png">`);
        id++;
    });

    var spawn = true;
    tetro.rotations[tetro.current_rotation].forEach(box => { // checks if it can spawn
        var x = box[0] + tetro.offset[0];
        var y = box[1] + tetro.offset[1];
        var id = "#"+x.toString() + y.toString();
        if($(id).css("background-color") != ("rgb(34, 34, 34)") && !game_over){
            game_over = true;
            clearTimeout(tetro_fall_timeout);
            alert(`game over\nYour score: ${score}\nrefresh to restart.`,"",function(){location.reload();});
            spawn = false;
        }
    });
    if (spawn){ // spawn the tetro
        current_tetro = Object.assign({}, tetro);
        renderTetro();
        clearTimeout(tetro_fall_timeout);
        tetro_fall_timeout = setTimeout(function (){moveTetro("down")}, tetro_fall_time);
    }
}

function rotateTetro(){
    unRenderTetro();
    let allow_rotation = false;
    var test_tetro = Object.assign({}, current_tetro);
    test_tetro.current_rotation++;
    if (test_tetro.current_rotation >= test_tetro.rotations.length){
        test_tetro.current_rotation = 0;
    }
    for(var i=0; i<test_tetro.rotations[0].length; i++){
        var x = test_tetro.rotations[test_tetro.current_rotation][i][0] + test_tetro.offset[0];
        var y = test_tetro.rotations[test_tetro.current_rotation][i][1] + test_tetro.offset[1];
        var id = "#"+x.toString() + y.toString();
        if (!$(id).length || $(id).css("background-color") != "rgb(34, 34, 34)"){
            allow_rotation = false;
            break;
        }
        else{
            allow_rotation = true;
        }
    }
    if(allow_rotation){
        current_tetro.current_rotation++;
        if (current_tetro.current_rotation >= current_tetro.rotations.length){
            current_tetro.current_rotation = 0;
        }
    }

   renderTetro();
}

function renderTetro(){
    for(var i=0; i<current_tetro.rotations[0].length; i++){
        var x = current_tetro.rotations[current_tetro.current_rotation][i][0] + current_tetro.offset[0];
        var y = current_tetro.rotations[current_tetro.current_rotation][i][1] + current_tetro.offset[1];
        render(x,y,current_tetro.color);
    }
}
function unRenderTetro(){
    for(var i=0; i<current_tetro.rotations[0].length; i++){
        var x = current_tetro.rotations[current_tetro.current_rotation][i][0] + current_tetro.offset[0];
        var y = current_tetro.rotations[current_tetro.current_rotation][i][1] + current_tetro.offset[1];
        unRender(x,y);
    }
}
function unRender(x,y){
    var id = "#"+x.toString() + y.toString();
    $(id).css("background-color", "rgb(34, 34, 34)");
}
function render(x,y,color){
    var id = "#"+x.toString() + y.toString();
    $(id).css("background-color", color);
}

function moveTetro(direction){
    let test_offset = [...current_tetro.offset];
    if(direction == "down"){
        test_offset[1]++;
        clearTimeout(tetro_fall_timeout);
        tetro_fall_timeout = setTimeout(function (){moveTetro("down")}, tetro_fall_time);
        clearTimeout()
    }
    else if(direction == "right"){
        test_offset[0]++;
    }
    else if(direction == "left"){
        test_offset[0]--;
    }
    var change_offset = true;
    for(var i=0; i<current_tetro.rotations[0].length; i++){
        var x = current_tetro.rotations[current_tetro.current_rotation][i][0] + test_offset[0];
        var y = current_tetro.rotations[current_tetro.current_rotation][i][1] + test_offset[1];
        var id = "#"+x.toString() + y.toString();
        if(y >= height){ // if tetro reached the bottom, next tetro
            spawnTetro();
            checkLine();
            change_offset = false;
            break;
        }
        if(x < 0 || x >= width){ // if hit the wall, do nothing
            change_offset = false;
            break;
        }
        if($(id).css("background-color") != "rgb(34, 34, 34)"){ // hit a colored square
            let allow = false;
            current_tetro.rotations[current_tetro.current_rotation].forEach(box => {
                var test_box = [...box];
                test_box[0] += current_tetro.offset[0];
                test_box[1] += current_tetro.offset[1];
                if(JSON.stringify(test_box) == JSON.stringify([x,y])){
                    allow = true;
                }
            });
            if(!allow){
                if(direction == "down"){ // fell on colored square
                    spawnTetro();
                    checkLine();
                    change_offset = false;
                    break;
                }
                else{
                    change_offset = false;
                    break;
                }
            }
        }
    }
    if (change_offset){
        unRenderTetro();
        current_tetro.offset = [...test_offset];
        renderTetro();
    }
}

function checkLine(){
    findBigTetro();
    var line_counter = 0;
    for(var i=0; i<height; i++){
        var line_sum = 0;
        squares.forEach(function(box) {
            if (box[1] == i){
                line_sum++;
            }
        });
        if(line_sum == width){
            line_counter++;
            $(".box").each(function(){
                var x = parseInt($(this).attr("id")[0]);
                var y = parseInt($(this).attr("id").slice(1, $(this).attr("id").length));
                var box = [x,y];
                if(box[1] == i){
                    unRender(x,y);
                }
            });
            findBigTetro();
            var temp_tetro = squares.slice().reverse();
            temp_tetro.forEach(box => {
                if (box[1] < i){
                    var id = "#"+box[0].toString() + box[1].toString();
                    var color = $(id).css("background-color");
                    unRender(box[0],box[1]);
                    render(box[0],box[1]+1,color);
                }
            });
        }
    }
    if(line_counter == 4){
        score += tetris_line_score;
    }
    else{
        score += single_line_score*line_counter;
    }
    updateScore();
}

function updateScore(){
    $(".score").html(score);
    var new_tetro_fall_time = Math.round(tetro_fall_time - score*score_time_multiplyer);
    if (new_tetro_fall_time<=tetro_min_fall_time){
        tetro_fall_time = tetro_min_fall_time;
    }
    else{
        tetro_fall_time = new_tetro_fall_time;
    }
}

function findBigTetro(){
    squares = [];
    $(".box").each(function(){
        var x = parseInt($(this).attr("id")[0]);
        var y = parseInt($(this).attr("id").slice(1, $(this).attr("id").length));
        var color = ""
        var box = [x,y];
        if($(this).css("background-color") != "rgb(34, 34, 34)"){
            var is_current_tetro = false;
            current_tetro.rotations[current_tetro.current_rotation].forEach(current_box => {
                test_box = [...current_box];
                test_box[0] += current_tetro.offset[0];
                test_box[1] += current_tetro.offset[1];
                if(JSON.stringify(test_box) == JSON.stringify(box)){
                    is_current_tetro = true;
                }
            });
            if(!is_current_tetro){
                squares.push(box);
            }
        }
    });
    squares.sort()
    // return squares.length;
    // console.log(squares, squares.length);
}

$("body").keyup(function(e){
    if (!game_over){
        if (e.keyCode == 40){ // down arrow key
            moveTetro("down");
        }
        if (e.keyCode == 37){ // left arrow key
            moveTetro("left");
        }
        if (e.keyCode == 39){ // right arrow key
            moveTetro("right");
        }
        if (e.keyCode == 38){ // up arrow key
            rotateTetro();
        }
    }
    if (e.keyCode == 32){
        // checkLine();
        // findBigTetro();
    }
    // console.log(e.keyCode);
});