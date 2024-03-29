const deepCopyFunction = inObject =>
{
    let outObject, value, key

    if(typeof inObject !== "object" || inObject === null)
    {
        return inObject
    }
  
    outObject = Array.isArray(inObject) ? [] : {}
  
    for (key in inObject)
    {
        value = inObject[key]
        
    outObject[key] = (typeof value === "object" && value !== null) ? deepCopyFunction(value) : value
    }
  
    return outObject
}

var crossword_size = 1
var crossword_words = []
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var crossword_diagonal;
var crossword = [];
var crossword_answer_key = [];
var intersect_offset = 0.9;
var limit;
var limit_counter = 1;
var error = false;

document.getElementById("sizeInput").value = crossword_size;
document.getElementById("wordsInput").value = crossword_words;

for(var n = 0; n < alphabet.length; n++)
{
    var img = document.createElement("img");
    img.src = "images/" + alphabet[n] + ".png";
    img.id = alphabet[n];
    document.getElementById("images").appendChild(img);
}

function createCrossword()
{
    crossword_words = document.getElementById("wordsInput").value.toUpperCase().replace(/ /g, "").split(",");
    
    for(var n = 0; n < crossword_words.length; n++)
    {
        if(!crossword_words[n].match(/[a-z]/i) && crossword_words[n] !== "")
        {
            clear();
            alert("Words can only be of English letters.");
            return;
        }
        
        var reversed_word = "";
        
        for(var o = 0; o < crossword_words[n].length; o++)
        {
            reversed_word += crossword_words[n].charAt(crossword_words[n].length - o - 1);
        }
    
        for(var m = n + 1; m < crossword_words.length; m++)
        {
            if(crossword_words[n] === crossword_words[m])
            {
                clear();
                alert("You cannot use the same word more than once.");
                return;
            }
            
            if(reversed_word === crossword_words[m])
            {
                clear();
                alert("You cannot have palindrome words.");
                return;
            }
        }
    }
    
    crossword_size = document.getElementById("sizeInput").value;
    
    if(crossword_size < 1 || Math.floor(crossword_size) != crossword_size)
    {
        clear();
        alert("Crossword size is invalid.");
        return;
    }
    
    document.getElementById("sizeInput").value = crossword_size;
    
    limit = Math.pow(crossword_size, 2) * 1000;
    
    crossword_diagonal = document.getElementById("diagonalInput").checked;
    crossword = [];
    crossword_answer_key = [];
    error = false;
    
    for(var n = 0; n < crossword_size; n++)
    {
        crossword.push([]);
    }
    
    for(var n = 0; n < crossword_words.length; n++)
    {
        crossword_answer_key.push([]);
    }
    
    limit_counter = 1;
    
    wordloop:
    for(var n = 0; n < crossword_words.length; n++)
    {
        var word = crossword_words[n];
        
        var x = Math.round(Math.random() * (crossword_size - 1));
        var y = Math.round(Math.random() * (crossword_size - 1));
        
        var direction_x;
        var direction_y;
        
        if(crossword_diagonal === false)
        {
            direction_x = Math.round(Math.random()) * 2 - 1;
            direction_y = 0;
        }
        
        else
        {
            direction_x = Math.round(Math.random() * 2 - 1);
            direction_y = Math.round(Math.random()) * 2 - 1;
        }
        
        if(Math.round(Math.random()) == 0)
        {
            var temp = direction_x;
            direction_x = direction_y;
            direction_y = temp;
        }
        
        var character_list = [];
        var flag = false;
        var intersect_flag = false;
        
        characterloop:
        for(var m = 0; m < word.length; m++)
        {
            if(m > 0)
            {
                x += direction_x;
                y += direction_y;
                
                if(x < 0 || x > crossword_size - 1 || y < 0 || y > crossword_size - 1)
                {
                    limit_counter++;
                    flag = true;
                    break characterloop;
                }
            }
            
            if(crossword[x][y] !== undefined && word.charAt(m) != crossword[x][y])
            {
                limit_counter++;
                flag = true;
                break characterloop;
            }
            
            if(word.charAt(m) == crossword[x][y])
            {
                intersect_flag = true;
            }
            
            character_list.push([x, y]);
        }
        
        if(intersect_flag === false && Math.random() < intersect_offset)
        {
            limit_counter++;
            flag = true;
        }
        
        if(limit_counter > limit)
        {
            error = true;
            break;
        }
        
        if(flag)
        {
            n--;
        }
        
        else
        {
            crossword_answer_key[n] = character_list;
            
            for(var m = 0; m < character_list.length; m++)
            {
                crossword[character_list[m][0]][character_list[m][1]] = word.charAt(m);
            }
            
            limit_counter = 1;
        }
    }
    
    if(!error)
    {
        for(var n = 0; n < crossword.length; n++)
        {
            for(var m = 0; m < crossword.length; m++)
            {
                if(typeof crossword[n][m] === "undefined")
                {
                    crossword[n][m] = alphabet.charAt(Math.random() * (alphabet.length - 1));
                }
            }
        }
        
        render();                    
    }
    
    else
    {
        alert("Crossword could not be created.\nHint: Try increasing the crossword size.");
    }
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var line_width = 2;

var canvas_answer_key = document.getElementById("canvas-answer-key");
var ctx_answer_key = canvas_answer_key.getContext("2d");

function render()
{
    canvas.width = crossword_size * 100;
    canvas.height = crossword_size * 100;
    canvas_answer_key.width = canvas.width;
    canvas_answer_key.height = canvas.height;
    clear();
    ctx.font = "15px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    
    for(var x = 0; x < crossword.length; x++)
    {
        for(var y = 0; y < crossword.length; y++)
        {
            ctx.drawImage(document.getElementById(crossword[x][y]), 100 * x, 100 * y);
        }
    }
    
    for(var n = 1; n < crossword.length; n++)
    {
        ctx.fillRect(100 * n - line_width / 2, 0, line_width, canvas.height);
        ctx.fillRect(0, 100 * n - line_width / 2, canvas.width, line_width);
    }
    
    ctx.fillRect(0, 0, canvas.width, line_width);
    ctx.fillRect(canvas.width - line_width, 0, line_width, canvas.height);
    ctx.fillRect(0, canvas.height - line_width, canvas.width, line_width);
    ctx.fillRect(0, 0, line_width, canvas.height);
    
    ctx_answer_key.drawImage(canvas, 0, 0);
    
    for(var n = 0; n < crossword_answer_key.length; n++)
    {
        if(crossword_answer_key[n].length >= 1)
        {
            var x1 = 100 * crossword_answer_key[n][0][0] + 50;
            var y1 = 100 * crossword_answer_key[n][0][1] + 50;
            var x2 = 100 * crossword_answer_key[n][crossword_answer_key[n].length - 1][0] + 50;
            var y2 = 100 * crossword_answer_key[n][crossword_answer_key[n].length - 1][1] + 50;
            var a = Math.atan2(y2 - y1, x2 - x1);
            
            ctx_answer_key.beginPath();
            ctx_answer_key.arc(x1, y1, 50, Math.PI + a - Math.PI / 2, Math.PI + a + Math.PI / 2);
            ctx_answer_key.arc(x2, y2, 50, a - Math.PI / 2, a + Math.PI / 2);
            ctx_answer_key.closePath();
            ctx_answer_key.globalAlpha = 0.5;
            ctx_answer_key.fillStyle = "hsl(" + (n / crossword_answer_key.length * 360) + ", 100%, 50%)";
            ctx_answer_key.fill();
        }
    }
    
    for(var n = 0; n < document.querySelectorAll(".hidden").length; n++)
    {
        document.getElementsByClassName("hidden")[n].style.visibility = "visible";
        document.getElementsByClassName("hidden")[n].style.pointerEvents = "auto";
    }
}

function clear()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx_answer_key.clearRect(0, 0, canvas_answer_key.width, canvas_answer_key.height);
    
    for(var n = 0; n < document.querySelectorAll(".hidden").length; n++)
    {
        document.getElementsByClassName("hidden")[n].style.visibility = "hidden";
        document.getElementsByClassName("hidden")[n].style.pointerEvents = "none";
    }
}

function loadExample()
{
    document.getElementById("sizeInput").value = 5;
    document.getElementById("wordsInput").value = "cat, bat, sat, mat, rat";
    document.getElementById("sure").remove();
    document.getElementById("load").remove();
}
