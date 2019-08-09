
(function() {



var btn = document.getElementById('DengenOnbtn');  

var keyboard = document.getElementById('keyboard');  

var state = false;  // ��ԊĎ��p�t���O

var synth;

var div;  // div�v�f�̊i�[

var textAreaStr1 = "";

var lines = "";

var onpu_list = []; //�����f�[�^

var octarve_list = []; //�I�N�^�[�u

var soundlen_list = [];//���̒���

var oneLineOnpuCount_list = [];

var oneLineOnpuCount; //��s�̉����̌�

var onpu_count = 0; //�����f�[�^�̌�

var current_onpuIdx = 0; //���݂̉����̃C���f�b�N�X

var isOnpuLoaded = false;

Initialize();


function Initialize(){

// �u�d��ON�v�{�^���̃C�x���g����

btn.addEventListener('click', dengenOn1);


// �u�������v��Ԃ̃C�x���g����

window.addEventListener('mousedown', playSound);


// �u�������v��Ԃ̃C�x���g����

window.addEventListener('keyup', offSound);

window.addEventListener('mouseup', offSound);

window.addEventListener('touchend', offSound);

}

// �����ݒ�
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
		
        // ��s�͖�������
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


// �����f�[�^�Z�b�g
$('#onpuDataSet').click(function() {
	current_onpuIdx = 0;
	
	LoadOnpuData();
	HyojiOnpuData();
	
	isOnpuLoaded = true;
});


function playSound(e) {

  if(!isOnpuLoaded) return;  // false�Ȃ珈�������s���Ȃ�

  

  // �u�L�[�{�[�h�v��keyCode���A�u�}�E�X�v��data�������擾����

  var key =  e.target.dataset.key;



  // �ukey�v���g���āudiv�v�f�v���擾����

  div = document.querySelector('div[data-key="'+ key +'"]');

  

  // �udiv�v�f�v���擾�ł������`�F�b�N

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