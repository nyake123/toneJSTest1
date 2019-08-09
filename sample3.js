
(function() {



var btn = document.getElementById('DengenOnbtn');  

var keyboard = document.getElementById('keyboard');  

var state = false;  // 状態監視用フラグ

var synth;

var div;  // div要素の格納

var textAreaStr1 = "";

var lines = "";

var onpu_list = []; //音符データ

var octarve_list = []; //オクターブ

var soundlen_list = [];//音の長さ

var oneLineOnpuCount_list = [];

var oneLineOnpuCount; //一行の音符の個数

var onpu_count = 0; //音符データの個数

var current_onpuIdx = 0; //現在の音符のインデックス

var isOnpuLoaded = false;

Initialize();


function Initialize(){

// 「電源ON」ボタンのイベント処理

btn.addEventListener('click', dengenOn1);


// 「押した」状態のイベント処理

window.addEventListener('mousedown', playSound);


// 「離した」状態のイベント処理

window.addEventListener('keyup', offSound);

window.addEventListener('mouseup', offSound);

window.addEventListener('touchend', offSound);

}

// 初期設定
function dengenOn1() {

  state = true;

  synth = new Tone.Synth().toMaster();

  DengenOnbtn.style.display = 'none';

  keyboard.style.opacity = 1;
  
  div.classList.add('activekey');

}


function LoadOnpuData(){
	textAreaStr1 = document.getElementById("textArea1").value;
	textAreaStr1  = textAreaStr1.replace(/\r\n|\r/g, "\n"); 
	lines = textAreaStr1.split('\n');
	
	
	var StartIdx;
	var EndIdx;
	var dataStr;
	var data_array;
	
	StartIdx = 0;
	EndIdx=0;
	dataStr="";
	data_array=[];
	onpu_list=[];
	octarve_list=[];
	soundlen_list=[];
	//oneLineOnpuCount_list=[];
	onpu_count=0;
	
	
	var z=0;
	for(var i=0; i<lines.length; i++){
		
        // 空行は無視する
        if ( lines[i] == '' ) {
            continue;
        }
        
        oneLineOnpuCount = 0;
        var ch;
        for(var j=0; j<lines[i].length; j++){
        	ch = lines[i].charAt(j);
        	
        	
        	if(ch == '('){
        		StartIdx = j;
        		while(j<lines[i].length){
        			j++;
        			ch = lines[i].charAt(j);
        			if(ch == ')'){
        				EndIdx = j;
        				break;
        			}
        		}
        	
        	
        	
        	
        	dataStr = lines[i].substr(StartIdx+1,EndIdx-(StartIdx+1));
        	
        	data_array = dataStr.split(",");        	
			onpu_list[onpu_count] = data_array[0];
			octarve_list[onpu_count] = data_array[1];
			soundlen_list[onpu_count] = data_array[2];
        	
        	onpu_count++;
        	oneLineOnpuCount++;
        	
        	}
        }
        
        oneLineOnpuCount_list[z] = oneLineOnpuCount;
        z++;        
	}
	

}

function HyojiOnpuData(){
	var myh1 = document.getElementById("h1_1");
	var outputStr;
	
	
	var hyojiOnpuMaxIdx = 0;
	var cr_line;
	for(var k=0; k<oneLineOnpuCount_list.length; k++){
		hyojiOnpuMaxIdx += oneLineOnpuCount_list[k];
		if(hyojiOnpuMaxIdx > current_onpuIdx){
			cr_line = k;
			break;
		}
	}
	
	outputStr="";
	for(i=current_onpuIdx; i<onpu_count && i<hyojiOnpuMaxIdx; i++){
		if(outputStr == ""){
			if(i>=1){
				outputStr = "<font color='red'>"+ onpu_list[i] +"</font>"
			}else{
				outputStr = "<font color='blue'>"+ onpu_list[i] +"</font>"
			}
			outputStr += "<font color='black'>";
		}else{
			outputStr += " "+onpu_list[i];
		}
	} 
	outputStr += "</font>";
	
	myh1.innerHTML = outputStr;

}


// 音符データセット
$('#onpuDataSet').click(function() {
	current_onpuIdx = 0;
	
	LoadOnpuData();
	HyojiOnpuData();
	
	isOnpuLoaded = true;
});


function playSound(e) {

  if(!isOnpuLoaded) return;  // falseなら処理を実行しない

  

  // 「キーボード」はkeyCodeを、「マウス」はdata属性を取得する

  var key =  e.target.dataset.key;



  // 「key」を使って「div要素」を取得する

  div = document.querySelector('div[data-key="'+ key +'"]');

  

  // 「div要素」が取得できたかチェック

  if(div) {
	var pushedKey = div.textContent;
	
	
	
    synth.triggerAttackRelease(div.textContent + octarve_list[current_onpuIdx], soundlen_list[current_onpuIdx]+'n');
    if(pushedKey == onpu_list[current_onpuIdx]){
    	current_onpuIdx++;
    	
    	if(current_onpuIdx >= onpu_count){
    		current_onpuIdx = 0;
    	}
    	

    }

    HyojiOnpuData();

  }

}



function offSound(e) {

  if(div) {

    div.classList.remove('activekey');

  }

}



})();