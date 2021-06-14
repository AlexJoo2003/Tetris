var width = 6;
var height = 10;

var blocks = [
    {
        "positions":[
            [[0,0],[1,0],[0,1],[1,1]],
            [[0,0],[1,0],[0,1],[1,1]],
            [[0,0],[1,0],[0,1],[1,1]],
            [[0,0],[1,0],[0,1],[1,1]]
        ],
        "color": "red",
        "current_position": 0,
        "offset": [0,0]
    },
    {
        "positions":[
            [[0,0],[0,1],[0,2],[1,2]],
            [[0,0],[0,1],[1,0],[2,0]],
            [[0,0],[1,0],[1,1],[1,2]],
            [[0,1],[1,1],[2,1],[2,0]]
        ],
        "color": "blue",
        "current_position": 0,
        "offset": [0,0]
    }
]


var current_block = [];
var big_block = [];

$("document").ready(function (){

    makeGrid();
    spawnBlock(blocks[1]);
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

function spawnBlock(block){
    var spawn = true;
    block.positions[block.current_position].forEach(box => {
        var x = box[0];
        var y = box[1];
        var id = "#"+x.toString() + y.toString();
        if($(id).css("background-color") != ("rgb(34, 34, 34)")){
            spawn = false;
        }
    });
    if (spawn){
        current_block = Object.assign({}, block);
        renderBlock();
    }
}

function rotateBlock(){
    unRenderBlock();
    current_block.current_position++;
    if (current_block.current_position >= 4){
        current_block.current_position = 0;
    }
    renderBlock();
}

function renderBlock(){
    for(var i=0; i<current_block.positions[0].length; i++){
        var x = current_block.positions[current_block.current_position][i][0] + current_block.offset[0];
        var y = current_block.positions[current_block.current_position][i][1] + current_block.offset[1];
        render(x,y,current_block.color);
    }
}

function unRenderBlock(){
    for(var i=0; i<current_block.positions[0].length; i++){
        var x = current_block.positions[current_block.current_position][i][0] + current_block.offset[0];
        var y = current_block.positions[current_block.current_position][i][1] + current_block.offset[1];
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


function moveBlock(direction){
    let test_offset = [...current_block.offset];
    if(direction == "down"){
        test_offset[1]++;
    }
    else if(direction == "right"){
        test_offset[0]++;
    }
    else if(direction == "left"){
        test_offset[0]--;
    }
    var change_offset = true;
    for(var i=0; i<current_block.positions[0].length; i++){
        var x = current_block.positions[current_block.current_position][i][0] + test_offset[0];
        var y = current_block.positions[current_block.current_position][i][1] + test_offset[1];
        var id = "#"+x.toString() + y.toString();
        if(y >= height){
            spawnBlock(blocks[1]);
            checkLine();
            change_offset = false;
            break;
        }
        if(x < 0 || x >= width){
            change_offset = false;
            break;
        }
        if($(id).css("background-color") != "rgb(34, 34, 34)"){
            let goon = false;
            current_block.positions[current_block.current_position].forEach(box => {
                test_box = [...box];
                test_box[0] += current_block.offset[0];
                test_box[1] += current_block.offset[1];
                if(JSON.stringify(test_box) == JSON.stringify([x,y])){
                    goon = true;
                }
            });
            if(!goon){
                if(direction == "down"){
                    spawnBlock(blocks[1]);
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
        unRenderBlock();
        current_block.offset = [...test_offset];
        renderBlock();
    }
}


function checkLine(){
    findBigBlock();
    for(var i=0; i<height; i++){
        var line_sum = 0;
        big_block.forEach(function(box) {
            if (box[1] == i){
                line_sum++;
            }
        });
        if(line_sum == width){
            $(".box").each(function(){
                var x = parseInt($(this).attr("id")[0]);
                var y = parseInt($(this).attr("id").slice(1, $(this).attr("id").length));
                var box = [x,y];
                if(box[1] == i){
                    unRender(x,y);
                }
            });
            findBigBlock();
            var temp_block = big_block.slice().reverse();
            temp_block.forEach(box => {
                if (box[1] < i){
                    var id = "#"+box[0].toString() + box[1].toString();
                    var color = $(id).css("background-color");
                    unRender(box[0],box[1]);
                    render(box[0],box[1]+1,color);
                }
            });
        }
    }
}


function findBigBlock(){
    big_block = [];
    $(".box").each(function(){
        var x = parseInt($(this).attr("id")[0]);
        var y = parseInt($(this).attr("id").slice(1, $(this).attr("id").length));
        var box = [x,y];
        if($(this).css("background-color") != "rgb(34, 34, 34)"){
            var is_current_block = false;
            current_block.positions[current_block.current_position].forEach(current_box => {
                test_box = [...current_box];
                test_box[0] += current_block.offset[0];
                test_box[1] += current_block.offset[1];
                if(JSON.stringify(test_box) == JSON.stringify(box)){
                    is_current_block = true;
                }
            });
            if(!is_current_block){
                big_block.push(box);
            }
        }
    });
    big_block.sort()
    console.log(big_block);
}

$("body").keyup(function(e){
    if (e.keyCode == 40){ // down arrow key
        moveBlock("down");
    }
    if (e.keyCode == 37){ // left arrow key
        moveBlock("left");
    }
    if (e.keyCode == 39){ // right arrow key
        moveBlock("right");
    }
    if (e.keyCode == 38){ // up arrow key
        rotateBlock();
    }
    if (e.keyCode == 32){
        // checkLine();
        // findBigBlock();
    }
    // console.log(e.keyCode);
});