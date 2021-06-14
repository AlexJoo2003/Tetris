var width = 10;
var height = 20;

var blocks = [
    [[0,0],[1,0],[0,1],[1,1]],
    [[0,0],[0,1],[0,2],[1,2]]
];
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
            $(".middle").append('<div class="box" id="'+j+''+i+'"></div>');
        }
        $(".middle").append("<br>");
    }
}

function spawnBlock(block){
    var spawn = true;
    block.forEach(box => {
        var x = box[0];
        var y = box[1];
        var id = "#"+x.toString() + y.toString();
        if($(id).css("background-color") != ("rgb(34, 34, 34)")){
            spawn = false;
        }
    });
    if (spawn){
        current_block = block;
        renderBlock();
        console.log("Spawned");
    }
}

function renderBlock(){
    for(var i=0; i<current_block.length; i++){
        var x = current_block[i][0];
        var y = current_block[i][1];
        var id = "#"+x.toString() + y.toString();
        $(id).css("background-color", "red");
    }
}

function unRenderBlock(){
    for(var i=0; i<current_block.length; i++){
        var x = current_block[i][0];
        var y = current_block[i][1];
        unRender(x,y);
        // var id = "#"+x.toString() + y.toString();
        // $(id).css("background-color", "rgb(34, 34, 34)");
    }
}
function unRender(x,y){
    var id = "#"+x.toString() + y.toString();
    $(id).css("background-color", "rgb(34, 34, 34)");
}
function Render(x,y){
    if (y >= height){
        return 0;
    }
    var id = "#"+x.toString() + y.toString();
    $(id).css("background-color", "red");
}


function moveBlock(direction){
    if (direction == "down"){
        var test_block = [];
        for(var i=0; i<current_block.length; i++){
            var x = current_block[i][0];
            var y = current_block[i][1]+1;
            var id = "#"+x.toString() + y.toString();
            if(y > height){
                spawnBlock(blocks[1]);
                checkLine();
                break;
            }
            else if($(id).css("background-color") != "rgb(34, 34, 34)"){
                loop_break = true;
                for(var j=0; j<current_block.length; j++){
                    
                    if (y == current_block[j][1] && x == current_block[j][0]){
                        loop_break = false;
                        break;
                    }
                }
                if (loop_break){
                    spawnBlock(blocks[1]);
                    checkLine();   
                    break;
                }
            }
            test_block.push([x,y]);
        }
        if(test_block.length == current_block.length){
            unRenderBlock();
            current_block = test_block;
            renderBlock();
        }
    }
    else if (direction == "right"){
        var test_block = [];
        for(var i=0; i<current_block.length; i++){
            var x = current_block[i][0]+1;
            var y = current_block[i][1];
            var id = "#"+x.toString() + y.toString();
            if(x > width){
                break;
            }
            else if($(id).css("background-color") != "rgb(34, 34, 34)"){
                loop_break = true;
                for(var j=0; j<current_block.length; j++){
                    
                    if (y == current_block[j][1] && x == current_block[j][0]){
                        loop_break = false;
                        break;
                    }
                }
                if (loop_break){
                    break;
                }
            }
            test_block.push([x,y]);
        }
        if(test_block.length == current_block.length){
            unRenderBlock();
            current_block = test_block;
            renderBlock();
        }
    }
    else if (direction == "left"){
        var test_block = [];
        for(var i=0; i<current_block.length; i++){
            var x = current_block[i][0]-1;
            var y = current_block[i][1];
            var id = "#"+x.toString() + y.toString();
            if(x < 0){
                break;
            }
            else if($(id).css("background-color") != "rgb(34, 34, 34)"){
                loop_break = true;
                for(var j=0; j<current_block.length; j++){
                    if (y == current_block[j][1] && x == current_block[j][0]){
                        loop_break = false;
                        break;
                    }
                }
                if (loop_break){
                    break;
                }
            }
            test_block.push([x,y]);
        }
        if(test_block.length == current_block.length){
            unRenderBlock();
            current_block = test_block;
            renderBlock();
        }
    }
}

function checkLine(){
    findBigBox();
    for(var i=0; i<height; i++){
        var line_sum = 0;
        big_block.forEach(function(box, index) {
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
            findBigBox();
            var temp_block = big_block.slice().reverse();
            temp_block.forEach(box => {
                if (box[1] < i){
                    var id = "#"+box[0].toString() + box[1].toString();
                    unRender(box[0],box[1]);
                    Render(box[0],box[1]+1);
                }
            });
            findBigBox();
        }
    }
}


function findBigBox(){
    big_block = [];
    $(".box").each(function(){
        var x = parseInt($(this).attr("id")[0]);
        var y = parseInt($(this).attr("id").slice(1, $(this).attr("id").length));
        var box = [x,y];
        if($(this).css("background-color") != "rgb(34, 34, 34)"){
            var is_current_block = false;
            current_block.forEach(current_box => { // MATH ERROR
                if(current_box[0] == box[0] && current_box[1] == box[1]){
                    is_current_block = true;
                }
            });
            if(!is_current_block){
                big_block.push(box);
            }
        }
    });
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
    if (e.keyCode == 32){
        // checkLine();
        // findBigBox();
        // checkLine();
    }
    // console.log(e.keyCode);
});