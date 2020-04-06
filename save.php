<?php

$fields = array("size", "words", "crossword", "crossword_answer_key");
$limit = 250000;
$flag = true;

for($n = 0; $n < count($fields); $n++)
{
    if(strlen($_POST[$fields[$n]]) > $limit)
    {
        $flag = false;
    }
}

if($flag == true)
{
    $id = uniqid();
    $path = "saves/$id";
    mkdir($path);
    
    $text = "Size of crossword: ".$_POST[$fields[0]]."\nArea of crossword: ".pow($_POST[$fields[0]], 2)."\nWord(s) used in the crossword: ".$_POST[$fields[1]];
    copy($_SERVER["DOCUMENT_ROOT"]."/directory.php", $path."/index.php");
    file_put_contents($path."/Data.txt", $text);
    
    file_put_contents($path."/Crossword.png", base64_decode($_POST[$fields[2]]));
    
    file_put_contents($path."/Crossword Answer Key.png", base64_decode($_POST[$fields[3]]));
}

?>